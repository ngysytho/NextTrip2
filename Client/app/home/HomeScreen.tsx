import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const tabs = ['Du Lịch', 'Nhà Hàng', 'Quán Nước'] as const;
type TabKey = typeof tabs[number];

type Item = {
  name: string;
  description: string;
  imageUrl: string;
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

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('Du Lịch');

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.deliveryTag}>
        <Text style={styles.deliveryText}>Delivery</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>NextTrip</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="facebook-messenger" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid list */}
      <FlatList
        data={tabData[activeTab]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: 'bold',
  },
  tabUnderline: {
    marginTop: 4,
    width: 24,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  gridContent: {
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    width: width / 2 - 16,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  deliveryTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deliveryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginHorizontal: 8,
  },
  cardDesc: {
    fontSize: 12,
    color: '#444',
    marginHorizontal: 8,
    marginBottom: 8,
  },
});
