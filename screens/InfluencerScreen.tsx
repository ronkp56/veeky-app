/**
 * ./screens/InfluencerScreen.tsx
 *
 * This screen shows an influencer’s profile and all the trips/videos
 * they have posted on Veeky.
 *
 * Responsibilities:
 * --------------------------------------------------------------------
 * ✔ Display influencer avatar, name, verification checkmark
 * ✔ Count and display number of videos from that influencer
 * ✔ Show a 3-column grid of their videos (TikTok profile-style)
 * ✔ Show thumbnails (generated from location via getThumbnailForLocation)
 * ✔ Navigate back to HomeFeed and auto-scroll to the selected video
 *
 * Navigation Flow:
 * --------------------------------------------------------------------
 * When the user taps a video:
 *   → We reset the navigation stack
 *   → Go to MainTabs → Home tab
 *   → Pass { videoId } so HomeFeed jumps directly to the video
 *
 * Data Source:
 * --------------------------------------------------------------------
 * Uses MOCK_DATA from VideoFeed. In the real app this will fetch from API.
 *
 * Layout:
 * --------------------------------------------------------------------
 * Top section = influencer header  
 * Below = grid of video thumbnails  
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

import { MOCK_DATA } from '../components/VideoFeed';
import { getThumbnailForLocation } from '../utils/thumbnails';

import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');
// Fit 3 thumbnails per row with 1px spacing
const itemWidth = (width - 4) / 3;

type Props = NativeStackScreenProps<RootStackParamList, 'Influencer'>;

export default function InfluencerScreen({ route, navigation }: Props) {
  const { influencerId } = route.params;

  /**
   * Filter all videos belonging to this influencer
   */
  const influencerVideos = MOCK_DATA.filter(
    (v) => v.influencer.id === influencerId
  );

  const influencer = influencerVideos[0]?.influencer;

  // If somehow no videos/influencer found → return nothing
  if (!influencer) return null;

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------------------
          HEADER: Back button, avatar, name, videos count
         ------------------------------------------------------------ */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.avatar}>{influencer.avatar}</Text>
          <Text style={styles.name}>
            {influencer.name} {influencer.verified && '✓'}
          </Text>
          <Text style={styles.stats}>{influencerVideos.length} סרטונים</Text>
        </View>
      </View>

      {/* ------------------------------------------------------------
          GRID OF VIDEOS
          Each item:
            • Thumbnail
            • Category label (Trips / Lodging / Entertainment)
            • Title + Price
         ------------------------------------------------------------ */}
      <FlatList
        data={influencerVideos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoCard}
            onPress={() => {
              // Reset navigation and open Home tab with specific videoId
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'MainTabs',
                      params: {
                        screen: 'Home',
                        params: { videoId: item.id },
                      },
                    },
                  ],
                })
              );
            }}
          >
            {/* Thumbnail */}
            <View style={styles.thumbnail}>
              <Image
                source={{ uri: getThumbnailForLocation(item.location) }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />

              {/* Category badge */}
              <View style={styles.overlay}>
                <Text style={styles.thumbnailCategory}>{item.category}</Text>
              </View>
            </View>

            {/* Title (2 lines max) */}
            <Text style={styles.videoTitle} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Price */}
            <Text style={styles.videoPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* --------------------------------------------------------------------
   STYLES
-------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  /* Header */
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 28,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  avatar: {
    fontSize: 64,
    marginBottom: 12,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  stats: {
    color: '#888',
    fontSize: 14,
  },

  /* Video grid items */
  videoCard: {
    width: itemWidth,
    padding: 1,
  },

  thumbnail: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  thumbnailCategory: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },

  videoTitle: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 2,
  },
  videoPrice: {
    color: '#00D5FF',
    fontSize: 12,
    fontWeight: '600',
  },
});
