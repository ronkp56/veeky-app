import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.name}>משתמש אורח</Text>
        <Text style={styles.email}>guest@veeky.com</Text>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>חופשות שהוזמנו</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>34</Text>
          <Text style={styles.statLabel}>סרטונים שמורים</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>לייקים</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <MenuItem icon="calendar-outline" title="ההזמנות שלי" onPress={() => console.log('Orders')} />
        <MenuItem icon="bookmark-outline" title="סרטונים שמורים" onPress={() => console.log('Saved')} />
        <MenuItem icon="heart-outline" title="מועדפים" onPress={() => console.log('Favorites')} />
        <MenuItem icon="notifications-outline" title="התראות" onPress={() => console.log('Notifications')} />
      </View>
      
      <View style={styles.section}>
        <MenuItem icon="settings-outline" title="הגדרות" onPress={() => console.log('Settings')} />
        <MenuItem icon="help-circle-outline" title="עזרה ותמיכה" onPress={() => console.log('Help')} />
        <MenuItem icon="information-circle-outline" title="אודות" onPress={() => console.log('About')} />
      </View>
      
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>התנתק</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

function MenuItem({ icon, title, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={24} color="#fff" />
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: '#888',
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#222',
  },
  section: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
  },
  logoutBtn: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B5C',
    fontSize: 16,
    fontWeight: '600',
  },
});
