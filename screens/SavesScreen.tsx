/**
 * SavesScreen.tsx
 *
 * This screen displays all videos the user has saved (bookmarked).
 *
 * Responsibilities:
 * --------------------------------------------------------------------
 * ✔ Load saved video IDs from the storage helper
 * ✔ Filter MOCK_DATA to show only the saved videos
 * ✔ Display them in a 3-column visual grid (like TikTok profile)
 * ✔ Navigate to a saved video inside the Home feed:
 *      → Reset stack → MainTabs → Home(videoId)
 * ✔ Show an empty state when no saved videos exist
 *
 * UX behavior:
 * --------------------------------------------------------------------
 * - useFocusEffect() ensures screen updates whenever it's re-opened
 * - Thumbnail images are generated via getThumbnailForLocation()
 * - Grid items show: thumbnail, category label, title (2 lines), price
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
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';

import { MOCK_DATA } from '../components/VideoFeed';
import { storage } from '../utils/storage';
import { getThumbnailForLocation } from '../utils/thumbnails';

const { width } = Dimensions.get('window');
const itemWidth = (width - 4) / 3;

export default function SavesScreen() {
  const navigation = useNavigation();

  // Stores the list of video IDs the user saved
  const [savedIds, setSavedIds] = useState<string[]>([]);

  /**
   * Refresh saved videos list every time user enters this screen.
   * This ensures the list is always fresh after liking/unliking inside feed.
   */
  useFocusEffect(
    useCallback(() => {
      setSavedIds(storage.getSavedVideos());
    }, [])
  );

  /** Full video objects for the saved IDs */
  const savedVideos = MOCK_DATA.filter((v) => savedIds.includes(v.id));

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------------------
          HEADER: back button + title + video count
         ------------------------------------------------------------ */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>שמורים</Text>
          <Text style={styles.count}>{savedVideos.length} סרטונים</Text>
        </View>
      </View>

      {/* ------------------------------------------------------------
          EMPTY STATE
         ------------------------------------------------------------ */}
      {savedVideos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyText}>אין סרטונים שמורים</Text>
          <Text style={styles.emptySubtext}>
            שמור חופשות שאהבת כדי לראות אותן כאן
          </Text>
        </View>
      ) : (
        /* ------------------------------------------------------------
            GRID OF SAVED VIDEOS
           ------------------------------------------------------------ */
        <FlatList
          data={savedVideos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.videoCard}
              onPress={() => {
                // Reset navigation and open the Home tab with this video preselected
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

              {/* Title */}
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

  /* Header layout */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerText: { flex: 1 },
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

  /* Empty state visuals */
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
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

  /* Category badge on thumbnail */
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

  /* Title + price */
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
