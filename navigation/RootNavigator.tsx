/**
 * RootNavigator.tsx
 *
 * High-level navigation configuration for the Veeky app.
 *
 * Structure:
 *  - Root stack (Stack.Navigator)
 *      - Login       → First screen for unauthenticated users
 *      - MainTabs    → The main app experience (bottom tab navigator)
 *      - Influencer  → A dedicated screen for a specific influencer
 *
 *  - MainTabs (Tab.Navigator)
 *      - Home        → Main video feed screen
 *      - AddVideo    → Screen for adding/uploading a new video
 *      - Profile     → Nested stack for all profile-related screens
 *
 *  - ProfileNavigator (ProfileStack.Navigator)
 *      - ProfileMain → Profile main screen
 *      - Orders      → User orders/reservations history
 *      - Saves       → Saved videos/trips
 *      - Liked       → Liked videos/trips
 *      - Settings    → User settings
 *
 * Notes:
 *  - Uses React Navigation (native stack + bottom tabs).
 *  - Uses Expo Haptics to give a small vibration when switching tabs.
 *  - Icon mapping for tabs is done based on the route name (Home/AddVideo/Profile).
 */

import React from 'react';
import * as Haptics from 'expo-haptics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import HomeFeedScreen from '../screens/HomeFeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InfluencerScreen from '../screens/InfluencerScreen';
import SavesScreen from '../screens/SavesScreen';
import LikedScreen from '../screens/LikedScreen';
import OrdersScreen from '../screens/OrdersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddVideoScreen from '../screens/AddVideoScreen';
import SearchScreen from '../screens/SearchScreen';

import type { SearchMode } from '../screens/SearchScreen';

/**
 * Type definitions for the stack that holds all profile-related screens.
 * This is used for type-safe navigation within the Profile stack.
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  Saves: undefined;
  Liked: undefined;
  Orders: undefined;
  Settings: undefined;
};

/**
 * Type definitions for the root navigation stack.
 * - Login: authentication screen
 * - MainTabs: bottom tab navigator (optional param: videoId to open a specific video)
 * - Influencer: screen for a single influencer (requires influencerId)
 */
export type RootStackParamList = {
  Login: undefined;
  MainTabs: { videoId?: string } | undefined;
  Influencer: { influencerId: string };

  Search: { query?: string; mode?: 'all' | 'tags' | 'location' | 'influencer' | 'title' } | undefined;
};

/**
 * Type definitions for the bottom tab navigator (main app navigation).
 * - Home: video feed (optional videoId to jump to a specific video)
 * - AddVideo: screen to upload a video
 * - Profile: nested profile stack
 */
type MainTabsParamList = {
  Home: { videoId?: string } | undefined;
  AddVideo: undefined;
  Profile: undefined;
};

// Create typed navigators for root, tabs, and profile
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Nested navigator for all profile-related screens.
 * This allows the Profile tab to have its own internal stack.
 */
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main profile view */}
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      {/* Orders / reservations history */}
      <ProfileStack.Screen name="Orders" component={OrdersScreen} />
      {/* Saved videos / trips */}
      <ProfileStack.Screen name="Saves" component={SavesScreen} />
      {/* Liked videos / trips */}
      <ProfileStack.Screen name="Liked" component={LikedScreen} />
      {/* Profile settings */}
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

/**
 * Bottom tab navigator for the main part of the app.
 * Contains:
 *  - Home feed
 *  - AddVideo
 *  - Profile stack
 *
 * Also sets up:
 *  - Tab bar styles (dark theme)
 *  - Icons for each tab
 *  - Haptic feedback on tab press
 */
function MainTabs() {
  return (
    <Tab.Navigator
      // `id={undefined}` is used to avoid conflicting navigator IDs
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false, // We manage headers manually per screen if needed
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: '#222',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          // Determine the icon based on the current route name
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'AddVideo') iconName = 'add-circle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      // Listener for tab presses: triggers a light haptic feedback
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      {/* Main video feed tab */}
      <Tab.Screen name="Home" component={HomeFeedScreen} />
      {/* Add new video tab */}
      <Tab.Screen name="AddVideo" component={AddVideoScreen} />
      {/* Profile (with nested stack) tab */}
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

/**
 * RootNavigator:
 * This is the top-level navigator used by the app.
 * It decides if the user sees the Login screen or the main app (tabs),
 * and also includes routes that sit "above" the tabs such as Influencer.
 */
export default function RootNavigator() {
  return (
    <Stack.Navigator
      // Same idea with `id={undefined}` to avoid ID clashes
      id={undefined}
      screenOptions={{ headerShown: false }}
    >
      {/* Login screen - usually the first screen for non-authenticated users */}
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Main application tabs (Home, AddVideo, Profile) */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      {/* Search screen */}
      <Stack.Screen name="Search" component={SearchScreen} />
      {/* Influencer profile / details screen */}
      <Stack.Screen name="Influencer" component={InfluencerScreen} />
    </Stack.Navigator>
  );
}
