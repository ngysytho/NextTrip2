import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
        <Stack
        screenOptions={{
            headerShown: false, // 🔑 Ẩn toàn bộ header
        }}
        />
    );
}
