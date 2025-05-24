import { Tabs } from "expo-router";
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Color } from "@/constants/Styles"; // Remove IsMobileScreen if using Platform
import { StoreProps, useStore } from "@/stores";
import { documentService, userService } from "@/services";
import ProviderWrapper from "@/contexts/ProviderWrapper";
import Sidebar from "@/components/base/Sidebar";

class TabLayout extends Component<StoreProps> {
  async componentDidMount() {
    const user = userService.getCurrentUser();
    if (!user) return console.error("User not found");
    this.props.userStore.setCurrentUser(user);
  }

  render() {
    const user = userService.getCurrentUser();
    const isNotAdmin = user?.role === "user";

    return (
      <ProviderWrapper>
        <View style={{ flex: 1, flexDirection: isNotAdmin ? "column" : "row" }}>
          {/* Sidebar only on web */}
          {!isNotAdmin && <Sidebar />}

          {/* Main content */}
          <View style={{ flex: 1 }}>
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarStyle: { display: isNotAdmin ? "flex" : "none" },
                tabBarActiveTintColor: Color.black,
                tabBarInactiveTintColor: Color.grey,
                tabBarShowLabel: isNotAdmin,
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
          </View>

          {/* Scan button only on mobile */}
          {isNotAdmin && (
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => {
                  this.props.groupStore.clearSelectedGroup();
                  this.props.documentStore.clearDocuments();
                  documentService.handleScanDocument();
                }}
              >
                <Ionicons name="scan" size={22} color={Color.black} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ProviderWrapper>
    );
  }
}

const styles = StyleSheet.create({
  cameraButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -30,
    zIndex: 1,
  },
  scanButton: {
    backgroundColor: Color.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default useStore(TabLayout);
