import ProviderWrapper from "@/contexts/ProviderWrapper";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <ProviderWrapper>
      <>
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="detail" options={{ headerShown: false }} />
          <Stack.Screen name="edit" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </>
    </ProviderWrapper>
  );
}
