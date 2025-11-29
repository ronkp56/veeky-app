import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VideoFeed from '../components/VideoFeed';

type FilterType = 'All' | 'Trips' | 'Lodging' | 'Entertainment';

// Dynamic web feed (only loaded on web)
let WebVideoFeed: React.ComponentType<{ filter?: FilterType }> | null = null;

if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WebVideoFeed = require('../components/WebVideoFeed').default;
}

type FilterItem = {
  key: string;
  label: string;
  icon?: string;
};

export default function HomeFeedScreen({ route }: any) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const videoId = route?.params?.videoId;

  const filters: FilterItem[] = [
    { key: 'search', icon: 'search-outline', label: '' },
    { key: 'All', label: 'All' },
    { key: 'Trips', label: 'Trips' },
    { key: 'Lodging', label: 'Lodging' },
    { key: 'Entertainment', label: 'Entertainment' },
    { key: 'location', icon: 'location-outline', label: '' },
  ];

  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.container}>
      {/* Top filter bar */}
      <View style={styles.filterBar}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterItem,
              selectedFilter === f.key && styles.filterItemActive,
            ]}
            onPress={() => {
              if (
                f.key === 'All' ||
                f.key === 'Trips' ||
                f.key === 'Lodging' ||
                f.key === 'Entertainment'
              ) {
                setSelectedFilter(f.key);
              }
            }}
          >
            {f.icon ? (
              <Ionicons name={f.icon as any} size={22} color="#fff" />
            ) : (
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === f.key && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Main feed: native vs web */}
      <View style={{ flex: 1 }}>
        {isWeb && WebVideoFeed ? (
          <WebVideoFeed filter={selectedFilter} />
        ) : (
          <VideoFeed filter={selectedFilter} initialVideoId={videoId} />
        )}
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#000',
  },
  filterItem: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  filterText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
});
