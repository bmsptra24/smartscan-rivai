import { View } from "react-native";
import React, { Component } from "react";
import TextBase from "@/components/base/Text";
import HistoryItem from "@/components/list/HistoryItem";
import { dateFormatter, timeFormatter } from "@/utils/formatter";
import { documentService, groupService, userService } from "@/services";
import { Group } from "@/services/Group";
import useGroupStore from "@/stores/Group";
import { router } from "expo-router";
import { StoreProps, useStore } from "@/stores";

// const historyData = [
//   {
//     index: 0,
//     id: "141002212997",
//     fileCount: 5,
//     date: "21 Okt 2024",
//     time: "12.15",
//   },
//   {
//     index: 1,
//     id: "141002212998",
//     fileCount: 3,
//     date: "22 Okt 2024",
//     time: "14.30",
//   },
//   {
//     index: 2,
//     id: "141002212997",
//     fileCount: 5,
//     date: "21 Okt 2024",
//     time: "12.15",
//   },
//   {
//     index: 3,
//     id: "141002212998",
//     fileCount: 3,
//     date: "22 Okt 2024",
//     time: "14.30",
//   },
//   {
//     index: 4,
//     id: "141002212997",
//     fileCount: 5,
//     date: "21 Okt 2024",
//     time: "12.15",
//   },
//   {
//     index: 5,
//     id: "141002212998",
//     fileCount: 3,
//     date: "22 Okt 2024",
//     time: "14.30",
//   },
//   {
//     index: 6,
//     id: "141002212997",
//     fileCount: 5,
//     date: "21 Okt 2024",
//     time: "12.15",
//   },
//   {
//     index: 7,
//     id: "141002212998",
//     fileCount: 3,
//     date: "22 Okt 2024",
//     time: "14.30",
//   },
// ];

export class HomeHistory extends Component<StoreProps> {
  async componentDidMount() {
    const userData = userService.getCurrentUser();
    if (!userData || !userData.id)
      return console.error("User data is missing or incomplete.");

    const groups = await groupService.getGroupsByCreator(userData.id);
    if (!groups) return console.error("No groups found.");
    this.props.groupStore.setGroups(groups);
  }

  render() {
    return (
      <View>
        <TextBase
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}
          variant="header"
        >
          Riwayat
        </TextBase>

        <View style={{}}>
          {this.props.groupStore.groups &&
            this.props.groupStore.groups?.map((item, index) => (
              <HistoryItem
                key={index.toString()}
                id={item.customerId ?? ""}
                fileCount={item.documentCount}
                // fileCount={this.props.groupStore.groups.length}
                date={dateFormatter.format(
                  item.createdAt instanceof Date
                    ? item.createdAt
                    : item.createdAt.toDate()
                )}
                time={timeFormatter(item.createdAt.toDate())}
                index={index}
                onPress={() => {
                  useGroupStore.getState().setSelectedGroup(item);
                  router.push("/(subtab)/detail");
                }}
              />
            ))}
        </View>
      </View>
    );
  }
}

export default useStore(HomeHistory);
