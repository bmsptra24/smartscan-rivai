import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import { Color, Distance, IsMobileScreen, Size } from "@/constants/Styles";
import TextBase from "@/components/base/Text";
import InputBase from "@/components/base/Input";
import ButtonBase from "@/components/base/Button";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";
import { authService, userService } from "@/services";
import { router } from "expo-router";

class LoginScreen extends Component {
  animation = React.createRef<LottieView>();

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
    console.log({ IsMobileScreen });

    return (
      <ScrollView style={{ backgroundColor: Color.background }}>
        {/* HERO */}
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={80}
          style={{
            position: "absolute",
            width: Size.screen.width,
            height: IsMobileScreen ? 430 : Size.screen.height,
            zIndex: 2,
          }}
        ></BlurView>
        <LottieView
          autoPlay
          ref={this.animation}
          style={{
            // width: Size.screen.width,
            height: IsMobileScreen ? 395 : Size.screen.height * 2,
          }}
          source={{
            uri: IsMobileScreen
              ? "https://lottie.host/85cf047f-e2c1-43ae-b7ef-b546903ce7df/yvShlRd481.lottie"
              : "https://lottie.host/0c707f6f-ef76-4524-ab6c-e2d03c501ca7/MWmdlV7ori.lottie",
          }}
          loop={true}
        />

        {/* Form Input */}
        <View
          style={{
            marginTop: IsMobileScreen ? 30 : "auto",
            position: IsMobileScreen ? "static" : "absolute",
            zIndex: 2,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            width: IsMobileScreen ? "auto" : Size.screen.width,
            height: IsMobileScreen ? "auto" : Size.screen.height,
          }}
        >
          <View
            style={{
              width: IsMobileScreen ? Size.screen.width : 378,
              paddingHorizontal: Distance.default,
              paddingVertical: Distance.default,
              alignItems: "center",
            }}
          >
            <View
              style={{
                gap: 20,
              }}
            >
              <View>
                <TextBase variant="title">Masuk</TextBase>
                <TextBase variant="content">Selamat datang kembali!</TextBase>
              </View>
              <InputBase
                value={username}
                onChangeText={this.handleUsernameChange}
                placeholder="Masukan username anda"
              />
              <InputBase
                value={password}
                onChangeText={this.handlePasswordChange}
                placeholder="Masukan kata sandi anda"
                secureTextEntry
              />
              <ButtonBase
                onPress={this.handleLogin}
                title="Lanjut"
                isLoading={this.state.isLoading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default LoginScreen;
