import { Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Document } from '../services/Document';

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