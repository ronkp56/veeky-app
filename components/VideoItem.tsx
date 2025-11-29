/**
 * VideoItem.tsx
 *
 * This component is the heart of the Veeky video experience.
 * It represents ONE video card in the vertical video feed (VideoFeed.tsx).
 *
 * Responsibilities:
 * --------------------------------------------------------------------------
 * ✔ Plays / pauses video automatically based on whether it's the active card
 * ✔ Allows user tap-to-play / tap-to-pause anywhere on the screen
 * ✔ Supports both Expo Native (expo-video player) and Web (HTML <video>)
 * ✔ Displays all interactive video actions:
 *      - Like (heart)
 *      - Save (bookmark)
 *      - Comment sheet
 *      - Share
 * ✔ Displays travel details overlay: influencer, title, location, days, etc.
 * ✔ Opens modals:
 *      - CommentsModal
 *      - ItineraryModal (trip details)
 * ✔ Uses local storage helpers to persist:
 *      - Likes
 *      - Saves
 *      - Comments count
 *
 * Architecture Notes:
 * --------------------------------------------------------------------------
 * • This file *must stay performant* — it renders once per video on screen.
 * • isActive is passed from VideoFeed.tsx and controls autoplay logic.
 * • Native and Web video players behave differently:
 *      - Native uses expo-video “VideoView” + useVideoPlayer
 *      - Web uses <video> element with manual play() / pause()
 * • tapIcon + animation gives immediate play/pause feedback.
 *
 * This is one of the most important UI components in Veeky.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  Platform,
} from 'react-native';

import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { VideoData } from './VideoFeed';
import { storage } from '../utils/storage';
import CommentsModal from './CommentsModal';
import ItineraryModal from './ItineraryModal';

// Full-screen height/width
const { height, width } = Dimensions.get('window');

type Props = {
  video: VideoData;
  isActive: boolean; // Determines whether to auto-play this video
};

export default function VideoItem({ video, isActive }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { uri, likes } = video;

  /* --------------------------------------------------------------------- *
   *                VIDEO PLAYER SETUP (NATIVE vs. WEB)
   * --------------------------------------------------------------------- */

  // Native video player (Expo)
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true; // All videos loop on native
  });

  // Web video <video> element ref
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Tracks whether the video is currently playing
  const [isPlaying, setIsPlaying] = useState(false);

  /* --------------------------------------------------------------------- *
   *                TAP FEEDBACK ICON (play/pause)
   * --------------------------------------------------------------------- */

  const [tapIcon, setTapIcon] = useState<'play' | 'pause' | null>(null);
  const tapIconAnim = useRef(new Animated.Value(0)).current;

  const showTapIcon = (type: 'play' | 'pause') => {
    setTapIcon(type);
    tapIconAnim.setValue(1);

    // Fade-out animation
    Animated.timing(tapIconAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setTapIcon(null));
  };

  /* --------------------------------------------------------------------- *
   *                UI STATE (like, save, comments, itinerary)
   * --------------------------------------------------------------------- */

  const [isLiked, setIsLiked] = useState(storage.isLiked(video.id));
  const [isSaved, setIsSaved] = useState(storage.isSaved(video.id));
  const [likesCount, setLikesCount] = useState(likes);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    storage.getComments(video.id).length
  );
  const [itineraryVisible, setItineraryVisible] = useState(false);

  // Placeholder loading / error states (not implemented but kept for future)
  const [loading] = useState(false);
  const [error] = useState(false);

  /* --------------------------------------------------------------------- *
   *                AUTO PLAY / PAUSE WHEN ACTIVE CHANGES
   * --------------------------------------------------------------------- */

  useEffect(() => {
    if (Platform.OS === 'web') {
      const el = videoRef.current;
      if (!el) return;

      if (isActive) {
        el.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        el.pause();
        setIsPlaying(false);
      }
    } else {
      if (isActive) {
        player.play();
        setIsPlaying(true);
      } else {
        player.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, player]);

  /* --------------------------------------------------------------------- *
   *                CLEANUP: stop video on component unmount
   * --------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (Platform.OS === 'web') {
        videoRef.current?.pause();
      } else {
        try {
          player.pause();
        } catch {}
      }
    };
  }, [player]);

  /* --------------------------------------------------------------------- *
   *                BUTTON HANDLERS (like, save, comments)
   * --------------------------------------------------------------------- */

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

  /* --------------------------------------------------------------------- *
   *                TAP-TO-PLAY / TAP-TO-PAUSE BEHAVIOR
   * --------------------------------------------------------------------- */

  const handleTogglePlay = () => {
    if (!isActive) return; // ignore if not visible video

    if (Platform.OS === 'web') {
      const el = videoRef.current;
      if (!el) return;

      if (isPlaying) {
        el.pause();
        setIsPlaying(false);
        showTapIcon('pause');
      } else {
        el.play().then(() => {
          setIsPlaying(true);
          showTapIcon('play');
        });
      }
    } else {
      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
        showTapIcon('pause');
      } else {
        player.play();
        setIsPlaying(true);
        showTapIcon('play');
      }
    }
  };

  /* --------------------------------------------------------------------- *
   *                               RENDER
   * --------------------------------------------------------------------- */

  return (
    <View style={styles.container}>

      {/* VIDEO LAYER: Web vs Native */}
      {Platform.OS === 'web' ? (
        <>
          <View style={styles.video}>
            <video
              ref={videoRef}
              src={uri}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              playsInline
            />
          </View>

          {/* Transparent play/pause tap area */}
          <Pressable style={StyleSheet.absoluteFill} onPress={handleTogglePlay} />
        </>
      ) : (
        <>
          <VideoView
            style={styles.video}
            player={player}
            contentFit="cover"
            allowsPictureInPicture={false}
            fullscreenOptions={{ enable: false }}
            nativeControls={false}
          />
          <Pressable style={StyleSheet.absoluteFill} onPress={handleTogglePlay} />
        </>
      )}

      {/* TAP FEEDBACK ICON */}
      {tapIcon && (
        <Animated.View
          pointerEvents="none"
          style={[overlayStyles.centerIconContainer, { opacity: tapIconAnim }]}
        >
          <Ionicons
            name={tapIcon === 'play' ? 'play-circle' : 'pause-circle'}
            size={72}
            color="#fff"
          />
        </Animated.View>
      )}

      {/* Optional loading/error state */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Loading…</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>שגיאה בטעינת הסרטון</Text>
        </View>
      )}

      {/* OVERLAY: influencer, buttons, actions, bottom info */}
      <VideoOverlay
        video={video}
        isLiked={isLiked}
        isSaved={isSaved}
        likesCount={likesCount}
        commentsCount={commentsCount}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComments}
        onShare={() => {}}
        onBook={() => {}}
        onDetails={() => setItineraryVisible(true)}
        onInfluencer={() =>
          navigation.navigate('Influencer', {
            influencerId: video.influencer.id,
          })
        }
      />

      {/* Comments popup */}
      <CommentsModal
        visible={commentsVisible}
        videoId={video.id}
        onClose={handleCloseComments}
      />

      {/* Trip details modal */}
      <ItineraryModal
        visible={itineraryVisible}
        video={video}
        onClose={() => setItineraryVisible(false)}
      />
    </View>
  );
}

/* =============================================================================
 *                           VIDEO OVERLAY (RIGHT + BOTTOM UI)
 * =============================================================================
 */

type OverlayProps = {
  video: VideoData;
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
  onShare: () => void;
  onBook: () => void;
  onDetails: () => void;
  onInfluencer: () => void;
};

function VideoOverlay({
  video,
  isLiked,
  isSaved,
  likesCount,
  commentsCount,
  onLike,
  onSave,
  onComment,
  onShare,
  onBook,
  onDetails,
  onInfluencer,
}: OverlayProps) {
  return (
    <View style={overlayStyles.container} pointerEvents="box-none">

      {/* RIGHT-SIDE ACTION BUTTONS */}
      <View style={overlayStyles.rightActions}>
        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onLike}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={32}
            color={isLiked ? '#FF3B5C' : '#fff'}
          />
          <Text style={overlayStyles.actionText}>{formatCount(likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={30} color="#fff" />
          <Text style={overlayStyles.actionText}>{formatCount(commentsCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onSave}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={30}
            color={isSaved ? '#FFD700' : '#fff'}
          />
          <Text style={overlayStyles.actionText}>שמור</Text>
        </TouchableOpacity>

        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onShare}>
          <Ionicons name="share-outline" size={30} color="#fff" />
          <Text style={overlayStyles.actionText}>
            {formatCount(video.shares)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM INFORMATION AREA */}
      <View style={overlayStyles.bottomInfo}>
        <TouchableOpacity style={overlayStyles.influencerRow} onPress={onInfluencer}>
          <Text style={overlayStyles.avatar}>{video.influencer.avatar}</Text>
          <Text style={overlayStyles.influencerName}>
            {video.influencer.name}
            {video.influencer.verified && ' ✓'}
          </Text>
        </TouchableOpacity>

        <Text style={overlayStyles.title}>{video.title}</Text>
        <Text style={overlayStyles.days}>🗓️ {video.days} ימים</Text>
        <Text style={overlayStyles.location}>📍 {video.location}</Text>

        <View style={overlayStyles.buttons}>
          <TouchableOpacity style={overlayStyles.detailsBtn} onPress={onDetails}>
            <Text style={overlayStyles.detailsBtnText}>פרטים</Text>
          </TouchableOpacity>

          <TouchableOpacity style={overlayStyles.bookBtn} onPress={onBook}>
            <Text style={overlayStyles.bookBtnText}>הזמנה מהירה</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* =============================================================================
 *                           HELPERS + STYLES
 * =============================================================================
 */

function formatCount(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

const styles = StyleSheet.create({
  container: {
    height,
    width,
    backgroundColor: '#000',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
});

const overlayStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'space-between',
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
  centerIconContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
