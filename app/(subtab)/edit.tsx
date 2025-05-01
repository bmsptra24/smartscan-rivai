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
import { showToastable } from "react-native-toastable";
import { StoreProps, useStore } from "@/stores";
import { DOCUMENT_TYPE } from "@/constants/Config";
import { documentService, groupService } from "@/services";
import { Group } from "@/services/Group";

export class Edit extends Component<StoreProps> {
  state = {
    isSaving: false,
  };

  handleOptionSelected = (docId: string) => (selectedIndex: number) => {
    if (selectedIndex >= 0 && selectedIndex < DOCUMENT_TYPE.length) {
      this.props.documentStore.updateDocumentCategory(
        docId,
        DOCUMENT_TYPE[selectedIndex]
      );
    }
  };

  handleSave = async () => {
    try {
      this.setState({ isSaving: true });
      console.log("Saving changes...", this.props.groupStore.selectedGroup);

      // Update group info
      const updatedData = {
        ...this.props.groupStore.selectedGroup,
        documentCount: this.props.documentStore.documents.length,
      };

      const groupResponse = await groupService.upsertGroup(
        this.props.groupStore.selectedGroup?.id,
        updatedData
      );

      if (!groupResponse) return console.error("Failed to update group");
      this.props.groupStore.setSelectedGroup(groupResponse);

      // Update documents
      this.props.documentStore.documents.forEach(async (doc) => {
        await documentService.upsertDocument(doc.id as string, doc);
      });

      // Update list groups in home page
      this.props.groupStore.updateGrup(groupResponse);

      showToastable({
        message: "Perubahan Berhasil Disimpan",
        status: "success",
      });
    } catch (error) {
      console.error("Failed to save changes", error);
    } finally {
      this.setState({ isSaving: false });
      router.back();
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
              <View key={doc.id}>
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

export default useStore(Edit);
