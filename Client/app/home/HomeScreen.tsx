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
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../context/ThemeContext'; // ✅ Thêm dòng này

const { width } = Dimensions.get('window');

const tab1 = ['Khám Phá', 'Bảng Tin'] as const;
const tabs = ['Du Lịch', 'Nhà Hàng', 'Quán Nước'] as const;
type TabKey = typeof tabs[number];
type TabKey1 = typeof tab1[number];

type Item = {
  name: string;
  description: string;
  imageUrl: string;
};

type News = {
  avatar: string;
  name: string;
  time: string;
  content: string;
  image: string;
};

const tabData: Record<TabKey, Item[]> = {
  'Du Lịch': [
    {
      name: 'Vinpearl Phú Quốc',
      description: 'Resort 5⭐️ cực đẹp',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Vinpearl',
    },
    {
      name: 'Sun World Bà Nà Hills',
      description: 'Vui chơi giải trí hấp dẫn',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Ba+Na+Hills',
    },
  ],
  'Nhà Hàng': [
    {
      name: 'Nhà hàng Quê Nhà',
      description: 'Ẩm thực truyền thống',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Que+Nha',
    },
    {
      name: 'Ẩm Thực Năm Sao',
      description: 'Món ăn cao cấp',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=5+Sao',
    },
  ],
  'Quán Nước': [
    {
      name: 'The Coffee House',
      description: 'Mua 1 tặng 1 nước ép',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Coffee+House',
    },
    {
      name: 'TocoToco Trà Sữa',
      description: 'Giảm 20% cho đơn đầu',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=TocoToco',
    },
  ],
};

const newsData: News[] = [
  {
    avatar: 'https://via.placeholder.com/50',
    name: 'Trường THPT Đô Lương 1',
    time: '1 giờ trước',
    content: 'Ngày hội Sách và Văn hóa đọc với chủ đề: "Cùng sách bước vào kỷ nguyên vươn mình của dân tộc".',
    image: 'https://via.placeholder.com/400x200.png?text=Ngay+Hoi+Sach',
  },
  {
    avatar: 'https://via.placeholder.com/50',
    name: 'Đoàn Trường THPT',
    time: '2 giờ trước',
    content: 'Hoạt động tình nguyện tháng 3: Dọn vệ sinh khuôn viên nghĩa trang liệt sĩ.',
    image: 'https://via.placeholder.com/400x200.png?text=Tinh+Nguyen+Thang+3',
  },
];

export default function HomeScreen() {
  const [activeTab1, setActiveTab1] = useState<TabKey1>('Khám Phá');
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
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.cardDesc, { color: isDark ? '#aaa' : '#444' }]} numberOfLines={2}>
        {item.description}
      </Text>
    </View>
  );

  const renderNewsItem = ({ item }: { item: News }) => (
    <View style={[styles.newsCard, { backgroundColor: isDark ? '#111' : '#fff' }]}>
      <View style={styles.newsHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View>
          <Text style={[styles.posterName, { color: isDark ? '#fff' : '#000' }]}>{item.name}</Text>
          <Text style={[styles.postTime, { color: isDark ? '#aaa' : '#666' }]}>{item.time}</Text>
        </View>
      </View>
      <Text style={[styles.newsContent, { color: isDark ? '#eee' : '#000' }]}>{item.content}</Text>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <FontAwesome name="thumbs-o-up" size={20} color={isDark ? '#ccc' : '#555'} />
          <Text style={[styles.actionText, { color: isDark ? '#ccc' : '#555' }]}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={20} color={isDark ? '#ccc' : '#555'} />
          <Text style={[styles.actionText, { color: isDark ? '#ccc' : '#555' }]}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="arrow-redo-outline" size={20} color={isDark ? '#ccc' : '#555'} />
          <Text style={[styles.actionText, { color: isDark ? '#ccc' : '#555' }]}>Share</Text>
        </TouchableOpacity>
      </View>
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
                router.push('/login');
              } else {
                router.push('/messages/index');
              }
            }}
          >
            <MaterialCommunityIcons name="facebook-messenger" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tab1Container, { backgroundColor: isDark ? '#111' : '#f5f5f5' }]}>
        {tab1.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              if (tab === 'Bảng Tin' && !isLoggedIn) {
                router.push('/login');
              } else {
                setActiveTab1(tab);
              }
            }}
            style={styles.tab1Item}
          >
            <Text style={[styles.tab1Text, { color: isDark ? '#fff' : '#000' }, activeTab1 === tab && styles.tab1TextActive]}>
              {tab}
            </Text>
            {activeTab1 === tab && <View style={styles.tab1Underline} />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab1 === 'Khám Phá' && (
        <>
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
        </>
      )}

      {activeTab1 === 'Bảng Tin' && isLoggedIn && (
        <FlatList
          data={newsData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderNewsItem}
          contentContainerStyle={{ padding: 12, backgroundColor: isDark ? '#000' : '#fff' }}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  tab1Container: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tab1Item: { alignItems: 'center' },
  tab1Text: { fontSize: 16, fontWeight: '500' },
  tab1TextActive: { fontWeight: 'bold', color: 'blue' },
  tab1Underline: { marginTop: 4, width: 24, height: 3, backgroundColor: 'blue', borderRadius: 2 },
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
  newsCard: {
    marginBottom: 16,
    borderRadius: 10, padding: 12, elevation: 2,
  },
  newsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  posterName: { fontWeight: 'bold', fontSize: 14 },
  postTime: { fontSize: 12 },
  newsContent: { fontSize: 14, marginBottom: 8 },
  newsImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 8 },
  newsActions: {
    flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, borderTopWidth: 1,
    borderColor: '#eee',
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13 },
});
