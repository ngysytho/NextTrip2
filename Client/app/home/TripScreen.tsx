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
import { useFocusEffect } from '@react-navigation/native';

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
  const [editedTrip, setEditedTrip] = useState<Trip | null>(null);
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
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

  const fetchTrips = async () => {
    if (!token || isTokenExpired(token)) { logout(); return; }
    setLoading(true);
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const res = await axios.get(`http://192.168.1.4:8080/api/trips/user/${decoded.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(res.data ?? []);
    } catch (err: any) { console.log('❌', err.response?.data || err.message); }
    finally { setLoading(false); }
  };

  const fetchTripDetail = async (tripId: string) => {
    try {
      const res = await axios.get<Trip>(`http://192.168.1.4:8080/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTripDetail(res.data);
      setEditedTrip(res.data);
    } catch (err: any) { console.log('❌', err.response?.data || err.message); }
  };

  const loadPlan = async (tripId: string) => {
    try {
      const res = await axios.get<TripPlan>(`http://192.168.1.4:8080/api/trips/${tripId}/plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgetData(res.data.budget ?? []);
      setScheduleData(res.data.schedule ?? []);
    } catch (err: any) { console.log('❌', err.response?.data || err.message); }
  };

  const saveTripEdit = async () => {
    if (!editedTrip || !token) return;
    try {
      await axios.put(`http://192.168.1.4:8080/api/trips/${editedTrip.id}`, editedTrip, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('✅', 'Đã lưu chỉnh sửa chuyến đi');
      setTripDetail(editedTrip);
      setIsEditingTrip(false);
    } catch (err: any) { console.log('❌', err.response?.data || err.message); }
  };

  useEffect(() => { fetchTrips(); }, [token]);
  useFocusEffect(React.useCallback(() => { fetchTrips(); }, [token]));

  const tripsFiltered = trips.filter(trip => trip.status === convertTabToStatus(tabDangChon));

  useEffect(() => {
    if (selectedTripId && token) {
      fetchTripDetail(selectedTripId);
      loadPlan(selectedTripId);
    } else {
      setTripDetail(null);
      setBudgetData([]);
      setScheduleData([]);
    }
  }, [selectedTripId, token]);

  if (loading) return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#007AFF" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.tabs}>
          {tabOptions.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setTabDangChon(tab)}>
              <Text style={[styles.tabText, tabDangChon === tab && styles.tabActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>📝 Danh sách chuyến đi</Text>
        {tripsFiltered.map(trip => (
          <TouchableOpacity
            key={trip.id}
            style={[styles.tripButton, selectedTripId === trip.id && styles.tripButtonSelected]}
            onPress={() => setSelectedTripId(trip.id)}
          >
            <Text style={styles.tripButtonText}>{trip.tripName}</Text>
          </TouchableOpacity>
        ))}

        {/* Chi tiết chuyến đi chỉ hiện nếu KHÔNG phải tab Nháp */}
        {tripDetail && tabDangChon !== 'Nháp' && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>🗺️ Chi tiết chuyến đi</Text>
              <TouchableOpacity onPress={() => { if (isEditingTrip) saveTripEdit(); else setIsEditingTrip(true); }}>
                <Text style={{ color: '#007AFF', fontWeight: '500' }}>
                  {isEditingTrip ? 'Lưu' : 'Chỉnh sửa'}
                </Text>
              </TouchableOpacity>
            </View>

            {isEditingTrip ? (
              <>
                <TextInput style={styles.input} value={editedTrip?.tripName} onChangeText={text => setEditedTrip(prev => prev ? { ...prev, tripName: text } : prev)} placeholder="Tên chuyến đi" />
                <TextInput style={styles.input} value={editedTrip?.startDate} onChangeText={text => setEditedTrip(prev => prev ? { ...prev, startDate: text } : prev)} placeholder="Ngày bắt đầu" />
                <TextInput style={styles.input} value={editedTrip?.endDate} onChangeText={text => setEditedTrip(prev => prev ? { ...prev, endDate: text } : prev)} placeholder="Ngày kết thúc" />
                <TextInput style={styles.input} value={editedTrip?.pickupAddress} onChangeText={text => setEditedTrip(prev => prev ? { ...prev, pickupAddress: text } : prev)} placeholder="Địa chỉ đón" />
                <TextInput style={styles.input} value={editedTrip?.returnAddress} onChangeText={text => setEditedTrip(prev => prev ? { ...prev, returnAddress: text } : prev)} placeholder="Địa chỉ trả" />
                <TextInput style={styles.input} value={editedTrip?.status} onChangeText={text => setEditedTrip(prev => prev ? { ...prev, status: text } : prev)} placeholder="Trạng thái" />
              </>
            ) : (
              <>
                <Text>Tên: {tripDetail.tripName}</Text>
                <Text>Bắt đầu: {tripDetail.startDate}</Text>
                <Text>Kết thúc: {tripDetail.endDate}</Text>
                <Text>Địa chỉ đón: {tripDetail.pickupAddress}</Text>
                <Text>Địa chỉ trả: {tripDetail.returnAddress}</Text>
                <Text>Trạng thái: {tripDetail.status}</Text>
              </>
            )}

            {/* Danh sách địa điểm */}
            <Text style={styles.sectionTitle}>📍 Danh sách địa điểm</Text>
            {tripDetail.places.map((place, index) => (
              <View key={place.placeId} style={styles.card}>
                {editingPlaceId === place.placeId ? (
                  <>
                    <TextInput style={styles.input} value={place.name} placeholder="Tên địa điểm" onChangeText={(text) => {
                      const newPlaces = [...tripDetail.places]; newPlaces[index].name = text;
                      setTripDetail({ ...tripDetail, places: newPlaces });
                    }} />
                    <TextInput style={styles.input} value={place.address} placeholder="Địa chỉ" onChangeText={(text) => {
                      const newPlaces = [...tripDetail.places]; newPlaces[index].address = text;
                      setTripDetail({ ...tripDetail, places: newPlaces });
                    }} />
                    <TextInput style={styles.input} value={place.startTime} placeholder="Giờ bắt đầu" onChangeText={(text) => {
                      const newPlaces = [...tripDetail.places]; newPlaces[index].startTime = text;
                      setTripDetail({ ...tripDetail, places: newPlaces });
                    }} />
                    <TextInput style={styles.input} value={place.endTime} placeholder="Giờ kết thúc" onChangeText={(text) => {
                      const newPlaces = [...tripDetail.places]; newPlaces[index].endTime = text;
                      setTripDetail({ ...tripDetail, places: newPlaces });
                    }} />
                    <TextInput style={styles.input} value={place.note} placeholder="Ghi chú" onChangeText={(text) => {
                      const newPlaces = [...tripDetail.places]; newPlaces[index].note = text;
                      setTripDetail({ ...tripDetail, places: newPlaces });
                    }} />
                    <TouchableOpacity onPress={() => setEditingPlaceId(null)}>
                      <Text style={{ color: '#007AFF', fontWeight: '500' }}>Lưu</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text>{place.name}</Text>
                    <Text>{place.address}</Text>
                    <Text>{place.startTime} - {place.endTime}</Text>
                    <Text>Note: {place.note}</Text>
                    <TouchableOpacity onPress={() => setEditingPlaceId(place.placeId)}>
                      <Text style={{ color: '#007AFF', fontWeight: '500' }}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}

            {/* Dự trù kinh phí */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>💰 Dự trù kinh phí</Text>
              <TouchableOpacity onPress={() => setIsEditingBudget(!isEditingBudget)}>
                <Text style={{ color: '#007AFF', fontWeight: '500' }}>
                  {isEditingBudget ? 'Lưu' : 'Chỉnh sửa'}
                </Text>
              </TouchableOpacity>
            </View>

            {budgetData.map((item, idx) => (
              <View key={`${item.category}-${item.name}`} style={styles.card}>
                {isEditingBudget ? (
                  <>
                    <TextInput style={styles.input} value={item.category} placeholder="Category" onChangeText={(text) => {
                      const newData = [...budgetData]; newData[idx].category = text;
                      setBudgetData(newData);
                    }} />
                    <TextInput style={styles.input} value={item.name} placeholder="Tên" onChangeText={(text) => {
                      const newData = [...budgetData]; newData[idx].name = text;
                      setBudgetData(newData);
                    }} />
                    <TextInput style={styles.input} value={item.quantity} placeholder="Số lượng" onChangeText={(text) => {
                      const newData = [...budgetData]; newData[idx].quantity = text;
                      setBudgetData(newData);
                    }} />
                    <TextInput style={styles.input} value={item.estimate} placeholder="Ước tính" onChangeText={(text) => {
                      const newData = [...budgetData]; newData[idx].estimate = text;
                      setBudgetData(newData);
                    }} />
                    <TextInput style={styles.input} value={item.total} placeholder="Tổng" onChangeText={(text) => {
                      const newData = [...budgetData]; newData[idx].total = text;
                      setBudgetData(newData);
                    }} />
                    <TextInput style={styles.input} value={item.note} placeholder="Ghi chú" onChangeText={(text) => {
                      const newData = [...budgetData]; newData[idx].note = text;
                      setBudgetData(newData);
                    }} />
                  </>
                ) : (
                  <>
                    <Text>{item.category}: {item.name}, SL: {item.quantity}, ƯT: {item.estimate}, Tổng: {item.total}</Text>
                    <Text>Note: {item.note}</Text>
                  </>
                )}
              </View>
            ))}
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
  tripButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 6 },
  tripButtonSelected: { backgroundColor: '#007AFF' },
  tripButtonText: { color: '#000', fontWeight: '500' },
  card: { backgroundColor: '#f9f9f9', padding: 12, marginBottom: 8, borderRadius: 8 },
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', marginVertical: 4 },
});
