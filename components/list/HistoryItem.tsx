import React from "react";
import { Pressable, View } from "react-native";
import TextBase from "@/components/base/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AccentColors, BorderRadius } from "@/constants/Styles";

interface HistoryItemProps {
  id: string;
  fileCount: number;
  date: string;
  time: string;
  index: number;
  onPress: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  id,
  fileCount,
  date,
  time,
  index,
  onPress,
}) => {
  // Hitung warna berdasarkan indeks item
  const iconColor = AccentColors[index % AccentColors.length];

  return (
    <Pressable
      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
      }}
    >
      <Ionicons
        style={{
          backgroundColor: iconColor,
          padding: 10,
          borderRadius: BorderRadius.full,
        }}
        name="document-outline"
        size={24}
        color="black"
      />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <TextBase>{id}</TextBase>
          <TextBase variant="subcontent">{fileCount} File</TextBase>
        </View>

        <View>
          <TextBase variant="subcontent">{date}</TextBase>
          <TextBase variant="subcontent">{time}</TextBase>
        </View>
      </View>
    </Pressable>
  );
};

export default HistoryItem;
