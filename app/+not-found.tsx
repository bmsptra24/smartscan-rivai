import { Stack } from "expo-router";
import { Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Text>This screen doesn't exist.</Text>
      <Text>Go to home screen!</Text>
    </>
  );
}
