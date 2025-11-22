import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MOCK_DATA } from '../components/VideoFeed';
import { getThumbnailForLocation } from '../utils/thumbnails';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 4) / 3;

type Props = NativeStackScreenProps<RootStackParamList, 'Influencer'>;

export default function InfluencerScreen({ route, navigation }: Props) {
  const { influencerId } = route.params;
  const influencerVideos = MOCK_DATA.filter(v => v.influencer.id === influencerId);
  const influencer = influencerVideos[0]?.influencer;

  if (!influencer) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.avatar}>{influencer.avatar}</Text>
          <Text style={styles.name}>{influencer.name} {influencer.verified && '✓'}</Text>
          <Text style={styles.stats}>{influencerVideos.length} סרטונים</Text>
        </View>
      </View>

      <FlatList
        data={influencerVideos}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingTop: 60, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#222' },
  backBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  backText: { color: '#fff', fontSize: 28 },
  profileInfo: { alignItems: 'center', marginTop: 16 },
  avatar: { fontSize: 64, marginBottom: 12 },
  name: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  stats: { color: '#888', fontSize: 14 },
  videoCard: { width: itemWidth, padding: 1 },
  thumbnail: { width: '100%', aspectRatio: 9 / 16, backgroundColor: '#1a1a1a', borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  thumbnailImage: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  thumbnailCategory: { color: '#fff', fontSize: 9, fontWeight: '600' },
  videoTitle: { color: '#fff', fontSize: 11, marginBottom: 2 },
  videoPrice: { color: '#00D5FF', fontSize: 12, fontWeight: '600' },
});
