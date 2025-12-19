/**
 * ItineraryModal.tsx
 *
 * This modal displays the full itinerary (trip plan) for a selected video.
 * It is used when the user taps the "Itinerary / Description" section from the video feed.
 *
 * What this component does:
 * ------------------------------------------------------------
 * • Shows a bottom-sheet style modal (80% height, sliding from bottom)
 * • Displays trip title, number of days, and the location
 * • Lists each day of the trip in a scrollable view
 * • Each day can have:
 *      - A “day badge”
 *      - A "free day" flag (day.isFree)
 *      - A list of activity items with time + description
 * • Footer includes a "Book now" button showing the trip price
 * • Modal closes when tapping the backdrop or the close icon
 *
 * Notes:
 * • This is a read-only component (no editing for now)
 * • Layout is fully RTL-friendly (Hebrew)
 * • Uses only local video data (VideoData type)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// VideoData type is imported from VideoFeed – describes the trip info
import { VideoData } from './VideoFeed';

type Props = {
  visible: boolean;     // Whether modal is displayed
  video: VideoData;     // The selected video's data (includes itinerary)
  onClose: () => void;  // Callback to close modal
};

export default function ItineraryModal({ visible, video, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>

        {/* Background overlay. Clicking closes modal */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Main modal body */}
        <View 
          style={styles.content} 
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
        >

          {/* Header section */}
          <View style={styles.header}>
            <View>
              {/* Trip title */}
              <Text style={styles.title}>{video.title}</Text>

              {/* Trip metadata (days + location) */}
              <Text style={styles.subtitle}>
                {video.days} ימים • {video.location}
              </Text>
            </View>

            {/* Close button */}
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Scrollable itinerary list */}
          <ScrollView style={styles.scrollView}>
            {video.itinerary.map((day) => (
              <View key={day.day} style={styles.dayCard}>

                {/* Day header with number + optional "free day" */}
                <View style={styles.dayHeader}>
                  <View
                    style={[
                      styles.dayBadge,
                      day.isFree && styles.dayBadgeFree
                    ]}
                  >
                    <Text style={styles.dayNumber}>יום {day.day}</Text>
                  </View>

                  {/* Free day label */}
                  {day.isFree && (
                    <Text style={styles.freeTag}>יום חופשי 🏖️</Text>
                  )}
                </View>

                {/* Activities for this day */}
                <View style={styles.activities}>
                  {day.activities.map((activity, idx) => (
                    <View key={idx} style={styles.activityRow}>

                      {/* Time (optional) */}
                      {activity.time && (
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      )}

                      {/* Checkmark icon */}
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#00D5FF"
                      />

                      {/* Activity description */}
                      <Text style={styles.activityText}>
                        {activity.activity}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer section – Booking button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.bookBtn} onPress={onClose}>
              <Text style={styles.bookBtnText}>
                הזמן עכשיו • {video.price}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

/**
 * Style definitions for bottom-sheet modal layout.
 * Dark theme consistent with Veeky UI.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Backdrop overlay
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // Main modal window
  content: {
    height: '80%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: '#222',
  },

  // Header area
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  subtitle: {
    color: '#888',
    fontSize: 14,
  },

  // Scrollable content
  scrollView: {
    flex: 1,
    padding: 16,
  },

  // Each day card
  dayCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  // Blue day badge (or gold for free day)
  dayBadge: {
    backgroundColor: '#00D5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  dayBadgeFree: {
    backgroundColor: '#FFD700',
  },

  dayNumber: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },

  freeTag: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },

  // Activity list per day
  activities: {
    gap: 8,
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  activityTime: {
    color: '#00D5FF',
    fontSize: 13,
    fontWeight: '600',
    minWidth: 50, // aligns times in a column
  },

  activityText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },

  // Footer booking area
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },

  // Book now button
  bookBtn: {
    backgroundColor: '#00D5FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  bookBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
