import {
  Color,
  BorderRadius,
  IsMobileScreen,
  ResponsiveComponent,
} from "@/constants/Styles";
import React, { Component } from "react";
import { StyleProp, TextInput, TextInputProps, TextStyle } from "react-native";

interface InputBaseProps extends TextInputProps {
  variant?: "default" | "search";
  size?: "large" | "medium" | "small";
  style?: StyleProp<TextStyle>;
}

export default class InputBase extends Component<InputBaseProps> {
  render() {
    const {
      variant = "default",
      size = IsMobileScreen ? "small" : "medium",
      style,
      ...restProps
    } = this.props;

    // Tentukan padding berdasarkan ukuran
    const paddingStyles = {
      large: { paddingVertical: 24, paddingHorizontal: 28 },
      medium: { paddingVertical: 18, paddingHorizontal: 20 },
      small: { paddingVertical: 15, paddingHorizontal: 20 },
    };

    return (
      <TextInput
        {...restProps}
        style={[
          {
            backgroundColor: Color.greyLight,
            width: ResponsiveComponent.width,
            borderRadius: BorderRadius.full,
            fontFamily: "PlusJakartaSans",
            color: Color.placeholder,
          },
          paddingStyles[size], // Gunakan padding sesuai ukuran
          style,
        ]}
      />
    );
  }
}
