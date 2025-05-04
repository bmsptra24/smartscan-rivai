import React, { Component } from "react";
import { Animated, Easing } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface SpinnerIconProps {
  size?: number;
  color?: string;
}

interface SpinnerIconState {
  isSpinning: boolean;
}

export class SpinnerIcon extends Component<SpinnerIconProps, SpinnerIconState> {
  state = {
    isSpinning: true, // Always spinning when rendered
  };

  spinValue = new Animated.Value(0);

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    this.spinValue.setValue(0);
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 1000, // 1 second per rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  render() {
    const { size = 24, color = "#000" } = this.props;

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome6 name="spinner" size={size} color={color} />
      </Animated.View>
    );
  }
}
