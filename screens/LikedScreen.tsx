import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { MOCK_DATA } from '../components/VideoFeed';
import { storage } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { getThumbnailForLocation } from '../utils/thumbnails';

const { width } = Dimensions.get('window');
const itemWidth = (width - 4) / 3;

export default function LikedScreen() {
  const navigation = useNavigation();
  const [likedIds, setLikedIds] = useState<string[]>([]);
  
  useFocusEffect(
    useCallback(() => {
      setLikedIds(storage.getLikedVideos());
    }, [])
  );
  
  const likedVideos = MOCK_DATA.filter(v => likedIds.includes(v.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>אהבתי</Text>
          <Text style={styles.count}>{likedVideos.length} סרטונים</Text>
        </View>
      </View>
      
      {likedVideos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyText}>אין סרטונים שאהבת</Text>
          <Text style={styles.emptySubtext}>לחץ על לייק כדי לראות כאן</Text>
        </View>
      ) : (
        <FlatList
          data={likedVideos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.videoCard}
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs', params: { screen: 'Home', params: { videoId: item.id } } }],
                  })
                );
              }}
            >
              <View style={styles.thumbnail}>
                <Image 
                  source={{ uri: getThumbnailForLocation(item.location) }} 
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
                <View style={styles.overlay}>
                  <Text style={styles.thumbnailCategory}>{item.category}</Text>
                </View>
              </View>
              <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.videoPrice}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#222', gap: 12 },
  backBtn: { padding: 4 },
  headerText: { flex: 1 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  count: { color: '#888', fontSize: 14, marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtext: { color: '#888', fontSize: 14, textAlign: 'center' },
  videoCard: { width: itemWidth, padding: 1 },
  thumbnail: { width: '100%', aspectRatio: 9 / 16, backgroundColor: '#1a1a1a', borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  thumbnailImage: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  thumbnailCategory: { color: '#fff', fontSize: 9, fontWeight: '600' },
  videoTitle: { color: '#fff', fontSize: 11, marginBottom: 2 },
  videoPrice: { color: '#00D5FF', fontSize: 12, fontWeight: '600' },
});
