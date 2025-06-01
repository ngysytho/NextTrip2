import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextProps {
    theme: 'light' | 'dark';
    mode: ThemeType;
    setMode: (mode: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: 'light',
    mode: 'system',
    setMode: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColor = useColorScheme(); // 'light' | 'dark' | null
    const [mode, setModeState] = useState<ThemeType>('system');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Load theme mode từ AsyncStorage
    useEffect(() => {
        const loadTheme = async () => {
            const savedMode = (await AsyncStorage.getItem('theme_mode')) as ThemeType;
            const resolvedMode = savedMode || 'system';
            setModeState(resolvedMode);
            setTheme(resolvedMode === 'system' ? (systemColor ?? 'light') : resolvedMode);
        };
        loadTheme();
    }, [systemColor]);

    // Hàm thay đổi theme
    const setMode = async (newMode: ThemeType) => {
        await AsyncStorage.setItem('theme_mode', newMode);
        setModeState(newMode);
        setTheme(newMode === 'system' ? (systemColor ?? 'light') : newMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook sử dụng trong các component
export const useAppTheme = () => useContext(ThemeContext);
