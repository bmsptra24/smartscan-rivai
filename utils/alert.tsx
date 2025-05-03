import { create } from "zustand";
import {
  Modal,
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React from "react";
import ButtonBase from "@/components/base/Button";

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
  }>;
  onDismiss?: () => void;
}

interface AlertState {
  alertConfig: AlertConfig | null;
  setAlertConfig: (config: AlertConfig | null) => void;
}

const useAlertStore = create<AlertState>((set) => ({
  alertConfig: null,
  setAlertConfig: (config) => set({ alertConfig: config }),
}));

export const showAlert = (title: string, message?: string) => {
  useAlertStore.getState().setAlertConfig({
    title,
    message,
    buttons: [
      {
        text: "OK",
        onPress: () => useAlertStore.getState().setAlertConfig(null),
      },
    ],
    onDismiss: () => useAlertStore.getState().setAlertConfig(null),
  });
};

export const showConfirm = (title: string, message?: string) => {
  return new Promise<boolean>((resolve) => {
    useAlertStore.getState().setAlertConfig({
      title,
      message,
      buttons: [
        {
          text: "Cancel",
          onPress: () => {
            resolve(false);
            useAlertStore.getState().setAlertConfig(null);
          },
        },
        {
          text: "OK",
          onPress: () => {
            resolve(true);
            useAlertStore.getState().setAlertConfig(null);
          },
        },
      ],
      onDismiss: () => {
        resolve(false);
        useAlertStore.getState().setAlertConfig(null);
      },
    });
  });
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const alertConfig = useAlertStore((state) => state.alertConfig);
  const hideAlert = () => useAlertStore.getState().setAlertConfig(null);

  return (
    <>
      {children}
      {alertConfig && (
        <Modal visible={true} transparent={true} animationType="fade">
          <TouchableWithoutFeedback
            onPress={() => {
              if (alertConfig.onDismiss) alertConfig.onDismiss();
              hideAlert();
            }}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.title}>{alertConfig.title}</Text>
                  {alertConfig.message && (
                    <Text style={styles.message}>{alertConfig.message}</Text>
                  )}
                  <View style={styles.buttonContainer}>
                    {alertConfig.buttons && alertConfig.buttons.length > 0 ? (
                      alertConfig.buttons.map((button, index) => (
                        <ButtonBase
                          style={{ width: "auto" }}
                          key={index}
                          title={button.text}
                          onPress={() => {
                            if (button.onPress) button.onPress();
                            hideAlert();
                          }}
                        />
                      ))
                    ) : (
                      <ButtonBase
                        style={{ width: "auto" }}
                        title="OK"
                        onPress={hideAlert}
                      />
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
});
