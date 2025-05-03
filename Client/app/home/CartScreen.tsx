import { SafeAreaView, FlatList, Text, View } from 'react-native';

export default function CartScreen() {
    const data = Array.from({ length: 50 }, (_, i) => `Trang chủ ${i + 1}`);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Hello World</Text>
        </View>
    );
}
