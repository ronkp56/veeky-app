import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const { height, width } = Dimensions.get('window');

type Props = {
  uri: string;
};

export default function VideoItem({ uri }: Props) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
    // Optionally set update interval:
    // player.timeUpdateEventInterval = 1;
  });

  const [_isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const listener = player.addListener('playingChange', (payload) => {
      setIsPlaying(payload.isPlaying); // payload is an object like: { playing: boolean }
    });
    return () => listener.remove();
  }, [player]);

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
      {/* Optional debugging UI */}
      {/*<Button title={isPlaying ? 'Pause' : 'Play'} onPress={() => {
        isPlaying ? player.pause() : player.play();
      }} />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height,
    width,
  },
  video: {
    height: '100%',
    width: '100%',
  },
});
