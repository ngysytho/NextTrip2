import { Stack } from 'expo-router';
import { ThemeProvider, useAppTheme } from '../context/ThemeContext';

function InnerLayout() {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: isDark ? '#000' : '#fff',
                },
                headerTintColor: isDark ? '#fff' : '#000',
                headerBackTitle: 'Back',
                headerTitle: '',
            }}
        >
            <Stack.Screen name="login/index" />
            <Stack.Screen name="login/signup" />
            <Stack.Screen name="messages/index" options={{ headerTitle: 'Tin Nhắn' }} />
            <Stack.Screen name="messages/[id]" />
            <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <InnerLayout />
        </ThemeProvider>
    );
}
