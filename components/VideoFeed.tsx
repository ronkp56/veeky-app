/**
 * ./components/VideoFeed.tsx
 *
 * This component renders the TikTok-style vertical video feed of Veeky.
 * It is responsible for:
 * -----------------------------------------------------------------------
 * • Rendering a full-screen FlatList where each item is a single video.
 * • Enabling vertical swipe navigation between videos (1 video per page).
 * • Tracking which video is currently visible (activeIndex).
 * • Passing `isActive` to VideoItem so it knows whether to play/pause video.
 * • Supporting category filtering (Trips / Lodging / Entertainment).
 * • Supporting jump-to-video navigation (initialVideoId).
 *
 * Architecture Notes:
 * -----------------------------------------------------------------------
 * 1. FlatList paging is achieved using:
 *      - pagingEnabled
 *      - snapToInterval = screen height
 *      - decelerationRate = "fast"
 * 2. activeIndex is computed based on scroll position to know which
 *    video should autoplay and which should pause.
 * 3. initialVideoId allows navigation from outside the feed
 *    (e.g., opening a specific video from search/profile).
 * 4. MOCK_DATA is currently used as local demo data (MVP).
 *    In the future this will be replaced with backend API calls.
 *
 * This file is one of the most critical in Veeky’s architecture since
 * it defines the TikTok-style vertical video experience.
 */

import React, {
  useMemo,
  useRef,
  useEffect,
  useState
} from 'react';
import {
  FlatList,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import VideoItem from './VideoItem';
import { videoService } from '../services/videoService';
import { Video } from '../types/database';

type VideoFeedProps = {
  filter?: 'All' | 'Trips' | 'Lodging' | 'Entertainment';
  initialVideoId?: string; // Video to auto-scroll to (for deep links or navigation)
  feedActive?: boolean;    // NEW: false when user leaves Home tab
  onRefresh?: () => void;
  refreshing?: boolean;
};

/**
 * Type definition for a single video object.
 * Matches the structure used across the feed UI.
 */
export type VideoData = Video;

// Keep MOCK_DATA as fallback
export const MOCK_DATA: VideoData[] = [
  {
    id: '1',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    category: 'Trips',
    influencer: { id: 'yonatan', name: 'יונתן רוט', avatar: '👨', verified: true },
    title: 'חופשה מדהימה ביוון 🇬🇷',
    location: 'Santorini, Greece',
    price: '₪3,500',
    days: 7,
    itinerary: [
      { day: 1, activities: [{ time: '11:00', activity: 'טיסה לסנטוריני' }, { time: '14:00', activity: 'צ׳ק-אין במלון' }, { time: '17:00', activity: 'סיור בעיר פירה' }] },
      { day: 2, activities: [{ time: '09:00', activity: 'שייט לוולקן' }, { time: '13:00', activity: 'מעיינות חמים' }, { time: '19:00', activity: 'שקיעה באויה' }] },
      { day: 3, activities: [{ time: '10:00', activity: 'חוף קמארי' }, { time: '15:00', activity: 'טעימות יין' }, { time: '20:00', activity: 'ארוחת ערב רומנטית' }] },
      { day: 4, isFree: true, activities: [{ time: '', activity: 'יום חופשי' }] },
      { day: 5, activities: [{ time: '09:00', activity: 'סיור באקרוטירי' }, { time: '14:00', activity: 'חוף אדום' }, { time: '18:00', activity: 'קניות' }] },
      { day: 6, activities: [{ time: '08:00', activity: 'שייט לאיים הסמוכים' }, { time: '13:00', activity: 'צלילה' }] },
      { day: 7, activities: [{ time: '10:00', activity: 'ארוחת בוקר אחרונה' }, { time: '15:00', activity: 'טיסה חזרה' }] },
    ],
    likes: 12500,
    comments: 340,
    shares: 89,
    tags: ['יוון', 'זוגות', 'חופשת קיץ', 'ים', 'מלון בוטיק'],
  },
  {
    id: '2', 
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
    category: 'Lodging',
    influencer: { id: 'amitai', name: 'אמיתי חצאל', avatar: '👨', verified: true },
    title: 'מלון יוקרה בדובאי ✨',
    location: 'Dubai, UAE',
    price: '₪8,900',
    days: 5,
    itinerary: [
      { day: 1, activities: [{ time: '10:00', activity: 'טיסה לדובאי' }, { time: '14:00', activity: 'צ׳ק-אין במלון בורג׳ אל ערב' }, { time: '20:00', activity: 'ארוחת ערב במסעדת אל מונתהא' }] },
      { day: 2, activities: [{ time: '09:00', activity: 'ביקור בבורג׳ חליפה' }, { time: '14:00', activity: 'קניות בדובאי מול' }, { time: '19:00', activity: 'מזרקות דובאי' }] },
      { day: 3, activities: [{ time: '15:00', activity: 'ספארי במדבר' }, { time: '17:00', activity: 'רכיבה על גמלים' }, { time: '20:00', activity: 'ארוחת ערב בדואית' }] },
      { day: 4, activities: [{ time: '10:00', activity: 'יום ספא במלון' }, { time: '14:00', activity: 'חוף פרטי' }, { time: '18:00', activity: 'שייט ביאכטה' }] },
      { day: 5, activities: [{ time: '11:00', activity: 'ארוחת בוקר מאוחרת' }, { time: '13:00', activity: 'קניות אחרונות' }, { time: '16:00', activity: 'טיסה חזרה' }] },
    ],
    likes: 23400,
    comments: 567,
    shares: 234,
    tags: ['דובאי', 'זוגות', 'חופשת קיץ', 'ים', 'מלון יוקרה'],
  },
  {
    id: '3', 
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
    category: 'Entertainment',
    influencer: { id: 'amir', name: 'אמיר אבניאל', avatar: '👩', verified: true },
    title: 'פארק שעשועים בברצלונה 🎢',
    location: 'Barcelona, Spain',
    price: '₪2,200',
    days: 4,
    itinerary: [
      { day: 1, activities: [{ time: '12:00', activity: 'טיסה לברצלונה' }, { time: '15:00', activity: 'צ׳ק-אין' }, { time: '18:00', activity: 'סיור ברמבלס' }] },
      { day: 2, activities: [{ time: '09:00', activity: 'פארק גואל' }, { time: '13:00', activity: 'סגרדה פמיליה' }, { time: '17:00', activity: 'חוף ברצלונטה' }] },
      { day: 3, activities: [{ time: '10:00', activity: 'פורט אוונטורה - פארק שעשועים' }, { time: '20:00', activity: 'מופעי ערב' }] },
      { day: 4, activities: [{ time: '10:00', activity: 'קניות' }, { time: '12:00', activity: 'ארוחת בוקר מאוחרת' }, { time: '15:00', activity: 'טיסה חזרה' }] },
    ],
    likes: 8900,
    comments: 156,
    shares: 45,
    tags: ['ברצלונה', 'זוגות', 'חופשת קיץ', 'פארק'],
  },
  {
    id: '4', 
    uri: 'https://res.cloudinary.com/dmxzi7dvx/video/upload/v1755583223/zwbbwckjrgjcrih4iuxj.mp4', 
    category: 'Trips',
    influencer: { id: 'yonatan', name: 'יונתן רוט', avatar: '👨', verified: true },
    title: 'טיול בהרי האלפים 🏔️',
    location: 'Swiss Alps',
    price: '₪5,600',
    days: 10,
    itinerary: [
      { day: 1, activities: [{ time: '10:00', activity: 'טיסה לציריך' }, { time: '14:00', activity: 'נסיעה לאינטרלקן' }, { time: '17:00', activity: 'צ׳ק-אין' }] },
      { day: 2, activities: [{ time: '08:00', activity: 'רכבל ליונגפראו' }, { time: '11:00', activity: 'ארמון הקרח' }, { time: '15:00', activity: 'נוף פנורמי' }] },
      { day: 3, activities: [{ time: '09:00', activity: 'טיול רגלי באגם בריינץ' }, { time: '14:00', activity: 'שייט באגם' }] },
      { day: 4, isFree: true, activities: [{ time: '', activity: 'יום חופשי' }] },
      { day: 5, activities: [{ time: '08:00', activity: 'סקי בגרינדלוולד' }, { time: '13:00', activity: 'שיעור סקי' }] },
      { day: 6, activities: [{ time: '10:00', activity: 'ביקור בלוצרן' }, { time: '13:00', activity: 'גשר הקפלה' }, { time: '16:00', activity: 'אריה לוצרן' }] },
      { day: 7, isFree: true, activities: [{ time: '', activity: 'יום חופשי' }] },
      { day: 8, activities: [{ time: '07:00', activity: 'רכבל למאטרהורן' }, { time: '12:00', activity: 'צילומים' }] },
      { day: 9, activities: [{ time: '14:00', activity: 'קניות שוקולד שוויצרי' }, { time: '19:00', activity: 'ארוחת פונדו' }] },
      { day: 10, activities: [{ time: '10:00', activity: 'ארוחת בוקר' }, { time: '13:00', activity: 'נסיעה לציריך' }, { time: '16:00', activity: 'טיסה חזרה' }] },
    ],
    likes: 18700,
    comments: 423,
    shares: 167,
    tags: ['טראק', 'זוגות', 'חורף', 'נוף', 'מלון בוטיק'],
  },
];

/**
 * Main component: the video feed itself.
 */
export default function VideoFeed({
  filter = 'All',
  initialVideoId,
  feedActive = true,
  onRefresh,
  refreshing = false
}: VideoFeedProps) {
  const { height } = useWindowDimensions();
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Load videos from Supabase
  useEffect(() => {
    loadVideos();
  }, [filter]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoService.getVideos(0, 20, filter === 'All' ? undefined : filter);
      console.log('📹 Loaded from DB:', data.length, 'videos');
      console.log('📹 First video:', data[0]);
      
      // Combine DB data with MOCK_DATA
      const combined = [...data, ...MOCK_DATA];
      console.log('✅ Total videos:', combined.length, '(DB + MOCK)');
      setVideos(combined);
    } catch (err) {
      console.error('❌ Error loading videos:', err);
      setError('Failed to load videos');
      setVideos(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  // Reference to the FlatList (so we can scroll programmatically)
  const flatListRef = useRef<FlatList<VideoData>>(null);

  // Index of the currently visible video
  const [activeIndex, setActiveIndex] = useState(0);

  const lastActiveIndexRef = useRef(0);

  // Shorts-like "one gesture = one step" locking
  const dragStartYRef = useRef(0);
  const dragStartIndexRef = useRef(0);
  const snappingRef = useRef(false);

  const clampIndex = (idx: number, max: number) => Math.max(0, Math.min(max, idx));

  /**
   * Compute filtered data based on category.
   * useMemo ensures we don't recompute on every render.
   */
  const filteredData = useMemo(
    () => videos,
    [videos]
  );

  /**
   * Support for "deep linking" into a specific video.
   * Example: navigating from influencer profile to video feed.
   */
  useEffect(() => {
    if (!feedActive) return; // if Home isn't active, don't autoplay/scroll

    if (initialVideoId && flatListRef.current) {
      const index = filteredData.findIndex((item) => item.id === initialVideoId);

      if (index !== -1) {
        // Short delay ensures FlatList is fully mounted before scrolling.
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
          setActiveIndex(index);
          lastActiveIndexRef.current = index;
        }, 300);
      }
    }
  }, [initialVideoId, filteredData, feedActive]);

  // pause/resume when leaving/returning to Home tab ✅ PUT THIS DIRECTLY UNDER (A)
  useEffect(() => {
    if (!feedActive) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex((prev) => {
      if (prev >= 0) return prev;
      return lastActiveIndexRef.current ?? 0;
    });
  }, [feedActive]);

  /**
   * Called whenever the scroll movement finishes.
   * Calculates which "page" (video index) is currently visible.
   */
  const onBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!feedActive) return;

    snappingRef.current = false;
    dragStartYRef.current = e.nativeEvent.contentOffset.y;
    dragStartIndexRef.current = lastActiveIndexRef.current;
  };

  const onEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!feedActive) return;

    const maxIndex = filteredData.length - 1;
    const startIndex = dragStartIndexRef.current;

    const endY = e.nativeEvent.contentOffset.y;
    const deltaY = endY - dragStartYRef.current;

    // How far user must drag to count as "next/prev"
    const threshold = height * 0.12;

    let nextIndex = startIndex;

    if (deltaY > threshold) nextIndex = startIndex + 1;       // swipe up -> next video
    else if (deltaY < -threshold) nextIndex = startIndex - 1; // swipe down -> previous video

    nextIndex = clampIndex(nextIndex, maxIndex);

    // Hard-lock to that single step immediately
    snappingRef.current = true;
    lastActiveIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);

    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });

    // release shortly after the snap begins
    setTimeout(() => {
      snappingRef.current = false;
    }, 250);
  };

  const onMomentumEnd = () => {
    // After everything settles, ensure we are exactly at our locked index
    if (!feedActive) return;
    if (snappingRef.current) return;

    const idx = clampIndex(lastActiveIndexRef.current, filteredData.length - 1);
    flatListRef.current?.scrollToIndex({ index: idx, animated: false });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > height * 2);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    setActiveIndex(0);
    lastActiveIndexRef.current = 0;
  };

  const feedActiveRef = useRef(feedActive);
  const activeIndexRef = useRef(activeIndex);

  // Update refs synchronously during render to avoid stale values
  feedActiveRef.current = feedActive;
  activeIndexRef.current = activeIndex;

  // Empty deps array is safe here because refs are used to access current values
  // This prevents renderItem recreation on every scroll while maintaining correct isActive values
  const renderItem = React.useCallback(
    ({ item, index }: { item: VideoData; index: number }) => (
      <VideoItem
        video={item}
        isActive={feedActiveRef.current && index === activeIndexRef.current}
      />
    ),
    []
  );

  const getItemLayout = React.useCallback(
    (_data: ArrayLike<VideoData> | null | undefined, index: number) => ({
      length: height,
      offset: height * index,
      index
    }),
    [height]
  );

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D5FF" />
          <Text style={styles.loadingText}>טוען סרטונים...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B5C" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadVideos}>
            <Text style={styles.retryText}>נסה שוב</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
      ref={flatListRef}
      data={filteredData}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      pagingEnabled={false} // snap one full screen per swipe
      snapToInterval={height} // ensures each video takes full height
      snapToAlignment="start"
      decelerationRate="fast" // makes swipe transitions snappy
      disableIntervalMomentum
      refreshing={refreshing}
      onRefresh={onRefresh}
      onScroll={onScroll}
      scrollEventThrottle={16}

      /**
       * Render each video item.
       * Pass isActive so only the current video plays.
       */
      renderItem={renderItem}

      /**
       * Improves performance: allows FlatList to jump directly to an item.
       */
      getItemLayout={getItemLayout}

      /**
       * Scroll event handlers:
       * - iOS: uses momentum
       * - Android/Web: may use drag end
       */
        onScrollBeginDrag={onBeginDrag}
        onScrollEndDrag={onEndDrag}
        onMomentumScrollEnd={onMomentumEnd}
      />
      )}

      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopBtn}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-up" size={24} color="#000" />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollTopBtn: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D5FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#00D5FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
