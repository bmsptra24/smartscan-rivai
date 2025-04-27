import React, { Component } from "react";
import Container from "@/components/base/Container";
import TextBase from "@/components/base/Text";
import { Image } from "expo-image";
import { BorderRadius, Color, Size, TABBAR_HEIGHT } from "@/constants/Styles";
import { View } from "react-native";
import ButtonBase from "@/components/base/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

export default class profile extends Component {
  handleLogout = () => {
    router.replace("/");
  };
  render() {
    return (
      <Container>
        <View
          style={{
            height: Size.screen.height - TABBAR_HEIGHT,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TextBase variant="titlepage">Profile</TextBase>
          <Image
            source={{
              uri: "https://api.dicebear.com/9.x/initials/svg?seed=Bima Saputra",
            }}
            style={{ width: 223, height: 223, borderRadius: BorderRadius.full }}
          />
          <View>
            <TextBase variant="header">14100.bima</TextBase>
            <TextBase variant="content">Bima Saputra</TextBase>
          </View>

          <TextBase variant="header">Versi 1.1</TextBase>

          <ButtonBase
            style={{ backgroundColor: Color.secondary }}
            textStyle={{ color: Color.text }}
            icon={<MaterialIcons name="logout" size={24} color={Color.text} />}
            title="Logout"
            onPress={this.handleLogout}
          />
        </View>
      </Container>
    );
  }
}
