import React, { Component } from "react";
import Container from "@/components/base/Container";
import TextBase from "@/components/base/Text";
import { Image } from "expo-image";
import { BorderRadius, Color, Size, TABBAR_HEIGHT } from "@/constants/Styles";
import { Platform, View } from "react-native";
import ButtonBase from "@/components/base/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StoreProps, useStore } from "@/stores";
import { authService } from "@/services";
import { APP_VERSION } from "@/constants/Config";

class Profile extends Component<StoreProps> {
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
              uri:
                "https://api.dicebear.com/9.x/initials/svg?seed=" +
                this.props.userStore.currentUser?.displayName,
            }}
            style={{ width: 223, height: 223, borderRadius: BorderRadius.full }}
          />
          <View>
            <TextBase variant="header" style={{ textAlign: "center" }}>
              {this.props.userStore.currentUser?.username}
            </TextBase>
            <TextBase variant="content" style={{ textAlign: "center" }}>
              {this.props.userStore.currentUser?.displayName}
            </TextBase>
          </View>

          <TextBase variant="header">Versi {APP_VERSION}</TextBase>

          <ButtonBase
            style={{ backgroundColor: Color.greyLight }}
            textStyle={{ color: Color.text }}
            icon={<MaterialIcons name="logout" size={24} color={Color.text} />}
            title="Logout"
            onPress={authService.logout}
          />
        </View>
      </Container>
    );
  }
}

export default useStore(Profile);
