import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import images from '../../constants/images';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');
const isVerySmall = height < 670;
const isSmall = height < 760;
const isMedium = height < 850;

export default function QuizIntroScreen() {
  const navigation = useNavigation<Nav>();

  const imageWidth = isVerySmall ? width * 0.52 : isSmall ? width * 0.58 : width * 0.64;
  const imageHeight = isVerySmall ? height * 0.22 : isSmall ? height * 0.26 : isMedium ? height * 0.29 : height * 0.32;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.centerWrap}>
          <Image
            source={images.onboardGirl2}
            style={[
              styles.girl,
              {
                width: imageWidth,
                height: imageHeight,
              },
            ]}
            resizeMode="contain"
          />

          <View style={styles.card}>
            <Text style={styles.title}>Think before you choose</Text>

            <Text style={styles.body}>
              Real-life situations.{'\n'}
              Pick the option that makes the most eco-friendly sense.
            </Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate('Quiz')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>Start</Text>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(5,15,40,0.5)',
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 24 : 10,
    paddingBottom: isVerySmall ? 18 : 24,
    paddingHorizontal: isVerySmall ? 12 : 16,
  },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  girl: {
    marginBottom: -22,
    zIndex: 1,
  },

  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(10,22,60,0.90)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: isVerySmall ? 18 : isSmall ? 22 : 26,
    paddingTop: isVerySmall ? 20 : isSmall ? 22 : 26,
    paddingBottom: isVerySmall ? 18 : isSmall ? 22 : 26,
    alignItems: 'center',
    zIndex: 2,
  },

  title: {
    color: '#fff',
    fontSize: isVerySmall ? 18 : isSmall ? 20 : 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  body: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: isVerySmall ? 13 : isSmall ? 14 : 15,
    textAlign: 'center',
    lineHeight: isVerySmall ? 20 : 22,
    marginBottom: isVerySmall ? 18 : 24,
  },

  btn: {
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: isVerySmall ? 11 : 13,
    paddingHorizontal: isVerySmall ? 40 : 60,
    minWidth: isVerySmall ? 150 : 170,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: isVerySmall ? 15 : 16,
  },
});