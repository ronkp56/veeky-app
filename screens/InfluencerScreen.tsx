import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MOCK_DATA } from '../components/VideoFeed';
import { getThumbnailForLocation } from '../utils/thumbnails';

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
            onPress={() => navigation.navigate('MainTabs', { videoId: item.id })}
          >
            <View style={styles.thumbnail}>
              <Text style={styles.thumbnailEmoji}>{getThumbnailForLocation(item.location)}</Text>
              <Text style={styles.thumbnailCategory}>{item.category}</Text>
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
  thumbnail: { width: '100%', aspectRatio: 9 / 16, backgroundColor: '#1a1a1a', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  thumbnailEmoji: { fontSize: 40, marginBottom: 8 },
  thumbnailCategory: { color: '#888', fontSize: 10 },
  videoTitle: { color: '#fff', fontSize: 11, marginBottom: 2 },
  videoPrice: { color: '#00D5FF', fontSize: 12, fontWeight: '600' },
});
