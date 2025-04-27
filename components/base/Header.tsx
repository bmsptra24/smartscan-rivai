import { Pressable, View } from "react-native";
import React, { Component } from "react";
import { router } from "expo-router";
import { BorderRadius, Color } from "@/constants/Styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import TextBase from "./Text";

interface HeaderProps {
  title: string;
}

export class Header extends Component<HeaderProps> {
  render() {
    return (
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
        <TextBase style={{ textAlign: "center", flex: 1 }} variant="titlepage">
          {this.props.title}
        </TextBase>
      </View>
    );
  }
}

export default Header;
