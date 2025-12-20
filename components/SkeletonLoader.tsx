/**
 * ./components/SkeletonLoader.tsx
 *
 * Reusable animated skeleton placeholder.
 *
 * Purpose:
 * --------------------------------------------------------------------
 * This component displays a gray animated block that simulates
 * loading content (text, cards, thumbnails, etc.).
 *
 * Why skeleton loaders are used instead of spinners:
 * --------------------------------------------------------------------
 * ✔ Preserves layout while data is loading
 * ✔ Reduces perceived loading time
 * ✔ Feels more modern and polished than a spinner
 * ✔ Prevents layout shifts when content appears
 *
 * Typical use cases:
 * --------------------------------------------------------------------
 * • Loading video metadata (title, location, influencer)
 * • Loading profile stats
 * • Placeholder for cards or list rows
 *
 * Design notes:
 * --------------------------------------------------------------------
 * • Uses opacity animation (pulse effect)
 * • Uses React Native Animated API
 * • No external dependencies
 * • Fully reusable via props
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

/**
 * Props for SkeletonLoader.
 *
 * width:
 *  - number (px) or string ('100%')
 * height:
 *  - height in pixels
 * borderRadius:
 *  - controls rounded corners
 * style:
 *  - optional additional styles (layout positioning, margins, etc.)
 */
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
  style,
}: SkeletonProps) {
  /**
   * Animated opacity value.
   * Starts at a low opacity and pulses to full opacity.
   */
  const opacity = useRef(new Animated.Value(0.3)).current;

  /**
   * Pulse animation loop.
   *
   * Sequence:
   *  - Fade in (0.3 → 1)
   *  - Fade out (1 → 0.3)
   *
   * The loop starts once when the component mounts.
   */
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

/* --------------------------------------------------------------------
   STYLES
-------------------------------------------------------------------- */

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#333',
  },
});
