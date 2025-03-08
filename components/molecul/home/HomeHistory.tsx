import { FlatList, View } from "react-native";
import React, { PureComponent } from "react";
import TextBase from "@/components/base/Text";
import HistoryItem from "@/components/list/HistoryItem";

const historyData = [
  {
    index: 0,
    id: "141002212997",
    fileCount: 5,
    date: "21 Okt 2024",
    time: "12.15",
  },
  {
    index: 1,
    id: "141002212998",
    fileCount: 3,
    date: "22 Okt 2024",
    time: "14.30",
  },
  {
    index: 2,
    id: "141002212997",
    fileCount: 5,
    date: "21 Okt 2024",
    time: "12.15",
  },
  {
    index: 3,
    id: "141002212998",
    fileCount: 3,
    date: "22 Okt 2024",
    time: "14.30",
  },
  {
    index: 4,
    id: "141002212997",
    fileCount: 5,
    date: "21 Okt 2024",
    time: "12.15",
  },
  {
    index: 5,
    id: "141002212998",
    fileCount: 3,
    date: "22 Okt 2024",
    time: "14.30",
  },
  {
    index: 6,
    id: "141002212997",
    fileCount: 5,
    date: "21 Okt 2024",
    time: "12.15",
  },
  {
    index: 7,
    id: "141002212998",
    fileCount: 3,
    date: "22 Okt 2024",
    time: "14.30",
  },
];

export class HomeHistory extends PureComponent {
  render() {
    return (
      <View style={{ padding: 25, gap: 25 }}>
        <TextBase variant="header">Riwayat</TextBase>

        <FlatList
          data={historyData}
          keyExtractor={(item) => item.index.toString()}
          renderItem={({ item }) => (
            <HistoryItem
              id={item.id}
              fileCount={item.fileCount}
              date={item.date}
              time={item.time}
              index={item.index}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    );
  }
}

export default HomeHistory;
