import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { VideoData } from './VideoFeed';
import { storage } from '../utils/storage';
import CommentsModal from './CommentsModal';
import ItineraryModal from './ItineraryModal';

const { height, width } = Dimensions.get('window');

type Props = {
  video: VideoData;
};

export default function VideoItem({ video }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { uri, influencer, title, location, price, likes, comments, shares } = video;
  const videoRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLiked, setIsLiked] = useState(storage.isLiked(video.id));
  const [isSaved, setIsSaved] = useState(storage.isSaved(video.id));
  const [likesCount, setLikesCount] = useState(likes);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(storage.getComments(video.id).length);
  const [itineraryVisible, setItineraryVisible] = useState(false);
  
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current) {
      const video = videoRef.current;
      video.loop = true;
      video.muted = true;
      
      const handleLoadStart = () => setLoading(true);
      const handleCanPlay = () => setLoading(false);
      const handleError = () => {
        setError(true);
        setLoading(false);
      };
      
      video.onloadstart = handleLoadStart;
      video.oncanplay = handleCanPlay;
      video.onerror = handleError;
      
      video.play().catch(() => setError(true));
      
      return () => {
        if (video) {
          video.onloadstart = null;
          video.oncanplay = null;
          video.onerror = null;
        }
      };
    }
  }, [uri]);

  const handleLike = () => {
    const liked = storage.toggleLike(video.id);
    setIsLiked(liked);
    setLikesCount(liked ? likesCount + 1 : likesCount - 1);
  };

  const handleSave = () => {
    const saved = storage.toggleSave(video.id);
    setIsSaved(saved);
  };

  const handleComments = () => {
    setCommentsVisible(true);
  };

  const handleCloseComments = () => {
    setCommentsVisible(false);
    setCommentsCount(storage.getComments(video.id).length);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>שגיאה בטעינת הסרטון</Text>
          </View>
        )}
        <video
          ref={videoRef}
          src={uri}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: loading || error ? 'none' : 'block',
          }}
          loop
          muted
          autoPlay
          playsInline
        />
        {!loading && !error && (
          <VideoOverlay 
            video={video}
            isLiked={isLiked}
            isSaved={isSaved}
            likesCount={likesCount}
            commentsCount={commentsCount}
            onLike={handleLike}
            onSave={handleSave}
            onComment={handleComments}
            onShare={() => console.log('Share')}
            onBook={() => console.log('Book')}
            onDetails={() => setItineraryVisible(true)}
            onInfluencer={() => navigation.navigate('Influencer', { influencerId: video.influencer.id })}
          />
        )}
        <CommentsModal visible={commentsVisible} videoId={video.id} onClose={handleCloseComments} />
        <ItineraryModal visible={itineraryVisible} video={video} onClose={() => setItineraryVisible(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsPictureInPicture={false}
        fullscreenOptions={{ enable: false }}
        contentFit="cover"
        nativeControls={false}
      />
      <VideoOverlay 
        video={video}
        isLiked={isLiked}
        isSaved={isSaved}
        likesCount={likesCount}
        commentsCount={commentsCount}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComments}
        onShare={() => console.log('Share')}
        onBook={() => console.log('Book')}
        onDetails={() => setItineraryVisible(true)}
        onInfluencer={() => navigation.navigate('Influencer', { influencerId: video.influencer.id })}
      />
      <CommentsModal visible={commentsVisible} videoId={video.id} onClose={handleCloseComments} />
      <ItineraryModal visible={itineraryVisible} video={video} onClose={() => setItineraryVisible(false)} />
    </View>
  );
}

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

function VideoOverlay({ video, isLiked, isSaved, likesCount, commentsCount, onLike, onSave, onComment, onShare, onBook, onDetails, onInfluencer }: OverlayProps) {
  return (
    <View style={overlayStyles.container}>
      <View style={overlayStyles.rightActions}>
        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onLike}>
          <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={32} color={isLiked ? '#FF3B5C' : '#fff'} />
          <Text style={overlayStyles.actionText}>{formatCount(likesCount)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={30} color="#fff" />
          <Text style={overlayStyles.actionText}>{formatCount(commentsCount)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onSave}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={30} color={isSaved ? '#FFD700' : '#fff'} />
          <Text style={overlayStyles.actionText}>שמור</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={overlayStyles.actionBtn} onPress={onShare}>
          <Ionicons name="share-outline" size={30} color="#fff" />
          <Text style={overlayStyles.actionText}>{formatCount(video.shares)}</Text>
        </TouchableOpacity>
      </View>
      
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

function formatCount(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
});
