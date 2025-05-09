import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="login/index"
                options={{ headerTitle: '' }}
            />
            <Stack.Screen
                name="home"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
