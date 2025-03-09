import React from "react";
import {
  Pressable,
  StyleSheet,
  PressableProps,
  ViewStyle,
  View,
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
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  style,
  isLoading = false,
  icon,
  size = "medium",
  ...restProps
}) => {
  // Determine button size
  let buttonSize: number;
  switch (size) {
    case "small":
      buttonSize = 40;
      break;
    case "large":
      buttonSize = 64;
      break;
    default:
      buttonSize = 52;
  }

  return (
    <Pressable
      {...restProps}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
        },
        style,
        pressed ? styles.pressed : null,
        isLoading ? LoadingStyle : null,
      ]}
      onPress={onPress}
      android_ripple={ANDROID_RIPPLE}
    >
      <View style={styles.iconContainer}>{icon}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.full,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});

export default IconButton;
