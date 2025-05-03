import Container from "@/components/base/Container";
import IconButton from "@/components/base/IconButton";
import Navbar from "@/components/base/Navbar";
import Table from "@/components/base/Table";
import TextBase from "@/components/base/Text";
import { userService } from "@/services";
import { UserProfile } from "@/services/User";
import { StoreProps, useStore } from "@/stores";
import { showAlert, showConfirm } from "@/utils/alert";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import React, { Component } from "react";
import { View } from "react-native";

export class UsersPage extends Component<StoreProps> {
  tableHead: string[] = ["Nama", "Username", "Role", "Aksi"];
  widthArr: number[] = [100, 120, 140, 160];

  async componentDidMount() {
    const users = await userService.getAllUsers();
    this.props.userStore.setUsers(users);
  }

  generateButtonAction = (user: UserProfile) => {
    const handleDelete = async () => {
      try {
        const confirmation = await showConfirm(
          "Hapus",
          "Apakah Anda yakin ingin menghapus riwayat ini?"
        );
        if (!confirmation) return;
        const isDeleted = await userService.deleteUser(user.id);
        if (!isDeleted) return;
        this.props.userStore.deleteUser(user.id);
        showAlert("Success", "Berhasil menghapus akun pengguna.");
      } catch (error) {
        showAlert("Error", `${error}`);
      }
    };

    const handleEdit = () => {
      this.props.userStore.setSelectedUser(user);
      router.push(`/(tabs)/edit-users`);
    };

    return (
      <View style={{ flexDirection: "row", gap: 10 }}>
        <IconButton
          onPress={handleDelete}
          icon={<Ionicons name="trash" size={24} color="black" />}
          size="small"
        />

        <IconButton
          onPress={handleEdit}
          icon={
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          }
          size="small"
        />
      </View>
    );
  };

  render() {
    const tableData = this.props.userStore.users.map((user) => [
      user.displayName,
      user.username,
      user.role,
      this.generateButtonAction(user),
    ]);

    return (
      <Container>
        <View style={{ gap: 20 }}>
          <Navbar title="Pengguna" />
          <View
            style={{
              paddingHorizontal: 25,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextBase variant="title">Akun Pengguna</TextBase>
            <IconButton
              onPress={() => {
                this.props.userStore.clearSelectedUserState();
                router.push("/(tabs)/edit-users");
              }}
              icon={<FontAwesome6 name="add" size={24} color="black" />}
              size="small"
            />
          </View>
          <View style={{ paddingHorizontal: 25, flex: 1 }}>
            <Table
              tableHead={this.tableHead}
              tableData={tableData}
              containerStyle={{ flex: 1 }}
              bodyCellStyle={{ width: "25%" }}
              headerCellStyle={{ width: "25%" }}
              // widthArr={this.widthArr}
            />
          </View>
        </View>
      </Container>
    );
  }
}

export default useStore(UsersPage);
