import { Tabs } from "expo-router";
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Color } from "@/constants/Styles";
import { StoreProps, useStore } from "@/stores";
import { documentService } from "@/services";

class TabLayout extends Component<StoreProps> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { position: "relative" },
            tabBarActiveTintColor: Color.black,
            tabBarInactiveTintColor: Color.grey,
            tabBarShowLabel: false,
            tabBarLabelPosition: "beside-icon",
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Entypo size={size - 6} name="home" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profil",
              tabBarIcon: ({ color, size }) => (
                <AntDesign size={size - 6} name="user" color={color} />
              ),
            }}
          />
        </Tabs>
        <View style={styles.cameraButtonContainer}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={documentService.handleScanDocument}
          >
            <Ionicons name="scan" size={22} color={Color.black} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cameraButtonContainer: {
    position: "absolute",
    bottom: 20, // Sesuaikan dengan tinggi tabbar
    left: "50%",
    marginLeft: -30, // Sesuaikan dengan ukuran ikon
    zIndex: 1,
  },
  scanButton: {
    backgroundColor: Color.primary, // Sesuaikan dengan warna yang diinginkan
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Untuk efek bayangan di Android
    shadowColor: "#000", // Untuk efek bayangan di iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default useStore(TabLayout);
