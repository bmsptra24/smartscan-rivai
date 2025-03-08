import { Color } from "@/constants/Styles";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "@/components/molecul/home/Header";
import HomeHistory from "@/components/molecul/home/HomeHistory";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.background }}>
      <ScrollView>
        <HomeHeader />
        <HomeHistory />
      </ScrollView>
    </SafeAreaView>
  );
}
