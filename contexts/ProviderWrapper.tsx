import React from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
// import Toastable from "react-native-toastable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertProvider } from "@/utils/alert";

const ProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <>
      {/* <Toastable duration={3000} offset={top} /> */}
      <AlertProvider>
        <ActionSheetProvider>{children}</ActionSheetProvider>
      </AlertProvider>
    </>
  );
};

export default ProviderWrapper;
