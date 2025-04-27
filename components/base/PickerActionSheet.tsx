import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import TextBase from "./Text";
import { BorderRadius, Color, ResponsiveComponent } from "@/constants/Styles";
import AntDesign from "@expo/vector-icons/AntDesign";

interface PickerActionSheetProps {
  title?: string;
  options: string[];
  destructiveButtonIndex?: number;
  cancelButtonIndex?: number;
  onOptionSelected?: (selectedIndex: number) => void;
  style?: StyleProp<ViewStyle>;
}

const PickerActionSheet: React.FC<PickerActionSheetProps> = ({
  title = "Menu",
  options = ["Cancel"],
  destructiveButtonIndex,
  cancelButtonIndex = options.length - 1,
  onOptionSelected,
  style,
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

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          padding: 10,
          borderRadius: BorderRadius.default,
          backgroundColor: Color.white,
          borderWidth: 1,
          width: ResponsiveComponent.width,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        style,
      ]}
    >
      <TextBase>{title}</TextBase>
      <AntDesign name="caretdown" size={12} color={Color.black} />
    </Pressable>
  );
};

export default PickerActionSheet;
