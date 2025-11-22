import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}>
      <View style={[styles.header, { borderBottomColor: darkMode ? '#222' : '#ddd' }]}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>הגדרות</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: darkMode ? '#fff' : '#000' }]}>תצוגה כהה</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#00D5FF' }}
            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 60, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '700' },
  section: { padding: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingLabel: { fontSize: 16 },
});
