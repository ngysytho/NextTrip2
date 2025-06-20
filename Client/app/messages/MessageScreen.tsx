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
import { useAppTheme } from '../../context/ThemeContext'; // ✅ Dark Mode Context

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
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    const renderItem = ({ item }: { item: typeof messages[0] }) => (
        <TouchableOpacity
            style={[styles.item, { borderColor: isDark ? '#333' : '#ddd' }]}
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
                <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>{item.name}</Text>
                <Text style={[styles.message, { color: isDark ? '#aaa' : '#555' }]} numberOfLines={1}>
                    {item.message}
                </Text>
            </View>
            <Text style={[styles.time, { color: isDark ? '#888' : '#888' }]}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Text style={[styles.header, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#000' : '#fff' }]}>
                Messages
            </Text>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 0.3,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    textContainer: { flex: 1 },
    name: {
        fontWeight: '600',
        fontSize: 16,
    },
    message: {
        marginTop: 2,
    },
    time: {
        fontSize: 12,
        marginLeft: 8,
    },
});
