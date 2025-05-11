import React from "react";
import {
  Pressable,
  StyleSheet,
  PressableProps,
  ViewStyle,
  View,
  Text,
} from "react-native";
import {
  ANDROID_RIPPLE,
  BorderRadius,
  Color,
  LoadingStyle,
} from "@/constants/Styles";

interface IconButtonProps extends PressableProps {
  onPress?: () => void;
  style?: ViewStyle;
  isLoading?: boolean;
  icon: React.ReactNode;
  size?: "small" | "medium" | "large";
  title?: string; // Tambahkan props title
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  style,
  isLoading = false,
  icon,
  size = "medium",
  title, // Destructure title
  ...restProps
}) => {
  // Determine button size
  let buttonSize: number;
  let fontSize: number;
  switch (size) {
    case "small":
      buttonSize = 40;
      fontSize = 12;
      break;
    case "large":
      buttonSize = 64;
      fontSize = 16;
      break;
    default:
      buttonSize = 52;
      fontSize = 14;
  }

  return (
    <Pressable
      {...restProps}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          height: buttonSize,
          // Lebar disesuaikan untuk menampung ikon dan teks
          paddingRight: title ? 16 : 0,
        },
        style,
        pressed ? styles.pressed : null,
        isLoading ? LoadingStyle : null,
      ]}
      onPress={onPress}
      android_ripple={ANDROID_RIPPLE}
    >
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { width: buttonSize }]}>
          {icon}
        </View>
        {title && <Text style={[styles.title, { fontSize }]}>{title}</Text>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    flexDirection: "row",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: Color.text,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default IconButton;
