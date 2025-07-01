import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Part = {
  time: string;
  title: string;
  booking?: boolean;
  vehicle?: boolean;
  food?: string[];
  note?: string;
};

type TripDay = {
  day: number;
  parts: Part[];
};

type Trip = {
  itinerary_id: string;
  name: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'draft';
  pickup_address: string;
  return_address: string;
  start_date: string;
  end_date: string;
  hasVehicle: boolean;
  vehicle_info?: string;
  days: TripDay[];
};

const tabOptions = ['Chuyến đi', 'Lịch sử', 'Đơn nháp'] as const;
type TripTab = typeof tabOptions[number];

export default function TripScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTab, setActiveTab] = useState<TripTab>('Chuyến đi');
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  useEffect(() => {
    const checkLoginAndLoad = async () => {
      const token = await AsyncStorage.getItem('access_token');
      setIsLoggedIn(!!token);
      if (!token) return;

      const mockTrips: Trip[] = [
        {
          itinerary_id: 'trip-01',
          name: 'Đà Lạt 2024',
          pickup_address: 'Hà Nội',
          return_address: 'Đà Lạt',
          start_date: '2025-06-20',
          end_date: '2025-06-22',
          status: 'upcoming',
          hasVehicle: true,
          vehicle_info: 'Đã đặt xe 7 chỗ',
          days: [
            {
              day: 1,
              parts: [
                {
                  time: '07:00',
                  title: 'Ăn sáng tại khách sạn',
                  food: ['Phở', 'Cà phê'],
                },
                {
                  time: '09:00',
                  title: 'Tham quan bảo tàng',
                  booking: true,
                  note: 'Đã đặt vé online',
                },
              ],
            },
            {
              day: 2,
              parts: [
                {
                  time: '08:00',
                  title: 'Đi thác Datanla',
                  vehicle: true,
                },
                {
                  time: '12:00',
                  title: 'Ăn trưa tại Bếp 1985',
                  food: ['Cơm lam', 'Gà nướng'],
                },
              ],
            },
          ],
        },
        {
          itinerary_id: 'trip-02',
          name: 'Huế cổ kính',
          pickup_address: 'Đà Nẵng',
          return_address: 'Huế',
          start_date: '2025-05-01',
          end_date: '2025-05-03',
          status: 'completed',
          hasVehicle: true,
          vehicle_info: 'Xe riêng đã thuê',
          days: [
            {
              day: 1,
              parts: [
                {
                  time: '10:00',
                  title: 'Check-in Đại Nội',
                  booking: true,
                },
              ],
            },
          ],
        },
        {
          itinerary_id: 'trip-03',
          name: 'Sapa draft',
          pickup_address: 'Hà Nội',
          return_address: 'Sapa',
          start_date: '2025-07-01',
          end_date: '2025-07-03',
          status: 'draft',
          hasVehicle: false,
          days: [],
        },
      ];

      setTrips(mockTrips);
    };

    checkLoginAndLoad();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    if (activeTab === 'Chuyến đi') return ['upcoming', 'ongoing'].includes(trip.status);
    if (activeTab === 'Lịch sử') return trip.status === 'completed';
    if (activeTab === 'Đơn nháp') return ['draft', 'cancelled'].includes(trip.status);
    return true;
  });

  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center', color: isDark ? '#fff' : '#000', marginBottom: 12 }}>
          Vui lòng đăng nhập để xem các chuyến đi của bạn.
        </Text>
        <TouchableOpacity onPress={() => router.push('/Login/LoginScreen')} style={styles.loginBtn}>
          <Ionicons name="log-in-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: '#fff' }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.tabs}>
        {tabOptions.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {filteredTrips.length === 0 && (
          <Text style={{ color: isDark ? '#aaa' : '#666', textAlign: 'center', marginTop: 20 }}>
            Không có chuyến nào trong mục này.
          </Text>
        )}
        {filteredTrips.map((trip) => (
          <View key={trip.itinerary_id} style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#f3f3f3' }]}>
            <Text style={[styles.tripName, { color: isDark ? '#fff' : '#000' }]}>{trip.name}</Text>
            <Text style={styles.subText}>📍 {trip.pickup_address} → {trip.return_address}</Text>
            <Text style={styles.subText}>📅 {trip.start_date} → {trip.end_date}</Text>
            <Text style={styles.subText}>📌 Trạng thái: {translateStatus(trip.status)} | 🚗 {trip.vehicle_info || 'Chưa đặt xe'}</Text>

            {trip.days.map((day) => (
              <View key={day.day} style={[styles.dayBox, { backgroundColor: isDark ? '#000' : '#fff' }]}>
                <Text style={[styles.dayTitle, { color: isDark ? '#fff' : '#000' }]}>Day {day.day}</Text>
                {day.parts.map((part, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={[styles.time, { color: isDark ? '#aaa' : '#555' }]}>{part.time}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.activity, { color: isDark ? '#eee' : '#333' }]}>{part.title}</Text>
                      {part.food && (
                        <Text style={styles.note}>🍽 Món: {part.food.join(', ')}</Text>
                      )}
                      {part.booking && (
                        <Text style={styles.note}>🎟 Đặt vé: {part.note || 'Đã đặt'}</Text>
                      )}
                      {part.vehicle && (
                        <Text style={styles.note}>🚗 Đã đặt xe riêng</Text>
                      )}
                      {part.note && !part.booking && (
                        <Text style={styles.note}>📝 {part.note}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const translateStatus = (s: string) => {
  switch (s) {
    case 'upcoming': return 'Sắp tới';
    case 'ongoing': return 'Đang đi';
    case 'completed': return 'Đã xong';
    case 'cancelled': return 'Đã huỷ';
    case 'draft': return 'Nháp';
    default: return s;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingTop: 10,
  },
  tabItem: {
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: '#000',
    textDecorationLine: 'underline',
  },
  content: { padding: 16 },
  card: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subText: {
    fontSize: 13,
    marginBottom: 2,
    color: '#777',
  },
  dayBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  time: {
    width: 70,
    fontSize: 12,
  },
  activity: {
    fontSize: 14,
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: '#6200EE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
});
