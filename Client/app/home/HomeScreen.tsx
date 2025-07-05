import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const tabs = ['Du Lịch', 'Nhà Hàng', 'Quán Nước', 'Khách Sạn'] as const;
type TabKey = typeof tabs[number];

type Item = {
  place_id: string;
  name_places: string;
  description_places: string;
  image_url_places: string;
  rating_places: number;
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('Du Lịch');
  const [data, setData] = useState<Record<TabKey, Item[]>>({
    'Du Lịch': [],
    'Nhà Hàng': [],
    'Quán Nước': [],
    'Khách Sạn': [],
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  useFocusEffect(
    useCallback(() => {
      const checkLogin = async () => {
        const token = await AsyncStorage.getItem('access_token');
        setIsLoggedIn(!!token);
      };
      checkLogin();
    }, [])
  );

  useEffect(() => {
    fetchData(1); // Load trang đầu tiên khi vào hoặc đổi tab
  }, [activeTab]);

  const fetchData = async (pageNumber = 1) => {
    if (!hasMore && pageNumber !== 1) return;

    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const url = `http://192.168.1.4:8080/api/places/category/${encodeURIComponent(activeTab)}?page=${pageNumber}&limit=10`;
      console.log('🔗 Fetching URL:', url);

      const res = await axios.get(url);
      const apiData = res.data.data;
      const more = res.data.hasMore;

      setData((prevData) => ({
        ...prevData,
        [activeTab]: pageNumber === 1 ? apiData : [...prevData[activeTab], ...apiData],
      }));

      setHasMore(more);
      setPage(pageNumber);
    } catch (err) {
      console.log('❌ Lỗi tải dữ liệu:', err);
    } finally {
      if (pageNumber === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/Items/PlaceDetailScreen',
          params: {
            place_id: item.place_id,
            name_places: item.name_places,
            description_places: item.description_places,
            image_url_places: item.image_url_places,
            rating_places: item.rating_places.toString(),
          },
        });
      }}
      style={[styles.card, { backgroundColor: isDark ? '#111' : '#fff' }]}>
      <View>
        <Image source={{ uri: item.image_url_places }} style={styles.cardImage} />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" style={{ marginRight: 2 }} />
          <Text style={styles.ratingText}>{item.rating_places.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>
        {item.name_places}
      </Text>
      <Text style={[styles.cardDesc, { color: isDark ? '#aaa' : '#444' }]} numberOfLines={2}>
        {item.description_places}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#000' : '#fff'} />

      <View style={[styles.header, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={[styles.logo, { color: isDark ? '#fff' : '#000' }]}>NextTrip</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              if (!isLoggedIn) router.push('/Login/LoginScreen');
              else router.push('/messages/index');
            }}>
            <MaterialCommunityIcons name="facebook-messenger" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: isDark ? '#111' : 'black' }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              setPage(1);
              setHasMore(true);
            }}
            style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data[activeTab]}
        keyExtractor={(item) => item.place_id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loadingMore && hasMore) {
            fetchData(page + 1);
          }
        }}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#00f" /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  logo: { fontSize: 28, fontWeight: 'bold' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 16 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  tabItem: { alignItems: 'center' },
  tabText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  tabTextActive: { fontWeight: 'bold' },
  tabUnderline: { marginTop: 4, width: 24, height: 3, backgroundColor: '#fff', borderRadius: 2 },
  gridContent: { paddingHorizontal: 8, paddingTop: 12 },
  card: { marginBottom: 12, borderRadius: 8, overflow: 'hidden', width: width / 2 - 16, elevation: 2 },
  cardImage: { width: '100%', height: 120 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 8, marginHorizontal: 8 },
  cardDesc: { fontSize: 12, marginHorizontal: 8, marginBottom: 8 },
  ratingBadge: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  ratingText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
