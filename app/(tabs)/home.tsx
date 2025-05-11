import React, { Component } from "react";
import HomeHeader from "@/components/molecul/home/Header";
import HomeHistory from "@/components/molecul/home/HomeHistory";
import Container from "@/components/base/Container";
import { View } from "react-native";
import IconButton from "@/components/base/IconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProgressBar from "@/components/base/ProgressBar";
import { groupService } from "@/services";
import { Document } from "@/services/Document";
import { showAlert } from "@/utils/alert";
import { IsMobileScreen } from "@/constants/Styles";
import { createPdfFromDocumentsInWeb } from "@/utils/PDF";
import { StoreProps, useStore } from "@/stores";

interface HomeScreenState {
  progress: number;
}

class HomeScreen extends Component<StoreProps, HomeScreenState> {
  constructor(props: {}) {
    super(props as StoreProps);
    this.state = {
      progress: 0,
    };
  }

  handleSyncDocument = async () => {
    if (!window.electronAPI) {
      console.error("Electron API is null.");
      return;
    }

    try {
      const excludedCustomerIds = await window.electronAPI.getFolders();
      if (!Array.isArray(excludedCustomerIds)) {
        console.error("Invalid excludedCustomerIds:", excludedCustomerIds);
        return;
      }

      const groupsWithDocuments =
        await groupService.getGroupsExcludingCustomerIdsWithDocuments(
          excludedCustomerIds
        );

      const totalGroups = groupsWithDocuments.length;
      if (totalGroups === 0) {
        showAlert("Selesai", "Tidak ada grup untuk diproses.");
        this.setState({ progress: 100 });
        return;
      }

      let processedGroups = 0;

      for (const group of groupsWithDocuments) {
        try {
          const documentsByType = group.documents.reduce((acc, doc) => {
            if (!acc[doc.type]) {
              acc[doc.type] = [];
            }
            acc[doc.type].push(doc);
            return acc;
          }, {} as Record<string, Document[]>);

          for (const [type, docs] of Object.entries(documentsByType)) {
            const pdfBlob = await createPdfFromDocumentsInWeb(docs);
            const pdfBuffer = await pdfBlob.arrayBuffer();
            const fileName = `${type}.pdf`;

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
          this.setState({ progress: (processedGroups / totalGroups) * 100 });
        } catch (error) {
          console.error(`Gagal memproses grup ${group.id}:`, error);
        }
      }

      console.log("Sinkronisasi dokumen selesai.");
      showAlert("Selesai", "Semua grup selesai diproses.");
    } catch (error) {
      console.error("Error selama sinkronisasi:", error);
      showAlert("Error selama sinkronisasi:", `${error}`);
      this.setState({ progress: 0 });
    }
  };

  render() {
    const { progress } = this.state;

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
              onPress={this.handleSyncDocument}
            />
          </View>
        )}
        <HomeHistory />
      </Container>
    );
  }
}

export default useStore(HomeScreen);
