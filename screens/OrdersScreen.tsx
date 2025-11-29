/**
 * OrdersScreen.tsx
 *
 * This screen displays the user's past and upcoming reservations.
 *
 * Current behavior:
 * --------------------------------------------------------------------
 * ✔ Shows a header with a back button and screen title
 * ✔ Displays an empty state (no real orders yet)
 * ✔ Matches the dark aesthetic of Veeky
 *
 * Future directions:
 * --------------------------------------------------------------------
 * • Integrate backend orders / reservations API
 * • Each order card may show:
 *      - Trip thumbnail
 *      - Dates, price, status
 *      - View itinerary button
 * • Add filters (upcoming / past)
 * • Allow rebooking a trip
 *
 * Navigation:
 * --------------------------------------------------------------------
 * - Tapping back returns to the Profile screen.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function OrdersScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------------------
          HEADER SECTION
         ------------------------------------------------------------ */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>ההזמנות שלי</Text>
      </View>

      {/* ------------------------------------------------------------
          EMPTY STATE (no reservations yet)
         ------------------------------------------------------------ */}
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>אין הזמנות</Text>
        <Text style={styles.emptySubtext}>ההזמנות שלך יופיעו כאן</Text>
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
    backgroundColor: '#000', // Veeky dark background
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 12,
  },

  backBtn: {
    padding: 4,
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  /* Empty state layout */
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});
