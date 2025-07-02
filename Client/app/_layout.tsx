import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

function InnerLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#000',
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
            <AuthProvider>
                <InnerLayout />
            </AuthProvider>
        </ThemeProvider>
    );
}
