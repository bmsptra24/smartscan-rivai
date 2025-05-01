import React from "react";
import {
  Pressable,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import TextBase from "@/components/base/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AccentColors, BorderRadius } from "@/constants/Styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
      }}
    >
      <Pressable
        android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
        onPress={onPress}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
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
            alignItems: "center",
            justifyContent: "space-between",
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
      <TouchableOpacity>
        <MaterialCommunityIcons name="delete-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default HistoryItem;
