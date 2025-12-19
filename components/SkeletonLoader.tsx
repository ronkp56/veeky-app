import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
};

export default function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#333',
  },
});
