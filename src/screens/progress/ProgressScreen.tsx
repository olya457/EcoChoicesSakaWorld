import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import images from '../../constants/images';
import PlanetView from '../../components/PlanetView';

const { width, height } = Dimensions.get('window');

const isVerySmall = height < 670;
const isSmall = height < 760;
const isMedium = height < 850;

export default function ProgressScreen() {
  const { ecoPoints } = useAppStore();
  const pct = Math.max(0, Math.min(100, Math.round(ecoPoints)));

  const planetSize = isVerySmall ? 170 : isSmall ? 190 : isMedium ? 205 : 220;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.topBlock}>
          <Text style={styles.header}>Your Planet</Text>

          <Text style={styles.sub}>
            Read articles, take the quiz and play the game.{'\n'}
            Your eco knowledge directly shapes the health of our planet.
          </Text>
        </View>

        <View style={styles.planetSection}>
          <View style={styles.planetWrap}>
            <PlanetView points={ecoPoints} size={planetSize} />
          </View>
        </View>

        <View style={styles.bottomBlock}>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${pct}%` as `${number}%` }]} />
            <Text style={styles.barLabel}>{pct}/100</Text>
          </View>
        </View>
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
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,15,40,0.52)',
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingHorizontal: isVerySmall ? 14 : 18,
  },

  topBlock: {
    alignItems: 'center',
    paddingTop: isVerySmall ? 16 : isSmall ? 22 : 28,
    paddingHorizontal: isVerySmall ? 4 : 10,
  },

  header: {
    color: '#fff',
    fontSize: isVerySmall ? 18 : isSmall ? 20 : 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },

  sub: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: isVerySmall ? 11.5 : 13,
    textAlign: 'center',
    lineHeight: isVerySmall ? 16 : 19,
    maxWidth: 560,
  },

  planetSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: isVerySmall ? 0 : 6,
    paddingBottom: isVerySmall ? 4 : isSmall ? 10 : 18,
  },

  planetWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isVerySmall ? 0 : 6,
  },

  bottomBlock: {
    width: '100%',
    paddingBottom: isVerySmall ? 112 : isSmall ? 124 : 136,
    alignItems: 'center',
    marginTop: -20,
  },

  barBg: {
    width: isVerySmall ? '92%' : '94%',
    height: isVerySmall ? 32 : 36,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },

  barLabel: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: isVerySmall ? 13 : 15,
  },
});