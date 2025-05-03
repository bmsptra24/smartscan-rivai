import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import TextBase from "./Text";
import {
  BorderRadius,
  Color,
  IsMobileScreen,
  ResponsiveComponent,
} from "@/constants/Styles";
import AntDesign from "@expo/vector-icons/AntDesign";

interface PickerActionSheetProps {
  title?: string;
  options: string[];
  destructiveButtonIndex?: number;
  cancelButtonIndex?: number;
  onOptionSelected?: (selectedIndex: number) => void;
  style?: StyleProp<ViewStyle>;
  size?: "large" | "medium" | "small";
  variant?: "default" | "white-border";
}

const PickerActionSheet: React.FC<PickerActionSheetProps> = ({
  title = "Menu",
  options = ["Cancel"],
  destructiveButtonIndex,
  cancelButtonIndex = options.length - 1,
  onOptionSelected,
  size = IsMobileScreen ? "small" : "medium",
  style,
  variant = "default",
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        cancelButtonTintColor: Color.danger,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (onOptionSelected) {
          if (selectedIndex !== undefined) {
            onOptionSelected(selectedIndex);
          }
        }
      }
    );
  };

  const paddingStyles = {
    large: { paddingVertical: 24 - 2, paddingHorizontal: 28 },
    medium: { paddingVertical: 18 - 2, paddingHorizontal: 20 },
    small: { paddingVertical: 15 - 2, paddingHorizontal: 20 },
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          padding: 10,
          borderRadius:
            variant === "default" ? BorderRadius.full : BorderRadius.default,
          backgroundColor:
            variant === "default" ? Color.greyLight : Color.white,
          borderWidth: variant === "default" ? 0 : 1,
          width: ResponsiveComponent.width,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        paddingStyles[size],
        style,
      ]}
    >
      <TextBase
        style={{
          color: variant === "default" ? Color.placeholder : Color.text,
        }}
      >
        {title}
      </TextBase>
      <AntDesign name="caretdown" size={12} color={Color.placeholder} />
    </Pressable>
  );
};

export default PickerActionSheet;
