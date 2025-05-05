import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = ['Chuyến Đi', 'Lịch sử', 'Đơn nháp'] as const;
type TabKey = typeof tabs[number];

export default function TripScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('Lịch sử');

  const renderContent = () => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Image
            source={require('../../assets/images/NextTripLogo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.loginPrompt}>
            <Ionicons name="person-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.promptText}>Vui lòng đăng nhập để tiếp tục</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Header */}
      <View style={styles.tabHeader}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5e5e5' },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingTop: 12,
    paddingBottom: 6,
  },
  tabItem: { alignItems: 'center' },
  tabText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  tabTextActive: { fontWeight: 'bold', fontSize: 18 },
  tabIndicator: {
    marginTop: 4,
    width: 30,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: 160, height: 160, marginBottom: 20 },
  loginPrompt: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  promptText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
