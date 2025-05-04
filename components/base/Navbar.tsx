import React, { Component } from "react";
import { View } from "react-native";
import TextBase from "./Text";
import { Color, IsMobileScreen } from "@/constants/Styles";
import { StoreProps, useStore } from "@/stores";
import ProfileCard from "./ProfileCard";

interface NavbarProps {
  title: string;
  description?: string;
}

export class Navbar extends Component<StoreProps & NavbarProps> {
  render() {
    return (
      !IsMobileScreen && (
        <View
          style={{
            gap: 10,
            flexDirection: IsMobileScreen ? "column" : "row-reverse",
            justifyContent: "space-between",
            alignItems: IsMobileScreen ? "flex-start" : "center",
            paddingVertical: 10,
            paddingHorizontal: 25,
            backgroundColor: Color.white,
            borderBottomWidth: 1,
            borderBottomColor: Color.grey,
          }}
        >
          <ProfileCard />

          {/* Cari File Description */}
          <View>
            <TextBase variant={this.props.description ? "title" : "titlepage"}>
              {this.props.title}
            </TextBase>
            {this.props.description && (
              <TextBase variant="content">{this.props.description}</TextBase>
            )}
          </View>
        </View>
      )
    );
  }
}

export default useStore(Navbar);
