import { FlatList, Text, View } from 'react-native';

export default function OfferScreen() {
  const data = Array.from({ length: 20 }, (_, i) => `Ưu đãi số ${i + 1}`);
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={{ padding: 16, marginBottom: 8, backgroundColor: '#ffe0b2', borderRadius: 6 }}>
          <Text>{item}</Text>
        </View>
      )}
    />
  );
}