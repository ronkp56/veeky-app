import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoData } from './VideoFeed';

type Props = {
  visible: boolean;
  video: VideoData;
  onClose: () => void;
};

export default function ItineraryModal({ visible, video, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{video.title}</Text>
              <Text style={styles.subtitle}>{video.days} ימים • {video.location}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {video.itinerary.map((day) => (
              <View key={day.day} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <View style={[styles.dayBadge, day.isFree && styles.dayBadgeFree]}>
                    <Text style={styles.dayNumber}>יום {day.day}</Text>
                  </View>
                  {day.isFree && <Text style={styles.freeTag}>יום חופשי 🏖️</Text>}
                </View>
                
                <View style={styles.activities}>
                  {day.activities.map((activity, idx) => (
                    <View key={idx} style={styles.activityRow}>
                      <Ionicons name="checkmark-circle" size={20} color="#00D5FF" />
                      <Text style={styles.activityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.bookBtn} onPress={onClose}>
              <Text style={styles.bookBtnText}>הזמן עכשיו • {video.price}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  content: { height: '80%', backgroundColor: '#000', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: '#222' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14 },
  scrollView: { flex: 1, padding: 16 },
  dayCard: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 12 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  dayBadge: { backgroundColor: '#00D5FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dayBadgeFree: { backgroundColor: '#FFD700' },
  dayNumber: { color: '#000', fontSize: 14, fontWeight: '700' },
  freeTag: { color: '#FFD700', fontSize: 12, fontWeight: '600' },
  activities: { gap: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activityText: { color: '#fff', fontSize: 14, flex: 1 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#222' },
  bookBtn: { backgroundColor: '#00D5FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  bookBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
