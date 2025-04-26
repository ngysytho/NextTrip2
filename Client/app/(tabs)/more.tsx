import { FlatList, Text, View } from 'react-native';

export default function MoreScreen() {
  const data = ['Tài khoản', 'Cài đặt', 'Trợ giúp', 'Giới thiệu'];
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={{ padding: 16, marginBottom: 8, backgroundColor: '#c8e6c9', borderRadius: 6 }}>
          <Text>{item}</Text>
        </View>
      )}
    />
  );
}
