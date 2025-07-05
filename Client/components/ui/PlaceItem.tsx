import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  place: {
    placeId: string;
    name: string;
    startTime: string;
    note: string;
  };
  onLongPress: () => void;
  onEditTime: () => void;
};

export default function PlaceItem({ place, onLongPress, onEditTime }: Props) {
  return (
    <TouchableOpacity style={styles.item} onLongPress={onLongPress}>
      <View>
        <Text style={styles.name}>{place.name}</Text>
        <Text>🕒 {place.startTime || 'Chưa chọn giờ'}</Text>
        <Text>📝 {place.note || 'Chưa có ghi chú'}</Text>
      </View>
      <TouchableOpacity onPress={onEditTime}>
        <Text style={styles.edit}>✏️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontWeight: 'bold' },
  edit: { fontSize: 18, color: '#007AFF' },
});
