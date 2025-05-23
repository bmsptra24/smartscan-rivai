import ButtonBase from "@/components/base/Button";
import Container from "@/components/base/Container";
import InputBase from "@/components/base/Input";
import Navbar from "@/components/base/Navbar";
import PickerActionSheet from "@/components/base/PickerActionSheet";
import TextBase from "@/components/base/Text";
import { ROLE } from "@/constants/Config";
import { userService } from "@/services";
import { CreateUserProfileData, UserProfile } from "@/services/User";
import { StoreProps, useStore } from "@/stores";
import { showAlert } from "@/utils/alert";
import { createHashSHA1 } from "@/utils/generator";
import { router } from "expo-router";
import React, { Component } from "react";
import { View } from "react-native";

// Definisikan tipe untuk state form
type FormData = {
  confirmPassword: string;
} & Partial<UserProfile>;

interface EditSettingPageState {
  confirmPassword: string;
}

class EditSettingPage extends Component<StoreProps, EditSettingPageState> {
  state = {
    confirmPassword: "",
  };

  // Fungsi untuk menangani perubahan input
  handleInputChange = (key: keyof FormData, value: string) => {
    this.props.userStore.setSelectedUser({
      ...this.props.userStore.selectedUser,
      id: this.props.userStore.selectedUser?.id || "",
      [key]: value,
    });
  };

  // Fungsi untuk menangani pemilihan role
  handleRoleSelect = (selectedIndex: number) => {
    if (selectedIndex !== 3) {
      this.handleInputChange("role", ROLE[selectedIndex]);
    }
  };

  // Fungsi untuk menyimpan data
  handleSave = async () => {
    const formData = this.props.userStore.selectedUser;
    if (!formData) return showAlert("Gagal", "Data harus terisi semua.");
    // Validasi input
    if (
      !formData.displayName ||
      !formData.username ||
      !formData.role ||
      !formData.password ||
      !this.state.confirmPassword
    ) {
      showAlert("Error", "Semua field harus diisi!");
      return;
    }

    if (formData.password !== this.state.confirmPassword) {
      showAlert("Error", "Password dan konfirmasi password tidak cocok!");
      return;
    }

    // Logika penyimpanan data
    const securedPassword = {
      ...formData,
      password: createHashSHA1(formData.password),
    };
    const userData = await userService.upsertUserProfile(
      formData.id || undefined,
      securedPassword as CreateUserProfileData
    );
    this.props.userStore.upsertUser(userData);

    console.log("Data yang disimpan:", userData);
    showAlert("Sukses", "Data pengguna berhasil disimpan!");

    // Reset form setelah simpan
    this.setState({
      confirmPassword: "",
    });
    this.props.userStore.clearSelectedUserState();

    router.replace("/setting");
  };

  render() {
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
          </View>
          <View style={{ paddingHorizontal: 25, gap: 20 }}>
            <InputBase
              placeholder="Nama"
              onChangeText={(text: string) =>
                this.handleInputChange("displayName", text)
              }
              value={this.props.userStore.selectedUser?.displayName}
            />
            <InputBase
              placeholder="Username"
              onChangeText={(text: string) =>
                this.handleInputChange("username", text)
              }
              value={this.props.userStore.selectedUser?.username}
            />
            <PickerActionSheet
              title={this.props.userStore.selectedUser?.role || "Role"}
              options={[...ROLE, "Cancel"]}
              onOptionSelected={this.handleRoleSelect}
            />
            <InputBase
              placeholder="Password"
              onChangeText={(text: string) =>
                this.handleInputChange("password", text)
              }
              // value={this.props.userStore.selectedUser?.password}
              secureTextEntry
            />
            <InputBase
              placeholder="Ulangi password"
              onChangeText={(text: string) =>
                this.setState({ confirmPassword: text })
              }
              value={this.state.confirmPassword}
              secureTextEntry
            />
            <ButtonBase title="Simpan" onPress={this.handleSave} />
          </View>
        </View>
      </Container>
    );
  }
}

export default useStore(EditSettingPage);
