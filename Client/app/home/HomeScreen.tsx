import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const tabs = ['Du Lịch', 'Nhà Hàng', 'Quán Nước', 'Khách Sạn'] as const;
type TabKey = typeof tabs[number];

type Item = {
  name: string;
  description: string;
  imageUrl: string;
  rating: number; // ⭐️ số sao
};

const tabData: Record<TabKey, Item[]> = {
  'Du Lịch': [
    {
      name: 'Vinpearl Phú Quốc',
      description: 'Resort 5⭐️ cực đẹp',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Vinpearl',
      rating: 4.8,
    },
    {
      name: 'Sun World Bà Nà Hills',
      description: 'Vui chơi giải trí hấp dẫn',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Ba+Na+Hills',
      rating: 4.5,
    },
  ],
  'Nhà Hàng': [
    {
      name: 'Nhà hàng Quê Nhà',
      description: 'Ẩm thực truyền thống',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Que+Nha',
      rating: 4.3,
    },
    {
      name: 'Ẩm Thực Năm Sao',
      description: 'Món ăn cao cấp',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=5+Sao',
      rating: 4.7,
    },
  ],
  'Quán Nước': [
    {
      name: 'The Coffee House',
      description: 'Mua 1 tặng 1 nước ép',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Coffee+House',
      rating: 4.6,
    },
    {
      name: 'TocoToco Trà Sữa',
      description: 'Giảm 20% cho đơn đầu',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=TocoToco',
      rating: 4.4,
    },
  ],
  'Khách Sạn': [
    {
      name: 'Khách Sạn Intercontinental',
      description: 'Dịch vụ chuẩn 5⭐️ quốc tế',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Intercontinental',
      rating: 4.9,
    },
    {
      name: 'Khách Sạn Mường Thanh',
      description: 'Giá tốt, tiện nghi đầy đủ',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Muong+Thanh',
      rating: 4.2,
    },
  ],
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('Du Lịch');
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

  const renderItem = ({ item }: { item: Item }) => (
    <View style={[styles.card, { backgroundColor: isDark ? '#111' : '#fff' }]}>
      <View>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

        {/* Badge hiển thị rating */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" style={{ marginRight: 2 }} />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.cardDesc, { color: isDark ? '#aaa' : '#444' }]} numberOfLines={2}>
        {item.description}
      </Text>
    </View>
  );

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
              if (!isLoggedIn) {
                router.push('/Login');
              } else {
                router.push('/messages/index');
              }
            }}
          >
            <MaterialCommunityIcons name="facebook-messenger" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: isDark ? '#111' : 'black' }]}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tabData[activeTab]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16,
    paddingTop: 12, paddingBottom: 8,
  },
  logo: { fontSize: 28, fontWeight: 'bold' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 16 },
  tabContainer: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tabItem: { alignItems: 'center' },
  tabText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  tabTextActive: { fontWeight: 'bold' },
  tabUnderline: { marginTop: 4, width: 24, height: 3, backgroundColor: '#fff', borderRadius: 2 },
  gridContent: { paddingHorizontal: 8, paddingTop: 12 },
  card: {
    marginBottom: 12, borderRadius: 8,
    overflow: 'hidden', width: width / 2 - 16, elevation: 2,
  },
  cardImage: { width: '100%', height: 120 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 8, marginHorizontal: 8 },
  cardDesc: { fontSize: 12, marginHorizontal: 8, marginBottom: 8 },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
