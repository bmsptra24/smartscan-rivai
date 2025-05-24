"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BorderRadius, Color, IsMobileScreen } from "@/constants/Styles";
import { Image } from "expo-image";
import { Images } from "@/constants/Images";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface NavItem {
  path: "/dashboard" | "/home" | "/setting" | "/profile";
  icon: React.ReactNode;
  label: string;
}

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(!IsMobileScreen);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const slideAnim = useState(new Animated.Value(IsMobileScreen ? -250 : 0))[0];
  const { top } = useSafeAreaInsets();

  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
    Animated.timing(slideAnim, {
      toValue: open ? 0 : -250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const handleResize = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
      const isMobile = width <= 768;

      if (!isMobile && !isOpen) {
        toggleDrawer(true);
      } else if (isMobile && isOpen) {
        toggleDrawer(false);
      }
    };

    let subscription: any = null;

    // Set up event listener for window resize (web only)
    if (Platform.OS === "web") {
      subscription = Dimensions.addEventListener("change", handleResize);
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isOpen]);

  const navItems: NavItem[] = [
    {
      path: "/dashboard",
      icon: <Ionicons size={24} name="home-outline" color={Color.black} />,
      label: "Beranda",
    },
    {
      path: "/home",
      icon: <Ionicons size={24} name="document-outline" color={Color.black} />,
      label: "Dokumen",
    },
    {
      path: "/setting",
      icon: <AntDesign size={24} name="setting" color={Color.black} />,
      label: "Pengaturan",
    },
    {
      path: "/profile",
      icon: <AntDesign size={24} name="user" color={Color.black} />,
      label: "Profil",
    },
  ];

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {IsMobileScreen && isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => toggleDrawer(false)}
          activeOpacity={0.5}
        />
      )}

      <Animated.View
        style={[
          styles.webTabBar,
          IsMobileScreen && styles.mobileWebTabBar,
          { transform: [{ translateX: slideAnim }] },
          { marginTop: top },
        ]}
      >
        <View style={styles.sidebarHeader}>
          <TouchableOpacity
            style={[
              styles.webTabItem,
              { justifyContent: "flex-start", gap: 15 },
            ]}
            onPress={() => router.push("/dashboard")}
          >
            <Image
              source={Images.logo.src}
              style={{ width: 40, height: 40, borderRadius: 5 }}
            />
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: Color.black }}
            >
              SmartScan Rivai
            </Text>
          </TouchableOpacity>

          {IsMobileScreen && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleDrawer(false)}
            >
              <AntDesign name="closecircleo" size={24} color={Color.black} />
            </TouchableOpacity>
          )}
        </View>

        {navItems.map((item) => (
          <Pressable
            key={item.path}
            style={({ hovered }) => [
              styles.webTabItem,
              {
                backgroundColor:
                  pathname === item.path ? Color.primary : Color.white,
              },
              hovered &&
                pathname !== item.path && { backgroundColor: Color.greyLight },
            ]}
            onPress={() => {
              if (pathname !== item.path) {
                router.push(item.path);
                if (IsMobileScreen) toggleDrawer(false);
              }
            }}
          >
            {item.icon}
            <Text>{item.label}</Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* Mobile toggle button */}
      {IsMobileScreen && !isOpen && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleDrawer(true)}
        >
          <AntDesign name="menuunfold" size={24} color={Color.black} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  webTabBar: {
    width: 225,
    backgroundColor: Color.white,
    borderRightWidth: 1,
    borderRightColor: Color.grey,
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: "100%",
    zIndex: 10,
  },
  mobileWebTabBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webTabItem: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: BorderRadius.full,
    gap: 10,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  toggleButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
    zIndex: 5,
    backgroundColor: Color.white,
    padding: 10,
    borderRadius: BorderRadius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
});
