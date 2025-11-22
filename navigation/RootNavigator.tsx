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

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Influencer: { influencerId: string };
  Saves: undefined;
  Liked: undefined;
  Orders: undefined;
  Settings: undefined;
};

type MainTabsParamList = {
  Home: undefined;
  Orders: undefined;
  AddVideo: undefined;
  Saves: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: '#222',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Orders') iconName = 'receipt-outline';
          else if (route.name === 'AddVideo') iconName = 'add-circle-outline';
          else if (route.name === 'Saves') iconName = 'bookmark-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeFeedScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="AddVideo" component={AddVideoScreen} />
      <Tab.Screen name="Saves" component={SavesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Influencer" component={InfluencerScreen} />
      <Stack.Screen name="Saves" component={SavesScreen} />
      <Stack.Screen name="Liked" component={LikedScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
