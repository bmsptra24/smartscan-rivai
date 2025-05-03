import React from "react";
import { DocumentProvider } from "./DocumentContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Toastable from "react-native-toastable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Color } from "@/constants/Styles";
import { AlertProvider } from "@/utils/alert";

const ProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <>
      <Toastable
        // statusMap={{
        //   success: Color.primary,
        //   danger: Color.danger,
        //   warning: "green",
        //   info: "blue",
        // }}
        duration={3000}
        offset={top}
      />
      <AlertProvider>
        <ActionSheetProvider>{children}</ActionSheetProvider>
      </AlertProvider>
    </>
  );
};

export default ProviderWrapper;
