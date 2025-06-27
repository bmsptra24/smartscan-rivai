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
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

// Data untuk carousel dengan tambahan background
const carouselData = [
  {
    image: Images.qrcode.src,
    header: "SmartScan Rivai",
    text: "Aplikasi pemindaian dengan pengenalan dokumen otomatis dan data terintegrasi dengan komputer pengelola.",
    background: require("@/assets/images/carousel-1.png"),
  },
  {
    image: Images.qrcode.src,
    header: "SmartScan Rivai",
    text: "Download aplikasinya sekarang!",
    background: require("@/assets/images/carousel-2.png"),
  },
];

class LoginScreen extends Component {
  state = {
    username: "",
    password: "",
    isLoading: false,
    hoveredCarouselIndex: -1, // State baru untuk melacak item carousel yang di-hover
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
    const { username, password, hoveredCarouselIndex } = this.state; // Ambil hoveredCarouselIndex dari state

    // Hitung lebar promoSection secara dinamis
    const loginSectionWidth =
      Size.screen.width < 1550
        ? IsMobileScreen
          ? width
          : width * 0.5
        : width * 0.25;
    const promoSectionWidth = IsMobileScreen ? 0 : width - loginSectionWidth; // 0 untuk mobile karena display: 'none'

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.loginSection, { width: loginSectionWidth }]}>
            <View style={styles.logoContainer}>
              <ImageBackground
                source={Images.logo.src}
                style={{ width: 50, height: 50, borderRadius: 5 }}
              />
              <TextBase style={styles.logoText}>SmartScan Rivai</TextBase>
            </View>
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
                backgroundColor: "#F2F2F2",
                borderWidth: 1,
                borderColor: "#DDD",
              }}
              isLoading={this.state.isLoading}
              textStyle={{ fontSize: Math.max(14, width * 0.01) }}
            />
          </View>
          {/* Promo Section */}
          {!IsMobileScreen && ( // Hanya tampilkan di non-mobile (desktop)
            <View style={[styles.promoSection, { width: promoSectionWidth }]}>
              {/* Carousel Section */}
              <Carousel
                loop
                width={promoSectionWidth} // Lebar carousel sama dengan promoSection
                height={height} // Tinggi carousel mengisi seluruh tinggi layar
                autoPlay={true}
                data={carouselData}
                scrollAnimationDuration={4000}
                renderItem={({ item, index }) => (
                  <ImageBackground
                    source={item.background} // Gunakan background dari data
                    style={styles.carouselBackground}
                    imageStyle={styles.carouselBackgroundImage}
                  >
                    {/* Overlay untuk efek gelap/terang */}
                    <View
                      style={[
                        styles.darkenOverlay,
                        {
                          // Opacity berubah berdasarkan apakah item ini di-hover
                          backgroundColor: `rgba(0,0,0, ${
                            hoveredCarouselIndex === index ? 0.1 : 0.3
                          })`, // 0.6 default (gelap), 0.2 saat hover (terang)
                        },
                      ]}
                    />
                    {/* Konten carousel */}
                    <View
                      style={styles.carouselContent}
                      // Event hover hanya berfungsi di lingkungan web
                      onPointerEnter={() =>
                        this.setState({ hoveredCarouselIndex: index })
                      }
                      onPointerLeave={() =>
                        this.setState({ hoveredCarouselIndex: -1 })
                      }
                    >
                      <TextBase style={styles.promoHeaderCarousel}>
                        {item.header}
                      </TextBase>
                      <TextBase style={styles.promoTextCarousel}>
                        {item.text}
                      </TextBase>
                      <Image source={item.image} style={styles.carouselImage} />
                    </View>
                  </ImageBackground>
                )}
              />
            </View>
          )}
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
  scrollContainer: {
    flexDirection: "row", // Tetap row untuk desktop, di mobile carousel tidak terlihat
    minHeight: height,
    flexGrow: 1,
  },
  loginSection: {
    padding: IsMobileScreen ? "auto" : "3%",
    alignItems: IsMobileScreen ? "center" : "flex-start",
    backgroundColor: "white",
    justifyContent: "center",
  },
  promoSection: {
    display: "flex",
    position: "relative",
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
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
  // Styles for Carousel
  carouselBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselBackgroundImage: {
    resizeMode: "cover",
  },
  // Overlay untuk membuat gambar gelap/terang
  darkenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // BackgroundColor akan diatur secara inline untuk perubahan opacity
    zIndex: 1, // Pastikan overlay di atas gambar tetapi di bawah konten teks
    // --- Tambahkan properti ini untuk animasi fade ---
    transitionProperty: "background-color",
    transitionDuration: "300ms", // Durasi animasi 300 milidetik
    transitionTimingFunction: "ease-in-out", // Fungsi timing animasi
    // ------------------------------------------------
  },
  carouselContent: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "60%",
    zIndex: 2, // Pastikan konten teks di atas overlay
  },
  promoHeaderCarousel: {
    fontSize: Math.max(24, width * 0.025),
    fontWeight: "bold",
    color: Color.white,
    marginBottom: "4%",
    textAlign: "center",
  },
  promoTextCarousel: {
    fontSize: Math.max(14, width * 0.012),
    color: Color.white,
    lineHeight: Math.max(20, width * 0.018),
    marginBottom: "4%",
    textAlign: "center",
  },
  carouselImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    resizeMode: "contain",
    backgroundColor: Color.white,
  },
});

export default LoginScreen;
