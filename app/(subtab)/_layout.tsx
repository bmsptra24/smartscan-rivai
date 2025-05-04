import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { IsMobileScreen } from "@/constants/Styles";
import ProviderWrapper from "@/contexts/ProviderWrapper";
import Sidebar from "@/components/base/Sidebar";
export default function RootLayout() {
  return (
    <ProviderWrapper>
      <View
        style={{ flex: 1, flexDirection: IsMobileScreen ? "column" : "row" }}
      >
        {!IsMobileScreen && <Sidebar />}

        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="detail" options={{ headerShown: false }} />
          <Stack.Screen name="edit" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ProviderWrapper>
  );
}
