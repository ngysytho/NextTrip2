import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CustomTabBar from '../../components/CustomTabBar'; // ✨ Đúng path
import HomeScreen from './HomeScreen';
import TripScreen from './TripScreen';
import OfferScreen from './OfferScreen';
import CartScreen from './CartScreen';
import MoreScreen from './MoreScreen';
import React from 'react';

const Tab = createBottomTabNavigator();

export default function HomeLayout() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Trang chủ' }} />
        <Tab.Screen name="TripScreen" component={TripScreen} options={{ title: 'Chuyến đi' }} />
        <Tab.Screen name="OfferScreen" component={OfferScreen} options={{ title: 'Ưu đãi' }} />
        <Tab.Screen name="CartScreen" component={CartScreen} options={{ title: 'Giỏ hàng' }} />
        <Tab.Screen name="MoreScreen" component={MoreScreen} options={{ title: 'Thêm' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
