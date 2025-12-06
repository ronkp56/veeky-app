/**
 * VideoFeed.tsx
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
  NativeSyntheticEvent
} from 'react-native';

import VideoItem from './VideoItem';

type VideoFeedProps = {
  filter?: 'All' | 'Trips' | 'Lodging' | 'Entertainment';
  initialVideoId?: string; // Video to auto-scroll to (for deep links or navigation)
};

/**
 * Type definition for a single video object.
 * Matches the structure used across the feed UI.
 */
export type VideoData = {
  id: string;
  uri: string;
  category: 'Trips' | 'Lodging' | 'Entertainment';
  influencer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  location: string;
  price: string;
  days: number;
  itinerary: {
    day: number;
    activities: { time: string; activity: string }[];
    isFree?: boolean;
  }[];
  likes: number;
  comments: number;
  shares: number;

  /**
   * Tags describe the trip in a way that is:
   * - searchable (later: search by tags)
   * - personal (used to learn user interests)
   * - useful for creators to describe their business
   *
   * Convention:
   * - Up to 20 tags per video (enforced in AddVideo / backend)
   * - Each tag is a short word/phrase WITHOUT the "#" prefix.
   *   UI will render it as #tag.
   */
  tags: string[];
};

/**
 * Temporary mock dataset (until backend integration).
 * All videos use public URLs.
 */
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
  initialVideoId
}: VideoFeedProps) {
  // Screen height — used to create "1 video per page"
  const { height } = useWindowDimensions();

  // Reference to the FlatList (so we can scroll programmatically)
  const flatListRef = useRef<FlatList<VideoData>>(null);

  // Index of the currently visible video
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Compute filtered data based on category.
   * useMemo ensures we don't recompute on every render.
   */
  const filteredData = useMemo(
    () =>
      filter === 'All'
        ? MOCK_DATA
        : MOCK_DATA.filter((item) => item.category === filter),
    [filter]
  );

  /**
   * Support for "deep linking" into a specific video.
   * Example: navigating from influencer profile to video feed.
   */
  useEffect(() => {
    if (initialVideoId && flatListRef.current) {
      const index = MOCK_DATA.findIndex((item) => item.id === initialVideoId);

      if (index !== -1) {
        // Short delay ensures FlatList is fully mounted before scrolling.
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
          setActiveIndex(index); // Ensure correct video plays
        }, 300);
      }
    }
  }, [initialVideoId]);

  /**
   * Called whenever the scroll movement finishes.
   * Calculates which "page" (video index) is currently visible.
   */
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const { contentOffset } = event.nativeEvent;

    // Compute page index by dividing scroll offset by screen height
    const pageIndex = Math.round(contentOffset.y / height);

    setActiveIndex(pageIndex);
  };

  return (
    <FlatList
      ref={flatListRef}
      data={filteredData}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      pagingEnabled // snap one full screen per swipe
      snapToInterval={height} // ensures each video takes full height
      snapToAlignment="start"
      decelerationRate="fast" // makes swipe transitions snappy

      /**
       * Render each video item.
       * Pass isActive so only the current video plays.
       */
      renderItem={({ item, index }) => (
        <VideoItem
          video={item}
          isActive={index === activeIndex} // autoplay logic handled inside VideoItem
        />
      )}

      /**
       * Improves performance: allows FlatList to jump directly to an item.
       */
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index
      })}

      /**
       * Scroll event handlers:
       * - iOS: uses momentum
       * - Android/Web: may use drag end
       */
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
    />
  );
}
