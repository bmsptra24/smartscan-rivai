import { router } from "expo-router";
import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Color } from "@/constants/Styles";
import { Image } from "expo-image";
import { Images } from "@/constants/Images";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export class Sidebar extends Component {
  render() {
    return (
      <View style={styles.webTabBar}>
        <TouchableOpacity
          style={[styles.webTabItem, { justifyContent: "flex-start", gap: 15 }]}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Image
            source={Images.logo.src}
            style={{ width: 40, height: 40, borderRadius: 5 }}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: Color.black,
            }}
          >
            SmartScan Rivai
          </Text>
        </TouchableOpacity>

        <Pressable
          style={({ hovered }) => [
            styles.webTabItem,
            hovered && { backgroundColor: Color.greyLight },
          ]}
          onPress={() => router.push("/home")}
        >
          <Entypo size={24} name="home" color={Color.black} />
          <Text>Beranda</Text>
        </Pressable>

        <Pressable
          style={({ hovered }) => [
            styles.webTabItem,
            hovered && { backgroundColor: Color.greyLight },
          ]}
          onPress={() => router.push("/users")}
        >
          <FontAwesome5 size={20} name="users-cog" color={Color.black} />
          <Text>Pengguna</Text>
        </Pressable>

        <Pressable
          style={({ hovered }) => [
            styles.webTabItem,
            hovered && { backgroundColor: Color.greyLight },
          ]}
          onPress={() => router.push("/profile")}
        >
          <AntDesign size={24} name="user" color={Color.black} />
          <Text>Profil</Text>
        </Pressable>
      </View>
    );
  }
}

export default Sidebar;

const styles = StyleSheet.create({
  webTabBar: {
    width: 225,
    backgroundColor: Color.white,
    borderRightWidth: 1,
    borderRightColor: Color.grey,
  },
  webTabItem: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});
