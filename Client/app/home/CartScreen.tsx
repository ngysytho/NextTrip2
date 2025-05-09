import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

export default function CartScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Xe đẩy hàng (0 mục)</Text>

            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/NextTripLogo.png')} // ← Thay bằng ảnh hành lý của bạn
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Giỏ hàng của quý khách chẳng có gì bên trong</Text>
                <Text style={styles.subtitle}>
                    Hãy mua khách sạn, quán ăn và điểm thu hút để lập kế hoạch cho chuyến của bạn
                </Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tìm kiếm du lịch</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#2F6FED',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});
