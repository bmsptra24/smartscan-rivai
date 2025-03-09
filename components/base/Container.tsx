import { ScrollView } from "react-native";
import React, { Component } from "react";
import { Color } from "@/constants/Styles";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContainerProps {
  children: React.ReactNode;
}

export class Container extends Component<ContainerProps> {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.background }}>
        <ScrollView>{this.props.children}</ScrollView>
      </SafeAreaView>
    );
  }
}

export default Container;
