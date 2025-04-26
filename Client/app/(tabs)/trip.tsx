import { FlatList, Text, View } from 'react-native';

export default function TripScreen() {
  const data = Array.from({ length: 50 }, (_, i) => `Chuyến đi ${i + 1}`);
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={{ padding: 16, marginBottom: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text>{item}</Text>
        </View>
      )}
    />
  );
}