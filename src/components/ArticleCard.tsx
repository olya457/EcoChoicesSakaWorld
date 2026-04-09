import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Share,
} from 'react-native';
import { Article } from '../store/types';

interface Props {
  article: Article;
  isSaved: boolean;
  onRead: () => void;
  onSave: () => void;
}

export default function ArticleCard({ article, isSaved, onRead, onSave }: Props) {
  const handleShare = async () => {
    await Share.share({ message: `Check out this article: ${article.title}` });
  };

  return (
    <View style={styles.card}>
      <Image source={article.image} style={styles.image} resizeMode="cover" />
      <View style={styles.footer}>
        <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Text style={styles.icon}>↗️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRead} style={styles.readBtn}>
            <Text style={styles.readText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} style={styles.iconBtn}>
            <Text style={styles.icon}>{isSaved ? '💛' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10,22,60,0.7)',
    borderRadius: 16, overflow: 'hidden', marginBottom: 16,
  },
  image: { width: '100%', height: 160 },
  footer: { padding: 12 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 6 },
  icon: { fontSize: 20 },
  readBtn: {
    flex: 1, backgroundColor: '#4CAF50', borderRadius: 20,
    paddingVertical: 8, alignItems: 'center',
  },
  readText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});