import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';

type TripPlace = {
  placeId: string;
  name: string;
  address: string;
  description: string;
  price: number;
  orderIndex: number;
  startTime: string;
  endTime: string;
  menu: string[];
  note: string;
};

type Trip = {
  id: string;
  userId: string;
  tripName: string;
  pickupAddress: string;
  returnAddress: string;
  startDate: string;
  endDate: string;
  status: string;
  places: TripPlace[];
};

type BudgetItem = {
  category: string;
  name: string;
  quantity: string;
  estimate: string;
  total: string;
  note: string;
};

type ScheduleItem = {
  time: string;
  location: string;
  activity: string;
  note: string;
};

type TripPlan = {
  budget: BudgetItem[];
  schedule: ScheduleItem[];
};

type DecodedToken = {
  sub: string;
  userId: string;
  iat: number;
  exp: number;
};

const tabOptions = ['Nháp', 'Chuyến đi', 'Đang đi', 'Hoàn thành'] as const;
type TripTab = typeof tabOptions[number];

export default function TripScreen() {
  const { token, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tabDangChon, setTabDangChon] = useState<TripTab>('Chuyến đi');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [tripDetail, setTripDetail] = useState<Trip | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEdited, setIsEdited] = useState(false);

  const isTokenExpired = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  const convertTabToStatus = (tab: TripTab) => {
    switch (tab) {
      case 'Nháp': return 'DRAFT';
      case 'Chuyến đi': return 'UPCOMING';
      case 'Đang đi': return 'ONGOING';
      case 'Hoàn thành': return 'COMPLETED';
      default: return '';
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      if (!token) return;

      if (isTokenExpired(token)) {
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
        logout();
        return;
      }

      setLoading(true);

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.userId;
        console.log('🔑 Token userId:', userId);

        const res = await axios.get(`http://192.168.1.9:8080/api/trips/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrips(res.data ?? []);
        if (res.data?.length > 0) {
          setSelectedTripId(res.data[0].id);
        }
      } catch (err: any) {
        console.log('❌ Lỗi lấy danh sách trip:', err.response?.status, err.response?.data || err.message);
        Alert.alert('❌', 'Không thể tải danh sách trip');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [token]);

  const fetchTripDetail = async (tripId: string) => {
    try {
      const res = await axios.get<Trip>(`http://192.168.1.9:8080/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTripDetail(res.data);
    } catch (err: any) {
      console.log('❌ Lỗi lấy trip detail:', err.response?.status, err.response?.data || err.message);
      Alert.alert('❌', 'Không thể tải chi tiết chuyến đi');
    }
  };

  useEffect(() => {
    const fetchPlan = async () => {
      if (!selectedTripId || !token) return;

      setLoading(true);

      try {
        const res = await axios.get<TripPlan>(`http://192.168.1.9:8080/api/trips/${selectedTripId}/plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBudgetData(res.data.budget ?? []);
        setScheduleData(res.data.schedule ?? []);
        setIsEdited(false);
        await fetchTripDetail(selectedTripId);
      } catch (err: any) {
        console.log('❌ Lỗi lấy plan:', err.response?.status, err.response?.data || err.message);
        Alert.alert('❌', 'Không thể tải dữ liệu plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [selectedTripId, token]);

  const savePlan = async () => {
    if (!selectedTripId || !token) return;

    try {
      await axios.put(
        `http://192.168.1.9:8080/api/trips/${selectedTripId}/plan`,
        { budget: budgetData, schedule: scheduleData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('✅', 'Đã lưu thành công');
      setIsEdited(false);
    } catch (err: any) {
      console.log('❌ Lỗi lưu plan:', err.response?.status, err.response?.data || err.message);
      Alert.alert('❌', 'Không thể lưu');
    }
  };

  const tripsFiltered = trips.filter(trip =>
    trip.status === convertTabToStatus(tabDangChon)
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Tabs */}
        <View style={styles.tabs}>
          {tabOptions.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setTabDangChon(tab)}>
              <Text style={[styles.tabText, tabDangChon === tab && styles.tabActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>📝 Danh sách chuyến đi</Text>
        {tripsFiltered.length === 0 ? (
          <Text style={styles.noDataText}>Không có chuyến đi</Text>
        ) : (
          tripsFiltered.map(trip => (
            <TouchableOpacity
              key={trip.id}
              style={[
                styles.tripButton,
                selectedTripId === trip.id && styles.tripButtonSelected,
              ]}
              onPress={() => setSelectedTripId(trip.id)}
            >
              <Text style={[
                styles.tripButtonText,
                selectedTripId === trip.id && { color: '#fff' },
              ]}>{trip.tripName}</Text>
            </TouchableOpacity>
          ))
        )}

        {tripDetail && (
          <>
            <Text style={styles.sectionTitle}>🗺️ Chi tiết chuyến đi</Text>
            <Text>Tên: {tripDetail.tripName}</Text>
            <Text>Bắt đầu: {tripDetail.startDate}</Text>
            <Text>Kết thúc: {tripDetail.endDate}</Text>
            <Text>Địa chỉ đón: {tripDetail.pickupAddress}</Text>
            <Text>Địa chỉ trả: {tripDetail.returnAddress}</Text>
            <Text>Trạng thái: {tripDetail.status}</Text>

            <Text style={styles.sectionTitle}>📍 Danh sách địa điểm</Text>
            {tripDetail.places.length === 0 ? (
              <Text style={styles.noDataText}>Không có địa điểm</Text>
            ) : (
              tripDetail.places.map(place => (
                <View key={place.placeId} style={styles.card}>
                  <Text style={styles.bold}>{place.name}</Text>
                  <Text>Địa chỉ: {place.address}</Text>
                  <Text>Giờ: {place.startTime} - {place.endTime}</Text>
                  <Text>Note: {place.note}</Text>
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>💰 Dự trù kinh phí</Text>
            {budgetData.length === 0 ? (
              <Text style={styles.noDataText}>Không có dự trù kinh phí</Text>
            ) : (
              budgetData.map(item => (
                <View key={`${item.category}-${item.name}`} style={styles.card}>
                  <Text style={styles.bold}>{item.category}</Text>
                  <TextInput
                    style={styles.input}
                    value={item.name}
                    onChangeText={(text) => {
                      const newData = budgetData.map(b => b === item ? { ...b, name: text } : b);
                      setBudgetData(newData);
                      setIsEdited(true);
                    }}
                  />
                  <Text>SL: {item.quantity} | ƯT: {item.estimate} | Tổng: {item.total}</Text>
                  <Text>Note: {item.note}</Text>
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>📅 Lịch trình</Text>
            {scheduleData.length === 0 ? (
              <Text style={styles.noDataText}>Không có lịch trình</Text>
            ) : (
              scheduleData.map(item => (
                <View key={`${item.time}-${item.location}`} style={styles.card}>
                  <Text style={styles.bold}>{item.time} - {item.location}</Text>
                  <TextInput
                    style={styles.input}
                    value={item.activity}
                    onChangeText={(text) => {
                      const newData = scheduleData.map(s => s === item ? { ...s, activity: text } : s);
                      setScheduleData(newData);
                      setIsEdited(true);
                    }}
                  />
                  <Text>Note: {item.note}</Text>
                </View>
              ))
            )}

            {isEdited && (
              <TouchableOpacity style={styles.btn} onPress={savePlan}>
                <Text style={styles.btnText}>💾 Lưu kế hoạch</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  tabText: { fontSize: 16, color: '#888' },
  tabActive: { color: '#007AFF', fontWeight: 'bold', textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  noDataText: { fontSize: 16, color: '#999', textAlign: 'center', marginVertical: 10 },
  tripButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 6 },
  tripButtonSelected: { backgroundColor: '#007AFF' },
  tripButtonText: { color: '#000', fontWeight: '500' },
  card: { backgroundColor: '#f9f9f9', padding: 12, marginBottom: 8, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  bold: { fontWeight: 'bold', marginBottom: 4 },
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 4, borderColor: '#ccc', borderWidth: 1, marginTop: 4 },
  btn: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
