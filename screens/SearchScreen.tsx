// screens/SearchScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MOCK_DATA, VideoData } from '../components/VideoFeed';
import { getThumbnailForLocation } from '../utils/thumbnails';
import { RootStackParamList } from '../navigation/RootNavigator';

export type SearchMode = 'all' | 'tags' | 'location' | 'influencer' | 'title';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const { width } = Dimensions.get('window');
const itemWidth = (width - 4) / 3;

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function matchIncludes(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalize(haystack).includes(normalize(needle));
}

function videoMatchesMode(video: VideoData, q: string, mode: SearchMode): boolean {
  const query = normalize(q);
  if (!query) return true;

  const title = normalize(video.title);
  const location = normalize(video.location);
  const influencer = normalize(video.influencer.name);
  const tags = (video.tags ?? []).map(normalize);

  switch (mode) {
    case 'tags':
      return tags.some((t) => t.includes(query));
    case 'location':
      return location.includes(query);
    case 'influencer':
      return influencer.includes(query);
    case 'title':
      return title.includes(query);
    case 'all':
    default:
      return (
        title.includes(query) ||
        location.includes(query) ||
        influencer.includes(query) ||
        tags.some((t) => t.includes(query))
      );
  }
}

export default function SearchScreen({ route }: Props) {
  const navigation = useNavigation();

  const initialQuery = route.params?.query ?? '';
  const initialMode = (route.params?.mode ?? 'all') as SearchMode;

  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>(initialMode);

  const results = useMemo(() => {
    return MOCK_DATA.filter((v) => videoMatchesMode(v, query, mode));
  }, [query, mode]);

  const modeItems: { key: SearchMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'all', label: 'הכל', icon: 'apps-outline' },
    { key: 'tags', label: 'תגיות', icon: 'pricetags-outline' },
    { key: 'location', label: 'מקום', icon: 'location-outline' },
    { key: 'influencer', label: 'יוצר', icon: 'person-outline' },
    { key: 'title', label: 'שם', icon: 'text-outline' },
  ];

    const openVideoInFeed = (videoId: string) => {
        navigation.dispatch(
            CommonActions.reset({
            index: 0,
            routes: [
                {
                name: 'MainTabs',
                state: {
                    index: 0,
                    routes: [
                    {
                        name: 'Home',
                        params: { videoId },
                    },
                    ],
                },
                },
            ],
            })
        );
    };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#888" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="חפש לפי תגית, מקום, יוצר, שם..."
            placeholderTextColor="#666"
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mode chips */}
      <View style={styles.modes}>
        {modeItems.map((m) => {
          const active = mode === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMode(m.key)}
              style={[styles.modeChip, active && styles.modeChipActive]}
              activeOpacity={0.9}
            >
              <Ionicons name={m.icon} size={16} color={active ? '#000' : '#fff'} />
              <Text style={[styles.modeText, active && styles.modeTextActive]}>{m.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results summary */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {query ? `נמצאו ${results.length} תוצאות` : `הקלד כדי לחפש (${MOCK_DATA.length} סרטונים)`}
        </Text>
        <Text style={styles.summaryHint}>
          מצב: {mode === 'all' ? 'הכל' : mode === 'tags' ? 'תגיות' : mode === 'location' ? 'מקום' : mode === 'influencer' ? 'יוצר' : 'שם'}
        </Text>
      </View>

      {/* Grid results */}
      <FlatList
        data={results}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoCard}
            onPress={() => openVideoInFeed(item.id)}
            activeOpacity={0.85}
          >
            <View style={styles.thumbnail}>
              <Image
                source={{ uri: getThumbnailForLocation(item.location) }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              <View style={styles.overlay}>
                <Text style={styles.badge}>{item.category}</Text>
              </View>
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item.influencer.name} • {item.location}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyTitle}>אין תוצאות</Text>
            <Text style={styles.emptySub}>נסה לשנות מצב חיפוש או מילת חיפוש</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 10,
  },
  backBtn: { padding: 6 },

  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2B31',
    backgroundColor: '#141416',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  clearBtn: { padding: 2 },

  modes: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#2A2B31',
    backgroundColor: '#0B0B0C',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  modeChipActive: {
    backgroundColor: '#00D5FF',
    borderColor: '#00D5FF',
  },
  modeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  modeTextActive: { color: '#000' },

  summaryRow: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  summaryText: { color: '#bbb', fontSize: 13, fontWeight: '600' },
  summaryHint: { color: '#666', fontSize: 12, marginTop: 4 },

  videoCard: { width: itemWidth, padding: 1 },
  thumbnail: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  thumbnailImage: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badge: { color: '#fff', fontSize: 9, fontWeight: '700' },

  title: { color: '#fff', fontSize: 11, marginBottom: 2 },
  meta: { color: '#777', fontSize: 10 },

  empty: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: { fontSize: 64, marginBottom: 10 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  emptySub: { color: '#888', fontSize: 13, textAlign: 'center' },
});
