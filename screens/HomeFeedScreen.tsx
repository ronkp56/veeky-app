import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import VideoFeed from '../components/VideoFeed';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export default function HomeFeedScreen({ navigation: _navigation, route }: Props) {
  // ✅ underscore silences unused var
  const [selectedFilter, setSelectedFilter] = useState<
    'All' | 'Trips' | 'Lodging' | 'Entertainment'
  >('All');
  const videoId = route?.params?.videoId;

  const filters = [
    { key: 'search', icon: 'search-outline', label: '' },
    { key: 'All', label: 'All' },
    { key: 'Trips', label: 'Trips' },
    { key: 'Lodging', label: 'Lodging' },
    { key: 'Entertainment', label: 'Entertainment' },
    { key: 'location', icon: 'location-outline', label: '' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterItem, selectedFilter === f.key && styles.filterItemActive]}
            onPress={() => {
              if (f.key === 'search') {
                console.log('Open search popup');
              } else if (f.key === 'location') {
                console.log('Open nearby popup');
              } else {
                setSelectedFilter(f.key as 'All' | 'Trips' | 'Lodging' | 'Entertainment'); // ✅ no `any`
              }
            }}
          >
            {f.icon ? (
              <Ionicons
                name={f.icon as keyof typeof Ionicons.glyphMap} // ✅ no `any`
                size={22}
                color={selectedFilter === f.key ? '#fff' : '#999'}
              />
            ) : (
              <Text
                style={[styles.filterText, selectedFilter === f.key && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <VideoFeed filter={selectedFilter} initialVideoId={videoId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  filterBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
