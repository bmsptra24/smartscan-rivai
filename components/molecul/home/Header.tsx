import { View } from "react-native";
import React, { Component } from "react";
import { Color, IsMobileScreen, ResponsiveComponent } from "@/constants/Styles";
import TextBase from "@/components/base/Text";
import InputBase from "@/components/base/Input";
import { groupService } from "@/services";
import { StoreProps, useStore } from "@/stores";
import ProfileCard from "@/components/base/ProfileCard";
import DateRangePicker from "@/components/base/DateRangePicker";

export class HomeHeader extends Component<StoreProps> {
  handleGetAll = async () => {
    const userId = this.props.userStore.currentUser?.id;

    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    const allGroups = await groupService.getGroupsByCreator(userId);
    this.props.groupStore.setGroups(allGroups);
    return allGroups;
  };

  handleSearch = (() => {
    let debounceTimeout: NodeJS.Timeout;

    return async (text: string) => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        // If the search text is empty, fetch all groups created by the user
        if (!text.trim()) {
          await this.handleGetAll();
          return;
        }

        const groups = await groupService.searchGroups(text);
        this.props.groupStore.setGroups(groups);
      }, 300); // 300ms debounce delay
    };
  })();

  handleFilterDate = async (startDate: Date | null, endDate: Date | null) => {
    const allGroups = await this.handleGetAll(); // Ini mengupdate this.props.groupStore.groups

    if (!startDate || !endDate || !allGroups) {
      return;
    }
    // Atur startDate ke awal hari
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setHours(0, 0, 0, 0);

    // Atur endDate ke akhir hari (23:59:59.999)
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    const filteredGroups = allGroups.filter((group) => {
      const groupDate = new Date(group.createdAt.toDate());
      return groupDate >= adjustedStartDate && groupDate <= adjustedEndDate;
    });

    this.props.groupStore.setGroups(filteredGroups);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          // height: 230,
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
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            gap: 15,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <DateRangePicker onDateRangeSelected={this.handleFilterDate} />
          <InputBase
            placeholder="Cari file..."
            style={{
              // width: "100%",
              minWidth: ResponsiveComponent.width - 100,
              flex: 1,
              backgroundColor: Color.white,
            }}
            onChangeText={this.handleSearch}
          />
        </View>
      </View>
    );
  }
}

export default useStore(HomeHeader);
