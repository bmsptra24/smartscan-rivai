import { Pressable, ScrollView, TextInput, View } from "react-native";
import React, { Component } from "react";
import Container from "@/components/base/Container";
import {
  Color,
  Size,
  Distance,
  BorderRadius,
  ASPECT_RATIO,
} from "@/constants/Styles";
import ButtonBase from "@/components/base/Button";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import PickerActionSheet from "@/components/base/PickerActionSheet";
import { StoreProps, useStore } from "@/stores";
import { DOCUMENT_TYPE } from "@/constants/Config";
import { documentService, groupService } from "@/services";
import { cloudinaryService } from "@/services/Cloudinary";
import { showAlert } from "@/utils/alert";
import IconButton from "@/components/base/IconButton";

export class EditDokumenPage extends Component<StoreProps> {
  state = {
    isSaving: false,
  };

  validateData() {
    const { selectedGroup } = this.props.groupStore;
    const { documents } = this.props.documentStore;

    if (!selectedGroup?.customerId?.trim()) {
      return { isValid: false, message: "ID Pelanggan harus diisi." };
    }

    for (const doc of documents) {
      if (!doc.type || !DOCUMENT_TYPE.includes(doc.type)) {
        return {
          isValid: false,
          message: "Semua dokumen harus memiliki tipe yang valid",
        };
      }
      if (!doc.image_url) {
        return { isValid: false, message: "All documents must have an image" };
      }
    }

    return { isValid: true };
  }

  handleOptionSelected = (docId: string) => (selectedIndex: number) => {
    if (selectedIndex >= 0 && selectedIndex < DOCUMENT_TYPE.length) {
      this.props.documentStore.updateDocumentCategory(
        docId,
        DOCUMENT_TYPE[selectedIndex]
      );
    }
  };

  handleDelete = async (id: string | undefined) => {
    if (!id || !this.props.groupStore.selectedGroup) return;
    this.props.documentStore.deleteDocument(id);
  };

  handleSave = async () => {
    const validation = this.validateData();
    if (!validation.isValid) {
      showAlert("Input tidak valid", validation.message);
      return;
    }

    try {
      this.setState({ isSaving: true });

      // Update the group and doc
      const updatedData = {
        ...this.props.groupStore.selectedGroup,
        documentCount: this.props.documentStore.documents.length,
      };

      const groupResponse = await groupService.upsertGroup(
        this.props.groupStore.selectedGroup?.id,
        updatedData
      );

      if (!groupResponse) {
        throw new Error("Failed to update group");
      }
      this.props.groupStore.setSelectedGroup(groupResponse);

      await Promise.all(
        this.props.documentStore.documents.map(async (doc) => {
          let response;
          if (!doc.image_public_id) {
            response = await cloudinaryService.addFile(doc.image_url);
          } else {
            response = await cloudinaryService.upsertFile(
              doc.image_public_id,
              doc.image_url
            );
          }

          const updatedData = {
            ...doc,
            image_public_id: response?.public_id,
            image_url: response?.secure_url,
          };
          return documentService.upsertDocument(doc.id as string, updatedData);
        })
      );

      this.props.groupStore.updateGrup(groupResponse);

      // Delete doc in firestore that deleted in state
      const docsInFirestore = await documentService.getDocumentsByGroupId(
        groupResponse.id
      );
      // 1. Check documents that are in Firestore but not in the state
      const stateDocumentIds = this.props.documentStore.documents.map(
        (doc) => doc.id
      );
      const documentsToDelete = docsInFirestore.filter(
        (firestoreDoc) => !stateDocumentIds.includes(firestoreDoc.id)
      );
      // 2. Delete the documents
      await Promise.all(
        documentsToDelete.map(async (doc) => {
          if (!doc.id || !doc.image_public_id) return;
          await cloudinaryService.deleteFile(doc.image_public_id);
          await documentService.deleteDocument(doc.id);
        })
      );

      showAlert("Success", "Perubahan Berhasil Disimpan");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Failed to save changes", error);
      showAlert("Error", "Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      this.setState({ isSaving: false });
    }
  };

  render() {
    return (
      <Container>
        <View
          style={{
            height: Size.screen.height,
            paddingVertical: Distance.default,
            paddingHorizontal: Distance.default,
            gap: Distance.default,
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                position: "absolute",
                backgroundColor: Color.greyLight,
                padding: 4,
                borderRadius: BorderRadius.default,
                zIndex: 1,
              }}
            >
              <Ionicons name="arrow-back" size={18} color={Color.text} />
            </Pressable>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <TextInput
                placeholder="ID Pelanggan"
                value={this.props.groupStore.selectedGroup?.customerId}
                style={{
                  fontFamily: "OpenSansBold",
                  fontSize: 16,
                  color: Color.text,
                  width: 120,
                }}
                onChangeText={(customerId) => {
                  if (!this.props.groupStore.selectedGroup)
                    return console.error("Selected group is undefined");

                  this.props.groupStore.setSelectedGroup({
                    ...this.props.groupStore.selectedGroup,
                    customerId,
                  });
                }}
              />
              <MaterialCommunityIcons name="pencil" size={16} color="black" />
            </View>
          </View>

          {/* Gambar Document */}
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              gap: Distance.default,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {this.props.documentStore.documents.map((doc) => (
              <View key={doc.id} style={{ position: "relative" }}>
                <IconButton
                  onPress={() => this.handleDelete(doc.id)}
                  icon={<Ionicons name="close" size={18} color="black" />}
                  size="small"
                  style={{
                    backgroundColor: Color.white,
                    width: 26,
                    height: 26,
                    position: "absolute",
                    top: 6,
                    left: 6,
                    zIndex: 2,
                  }}
                />
                <Image
                  source={{ uri: doc.image_url }}
                  style={{
                    width: 150,
                    aspectRatio: ASPECT_RATIO.A4,
                    borderWidth: 1,
                    borderColor: Color.black,
                    borderRadius: BorderRadius.default,
                  }}
                />
                <PickerActionSheet
                  title={doc.type}
                  options={[...DOCUMENT_TYPE, "Cancel"]}
                  onOptionSelected={this.handleOptionSelected(doc.id as string)}
                  style={{ marginTop: Distance.default, width: 150 }}
                />
              </View>
            ))}
            <View
              style={{ borderRadius: BorderRadius.default, overflow: "hidden" }}
            >
              <Pressable
                style={{
                  width: 150,
                  aspectRatio: ASPECT_RATIO.A4,
                  borderRadius: BorderRadius.default,
                  backgroundColor: Color.greyLight,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                android_ripple={{ color: Color.placeholder }}
                onPress={documentService.handleScanDocument}
              >
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={48}
                  color={Color.placeholder}
                />
              </Pressable>
            </View>
          </ScrollView>

          {/* Tombol Aksi */}
          <ButtonBase
            isLoading={this.state.isSaving}
            style={{ width: "100%" }}
            textStyle={{ color: Color.text }}
            title="Save"
            onPress={this.handleSave}
          />
        </View>
      </Container>
    );
  }
}

export default useStore(EditDokumenPage);
