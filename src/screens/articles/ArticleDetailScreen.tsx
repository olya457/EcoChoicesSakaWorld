import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { ARTICLES } from '../../data/articles';
import { useAppStore } from '../../store/useAppStore';
import images from '../../constants/images';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

const { width, height } = Dimensions.get('window');
const isVerySmall = height < 670;
const isSmall = height < 760;

export default function ArticleDetailScreen({ route, navigation }: Props) {
  const { articleId } = route.params;
  const article = ARTICLES.find((a) => a.id === articleId)!;

  const { savedArticles, toggleSaveArticle, markArticleRead } = useAppStore();
  const isSaved = savedArticles.includes(article.id);

  React.useEffect(() => {
    markArticleRead(article.id);
  }, [article.id, markArticleRead]);

  const handleShare = () =>
    Share.share({ message: `${article.title}\n\nRead this eco article!` });

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'← Back'}</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Image source={article.image} style={styles.image} resizeMode="cover" />

          <View style={styles.content}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.body}>{article.text}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                <Text style={styles.icon}>{'↗️'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => toggleSaveArticle(article.id)}
              >
                <Text style={styles.icon}>{isSaved ? '💛' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(5,15,40,0.5)',
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 10,
  },

  back: {
    paddingHorizontal: isVerySmall ? 12 : 16,
    paddingVertical: 8,
    marginTop: 10,
  },

  backText: {
    color: '#4CAF50',
    fontSize: isVerySmall ? 15 : 16,
    fontWeight: '600',
  },

  scroll: {
    paddingTop: 10,
    paddingBottom: 140,
  },

  image: {
    width: '100%',
    height: isVerySmall ? 190 : isSmall ? 210 : 220,
  },

  content: {
    paddingHorizontal: isVerySmall ? 12 : 16,
    paddingTop: 10,
    paddingBottom: 20,
  },

  title: {
    color: '#fff',
    fontSize: isVerySmall ? 18 : 20,
    fontWeight: '700',
    marginBottom: 12,
  },

  body: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: isVerySmall ? 13 : 14,
    lineHeight: isVerySmall ? 20 : 22,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },

  iconBtn: {
    padding: 8,
  },

  icon: {
    fontSize: isVerySmall ? 20 : 22,
  },
});