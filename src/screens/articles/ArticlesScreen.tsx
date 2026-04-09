import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { ARTICLES } from '../../data/articles';
import { useAppStore } from '../../store/useAppStore';
import images from '../../constants/images';
import ArticleCard from '../../components/ArticleCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');
const isVerySmall = height < 670;
const isSmall = height < 760;

export default function ArticlesScreen() {
  const navigation = useNavigation<Nav>();
  const { savedArticles, toggleSaveArticle } = useAppStore();

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <Text style={styles.header}>Articles</Text>

        <FlatList
          data={ARTICLES}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              isSaved={savedArticles.includes(item.id)}
              onSave={() => toggleSaveArticle(item.id)}
              onRead={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,15,40,0.55)',
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 10,
  },

  header: {
    color: '#fff',
    fontSize: isVerySmall ? 20 : 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 10,
  },

  list: {
    paddingHorizontal: isVerySmall ? 12 : 16,
    paddingTop: 10,
    paddingBottom: 140,
  },
});