import { Stack } from 'expo-router';

export default function ItemLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 🔑 Ẩn toàn bộ header
      }}
    />
  );
}
