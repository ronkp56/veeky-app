import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '../utils/haptics';

type Category = 'Trips' | 'Lodging' | 'Entertainment';

export default function AddVideoScreen() {
  const [videoUri, setVideoUri] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [days, setDays] = useState('');
  const [category, setCategory] = useState<Category>('Trips');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    haptics.light();
    // TODO: Implement video picker
    alert('בחירת וידאו - יש לממש עם expo-image-picker');
  };

  const handleUpload = async () => {
    if (!title || !location || !price || !days) {
      alert('נא למלא את כל השדות');
      return;
    }

    setUploading(true);
    haptics.success();
    
    // TODO: Upload to backend
    setTimeout(() => {
      setUploading(false);
      alert('הוידאו הועלה בהצלחה! 🎉');
      // Reset form
      setTitle('');
      setLocation('');
      setPrice('');
      setDays('');
      setTags('');
      setVideoUri('');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>העלאת וידאו חדש</Text>
        <Text style={styles.headerSubtitle}>שתף את חוויית הטיול שלך</Text>
      </View>

      {/* Video Picker */}
      <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
        {videoUri ? (
          <View style={styles.videoPreview}>
            <Ionicons name="videocam" size={48} color="#00D5FF" />
            <Text style={styles.videoText}>וידאו נבחר</Text>
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="cloud-upload-outline" size={64} color="#666" />
            <Text style={styles.placeholderText}>לחץ לבחירת וידאו</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Category Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>קטגוריה</Text>
        <View style={styles.categoryRow}>
          {(['Trips', 'Lodging', 'Entertainment'] as Category[]).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                category === cat && styles.categoryBtnActive,
              ]}
              onPress={() => {
                setCategory(cat);
                haptics.light();
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive,
                ]}
              >
                {cat === 'Trips' ? 'טיולים' : cat === 'Lodging' ? 'לינה' : 'בילויים'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.label}>כותרת</Text>
        <TextInput
          style={styles.input}
          placeholder="לדוגמה: חופשה מדהימה ביוון"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.label}>מיקום</Text>
        <TextInput
          style={styles.input}
          placeholder="לדוגמה: Santorini, Greece"
          placeholderTextColor="#666"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Price & Days */}
      <View style={styles.row}>
        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>מחיר</Text>
          <TextInput
            style={styles.input}
            placeholder="₪3,500"
            placeholderTextColor="#666"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>ימים</Text>
          <TextInput
            style={styles.input}
            placeholder="7"
            placeholderTextColor="#666"
            value={days}
            onChangeText={setDays}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <Text style={styles.label}>תגיות (מופרדות בפסיק)</Text>
        <TextInput
          style={styles.input}
          placeholder="יוון, זוגות, חופשת קיץ, ים"
          placeholderTextColor="#666"
          value={tags}
          onChangeText={setTags}
          multiline
        />
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Ionicons name="hourglass-outline" size={24} color="#000" />
            <Text style={styles.uploadBtnText}>מעלה...</Text>
          </>
        ) : (
          <>
            <Ionicons name="cloud-upload" size={24} color="#000" />
            <Text style={styles.uploadBtnText}>העלה וידאו</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  videoPicker: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  videoPreview: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
  },
  videoText: {
    color: '#00D5FF',
    fontSize: 16,
    marginTop: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: '#00D5FF',
    borderColor: '#00D5FF',
  },
  categoryText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#00D5FF',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  uploadBtnDisabled: {
    opacity: 0.5,
  },
  uploadBtnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
});
