import { Pressable, ScrollView, TextInput, View } from "react-native";
import React, { Component } from "react";
import Container from "@/components/base/Container";
import {
  Color,
  Size,
  Distance,
  BorderRadius,
  ASPECT_RATIO,
  ANDROID_RIPPLE,
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
import { documentService } from "@/services";

export class Edit extends Component<StoreProps> {
  // Handler untuk pilihan kategori
  handleOptionSelected = (docId: string) => (selectedIndex: number) => {
    if (selectedIndex >= 0 && selectedIndex < DOCUMENT_TYPE.length) {
      this.props.document.updateDocumentCategory(
        docId,
        DOCUMENT_TYPE[selectedIndex]
      );
    }
  };

  // Handler simpan perubahan
  handleSave = () => {
    showToastable({
      message: "Perubahan Berhasil Disimpan",
      status: "success",
    });
    router.back();
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
                value={this.props.document.title}
                style={{
                  fontFamily: "OpenSansBold",
                  fontSize: 16,
                  color: Color.text,
                  width: 120,
                }}
                onChangeText={(title) => this.props.document.setTitle(title)}
              />
              <MaterialCommunityIcons name="pencil" size={16} color="black" />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              gap: Distance.default,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {this.props.document.documents.map((doc) => (
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
