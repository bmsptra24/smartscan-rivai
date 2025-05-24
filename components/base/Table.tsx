import { BorderRadius, Color, IsMobileScreen } from "@/constants/Styles";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from "react-native";
import TextBase from "./Text";

// Definisikan tipe untuk style props
interface TableStyleProps {
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  headerCellStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  bodyStyle?: ViewStyle;
  bodyRowStyle?: ViewStyle;
  bodyCellStyle?: ViewStyle;
  bodyTextStyle?: TextStyle;
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
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  // Update screen width when dimensions change
  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    const subscription = Dimensions.addEventListener("change", updateWidth);
    return () => subscription.remove();
  }, []);

  // Calculate responsive column widths
  const getResponsiveWidths = () => {
    const isMobile = screenWidth < 768;

    if (isMobile) {
      // For mobile: use minimum widths that make sense for content
      return tableHead.map((_, index) => {
        // Make action column wider, others more compact
        if (
          index === tableHead.length - 1 &&
          tableHead[index].toLowerCase().includes("aksi")
        ) {
          return 150;
        }
        return 120;
      });
    }

    // For desktop: use provided widths or default
    return widthArr ?? tableHead.map(() => 200);
  };

  const responsiveWidths = getResponsiveWidths();
  const isMobile = screenWidth < 768;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
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
                { width: responsiveWidths[index] },
                headerCellStyle,
              ]}
            >
              <TextBase
                style={[
                  styles.headerText,
                  isMobile && styles.mobileHeaderText,
                  headerTextStyle,
                ]}
              >
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
                    { width: responsiveWidths[cellIndex] },
                    bodyCellStyle,
                  ]}
                >
                  {typeof cell === "string" ? (
                    <TextBase
                      style={[
                        styles.bodyText,
                        isMobile && styles.mobileBodyText,
                        bodyTextStyle,
                      ]}
                    >
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
    borderWidth: !IsMobileScreen ? 1 : 0,
    shadowColor: "#000",
    shadowOpacity: !IsMobileScreen ? 0.1 : 0,
    shadowRadius: 7,
    elevation: 5,
    padding: IsMobileScreen ? 8 : 15,
    borderColor: "#ccc",
    borderRadius: BorderRadius.medium,
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
  mobileHeaderText: {
    fontSize: 12,
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
    // Default style untuk body text
  },
  mobileBodyText: {
    fontSize: 12,
  },
});

export default Table;
