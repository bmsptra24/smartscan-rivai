import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import TextBase from "@/components/base/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AccentColors, BorderRadius, IsMobileScreen } from "@/constants/Styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface HistoryItemProps {
  id: string;
  costumerId: string;
  fileCount: number;
  date: string;
  time: string;
  index: number;
  onPress: () => void;
  onDelete: (grupId: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  id,
  costumerId,
  fileCount,
  date,
  time,
  index,
  onPress,
  onDelete,
}) => {
  // Hitung warna berdasarkan indeks item
  const iconColor = AccentColors[index % AccentColors.length];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        },
        IsMobileScreen ? {} : { paddingVertical: 10, paddingHorizontal: 20 },
      ]}
    >
      <Pressable
        android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
        onPress={onPress}
        style={[
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          },
          !IsMobileScreen ? {} : { paddingVertical: 10, paddingHorizontal: 20 },
        ]}
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
            <TextBase>{costumerId}</TextBase>
            <TextBase variant="subcontent">{fileCount} File</TextBase>
          </View>

          <View>
            <TextBase variant="subcontent">{date}</TextBase>
            <TextBase variant="subcontent">{time}</TextBase>
          </View>
        </View>
      </Pressable>
      {!IsMobileScreen && (
        <TouchableOpacity onPress={() => onDelete(id)}>
          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HistoryItem;
