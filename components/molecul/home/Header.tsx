import { Text, View } from "react-native";
import React, { PureComponent } from "react";
import { BorderRadius, Color } from "@/constants/Styles";
import { Image } from "expo-image";
import TextBase from "@/components/base/Text";
import InputBase from "@/components/base/Input";

export class HomeHeader extends PureComponent {
  render() {
    return (
      <View
        style={{
          flex: 1,
          height: 230,
          backgroundColor: Color.primary,
          borderBottomRightRadius: 49,
          borderBottomLeftRadius: 49,
          padding: 25,
          justifyContent: "space-between",
        }}
      >
        {/* Profile */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Image
            source={{
              uri: "https://api.dicebear.com/9.x/initials/svg?seed=Bima Saputra",
            }}
            style={{ width: 40, height: 40, borderRadius: BorderRadius.full }}
          />
          <View>
            <TextBase variant="subcontent">Selamat datang,</TextBase>
            <TextBase variant="header">Bima Saputra</TextBase>
          </View>
        </View>

        {/* Cari File Description */}
        <View>
          <TextBase variant="title">Cari File Kamu</TextBase>
          <TextBase variant="content">
            Cari file yang diunggah dengan mudah.
          </TextBase>
        </View>

        {/* Cari File Input */}
        <InputBase placeholder="Cari file..." style={{ width: "100%" }} />
      </View>
    );
  }
}

export default HomeHeader;
