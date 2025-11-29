/**
 * LikedScreen.tsx
 *
 * This screen shows all videos the user has "liked" (hearted).
 *
 * Responsibilities:
 * --------------------------------------------------------------------
 * ✔ Read liked video IDs from the storage helper
 * ✔ Filter MOCK_DATA to get full video objects for those IDs
 * ✔ Display a 3-column grid of liked trips (similar to InfluencerScreen)
 * ✔ Navigate back to the Home feed and auto-scroll to a selected video
 * ✔ Show an empty state when there are no liked videos
 *
 * Data flow:
 * --------------------------------------------------------------------
 * - On focus (useFocusEffect): load liked video IDs via storage.getLikedVideos()
 * - Compute likedVideos by filtering MOCK_DATA
 * - Tapping a card:
 *      → Reset navigation stack
 *      → Go to MainTabs → Home tab
 *      → Pass { videoId } so the feed jumps to that video
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';

import { MOCK_DATA } from '../components/VideoFeed';
import { storage } from '../utils/storage';
import { getThumbnailForLocation } from '../utils/thumbnails';

const { width } = Dimensions.get('window');
const itemWidth = (width - 4) / 3;

export default function LikedScreen() {
  const navigation = useNavigation();

  // All liked video IDs (strings), synced from storage
  const [likedIds, setLikedIds] = useState<string[]>([]);

  /**
   * When the screen comes into focus:
   * - Pull the latest liked video IDs from storage
   * - This ensures the list is always up to date when user returns
   */
  useFocusEffect(
    useCallback(() => {
      setLikedIds(storage.getLikedVideos());
    }, [])
  );

  /**
   * Derive full video objects from the global MOCK_DATA list
   * based on which IDs are liked.
   */
  const likedVideos = MOCK_DATA.filter((v) => likedIds.includes(v.id));

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------------------
          HEADER: back arrow, title, count
         ------------------------------------------------------------ */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>אהבתי</Text>
          <Text style={styles.count}>{likedVideos.length} סרטונים</Text>
        </View>
      </View>

      {/* ------------------------------------------------------------
          BODY: empty state vs grid of liked videos
         ------------------------------------------------------------ */}
      {likedVideos.length === 0 ? (
        // Empty state when user hasn’t liked anything yet
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyText}>אין סרטונים שאהבת</Text>
          <Text style={styles.emptySubtext}>
            לחץ על לייק כדי לראות כאן
          </Text>
        </View>
      ) : (
        // Grid of liked videos
        <FlatList
          data={likedVideos}
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
                <View style={styles.overlay}>
                  <Text style={styles.thumbnailCategory}>
                    {item.category}
                  </Text>
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
      )}
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  count: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },

  /* Empty state */
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },

  /* Grid items */
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
