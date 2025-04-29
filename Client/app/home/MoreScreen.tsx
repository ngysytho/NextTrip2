import { SafeAreaView, FlatList, Text, View } from 'react-native';

export default function MoreScreen() {
  const data = Array.from({ length: 50 }, (_, i) => `Trang chủ ${i + 1}`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,  // để tránh che mất cuối danh sách
        }}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 12,
              backgroundColor: 'lightblue',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text>{item}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
