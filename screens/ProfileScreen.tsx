import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/RootNavigator';
import { storage } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { isDarkMode } = useTheme();
  const [savedCount, setSavedCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [aboutVisible, setAboutVisible] = useState(false);
  
  useFocusEffect(
    React.useCallback(() => {
      setSavedCount(storage.getSavedVideos().length);
      setLikedCount(storage.getLikedVideos().length);
    }, [])
  );
  const bg = isDarkMode ? '#000' : '#fff';
  const border = isDarkMode ? '#222' : '#ddd';
  const text = isDarkMode ? '#fff' : '#000';
  const subtext = isDarkMode ? '#888' : '#666';
  const card = isDarkMode ? '#1a1a1a' : '#f0f0f0';
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <View style={[styles.avatarContainer, { backgroundColor: card }]}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={[styles.name, { color: text }]}>משתמש אורח</Text>
        <Text style={[styles.email, { color: subtext }]}>guest@veeky.com</Text>
      </View>
      
      <View style={[styles.stats, { borderBottomColor: border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: text }]}>0</Text>
          <Text style={[styles.statLabel, { color: subtext }]}>חופשות שהוזמנו</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: text }]}>{savedCount}</Text>
          <Text style={[styles.statLabel, { color: subtext }]}>שמורים</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: text }]}>{likedCount}</Text>
          <Text style={[styles.statLabel, { color: subtext }]}>אהבתי</Text>
        </View>
      </View>
      
      <View style={[styles.section, { borderBottomColor: border }]}>
        <MenuItem isDark={isDarkMode} icon="calendar-outline" title="ההזמנות שלי" onPress={() => navigation.navigate('Orders')} />
        <MenuItem isDark={isDarkMode} icon="bookmark-outline" title="שמורים" onPress={() => navigation.navigate('Saves')} />
        <MenuItem isDark={isDarkMode} icon="heart-outline" title="אהבתי" onPress={() => navigation.navigate('Liked')} />
        <MenuItem isDark={isDarkMode} icon="notifications-outline" title="התראות (לא פעיל)" onPress={() => {}} disabled />
      </View>
      
      <View style={[styles.section, { borderBottomColor: border }]}>
        <MenuItem isDark={isDarkMode} icon="settings-outline" title="הגדרות" onPress={() => navigation.navigate('Settings')} />
        <MenuItem isDark={isDarkMode} icon="information-circle-outline" title="אודות" onPress={() => setAboutVisible(true)} />
      </View>
      
      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: card }]}>
        <Text style={styles.logoutText}>התנתק</Text>
      </TouchableOpacity>
      
      <Modal visible={aboutVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: card }]}>
            <Text style={[styles.modalTitle, { color: text }]}>אודות Veeky</Text>
            <Text style={[styles.modalText, { color: subtext }]}>כל הזכויות שמורות ל:</Text>
            <Text style={styles.modalName}>רון קופליס</Text>
            <Text style={styles.modalName}>טל חדד</Text>
            <Text style={styles.modalName}>רן וחניש</Text>
            <Text style={styles.modalName}>גל חיות</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setAboutVisible(false)}>
              <Text style={styles.modalBtnText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

type MenuItemProps = {
  isDark: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

function MenuItem({ isDark, icon, title, onPress, disabled }: MenuItemProps) {
  return (
    <TouchableOpacity style={[styles.menuItem, disabled && styles.menuItemDisabled]} onPress={onPress} disabled={disabled}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={24} color={disabled ? (isDark ? '#444' : '#ccc') : (isDark ? '#fff' : '#000')} />
        <Text style={[styles.menuTitle, { color: isDark ? '#fff' : '#000' }, disabled && styles.menuTitleDisabled]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#999'} />
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
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuTitleDisabled: {
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 12,
  },
  modalName: {
    color: '#00D5FF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalBtn: {
    backgroundColor: '#00D5FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
  },
  modalBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
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
