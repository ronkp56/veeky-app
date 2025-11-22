import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

type Props = {
  visible: boolean;
  videoId: string;
  onClose: () => void;
};

export default function CommentsModal({ visible, videoId, onClose }: Props) {
  const [comments, setComments] = useState(storage.getComments(videoId));
  const [text, setText] = useState('');

  const handleAddComment = () => {
    if (text.trim()) {
      const newComment = storage.addComment(videoId, text.trim());
      setComments([...comments, newComment]);
      setText('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{comments.length} תגובות</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {comments.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyText}>אין תגובות עדיין</Text>
              <Text style={styles.emptySubtext}>היה הראשון להגיב!</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={styles.commentAvatar}>👤</Text>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
                  </View>
                </View>
              )}
            />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="הוסף תגובה..."
              placeholderTextColor="#666"
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]} 
              onPress={handleAddComment}
              disabled={!text.trim()}
            >
              <Ionicons name="send" size={20} color={text.trim() ? '#00D5FF' : '#666'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'עכשיו';
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours} שעות`;
  return `לפני ${days} ימים`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    height: '70%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: '#222',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
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
  },
  comment: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  commentAvatar: {
    fontSize: 32,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});
