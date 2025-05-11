import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import IconButton from "./IconButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Color } from "@/constants/Styles";
import { showAlert } from "@/utils/alert";
import { dateFormatter } from "@/utils/formatter";

interface DateRangePickerProps {
  onDateRangeSelected: (startDate: Date | null, endDate: Date | null) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeSelected,
  containerStyle,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );

  const today = new Date();
  const maxYear = today.getFullYear();
  const years = Array.from(
    { length: maxYear - 1900 + 1 },
    (_, i) => 1900 + i
  ).reverse();
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();
  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = Array(firstDay)
      .fill(null)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  };

  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  const handleButtonPress = () => {
    setShowStartPicker(true);
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const handleDateSelect = (day: number | null, isStart: boolean) => {
    if (!day) return;
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (selectedDate > today) {
      showAlert("Gagal", "Tidak dapat memilih tanggal di masa depan.");
      return;
    }
    if (isStart) {
      setStartDate(selectedDate);
      setShowStartPicker(false);
      setShowEndPicker(true);
    } else {
      if (startDate && selectedDate >= startDate) {
        setEndDate(selectedDate);
        setShowEndPicker(false);
        if (startDate) onDateRangeSelected(startDate, selectedDate);
      } else {
        showAlert("Gagal", "Tanggal akhir harus setelah tanggal mulai.");
      }
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    if (direction === "prev") {
      newMonth -= 1;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
    } else {
      newMonth += 1;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
    }
    if (
      newYear > maxYear ||
      (newYear === maxYear && newMonth > today.getMonth())
    ) {
      showAlert("Gagal", "Tidak dapat memilih bulan di masa depan.");
      return;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleCancel = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setShowStartPicker(false);
    setShowEndPicker(false);
    setCurrentYear(new Date().getFullYear());
    setCurrentMonth(new Date().getMonth());
    onDateRangeSelected(null, null);
  };

  const renderCalendar = (isStart: boolean) => (
    <View style={styles.calendarContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleMonthChange("prev")}>
          <AntDesign
            name="left"
            size={24}
            color="black"
            style={styles.headerButton}
          />
        </TouchableOpacity>
        <Text
          style={styles.headerText}
        >{`${months[currentMonth]} ${currentYear}`}</Text>
        <TouchableOpacity onPress={() => handleMonthChange("next")}>
          <AntDesign
            name="right"
            size={24}
            color="black"
            style={styles.headerButton}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.weekDays}>
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.day,
              day ? styles.dayActive : styles.dayInactive,
              day &&
              startDate &&
              day === startDate.getDate() &&
              currentMonth === startDate.getMonth() &&
              currentYear === startDate.getFullYear()
                ? styles.daySelected
                : undefined,
              day &&
              endDate &&
              day === endDate.getDate() &&
              currentMonth === endDate.getMonth() &&
              currentYear === endDate.getFullYear()
                ? styles.daySelected
                : undefined,
            ]}
            onPress={() => handleDateSelect(day, isStart)}
            disabled={!day}
          >
            <Text style={styles.dayText}>{day || ""}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <IconButton
        icon={<AntDesign name="calendar" size={24} color="black" />}
        onPress={handleButtonPress}
        style={{ backgroundColor: Color.white }}
        title={
          startDate && endDate
            ? `${dateFormatter.format(startDate)}-${dateFormatter.format(
                endDate
              )}`
            : undefined
        }
      />
      <Modal
        visible={showStartPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.modalContainer} onPress={handleCancel}>
          <View style={styles.modalContent} pointerEvents="box-none">
            <Text style={styles.modalTitle}>Pilih Tanggal Mulai</Text>
            {renderCalendar(true)}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleClear} style={styles.button}>
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.button}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={showEndPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.modalContainer} onPress={handleCancel}>
          <View style={styles.modalContent} pointerEvents="box-none">
            <Text style={styles.modalTitle}>Pilih Tanggal Selesai</Text>
            {renderCalendar(false)}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleCancel} style={styles.button}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  calendarContainer: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginBottom: 8,
  },
  headerButton: {
    color: Color.primary,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  day: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  dayActive: {
    borderRadius: 8,
  },
  dayInactive: {
    backgroundColor: "transparent",
  },
  daySelected: {
    backgroundColor: Color.primary,
  },
  dayText: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  buttonText: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default DateRangePicker;
