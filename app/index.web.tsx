import ButtonBase from "@/components/base/Button";
import InputBase from "@/components/base/Input";
import { Images } from "@/constants/Images";
import { Color } from "@/constants/Styles";
import { authService, userService } from "@/services";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

class LoginScreen extends Component {
  state = {
    username: "bima",
    password: "123",
    isLoading: false,
  };

  componentDidMount(): void {
    const user = userService.getCurrentUser();
    if (user) {
      setTimeout(() => {
        router.push("/(tabs)/home");
      }, 0);
    }
  }

  handleUsernameChange = (username: string) => {
    this.setState({ username });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  handleLogin = async () => {
    try {
      this.setState({ isLoading: true });

      const username = this.state.username;
      const password = this.state.password;

      await authService.login({ username, password });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { username, password } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.loginSection}>
            <View style={styles.logoContainer}>
              <ImageBackground
                source={Images.logo.src}
                style={{ width: 50, height: 50, borderRadius: 5 }}
              />
              <Text style={styles.logoText}>SmartScan Rivai</Text>
            </View>
            <Text style={styles.loginHeader}>Masuk ke akun mu</Text>
            <View style={styles.signUpContainer}>
              <Text style={styles.noAccountText}>
                Hanya admin yang dapat masuk.
              </Text>
            </View>
            <InputBase
              style={styles.input}
              value={username}
              onChangeText={this.handleUsernameChange}
              placeholder="Masukan username"
              placeholderTextColor="#999"
            />
            <InputBase
              style={styles.input}
              value={password}
              onChangeText={this.handlePasswordChange}
              placeholder="Masukan kata sandi"
              placeholderTextColor="#999"
            />
            <ButtonBase
              title="Lanjutkan"
              onPress={this.handleLogin}
              style={{
                width: 200,
                backgroundColor: "#F2F2F2",
                borderWidth: 1,
                borderColor: "#DDD",
              }}
              isLoading={this.state.isLoading}
              textStyle={{ fontSize: Math.max(14, width * 0.01) }}
            />
          </View>
          <View style={styles.promoSection}>
            <View style={styles.promoContent}>
              <Text style={styles.promoHeader}>SmartScan Rivai</Text>
              <Text style={styles.promoText}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
                Expedita facilis odit voluptas ut tempora
                <br />a dicta doloribus quos?
              </Text>
            </View>
            <View style={styles.illustrationsContainer}></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexDirection: "row", minHeight: height },
  loginSection: {
    width: "40%",
    padding: "3%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  promoSection: {
    width: "60%",
    backgroundColor: Color.primary,
    padding: "3%",
    justifyContent: "space-between",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "5%",
    gap: 10,
  },
  logoText: {
    fontSize: Math.max(16, width * 0.015),
    fontWeight: "bold",
    color: Color.text,
  },
  loginHeader: {
    fontSize: Math.max(20, width * 0.02),
    fontWeight: "bold",
    color: Color.text,
    marginBottom: "2%",
  },
  signUpContainer: { flexDirection: "row", marginBottom: "5%" },
  noAccountText: { color: "#555", fontSize: Math.max(14, width * 0.01) },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: "4%",
    fontSize: Math.max(14, width * 0.01),
  },
  promoContent: { flex: 0.4 },
  promoHeader: {
    fontSize: Math.max(24, width * 0.025),
    fontWeight: "bold",
    color: Color.text,
    marginBottom: "4%",
  },
  promoText: {
    fontSize: Math.max(14, width * 0.012),
    color: Color.text,
    lineHeight: Math.max(20, width * 0.018),
    marginBottom: "4%",
  },
  illustrationsContainer: { flex: 0.6, justifyContent: "space-between" },
});

export default LoginScreen;
