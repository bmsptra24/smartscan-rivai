import ButtonBase from "@/components/base/Button";
import InputBase from "@/components/base/Input";
import TextBase from "@/components/base/Text";
import { Images } from "@/constants/Images";
import { Color, IsMobileScreen, Size } from "@/constants/Styles";
import { authService, userService } from "@/services";
import { Image, ImageBackground } from "expo-image";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
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
    username: "",
    password: "",
    isLoading: false,
  };
  animation = React.createRef<LottieView>();

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
              <TextBase style={styles.logoText}>SmartScan Rivai</TextBase>
            </View>
            {/* <Text style={styles.loginHeader}>Masuk ke akun mu</Text> */}
            <View style={styles.signUpContainer}>
              <TextBase style={styles.noAccountText}>Masuk ke akun mu</TextBase>
            </View>
            <InputBase
              style={styles.input}
              value={username}
              onChangeText={this.handleUsernameChange}
              placeholder="Masukan username"
              placeholderTextColor="#999"
            />
            <InputBase
              type="password"
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
                // width: 200,
                backgroundColor: "#F2F2F2",
                borderWidth: 1,
                borderColor: "#DDD",
              }}
              isLoading={this.state.isLoading}
              textStyle={{ fontSize: Math.max(14, width * 0.01) }}
            />
          </View>
          <View style={styles.promoSection}>
            <View
              style={{
                position: "absolute",
                inset: 0,
              }}
            >
              <Image
                source={require("@/assets/images/grainy-1.jpeg")}
                style={{ width: "auto", height: Size.screen.height, inset: 0 }}
              />
            </View>
            <View style={styles.promoContent}>
              <TextBase style={styles.promoHeader}>SmartScan Rivai</TextBase>
              <TextBase style={styles.promoText}>
                Aplikasi ini memungkinkan pemindaian,
                <br />
                pengenalan teks otomatis, dan
                <br />
                pengelolaan dokumen secara
                <br />
                efisien melalui lintas-platform.
              </TextBase>
              <Image
                source={Images.qrcode.src}
                style={{ width: 150, height: 150, borderRadius: 5 }}
              />
            </View>
            <View style={styles.illustrationsContainer}></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: IsMobileScreen ? "center" : "flex-start",
    backgroundColor: Color.white,
  },
  scrollContainer: { flexDirection: "row", minHeight: height },
  loginSection: {
    width: Size.screen.width < 1550 ? (IsMobileScreen ? "100%" : "50%") : "25%",
    padding: IsMobileScreen ? "auto" : "3%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  promoSection: {
    display: IsMobileScreen ? "none" : "flex",
    position: "relative",
    width: Size.screen.width,
    backgroundColor: Color.primary,
    // padding: "3%",
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
  promoContent: { flex: 0.4, padding: 80 },
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
