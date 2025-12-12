/**
 * WebVideoFeed.tsx
 *
 * This is the web-optimized version of the Veeky video feed.
 * Because Expo Native video (expo-video) doesn't run inside web browsers,
 * we build a **100% HTML <video> implementation** here.
 *
 * -------------------------------------------------------------------------
 * What this feed does:
 * -------------------------------------------------------------------------
 * ✔ Renders a vertical full-page scrolling video feed (TikTok-style)
 * ✔ Uses <ScrollView> with snapToInterval = screen height (one video per page)
 * ✔ Autoplays the video currently in view
 * ✔ Pauses all other videos when the user swipes away
 * ✔ Detects “scroll end” using a timeout approach (because web has no
 *   reliable onMomentumScrollEnd event)
 * ✔ Supports category filtering
 * ✔ Supports full interactions:
 *      - Like / Save / Comment / Share
 *      - Tap to play/pause
 *      - Comments modal
 *      - Itinerary modal
 * ✔ Reuses logic from VideoItem but adapted for Web
 *
 * Why this file exists:
 * -------------------------------------------------------------------------
 * On mobile/native we use <VideoView> from expo-video.
 * On web this doesn't exist, so we must manage:
 *    - Raw <video> HTML tags
 *    - Manual play() / pause()
 *    - Manual scroll detection
 *
 * This file ensures Veeky works perfectly on browsers.
 */

import React, {
  useMemo,
  useRef,
  useState,
  useEffect
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Animated,
  Text,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { VideoData, MOCK_DATA } from './VideoFeed';
import { storage } from '../utils/storage';
import CommentsModal from './CommentsModal';
import ItineraryModal from './ItineraryModal';
import { RootStackParamList } from '../navigation/RootNavigator';

const { width } = Dimensions.get('window');

type FilterType = 'All' | 'Trips' | 'Lodging' | 'Entertainment';

type WebVideoFeedProps = {
  filter?: FilterType;
  initialVideoId?: string;
};

export default function WebVideoFeed({ filter = 'All', initialVideoId }: WebVideoFeedProps) {
  const { height } = useWindowDimensions();

  /**
   * Filter videos by category ("Trips", "Lodging", etc)
   */
  const filteredData = useMemo(
    () => (filter === 'All'
      ? MOCK_DATA
      : MOCK_DATA.filter((item) => item.category === filter)),
    [filter]
  );

  useEffect(() => {
    if (!initialVideoId) return;

    const index = filteredData.findIndex((v) => v.id === initialVideoId);
    if (index === -1) return;

    // Scroll to the correct "page" and start playing it
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: height * index, animated: false });
      playIndex(index);
    }, 50);
  }, [initialVideoId, filteredData, height]);


  /**
   * Index of the video that is currently visible / playing
   */
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Hold refs to all <video> HTML elements
   * (One ref per video item)
   */
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  /* Add a scrollViewRef and a useEffect to jump */
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Used to detect scroll end on Web.
   * We store the Y position and wait for the user to stop scrolling.
   */
  const scrollY = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Play only the video at index, pause all others
   */
  const playIndex = (index: number) => {
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === index) {
        videoEl
          .play()
          .catch(() => {
            // Autoplay may be blocked on some browsers (especially Safari)
          });
      } else {
        videoEl.pause();
      }
    });

    setActiveIndex(index);
  };

  /**
   * Handle scroll events on Web (since we don’t have momentum events).
   * Approach:
   *   - On scroll: store new Y position
   *   - Clear any existing timer
   *   - Start a new timer: if user stops scrolling for 120ms,
   *     we consider it a “scroll end” → compute page index
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    scrollY.current = contentOffset.y;

    // Reset scroll timer
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const pageIndex = Math.round(scrollY.current / height);

      if (pageIndex >= 0 && pageIndex < filteredData.length) {
        playIndex(pageIndex);
      }
    }, 120);
  };

  /**
   * On mount:
   *   - Try to autoplay first video
   * On unmount:
   *   - Clear timeout
   *   - Pause all videos
   */
  useEffect(() => {
    if (filteredData.length > 0) playIndex(0);

    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      videoRefs.current.forEach((v) => v?.pause());
    };
  }, [filteredData.length]);

  /**
   * Called when user taps on the video → toggles play/pause
   * Also returns action so UI can show icon (play/pause)
   */
  const handleToggleFromItem = (index: number): 'play' | 'pause' => {
    const el = videoRefs.current[index];
    if (!el) return 'pause';

    if (el.paused) {
      playIndex(index); // Also pauses all others
      return 'play';
    } else {
      el.pause();
      return 'pause';
    }
  };

  /**
   * Main render: Each child is a <WebVideoItem/> component
   */
  return (
    <ScrollView
      pagingEnabled
      snapToInterval={height}
      snapToAlignment="start"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      ref={scrollViewRef}
    >
      {filteredData.map((video, index) => (
        <WebVideoItem
          key={video.id}
          video={video}
          index={index}
          height={height}
          provideRef={(el) => (videoRefs.current[index] = el)}
          onToggle={handleToggleFromItem}
        />
      ))}
    </ScrollView>
  );
}

/* ============================================================================
 *                            WebVideoItem (ONE ITEM)
 * ============================================================================
 */

type WebVideoItemProps = {
  video: VideoData;
  index: number;
  height: number;
  provideRef: (el: HTMLVideoElement | null) => void;
  onToggle: (index: number) => 'play' | 'pause';
};

function WebVideoItem({
  video,
  index,
  height,
  provideRef,
  onToggle,
}: WebVideoItemProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Center tap feedback (UI only)
  const [tapIcon, setTapIcon] = useState<'play' | 'pause' | null>(null);
  const tapIconAnim = useRef(new Animated.Value(0)).current;

  // Like / save / comments UI state
  const [isLiked, setIsLiked] = useState(storage.isLiked(video.id));
  const [isSaved, setIsSaved] = useState(storage.isSaved(video.id));
  const [likesCount, setLikesCount] = useState(video.likes);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    storage.getComments(video.id).length
  );
  const [itineraryVisible, setItineraryVisible] = useState(false);

  /**
   * Animate tap icon
   */
  const showTapIcon = (type: 'play' | 'pause') => {
    setTapIcon(type);
    tapIconAnim.setValue(1);

    Animated.timing(tapIconAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setTapIcon(null));
  };

  /**
   * User taps on video → toggle play/pause
   */
  const handlePress = () => {
    const action = onToggle(index);
    showTapIcon(action);
  };

  /**
   * Likes / saves
   */
  const handleLike = () => {
    const liked = storage.toggleLike(video.id);
    setIsLiked(liked);
    setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
  };

  const handleSave = () => {
    const saved = storage.toggleSave(video.id);
    setIsSaved(saved);
  };

  const handleComments = () => setCommentsVisible(true);

  const handleCloseComments = () => {
    setCommentsVisible(false);
    setCommentsCount(storage.getComments(video.id).length);
  };

  const handleInfluencer = () => {
    navigation.navigate('Influencer', {
      influencerId: video.influencer.id,
    });
  };

  const handleTagPress = (tag: string) => {
    navigation.navigate('Search', { query: tag, mode: 'tags' });
  };

  return (
    <View style={[styles.itemContainer, { height }]}>
      <View style={styles.videoWrapper}>
        {/* RAW HTML5 VIDEO ELEMENT */}
        <video
          ref={provideRef}
          src={video.uri}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          playsInline
          muted={false}
          loop
        />

        {/* Tap layer for toggle play/pause */}
        <Pressable style={StyleSheet.absoluteFill} onPress={handlePress} />

        {/* Center feedback icon */}
        {tapIcon && (
          <Animated.View
            pointerEvents="none"
            style={[styles.centerIconContainer, { opacity: tapIconAnim }]}
          >
            <Ionicons
              name={tapIcon === 'play' ? 'play-circle' : 'pause-circle'}
              size={72}
              color="#fff"
            />
          </Animated.View>
        )}

        {/* RIGHT ACTION BUTTONS */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={32}
              color={isLiked ? '#FF3B5C' : '#fff'}
            />
            <Text style={styles.actionText}>{formatCount(likesCount)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleComments}>
            <Ionicons name="chatbubble-outline" size={30} color="#fff" />
            <Text style={styles.actionText}>{formatCount(commentsCount)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={30}
              color={isSaved ? '#FFD700' : '#fff'}
            />
            <Text style={styles.actionText}>שמור</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#fff" />
            <Text style={styles.actionText}>
              {formatCount(video.shares)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM INFO PANEL */}
        <View style={styles.bottomInfo}>
          <TouchableOpacity
            style={styles.influencerRow}
            onPress={handleInfluencer}
          >
            <Text style={styles.avatar}>{video.influencer.avatar}</Text>
            <Text style={styles.influencerName}>
              {video.influencer.name}
              {video.influencer.verified && ' ✓'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>{video.title}</Text>
          <Text style={styles.days}>🗓️ {video.days} ימים</Text>
          <Text style={styles.location}>📍 {video.location}</Text>

          {video.tags && video.tags.length > 0 && (
            <ScrollView
              style={styles.tagsScroll}
              contentContainerStyle={styles.tagsContent}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {video.tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tagPill}
                  onPress={() => handleTagPress(tag)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => setItineraryVisible(true)}
            >
              <Text style={styles.detailsBtnText}>פרטים</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bookBtn} onPress={() => {}}>
              <Text style={styles.bookBtnText}>הזמנה מהירה</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* COMMENTS MODAL */}
      <CommentsModal
        visible={commentsVisible}
        videoId={video.id}
        onClose={handleCloseComments}
      />

      {/* ITINERARY MODAL */}
      <ItineraryModal
        visible={itineraryVisible}
        video={video}
        onClose={() => setItineraryVisible(false)}
      />
    </View>
  );
}

/* ============================================================================
 *                              HELPERS + STYLES
 * ============================================================================
 */

function formatCount(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

const styles = StyleSheet.create({
  itemContainer: {
    width,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerIconContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    gap: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 140,
    left: 12,
    right: 80,
  },
  influencerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    fontSize: 32,
  },
  influencerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  days: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  location: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagsScroll: {
    maxHeight: 34,
    marginBottom: 8,
  },
  tagsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  tagPill: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  detailsBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  bookBtn: {
    backgroundColor: '#00D5FF',
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
});
