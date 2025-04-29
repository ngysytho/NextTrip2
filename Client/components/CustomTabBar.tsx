import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const iconName = getIconName(route.name);

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        style={styles.tabButton}
                        activeOpacity={0.7}
                    >
                        {iconName}
                        <Text style={[styles.tabLabel, { color: isFocused ? '#007AFF' : '#8e8e93' }]}>
                            {label as string}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const getIconName = (routeName: string) => {
    switch (routeName) {
        case 'HomeScreen':
            return <Ionicons name="home-outline" size={24} color="black" />;
        case 'TripScreen':
            return <Ionicons name="briefcase-outline" size={24} color="black" />;
        case 'OfferScreen':
            return <Ionicons name="pricetag-outline" size={24} color="black" />;
        case 'CartScreen':
            return <MaterialCommunityIcons name="cart-outline" size={24} color="black" />;
        case 'MoreScreen':
            return <Ionicons name="person-outline" size={24} color="black" />;
        default:
            return null;
    }
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12, // ✨ iOS thêm padding xuống
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0.5,
        borderTopColor: '#ccc',
        height: Platform.OS === 'ios' ? 90 : 70, // ✨ Cho cao bằng Facebook
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 2,
    },
});

export default CustomTabBar;
