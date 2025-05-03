import { BorderRadius, Color } from "@/constants/Styles";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import TextBase from "./Text";

// Definisikan tipe untuk style props
interface TableStyleProps {
  containerStyle?: ViewStyle; // Style untuk tableContainer
  headerStyle?: ViewStyle; // Style untuk tableHeader
  headerCellStyle?: ViewStyle; // Style untuk bodyCell
  headerTextStyle?: TextStyle; // Style untuk teks header
  bodyStyle?: ViewStyle; // Style untuk tableBody
  bodyRowStyle?: ViewStyle; // Style untuk bodyRow
  bodyCellStyle?: ViewStyle; // Style untuk bodyCell
  bodyTextStyle?: TextStyle; // Style untuk teks body
}

// Gabungkan TableProps dengan TableStyleProps
interface TableProps extends TableStyleProps {
  tableHead: string[];
  tableData: (string | React.ReactNode)[][];
  widthArr?: number[];
}

const Table: React.FC<TableProps> = ({
  tableHead,
  tableData,
  widthArr,
  containerStyle,
  headerStyle,
  headerTextStyle,
  bodyStyle,
  bodyRowStyle,
  bodyCellStyle,
  bodyTextStyle,
  headerCellStyle,
}) => {
  // Default lebar kolom jika widthArr tidak disediakan
  const defaultWidth = 100;
  const columnWidths = widthArr ?? tableHead.map(() => defaultWidth);

  return (
    <ScrollView
      horizontal
      contentContainerStyle={[styles.tableContainer, containerStyle]}
    >
      <View>
        {/* Table Header */}
        <View style={[styles.tableHeader, headerStyle]}>
          {tableHead.map((head, index) => (
            <View
              key={`head-${index}`}
              style={[
                styles.headerCell,
                { width: columnWidths[index] ?? defaultWidth },
                headerCellStyle,
              ]}
            >
              <TextBase style={[styles.headerText, headerTextStyle]}>
                {head}
              </TextBase>
            </View>
          ))}
        </View>

        {/* Table Body */}
        <View style={[styles.tableBody, bodyStyle]}>
          {tableData.map((row, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              style={[styles.bodyRow, bodyRowStyle]}
            >
              {row.map((cell, cellIndex) => (
                <View
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={[
                    styles.bodyCell,
                    { width: columnWidths[cellIndex] ?? defaultWidth },
                    bodyCellStyle,
                  ]}
                >
                  {typeof cell === "string" ? (
                    <TextBase style={[styles.bodyText, bodyTextStyle]}>
                      {cell}
                    </TextBase>
                  ) : (
                    cell // Mendukung elemen kustom
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "column",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 5,
    padding: 15,
    borderColor: "#ccc",
    borderRadius: BorderRadius.medium,
    overflow: "hidden", // Untuk border radius
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Color.greyLight,
    borderRadius: BorderRadius.default,
  },
  headerCell: {
    justifyContent: "center",
    padding: 10,
  },
  headerText: {
    color: Color.grey,
    textTransform: "uppercase",
  },
  tableBody: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  bodyRow: {
    flexDirection: "row",
  },
  bodyCell: {
    justifyContent: "center",
    padding: 10,
  },
  bodyText: {
    // Default style untuk body text jika dibutuhkan
  },
});

export default Table;
