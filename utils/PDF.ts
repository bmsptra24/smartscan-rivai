import { Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Document } from '../services/Document';
import { PDFDocument, PageSizes } from 'pdf-lib';

export const generateAndSharePdf = async (documents: Document[]) => {
  try {
    let htmlContent = `
      <html>
        <head>
          <style>
            img {
              width: 100%;
              height: auto;
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            @page {
              margin: 20px;
            }
          </style>
        </head>
        <body>
    `;

    // Process each image
    for (const doc of documents) {
      try {
        const imageUrl = doc.image_url;
        const fileExtension = imageUrl?.split('.').pop()?.toLowerCase() || '';
        let mimeType = 'image/jpeg';

        if (fileExtension === 'png') {
          mimeType = 'image/png';
        }

        // Download image
        const downloadResult = await FileSystem.downloadAsync(
          imageUrl,
          FileSystem.cacheDirectory + `image_${doc.id}.${fileExtension}`
        );

        // Convert to base64
        const base64 = await FileSystem.readAsStringAsync(downloadResult.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        htmlContent += `<img src="data:${mimeType};base64,${base64}" />`;
      } catch (error) {
        console.error(`Error processing image ${doc.id}:`, error);
      }
    }

    htmlContent += '</body></html>';

    // Generate PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 595,   // A4 width in points (210mm)
      height: 842,   // A4 height in points (297mm)
      margins: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    });

    // Share PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Bagikan Dokumen PDF',
        UTI: 'com.adobe.pdf'
      });
    } else {
      Alert.alert('Sharing tidak tersedia di perangkat ini');
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Gagal membuat PDF. Silakan coba lagi.');
  }
};

export async function createPdfFromDocumentsInWeb(documents: Document[]): Promise<Blob> {
  // Membuat dokumen PDF baru
  const pdfDoc = await PDFDocument.create();

  for (const document of documents) {
    try {
      // Mengambil gambar sebagai Uint8Array dan mendapatkan tipe kontennya
      const { bytes, contentType } = await fetchImageAsUint8Array(document.image_url);

      // Mengembed gambar berdasarkan tipe konten
      let image;
      if (contentType === 'image/jpeg') {
        image = await pdfDoc.embedJpg(bytes);
      } else if (contentType === 'image/png') {
        image = await pdfDoc.embedPng(bytes);
      } else {
        throw new Error(`Format gambar tidak didukung: ${contentType}`);
      }

      // Menambahkan halaman baru dengan ukuran A4
      const page = pdfDoc.addPage(PageSizes.A4);
      const { width: pageWidth, height: pageHeight } = page.getSize();

      // Mengonversi margin dari mm ke points (1 mm = 72 / 25.4 points)
      const mmToPoints = 72 / 25.4;
      const margin = 10; // Margin dalam mm
      const marginPoints = margin * mmToPoints;

      // Menghitung dimensi maksimum gambar
      const maxImgWidth = pageWidth - 2 * marginPoints;
      const maxImgHeight = pageHeight - 2 * marginPoints;

      // Mendapatkan dimensi asli gambar dan menghitung skala
      let scaledWidth = image.width;
      let scaledHeight = image.height;

      if (image.width > maxImgWidth || image.height > maxImgHeight) {
        const widthRatio = maxImgWidth / image.width;
        const heightRatio = maxImgHeight / image.height;
        const scaleRatio = Math.min(widthRatio, heightRatio);
        scaledWidth = image.width * scaleRatio;
        scaledHeight = image.height * scaleRatio;
      }

      // Menghitung posisi gambar agar berada di tengah
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      // Menambahkan gambar ke halaman
      page.drawImage(image, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error(`Gagal menambahkan gambar untuk dokumen ${document.id}:`, error);
    }
  }

  // Menyimpan PDF sebagai Uint8Array dan mengonversinya ke Blob
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return blob;
}

// Fungsi untuk mengambil gambar dari URL sebagai Uint8Array
async function fetchImageAsUint8Array(url: string): Promise<{ bytes: Uint8Array; contentType: string }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Gagal mengambil gambar dari ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('Content-Type') || 'image/jpeg';
  return { bytes: new Uint8Array(arrayBuffer), contentType };
}

