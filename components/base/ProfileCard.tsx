import { Image } from "expo-image";
import React, { Component } from "react";
import { View } from "react-native";
import TextBase from "./Text";
import { BorderRadius } from "@/constants/Styles";
import { StoreProps, useStore } from "@/stores";

export class ProfileCard extends Component<StoreProps> {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Image
          source={{
            uri:
              "https://api.dicebear.com/9.x/initials/svg?seed=" +
              this.props.userStore.currentUser?.displayName,
          }}
          style={{ width: 40, height: 40, borderRadius: BorderRadius.full }}
        />
        <View>
          <TextBase variant="subcontent">Selamat datang,</TextBase>
          <TextBase variant="header">
            {this.props.userStore.currentUser?.displayName}
          </TextBase>
        </View>
      </View>
    );
  }
}

export default useStore(ProfileCard);
