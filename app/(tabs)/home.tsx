import HomeHeader from "@/components/molecul/home/Header";
import HomeHistory from "@/components/molecul/home/HomeHistory";
import Container from "@/components/base/Container";
import { View } from "react-native";
import IconButton from "@/components/base/IconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProgressBar from "@/components/base/ProgressBar";
import { groupService } from "@/services";
import { useState } from "react";
import { jsPDF } from "jspdf";
import { Document } from "@/services/Document";
import { showAlert } from "@/utils/alert";
import { IsMobileScreen } from "@/constants/Styles";

export default function HomeScreen() {
  const [progress, setProgress] = useState(0);

  const handleSyncDocument = async () => {
    if (!window.electronAPI) {
      console.error("Electron API is null.");
      return;
    }

    try {
      // 1. Ambil daftar folder (excludedCustomerIds) dari Electron API
      const excludedCustomerIds = await window.electronAPI.getFolders();
      if (!Array.isArray(excludedCustomerIds)) {
        console.error("Invalid excludedCustomerIds:", excludedCustomerIds);
        return;
      }

      // 2. Ambil grup beserta dokumennya, kecualikan customer IDs tertentu
      const groupsWithDocuments =
        await groupService.getGroupsExcludingCustomerIdsWithDocuments(
          excludedCustomerIds
        );

      // 3. Hitung total grup untuk progress bar
      const totalGroups = groupsWithDocuments.length;
      if (totalGroups === 0) {
        showAlert("Selesai", "Tidak ada grup untuk diproses.");
        setProgress(100);
        return;
      }

      let processedGroups = 0;

      // 4. Proses setiap grup
      for (const group of groupsWithDocuments) {
        try {
          // Kelompokkan dokumen berdasarkan type
          const documentsByType = group.documents.reduce((acc, doc) => {
            if (!acc[doc.type]) {
              acc[doc.type] = [];
            }
            acc[doc.type].push(doc);
            return acc;
          }, {} as Record<string, Document[]>);

          // Buat dan simpan PDF untuk setiap type
          for (const [type, docs] of Object.entries(documentsByType)) {
            const pdfBlob = await createPdfFromDocuments(docs);
            const pdfBuffer = await pdfBlob.arrayBuffer();
            const fileName = `${type}.pdf`; // Nama file berdasarkan type

            // Simpan PDF dengan folderName = customerId, fileName = type.pdf
            const success = await window.electronAPI.saveFile(
              group.customerId,
              fileName,
              pdfBuffer
            );
            if (!success) {
              console.error(
                `Gagal menyimpan PDF untuk grup ${group.id} dan type ${type}`
              );
            }
          }

          processedGroups++;
          setProgress((processedGroups / totalGroups) * 100);
        } catch (error) {
          console.error(`Gagal memproses grup ${group.id}:`, error);
        }
      }

      console.log("Sinkronisasi dokumen selesai.");
      showAlert("Selesai", "Semua grup selesai diproses.");
    } catch (error) {
      console.error("Error selama sinkronisasi:", error);
      showAlert("Error selama sinkronisasi:", `${error}`);
      setProgress(0);
    }
  };

  // Fungsi untuk membuat PDF dari dokumen dengan gambar
  async function createPdfFromDocuments(documents: Document[]): Promise<Blob> {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const maxImgWidth = pageWidth - 2 * margin;
    const maxImgHeight = pageHeight - 2 * margin;

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      try {
        const response = await fetch(document.image_url);
        if (!response.ok)
          throw new Error(`Gagal mengambil gambar dari ${document.image_url}`);
        const blob = await response.blob();
        const imgData = await blobToBase64(blob);

        const imgProps = await getImageProperties(imgData);
        let scaledWidth = imgProps.width;
        let scaledHeight = imgProps.height;

        if (imgProps.width > maxImgWidth || imgProps.height > maxImgHeight) {
          const widthRatio = maxImgWidth / imgProps.width;
          const heightRatio = maxImgHeight / imgProps.height;
          const scaleRatio = Math.min(widthRatio, heightRatio);
          scaledWidth = imgProps.width * scaleRatio;
          scaledHeight = imgProps.height * scaleRatio;
        }

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        doc.addImage(imgData, "JPEG", x, y, scaledWidth, scaledHeight);

        if (i < documents.length - 1) {
          doc.addPage();
        }
      } catch (error) {
        console.error(
          `Gagal menambahkan gambar untuk dokumen ${document.id}:`,
          error
        );
      }
    }

    return doc.output("blob");
  }

  // Fungsi untuk mengonversi blob ke base64 (untuk gambar di PDF)
  async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Fungsi untuk mendapatkan properti gambar
  async function getImageProperties(
    imgData: string
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = imgData;
    });
  }

  return (
    <Container>
      <HomeHeader />
      {!IsMobileScreen && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <ProgressBar progress={progress} />
          <IconButton
            size="small"
            icon={<Ionicons name="sync" size={24} color="black" />}
            onPress={handleSyncDocument}
          />
        </View>
      )}
      <HomeHistory />
    </Container>
  );
}
