/**
 * SettingsScreen.tsx
 *
 * This screen allows the user to configure app-level preferences.
 *
 * Current responsibilities:
 * --------------------------------------------------------------------
 * ✔ Toggle dark/light mode (via ThemeContext)
 * ✔ Provide a clean, minimal settings layout
 * ✔ Provide navigation back to Profile
 *
 * Future options (planned):
 * --------------------------------------------------------------------
 * • Language selection
 * • Notification preferences
 * • App version information
 * • Account management (email, password, delete account)
 * • Support/FAQ links
 *
 * Architecture Notes:
 * --------------------------------------------------------------------
 * • Uses ThemeContext to store global app theme state.
 * • toggleTheme() flips between dark and light modes.
 * • Dark mode styling is applied inline using the current theme.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const navigation = useNavigation();

  // Theme context provides dark mode and a toggle function
  const { isDarkMode, toggleTheme } = useTheme();
  const darkMode = isDarkMode;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#000' : '#fff' },
      ]}
    >
      {/* ------------------------------------------------------------
          HEADER (Back button + screen title)
         ------------------------------------------------------------ */}
      <View
        style={[
          styles.header,
          { borderBottomColor: darkMode ? '#222' : '#ddd' },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={darkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>
          הגדרות
        </Text>
      </View>

      {/* ------------------------------------------------------------
          SETTINGS SECTION
         ------------------------------------------------------------ */}
      <View style={styles.section}>
        {/* Dark Mode Toggle */}
        <View style={styles.settingRow}>
          <Text
            style={[
              styles.settingLabel,
              { color: darkMode ? '#fff' : '#000' },
            ]}
          >
            תצוגה כהה
          </Text>

          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#00D5FF' }}
            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

/* --------------------------------------------------------------------
   STYLES
-------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  /* Settings section */
  section: {
    padding: 16,
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
});
