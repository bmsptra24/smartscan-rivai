import Container from "@/components/base/Container";
import IconButton from "@/components/base/IconButton";
import Navbar from "@/components/base/Navbar";
import Table from "@/components/base/Table";
import TextBase from "@/components/base/Text";
import { Color } from "@/constants/Styles";
import { userService } from "@/services";
import { UserProfile } from "@/services/User";
import { StoreProps, useStore } from "@/stores";
import { showAlert, showConfirm } from "@/utils/alert";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { Component } from "react";
import { View, Dimensions } from "react-native";

interface UsersPageState {
  screenWidth: number;
}

export class UsersPage extends Component<StoreProps, UsersPageState> {
  tableHead: string[] = ["Nama", "Username", "Role", "Aksi"];

  // We'll calculate widths dynamically based on screen size
  constructor(props: StoreProps) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
    };

    this.dimensionsHandler = null; // Initialize in constructor
  }

  dimensionsHandler: any;

  componentDidMount() {
    this.fetchUsers();

    // Add event listener for screen dimension changes
    this.dimensionsHandler = Dimensions.addEventListener(
      "change",
      this.updateScreenWidth
    );
  }

  componentWillUnmount() {
    // Clean up event listener
    if (this.dimensionsHandler) {
      this.dimensionsHandler.remove();
    }
  }

  updateScreenWidth = () => {
    this.setState({
      screenWidth: Dimensions.get("window").width,
    });
  };

  async fetchUsers() {
    const users = await userService.getAllUsers();
    this.props.userStore.setUsers(users);
  }

  getWidthArr() {
    const { screenWidth } = this.state;
    const isMobile = screenWidth < 768;

    if (isMobile) {
      // More compact widths for mobile
      return [120, 120, 100, 150];
    } else {
      // Original widths for desktop
      return [300, 320, 300, 500];
    }
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
      router.push(`/(subtab)/edit-users`);
    };

    const isMobile = this.state.screenWidth < 768;

    return (
      <View style={{ flexDirection: "row", gap: isMobile ? 5 : 10 }}>
        <IconButton
          onPress={handleEdit}
          icon={
            <MaterialCommunityIcons
              name="pencil"
              size={isMobile ? 18 : 24}
              color="black"
            />
          }
          size="small"
        />
        <IconButton
          style={{ backgroundColor: Color.danger }}
          onPress={handleDelete}
          icon={
            <Ionicons
              name="trash"
              size={isMobile ? 18 : 24}
              color={Color.white}
            />
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

    const isMobile = this.state.screenWidth < 768;

    return (
      <Container>
        <View style={{ gap: isMobile ? 10 : 20 }}>
          <Navbar title="Pengguna" />
          <View
            style={{
              paddingHorizontal: isMobile ? 15 : 25,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextBase variant="title">Akun Pengguna</TextBase>
            <IconButton
              onPress={() => {
                this.props.userStore.clearSelectedUserState();
                router.push("/(subtab)/edit-users");
              }}
              icon={
                <FontAwesome6
                  name="add"
                  size={isMobile ? 18 : 24}
                  color="black"
                />
              }
              size="small"
            />
          </View>
          <View
            style={{
              paddingHorizontal: isMobile ? 10 : 25,
              flex: 1,
            }}
          >
            <Table
              tableHead={this.tableHead}
              tableData={tableData}
              widthArr={isMobile ? this.getWidthArr() : undefined}
              containerStyle={{
                padding: isMobile ? 5 : 15,
                flex: isMobile ? 0 : 1,
              }}
              headerCellStyle={{
                padding: 10,
                width: isMobile ? 100 : "25%",
              }}
              bodyCellStyle={{
                padding: isMobile ? 5 : 10,
                width: isMobile ? 100 : "25%",
              }}
            />
          </View>
        </View>
      </Container>
    );
  }
}

const ConnectedUsersPage = useStore(UsersPage);
export default ConnectedUsersPage;
