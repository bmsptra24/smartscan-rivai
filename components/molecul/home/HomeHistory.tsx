import { View } from "react-native";
import React, { Component } from "react";
import TextBase from "@/components/base/Text";
import HistoryItem from "@/components/list/HistoryItem";
import { dateFormatter, timeFormatter } from "@/utils/formatter";
import { groupService, userService } from "@/services";
import useGroupStore from "@/stores/Group";
import { router } from "expo-router";
import { StoreProps, useStore } from "@/stores";
import NotFound from "@/components/base/NotFound";
import { showConfirm } from "@/utils/alert";

export class HomeHistory extends Component<StoreProps> {
  async componentDidMount() {
    const userData = userService.getCurrentUser();
    if (!userData || !userData.id)
      return console.error("User data is missing or incomplete.");

    const groups = await groupService.getGroupsByCreator(userData.id);
    if (!groups) return console.error("No groups found.");
    this.props.groupStore.setGroups(groups);
  }

  handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      "Hapus",
      "Apakah Anda yakin ingin menghapus riwayat ini?"
    );
    if (!confirmed) return;

    const userData = userService.getCurrentUser();
    if (!userData || !userData.id)
      return console.error("User data is missing or incomplete.");

    await groupService.deleteGroup(id);
    this.props.groupStore.removeGroup(id);
  };

  render() {
    return (
      <View>
        <TextBase
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}
          variant="header"
        >
          Riwayat
        </TextBase>

        {this.props.groupStore.groups.length === 0 && <NotFound />}

        <View style={{}}>
          {this.props.groupStore.groups &&
            this.props.groupStore.groups?.map((item, index) => (
              <HistoryItem
                key={index.toString()}
                id={item.id ?? ""}
                costumerId={item.customerId ?? ""}
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
                onDelete={this.handleDelete}
              />
            ))}
        </View>
      </View>
    );
  }
}

export default useStore(HomeHistory);
