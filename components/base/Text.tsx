import { Color } from "@/constants/Styles";
import React, { Component, ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

interface TextBaseProps {
  children: ReactNode;
  variant?: "title" | "header" | "content" | "subcontent";
  style?: StyleProp<TextStyle>;
}

export default class TextBase extends Component<TextBaseProps> {
  render() {
    const { children, variant, style } = this.props;

    // Menentukan style berdasarkan variant
    let fontSize: number;
    let fontFamily: "OpenSansMedium" | "OpenSansSemiBold" | "OpenSansBold" =
      "OpenSansMedium";
    switch (variant) {
      case "title":
        fontSize = 24;
        fontFamily = "OpenSansSemiBold";
        break;
      case "header":
        fontSize = 14;
        fontFamily = "OpenSansBold";
        break;
      case "content":
        fontSize = 14;
        fontFamily = "OpenSansMedium";
        break;
      case "subcontent":
        fontSize = 12;
        fontFamily = "OpenSansMedium";
        break;
      default:
        fontSize = 14;
        fontFamily = "OpenSansMedium";
    }

    return (
      <Text
        style={[
          {
            fontFamily: fontFamily,
            fontSize: fontSize,
            color: Color.text,
          },
          style,
        ]}
      >
        {children}
      </Text>
    );
  }
}
