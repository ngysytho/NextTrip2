import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

const messages = [
    {
        id: '1',
        name: 'Châu Nguyễn',
        message: 'e thi được mấy',
        time: '30 Mar',
        avatar: 'https://via.placeholder.com/150',
    },
    {
        id: '2',
        name: 'Nhi Mhi',
        message: '🔥',
        time: '30 Mar',
        avatar: 'https://via.placeholder.com/150',
    },
];

export default function MessageScreen() {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof messages[0] }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() =>
                router.push({
                    pathname: '/messages/[id]',
                    params: {
                        id: item.id,
                        name: item.name,
                        avatar: item.avatar,
                    },
                })
            }
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Messages</Text>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        color: '#fff',
        backgroundColor: '#000',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 0.3,
        borderColor: '#333',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    textContainer: { flex: 1 },
    name: { color: '#fff', fontWeight: '600', fontSize: 16 },
    message: { color: '#aaa', marginTop: 2 },
    time: { color: '#888', fontSize: 12 },
});
