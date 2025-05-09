import { BorderRadius, Color } from "@/constants/Styles";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface ProgressBarProps {
  progress: number;
  duration?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration = 1000,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolation = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progress, { width: widthInterpolation }]}>
          <Text style={styles.percentage}>{`${Math.round(progress)}%`}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressBar: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: Color.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  percentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    minWidth: 50,
  },
});

export default ProgressBar;
