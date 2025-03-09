import { View, FlatList, Dimensions } from "react-native";
import React, { PureComponent } from "react";
import Container from "@/components/base/Container";
import TextBase from "@/components/base/Text";
import { BorderRadius, Color, Size, Distance } from "@/constants/Styles";
import ButtonBase from "@/components/base/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import IconButton from "@/components/base/IconButton";
import { WebView } from "react-native-webview"; // Ganti Pdf dengan WebView

interface ScrollEvent {
  nativeEvent: {
    contentOffset: {
      x: number;
    };
  };
}

export class Detail extends PureComponent {
  state = {
    currentIndex: 0,
    documents: [
      {
        uri: "https://media.neliti.com/media/publications/331245-aplikasi-pengelolaan-dokumen-dan-arsip-b-228aadf8.pdf",
      },
      {
        uri: "https://media.neliti.com/media/publications/331245-aplikasi-pengelolaan-dokumen-dan-arsip-b-228aadf8.pdf",
      },
    ],
  };

  handleScrollEnd = (e: ScrollEvent) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / Size.screen.width);
    this.setState({ currentIndex });
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
            <Ionicons
              name="arrow-back"
              size={18}
              color={Color.text}
              style={{
                position: "absolute",
                left: 0,
                backgroundColor: Color.greyLight,
                padding: 4,
                borderRadius: BorderRadius.default,
              }}
              onPress={() => router.back()} // Kembali ke halaman sebelumnya
            />
            <TextBase
              style={{ textAlign: "center", flex: 1 }}
              variant="titlepage"
            >
              Detail
            </TextBase>
          </View>

          {/* Preview PDF Section */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.documents}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: Size.screen.width - 40,
                    aspectRatio: "210/297", //size A4 papper
                  }}
                >
                  <WebView
                    source={{
                      uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                        item.uri
                      )}`,
                    }}
                    style={{ flex: 1 }}
                    onError={(error) =>
                      console.log("Error loading PDF:", error)
                    }
                  />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              onMomentumScrollEnd={this.handleScrollEnd}
            />

            {/* Page Indicator */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
                marginTop: Distance.default,
              }}
            >
              {this.state.documents.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      index === this.state.currentIndex
                        ? Color.primary
                        : Color.greyLight,
                  }}
                />
              ))}
            </View>
          </View>

          {/* Detail Informasi */}
          <View
            style={{
              flex: 1,
              gap: Distance.default,
            }}
          >
            <View>
              <TextBase variant="header">ID Pelanggan</TextBase>
              <TextBase variant="content">141002212997</TextBase>
            </View>

            <View>
              <TextBase variant="header">Jumlah</TextBase>
              <TextBase variant="content">5 Jenis Dokumen</TextBase>
            </View>

            <View>
              <TextBase variant="header">Tanggal update</TextBase>
              <TextBase variant="content">10 Oktober 2024</TextBase>
            </View>
          </View>

          {/* Tombol Aksi */}
          <View style={{ flexDirection: "row", gap: Distance.default }}>
            <ButtonBase
              style={{ flex: 1 }}
              textStyle={{ color: Color.text }}
              title="Edit"
              onPress={() => router.push("/(subtab)/edit")}
            />
            <IconButton
              style={{ backgroundColor: Color.secondary }}
              icon={
                <MaterialCommunityIcons
                  name="share"
                  size={24}
                  color={Color.text}
                />
              }
              onPress={() => {}}
            />
          </View>
        </View>
      </Container>
    );
  }
}

export default Detail;
