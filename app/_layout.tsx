import ProviderWrapper from "@/contexts/ProviderWrapper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Extend the Window interface to include electronAPI
interface ElectronAPI {
  selectFolder: () => Promise<string | null>;
  saveFile: (
    folder: string,
    fileName: string,
    content: ArrayBuffer
  ) => Promise<boolean>;
  openFileExplorer: () => Promise<boolean>;
  getFolders: () => Promise<string[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export default function RootLayout() {
  const [loaded] = useFonts({
    OpenSansMedium: require("../assets/fonts/OpenSans-Medium.ttf"),
    OpenSansSemiBold: require("../assets/fonts/OpenSans-SemiBold.ttf"),
    OpenSansBold: require("../assets/fonts/OpenSans-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ProviderWrapper>
      <>
        <Stack
          initialRouteName="index"
          screenOptions={{ headerShown: false, animation: "none" }}
        >
          {/* <Stack initialRouteName="(tabs)"> */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen name="(subtab)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </ProviderWrapper>
  );
}
