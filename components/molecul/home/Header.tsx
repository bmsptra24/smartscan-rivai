import { View } from "react-native";
import React, { Component } from "react";
import { BorderRadius, Color, IsMobileScreen } from "@/constants/Styles";
import { Image } from "expo-image";
import TextBase from "@/components/base/Text";
import InputBase from "@/components/base/Input";
import { groupService } from "@/services";
import { StoreProps, useStore } from "@/stores";
import ProfileCard from "@/components/base/ProfileCard";

export class HomeHeader extends Component<StoreProps> {
  handleSearch = (() => {
    let debounceTimeout: NodeJS.Timeout;

    return async (text: string) => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        // If the search text is empty, fetch all groups created by the user
        if (!text.trim()) {
          const userId = this.props.userStore.currentUser?.id;

          if (!userId) {
            console.error("User ID is undefined");
            return;
          }

          const allGroups = await groupService.getGroupsByCreator(userId);
          this.props.groupStore.setGroups(allGroups);
          return;
        }

        const groups = await groupService.searchGroups(text);
        this.props.groupStore.setGroups(groups);
      }, 300); // 300ms debounce delay
    };
  })();

  render() {
    return (
      <View
        style={{
          flex: 1,
          height: 230,
          backgroundColor: Color.primary,
          borderBottomRightRadius: IsMobileScreen ? 49 : 0,
          borderBottomLeftRadius: IsMobileScreen ? 49 : 0,
          padding: 25,
          justifyContent: "space-between",
        }}
      >
        {/* Profile */}
        <View
          style={{
            gap: 10,
            flexDirection: IsMobileScreen ? "column" : "row-reverse",
            justifyContent: "space-between",
            alignItems: IsMobileScreen ? "flex-start" : "center",
          }}
        >
          <ProfileCard />

          {/* Cari File Description */}
          <View>
            <TextBase variant="title">Cari File Kamu</TextBase>
            <TextBase variant="content">
              Cari file yang diunggah dengan mudah.
            </TextBase>
          </View>
        </View>

        {/* Cari File Input */}
        <InputBase
          placeholder="Cari file..."
          style={{ width: "100%", marginTop: 10 }}
          onChangeText={this.handleSearch}
        />
      </View>
    );
  }
}

export default useStore(HomeHeader);
