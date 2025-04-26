import { FlatList, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const data = Array.from({ length: 30 }, (_, i) => `Trang chủ ${i + 1}`);
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={{ padding: 16, marginBottom: 8, backgroundColor: '#e0f7fa', borderRadius: 6 }}>
          <Text>{item}</Text>
        </View>
      )}
    />
  );
}