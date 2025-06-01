import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { Platform } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext'; // ✅ Import

export default function HomeLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: (Platform.OS === 'ios' ? 60 : 55) + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: isDark ? '#000' : '#fff', // ✅ đổi theo dark/light
          borderTopWidth: 0.5,
          borderTopColor: isDark ? '#444' : '#ccc',
          paddingTop: 8,
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'HomeScreen':
              return <Ionicons name="home-outline" size={size} color={color} />;
            case 'TripScreen':
              return <Ionicons name="briefcase-outline" size={size} color={color} />;
            case 'AIScreen':
              return <Ionicons name="pricetag-outline" size={size} color={color} />;
            case 'CartScreen':
              return <MaterialCommunityIcons name="cart-outline" size={size} color={color} />;
            case 'MoreScreen':
              return <Ionicons name="person-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="HomeScreen" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="TripScreen" options={{ title: 'Chuyến đi' }} />
      <Tabs.Screen name="AIScreen" options={{ title: 'TripAI' }} />
      <Tabs.Screen name="CartScreen" options={{ title: 'Giỏ hàng' }} />
      <Tabs.Screen name="MoreScreen" options={{ title: 'Thêm' }} />
    </Tabs>
  );
}
