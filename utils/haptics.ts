/**
 * ./utils/haptics.ts
 *
 * Centralized haptic feedback utility for the Veeky app.
 *
 * Purpose:
 * --------------------------------------------------------------------
 * This file provides a clean, platform-safe API for triggering
 * haptic (vibration) feedback across the app.
 *
 * Why this file exists:
 * --------------------------------------------------------------------
 * ✔ Prevents direct usage of `expo-haptics` in UI components
 * ✔ Avoids errors on platforms that do not support haptics (Web)
 * ✔ Gives semantic meaning to vibrations (light, success, error)
 * ✔ Makes future changes easy (disable, customize, or expand haptics)
 *
 * Design principles:
 * --------------------------------------------------------------------
 * • UI components should not care *how* vibration works
 * • They only express *intent* (e.g. success, light tap)
 * • Platform-specific behavior is handled here
 *
 * Example usage:
 * --------------------------------------------------------------------
 * import { haptics } from '../utils/haptics';
 *
 * haptics.light();    // Small tap feedback
 * haptics.success(); // Positive confirmation feedback
 */

import { Platform } from 'react-native';

// Import Expo Haptics only once, centrally
import * as Haptics from 'expo-haptics';

/**
 * Internal helper:
 * Checks whether haptic feedback is supported on the current platform.
 *
 * Web does NOT support Expo haptics.
 */
const isHapticsSupported = Platform.OS !== 'web';

/**
 * Public haptics API
 *
 * Exposes semantic vibration functions instead of raw haptic calls.
 * This keeps UI code readable and intention-based.
 */
export const haptics = {
  /**
   * Light impact feedback
   *
   * Use for:
   * - Button taps
   * - Navigation changes
   * - Toggle switches
   *
   * Very subtle vibration.
   */
  light() {
    if (!isHapticsSupported) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Success notification feedback
   *
   * Use for:
   * - Successful actions (like, save, upload)
   * - Completed flows
   *
   * Stronger and more noticeable vibration.
   */
  success() {
    if (!isHapticsSupported) return;

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  },

  /**
   * Error notification feedback
   *
   * Use for:
   * - Failed actions
   * - Validation errors
   * - Upload / network failures
   *
   * Sharp vibration signaling something went wrong.
   */
  error() {
    if (!isHapticsSupported) return;

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    );
  },
};
