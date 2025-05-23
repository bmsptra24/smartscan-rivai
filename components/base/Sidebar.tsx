import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BorderRadius, Color } from "@/constants/Styles";
import { Image } from "expo-image";
import { Images } from "@/constants/Images";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

interface NavItem {
  path: "/dashboard" | "/home" | "/setting" | "/profile";
  icon: React.ReactNode;
  label: string;
}

const Sidebar = () => {
  const pathname = usePathname();
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
    <View style={styles.webTabBar}>
      <TouchableOpacity
        style={[styles.webTabItem, { justifyContent: "flex-start", gap: 15 }]}
        onPress={() => router.push("/dashboard")}
      >
        <Image
          source={Images.logo.src}
          style={{ width: 40, height: 40, borderRadius: 5 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", color: Color.black }}>
          SmartScan Rivai
        </Text>
      </TouchableOpacity>

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
          onPress={() => pathname !== item.path && router.push(item.path)}
        >
          {item.icon}
          <Text>{item.label}</Text>
        </Pressable>
      ))}
    </View>
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
  },
  webTabItem: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: BorderRadius.full,
    gap: 10,
  },
});
