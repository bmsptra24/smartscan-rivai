import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  BorderRadius,
  Color,
  Distance,
  IsMobileScreen,
  Size,
} from "@/constants/Styles";
import TextBase from "@/components/base/Text";
import InputBase from "@/components/base/Input";
import { Image } from "expo-image";
import { Images } from "@/constants/Images";
import ButtonBase from "@/components/base/Button";
import { authService } from "@/services/Auth";
import { router } from "expo-router";

class LoginScreen extends Component {
  state = {
    username: "",
    password: "",
    isLoading: false,
    isLoggedIn: false,
  };

  componentDidMount(): void {
    // Replace this with actual auth check
    if (true) {
      // Temporary false for demonstration
      this.setState({ isLoggedIn: true });
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // Handle navigation after state update
    if (this.state.isLoggedIn && !prevState.isLoggedIn) {
      router.replace("/(tabs)");
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

      const { username, password } = this.state;
      await authService.login({ username, password });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { username, password } = this.state;

    return (
      <ScrollView style={{ backgroundColor: Color.background }}>
        <LinearGradient
          style={{
            height: Size.screen.height,
            justifyContent: "center",
            alignItems: "center",
          }}
          colors={[
            Color.primaryBackdropGradient[0],
            Color.primaryBackdropGradient[1],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={{
              flexDirection: IsMobileScreen ? "column" : "row",
              shadowColor: Color.black,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 60,
              borderRadius: BorderRadius.large,
              height: IsMobileScreen ? "100%" : "auto",
            }}
          >
            {/* HERO */}
            <LinearGradient
              style={{
                height: IsMobileScreen ? "auto" : 543,
                width: IsMobileScreen ? Size.screen.width : 488,
                borderTopLeftRadius: IsMobileScreen ? 0 : BorderRadius.large,
                borderBottomLeftRadius: IsMobileScreen ? 0 : BorderRadius.large,
              }}
              colors={[Color.primaryGradient[0], Color.primaryGradient[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TextBase
                style={{
                  marginLeft: 45,
                  marginTop: 45,
                  color: Color.background,
                }}
                variant={IsMobileScreen ? "header" : "title"}
              >
                {"Selamat\nDatang!"}
              </TextBase>
              <Image
                source={Images.hero_login.src}
                style={{
                  height: IsMobileScreen ? 200 : 410,
                  width: IsMobileScreen ? "auto" : 575,
                }}
                contentFit="contain"
                placeholder={{ blurhash: Images.hero_login.placeholder }}
              />
            </LinearGradient>

            {/* Form Input */}
            <View style={{ position: "relative", flex: 1 }}>
              {/* This gradient for hide the backgound corner*/}
              <LinearGradient
                style={{
                  opacity: IsMobileScreen ? 1 : 0,
                  position: "absolute",
                  height: 100,
                  top: -1,
                  left: 0,
                  right: 0,
                }}
                colors={["#37CDD6", "#20B8EB"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              />

              {/* Content */}
              <View
                style={{
                  flex: 1,
                  height: IsMobileScreen ? "auto" : 543,
                  width: IsMobileScreen ? Size.screen.width : 378,
                  borderTopRightRadius: BorderRadius.large,
                  borderTopLeftRadius: IsMobileScreen ? BorderRadius.large : 0,
                  borderBottomRightRadius: IsMobileScreen
                    ? 0
                    : BorderRadius.large,
                  backgroundColor: Color.background,
                  justifyContent: IsMobileScreen ? "flex-start" : "center",
                  paddingHorizontal: Distance.default,
                  paddingVertical: Distance.default,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <TextBase variant={IsMobileScreen ? "header" : "title"}>
                    Masuk
                  </TextBase>
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
          </View>
        </LinearGradient>
      </ScrollView>
    );
  }
}

export default LoginScreen;
