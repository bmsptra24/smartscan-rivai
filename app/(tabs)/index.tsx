import HomeHeader from "@/components/molecul/home/Header";
import HomeHistory from "@/components/molecul/home/HomeHistory";
import Container from "@/components/base/Container";

export default function HomeScreen() {
  return (
    <Container>
      <HomeHeader />
      <HomeHistory />
    </Container>
  );
}
