import { IsMobileScreen, Size } from "@/constants/Styles";
import LottieView from "lottie-react-native";
import React, { Component } from "react";
import TextBase from "./Text";
import { View } from "react-native";

interface NotFoundProps {
  title?: string;
}

export default class NotFound extends Component<NotFoundProps> {
  render() {
    return (
      <View style={{ height: 200 }}>
        <LottieView
          autoPlay
          source={{
            uri: "https://lottie.host/f1b83010-0c81-40b5-a390-9c977d98cfa8/r69wk0Gcfj.lottie",
          }}
          loop={true}
        />
        <TextBase style={{ textAlign: "center" }}>
          {this.props.title ?? "File tidak ditemukan."}
        </TextBase>
      </View>
    );
  }
}
