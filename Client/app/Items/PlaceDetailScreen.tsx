import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity,
  ActivityIndicator, TextInput, Platform, Alert, Animated,
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
  rating_count: number;
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
  const cartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`http://192.168.1.7:8080/api/places/${place_id}`);
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
          const res = await axios.get(`http://192.168.1.7:8080/api/reviews/${place_id}`);
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

  const animateCart = () => {
    Animated.sequence([
      Animated.timing(cartAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(cartAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addToCart = async () => {
    if (!user) {
      Alert.alert('❌', 'Bạn cần đăng nhập để thêm vào giỏ hàng');
      return;
    }
    try {
      await axios.post(`http://192.168.1.7:8080/api/cart/${user.userId}/add`, {
        placeId: place?.place_id,
        name: place?.name_places,
        price: place?.ticket_price_places ?? 0,
      });
      Alert.alert('✅', 'Đã thêm vào giỏ hàng');
      animateCart();
    } catch (err) {
      console.log(err);
      Alert.alert('❌', 'Thêm vào giỏ hàng thất bại');
    }
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
      await axios.post('http://192.168.1.7:8080/api/reviews', {
        place_id,
        user_id: user.userId,
        username: user.username,
        rating: selectedRating,
        comment,
      });
      Alert.alert('✅', 'Đã gửi đánh giá');
      setSelectedRating(0);
      setComment('');
      const res = await axios.get(`http://192.168.1.7:8080/api/reviews/${place_id}`);
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

  const averageRating = place.rating_places?.toFixed(1) ?? '0.0';

  return (
    <>
      <ScrollView style={styles.container}>
        <Image source={{ uri: place.image_url_places }} style={styles.image} />

        <View style={styles.contentBox}>
          <Text style={styles.title}>{place.name_places}</Text>

          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 8 }}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.infoText}>{place.address_places}</Text>
          </View>

          {/* ⭐ Giờ mở cửa */}
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#555" />
            <Text style={styles.infoText}>
              Giờ mở cửa: {place.open_time_places ?? 'Chưa cập nhật'} - {place.close_time_places ?? 'Chưa cập nhật'}
            </Text>
          </View>

          <Text style={styles.priceText}>
            Giá: {place.ticket_price_places ? `${place.ticket_price_places.toLocaleString()} VNĐ` : 'Chưa cập nhật'}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={{ fontSize: 16, fontWeight: '500', marginLeft: 4 }}>
              {averageRating}/5 ({place.rating_count} đánh giá)
            </Text>
          </View>

          {/* ⭐ Map */}
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

          {/* ⭐ Review */}
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

      {/* ⭐ Icon giỏ hàng góc dưới ➔ tự thêm vào giỏ */}
      <Animated.View style={[styles.cartButton, { transform: [{ scale: cartAnim }] }]}>
        <TouchableOpacity onPress={addToCart}>
          <Ionicons name="cart-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  image: { width, height: 220 },
  contentBox: { backgroundColor: '#fff', margin: 12, padding: 16, borderRadius: 12 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 12, color: '#222' },
  addToCartButton: {
    flexDirection: 'row', backgroundColor: '#000', padding: 12, borderRadius: 8, marginTop: 16, alignItems: 'center', justifyContent: 'center',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  infoText: { marginLeft: 8, fontSize: 15, color: '#444', flexShrink: 1 },
  priceText: { fontSize: 16, color: '#FF3B30', marginTop: 8, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginTop: 12 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  commentInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, textAlignVertical: 'top', marginBottom: 12 },
  submitButton: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  reviewItem: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 8 },
  reviewUser: { fontWeight: 'bold', marginBottom: 4, fontSize: 15 },
  reviewRating: { fontSize: 14, color: '#444' },
  reviewComment: { fontSize: 14, color: '#555', marginTop: 4 },
  map: { width: '100%', height: 200, borderRadius: 12, marginTop: 12 },
  directionButton: { backgroundColor: '#34A853', paddingVertical: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  directionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cartButton: { position: 'absolute', bottom: 20, left: 20, backgroundColor: '#000', borderRadius: 30, padding: 12 },
});
