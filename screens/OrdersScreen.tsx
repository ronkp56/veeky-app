import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ההזמנות שלי</Text>
      </View>
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>אין הזמנות</Text>
        <Text style={styles.emptySubtext}>ההזמנות שלך יופיעו כאן</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtext: { color: '#888', fontSize: 14, textAlign: 'center' },
});
