import React from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Dimensions, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { ARTICLES } from '../../data/articles';
import { useAppStore } from '../../store/useAppStore';
import images from '../../constants/images';
import ArticleCard from '../../components/ArticleCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { height } = Dimensions.get('window');
const isVerySmall = height < 670;
const isSmall = height < 760;

export default function SavedScreen() {
  const navigation = useNavigation<Nav>();
  const { savedArticles, toggleSaveArticle } = useAppStore();
  const saved = ARTICLES.filter((a) => savedArticles.includes(a.id));

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.header}>Favorites</Text>
        {saved.length === 0 ? (
          <View style={styles.empty}>
            <Image
              source={images.onboardGirl1}
              style={styles.girlEmpty}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyBody}>
              {'Explore articles and save what matters to you.\nBuild your personal eco guide.'}
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate('Main', { screen: 'Articles' })}
            >
              <Text style={styles.btnText}>Start</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={saved}
            keyExtractor={(a) => a.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ArticleCard
                article={item}
                isSaved={true}
                onSave={() => toggleSaveArticle(item.id)}
                onRead={() =>
                  navigation.navigate('ArticleDetail', { articleId: item.id })
                }
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,15,40,0.55)',
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 20,
  },
  header: {
    color: '#fff',
    fontSize: isVerySmall ? 20 : 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: isVerySmall ? 4 : 0,
  },
  list: {
    paddingHorizontal: isVerySmall ? 12 : 16,
    paddingBottom: 140,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: isVerySmall ? 120 : isSmall ? 140 : 160,
    paddingHorizontal: isVerySmall ? 16 : 20,
  },
  girlEmpty: {
    width: isVerySmall ? '58%' : isSmall ? '62%' : '65%',
    height: isVerySmall ? '34%' : isSmall ? '40%' : '45%',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: isVerySmall ? 18 : 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyBody: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: isVerySmall ? 13 : 14,
    textAlign: 'center',
    lineHeight: isVerySmall ? 18 : 20,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: isVerySmall ? 11 : 13,
    paddingHorizontal: isVerySmall ? 46 : 60,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: isVerySmall ? 15 : 16,
  },
});