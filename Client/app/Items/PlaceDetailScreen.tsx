import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Linking from 'expo-linking';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

type Place = {
  place_id: string;
  name_places: string;
  description_places: string;
  address_places: string;
  open_time_places: string;
  close_time_places: string;
  ticket_price_places: number;
  phone_number_places: string;
  image_url_places: string;
  rating_places: number;
  latitude_places: number;
  longitude_places: number;
  group_type: string;
};

type Review = {
  review_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
};

export default function PlaceDetailScreen() {
  const { place_id } = useLocalSearchParams();
  const { user } = useAuth();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [menu, setMenu] = useState<any[]>([
    { name: 'Cà phê sữa đá', price: 25000 },
    { name: 'Trà đào cam sả', price: 35000 },
    { name: 'Bánh mì ốp la', price: 30000 },
  ]);
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`http://192.168.1.6:8080/api/places/${place_id}`);
        setPlace(res.data);
      } catch (err) {
        console.log('❌ Lỗi load place:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [place_id]);

  useFocusEffect(
    useCallback(() => {
      const fetchReviews = async () => {
        try {
          const res = await axios.get(`http://192.168.1.6:8080/api/reviews/${place_id}`);
          setReviews(res.data);
        } catch (err) {
          console.log('❌ Lỗi load reviews:', err);
        }
      };
      fetchReviews();
    }, [place_id])
  );

  const handleDirections = () => {
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${place?.latitude_places},${place?.longitude_places}`
        : `https://www.google.com/maps/dir/?api=1&destination=${place?.latitude_places},${place?.longitude_places}`;
    Linking.openURL(url);
  };

  const submitReview = async () => {
    if (selectedRating === 0 || comment.trim() === '') {
      Alert.alert('❌', 'Vui lòng chọn sao và nhập bình luận');
      return;
    }

    if (!user) {
      Alert.alert('❌', 'Bạn cần đăng nhập để viết đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://192.168.1.6:8080/api/reviews', {
        place_id,
        user_id: user.user_id,
        username: user.username,
        rating: selectedRating,
        comment,
      });
      Alert.alert('✅', 'Đã gửi đánh giá');
      setSelectedRating(0);
      setComment('');
      const res = await axios.get(`http://192.168.1.6:8080/api/reviews/${place_id}`);
      setReviews(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('❌', 'Không gửi được đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!place) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Không tìm thấy địa điểm.</Text>;
  }

  const isRestaurantOrCafe =
    place.group_type?.toLowerCase() === 'nhà hàng' || place.group_type?.toLowerCase() === 'quán nước';

  return (
    <>
      <ScrollView style={styles.container}>
        <Image source={{ uri: place.image_url_places }} style={styles.image} />

        <View style={styles.contentBox}>
          <Text style={styles.title}>{place.name_places}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.infoText}>{place.address_places}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#555" />
            <Text style={styles.infoText}>{place.phone_number_places || 'Chưa cập nhật'}</Text>
          </View>

          <Text style={styles.description}>{place.description_places}</Text>

          <Text style={styles.priceText}>
            Giá: {place.ticket_price_places ? `${place.ticket_price_places.toLocaleString()} VNĐ` : 'Chưa cập nhật'}
          </Text>

          {isRestaurantOrCafe && (
            <>
              <TouchableOpacity
                style={styles.menuHeader}
                onPress={() => setMenuExpanded(!menuExpanded)}
              >
                <Text style={styles.sectionTitle}>Menu</Text>
                <Ionicons
                  name={menuExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

              {menuExpanded && (
                menu.length === 0 ? (
                  <Text style={{ color: '#666' }}>Chưa có menu</Text>
                ) : (
                  menu.map((item, index) => (
                    <View key={index} style={styles.menuItem}>
                      <View>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemPrice}>{item.price.toLocaleString()} VNĐ</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => Alert.alert('🛒', `Đã thêm ${item.name} vào giỏ hàng`)}
                        style={styles.addButton}
                      >
                        <Ionicons name="add" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))
                )
              )}
            </>
          )}

          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: place.latitude_places,
              longitude: place.longitude_places,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: place.latitude_places,
                longitude: place.longitude_places,
              }}
              title={place.name_places}
              description={place.address_places}
            />
          </MapView>

          <TouchableOpacity style={styles.directionButton} onPress={handleDirections}>
            <Text style={styles.directionButtonText}>Chỉ đường</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Viết đánh giá của bạn</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                <Ionicons
                  name={star <= selectedRating ? 'star' : 'star-outline'}
                  size={32}
                  color="#FFD700"
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Nhập bình luận..."
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={submitReview} disabled={submitting}>
            <Text style={styles.submitButtonText}>{submitting ? 'Đang gửi...' : 'Gửi đánh giá'}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Bình luận</Text>
          {reviews.length === 0 ? (
            <Text style={{ color: '#666' }}>Chưa có bình luận</Text>
          ) : (
            reviews.map((r) => (
              <View key={r.review_id} style={styles.reviewItem}>
                <Text style={styles.reviewUser}>{r.username}</Text>
                <Text style={styles.reviewRating}>Đánh giá: {r.rating}/5</Text>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  image: { width, height: 220 },
  contentBox: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 12, color: '#222' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  infoText: { marginLeft: 8, fontSize: 15, color: '#444', flexShrink: 1 },
  description: { fontSize: 16, color: '#555', marginTop: 12, lineHeight: 22 },
  priceText: { fontSize: 16, color: '#FF3B30', marginTop: 8, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333' },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  menuItemName: { fontSize: 16, color: '#222' },
  menuItemPrice: { fontSize: 16, color: '#FF9500' },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 6,
    borderRadius: 20,
  },
  map: { width: '100%', height: 200, borderRadius: 12, marginTop: 12 },
  directionButton: {
    backgroundColor: '#34A853',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  directionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewUser: { fontWeight: 'bold', marginBottom: 4, fontSize: 15 },
  reviewRating: { fontSize: 14, color: '#444' },
  reviewComment: { fontSize: 14, color: '#555', marginTop: 4 },
});
