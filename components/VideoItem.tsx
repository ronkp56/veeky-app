import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const { height, width } = Dimensions.get('window');

type Props = {
  uri: string;
};

export default function VideoItem({ uri }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // For native platforms, use expo-video
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    // For web, use HTML5 video
    if (Platform.OS === 'web' && videoRef.current) {
      const video = videoRef.current;
      video.loop = true;
      video.muted = true; // Required for autoplay
      
      video.onloadstart = () => setLoading(true);
      video.oncanplay = () => setLoading(false);
      video.onerror = () => {
        setError(true);
        setLoading(false);
      };
      
      video.play().catch(() => setError(true));
    }
  }, [uri]);

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
    </View>
  );
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
