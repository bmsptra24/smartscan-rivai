import ButtonBase from "@/components/base/Button";
import Container from "@/components/base/Container";
import IconButton from "@/components/base/IconButton";
import InputBase from "@/components/base/Input";
import Navbar from "@/components/base/Navbar";
import Table from "@/components/base/Table";
import TextBase from "@/components/base/Text";
import { Color, IsMobileScreen } from "@/constants/Styles";
import {
  documentService,
  groupService,
  systemService,
  userService,
} from "@/services";
import { UserProfile } from "@/services/User";
import { StoreProps, useStore } from "@/stores";
import { showAlert, showConfirm } from "@/utils/alert";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

import React, { Component } from "react";
import { View, Dimensions, Platform } from "react-native";

interface SettingPageState {
  screenWidth: number;
  path: string | undefined;
}

export class SettingPage extends Component<StoreProps, SettingPageState> {
  tableHead: string[] = ["Nama", "Username", "Role", "Aksi"];

  // We'll calculate widths dynamically based on screen size
  constructor(props: StoreProps) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      path: systemService.getPath(),
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
    this.setState({ path: systemService.getPath() });
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

  handleOpenFileExplorer = async () => {
    try {
      if (!window.electronAPI) return console.error("Electron API is null.");
      const success = await window.electronAPI.openFileExplorer();
      if (!success)
        return showAlert(
          "Gagal membuka file explorer",
          "Path folder tidak ditemukan"
        );
    } catch (error) {
      console.error(error);
    }
  };

  handleChooseStorageLocation = async () => {
    try {
      if (!window.electronAPI) return console.error("Electron API is null.");
      const path = await window.electronAPI.selectFolder();
      if (!path) return;
      systemService.setPath(path);
      this.setState({ path });
    } catch (error) {
      console.error(error);
    }
  };

  handleResetSystem = async () => {
    try {
      const confirmation = await showConfirm(
        "Peringatan!",
        "Yakin ingin mereset? Data akan hilang permanen."
      );
      if (!confirmation) return;

      // delete all images
      const docs = await documentService.getAllDocuments();
      await Promise.all(
        docs.map((doc) => {
          if (doc.image_public_id) {
            // delete using server
            fetch(
              `/cloudinary?public_id=${encodeURIComponent(
                doc.image_public_id
              )}`,
              {
                method: "DELETE",
              }
            );
            return;
          }
          return Promise.resolve();
        })
      );

      // delete all docs
      await documentService.deleteAllDocuments();
      this.props.documentStore.clearDocuments();

      // delete all groups
      await groupService.deleteAllGroups();
      this.props.groupStore.setGroups([]);
      this.props.groupStore.clearSelectedGroup();

      showAlert("Berhasil", `Penyimpanan berhasil dikosongkan.`);
    } catch (error) {
      showAlert("Gagal mengosongkan penyimpanan.", `${error}`);
    }
  };

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
      router.push(`/(subtab)/edit-setting`);
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

    const userRole = this.props.userStore.currentUser?.role;

    return (
      <Container>
        <View style={{ gap: isMobile ? 20 : 40 }}>
          <Navbar title="Pengaturan" />
          {Platform.OS === "web" && (
            <View
              style={{
                gap: isMobile ? 10 : 20,
                paddingHorizontal: isMobile ? 15 : 25,
              }}
            >
              <TextBase variant={IsMobileScreen ? "header" : "title"}>
                Lokasi Penyimpanan
              </TextBase>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <InputBase
                  style={{ width: "100%" }}
                  value={systemService.getPath()}
                  placeholder="Pilih lokasi..."
                />
                <IconButton
                  onPress={this.handleChooseStorageLocation}
                  icon={
                    <MaterialCommunityIcons
                      name="pencil"
                      size={isMobile ? 18 : 24}
                      color="black"
                    />
                  }
                />
                <IconButton
                  onPress={this.handleOpenFileExplorer}
                  icon={
                    <Ionicons
                      name="open-outline"
                      size={isMobile ? 18 : 24}
                      color="black"
                    />
                  }
                />
              </View>
            </View>
          )}

          <View
            style={{
              gap: isMobile ? 10 : 20,
              paddingHorizontal: isMobile ? 15 : 25,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextBase variant={IsMobileScreen ? "header" : "title"}>
                Akun Pengguna
              </TextBase>
              <IconButton
                onPress={() => {
                  this.props.userStore.clearSelectedUserState();
                  router.push("/(subtab)/edit-setting");
                }}
                size={IsMobileScreen ? "small" : "medium"}
                icon={
                  <FontAwesome6
                    name="add"
                    size={isMobile ? 18 : 24}
                    color="black"
                  />
                }
              />
            </View>
            <View
              style={{
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

          {userRole === "admin" && (
            <View
              style={{
                gap: isMobile ? 10 : 20,
                paddingHorizontal: isMobile ? 15 : 25,
              }}
            >
              <TextBase variant={IsMobileScreen ? "header" : "title"}>
                Reset
              </TextBase>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <ButtonBase
                  onPress={this.handleResetSystem}
                  textStyle={{ color: Color.white }}
                  style={{ backgroundColor: Color.danger }}
                  title="Kosongkan Penyimpanan"
                />
              </View>
            </View>
          )}
        </View>
      </Container>
    );
  }
}

const ConnectedSettingPage = useStore(SettingPage);
export default ConnectedSettingPage;
