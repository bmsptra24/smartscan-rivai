import { ANDROID_RIPPLE, BorderRadius, Color, LoadingStyle, ResponsiveComponent } from "@/constants/Styles";
import React from "react";
import { Pressable, Text, StyleSheet, PressableProps, ViewStyle, TextStyle } from "react-native";

// Props untuk kustomisasi
interface ButtonBaseProps extends PressableProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
}

const ButtonBase: React.FC<ButtonBaseProps> = ({ title, onPress, style, textStyle, isLoading = false, ...restProps }) => {
  return (
    <Pressable {...restProps} disabled={isLoading} style={({ pressed }) => [styles.button, style, pressed ? styles.pressed : null, isLoading ? LoadingStyle : null]} onPress={onPress} android_ripple={ANDROID_RIPPLE}>
      <Text style={[styles.text, textStyle]}>{!isLoading ? title : "Loading..."}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: ResponsiveComponent.width,
    borderRadius: BorderRadius.default,
  },
  pressed: {
    opacity: 0.7, // Efek sentuh untuk iOS
  },
  text: {
    textAlign: "center",
    color: Color.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonBase;
