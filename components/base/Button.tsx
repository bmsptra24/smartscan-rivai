import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import {
  ANDROID_RIPPLE,
  BorderRadius,
  Color,
  LoadingStyle,
  ResponsiveComponent,
} from "@/constants/Styles";

// Props untuk kustomisasi
interface ButtonBaseProps extends PressableProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const ButtonBase: React.FC<ButtonBaseProps> = ({
  title,
  onPress,
  style,
  textStyle,
  isLoading = false,
  icon,
  ...restProps
}) => {
  return (
    <Pressable
      {...restProps}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed ? styles.pressed : null,
        isLoading ? LoadingStyle : null,
      ]}
      onPress={onPress}
      android_ripple={ANDROID_RIPPLE}
    >
      <View
        style={[
          styles.contentContainer,
          { justifyContent: icon ? "space-between" : "center" },
        ]}
      >
        <Text style={[styles.text, textStyle]}>
          {!isLoading ? title : "Loading..."}
        </Text>
        {icon && icon}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: ResponsiveComponent.width,
    borderRadius: BorderRadius.full,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7, // Efek sentuh untuk iOS
  },
  text: {
    color: Color.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonBase;
