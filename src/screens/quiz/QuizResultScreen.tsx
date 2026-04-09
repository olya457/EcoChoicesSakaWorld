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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import images from '../../constants/images';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

const { width, height } = Dimensions.get('window');
const isVerySmall = height < 670;
const isSmall = height < 760;
const isMedium = height < 850;

export default function QuizResultScreen({ route, navigation }: Props) {
  const { score, total } = route.params;

  const passed = score > total / 2;

  const handleExit = () => {
    navigation.replace('Quiz');
  };

  const handleTryAgain = () => {
    navigation.replace('Quiz');
  };

  const handleNextLevel = () => {
    navigation.replace('Quiz');
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.centerWrap}>
          <Image
            source={images.onboardGirl5}
            style={styles.girl}
            resizeMode="contain"
          />

          <View style={styles.card}>
            <Text style={styles.scoreText}>
              You scored {score}/{total}
            </Text>

            <Text style={styles.body}>
              {passed
                ? "Great result. You're already making smarter choices and understanding what matters most."
                : "Keep trying. Every new attempt helps you notice better choices and improve step by step."}
            </Text>

            <View style={styles.row}>
              {passed ? (
                <>
                  <TouchableOpacity
                    style={styles.greenBtn}
                    onPress={handleNextLevel}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.greenText}>Next Level</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.darkBtn}
                    onPress={handleExit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.darkText}>Exit</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.yellowBtn}
                    onPress={handleTryAgain}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.yellowText}>Try Again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.darkBtn}
                    onPress={handleExit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.darkText}>Exit</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
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
    paddingHorizontal: isVerySmall ? 12 : 16,
    paddingBottom: isVerySmall ? 16 : 24,
  },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  girl: {
    width: isVerySmall ? width * 0.46 : isSmall ? width * 0.52 : width * 0.56,
    height: isVerySmall ? height * 0.18 : isSmall ? height * 0.21 : isMedium ? height * 0.24 : height * 0.26,
    marginBottom: -16,
    zIndex: 1,
  },

  card: {
    width: '100%',
    maxWidth: 410,
    backgroundColor: 'rgba(10,22,60,0.90)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: isVerySmall ? 16 : isSmall ? 20 : 24,
    paddingTop: isVerySmall ? 20 : 24,
    paddingBottom: isVerySmall ? 18 : 24,
    alignItems: 'center',
    zIndex: 2,
  },

  scoreText: {
    color: '#fff',
    fontSize: isVerySmall ? 19 : isSmall ? 21 : 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  body: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: isVerySmall ? 13 : 14,
    textAlign: 'center',
    lineHeight: isVerySmall ? 19 : 21,
    marginBottom: isVerySmall ? 18 : 22,
    paddingHorizontal: 2,
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    gap: isVerySmall ? 8 : 12,
    justifyContent: 'center',
  },

  yellowBtn: {
    flex: 1,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: isVerySmall ? 11 : 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },

  yellowText: {
    color: '#000',
    fontWeight: '700',
    fontSize: isVerySmall ? 13 : 14,
  },

  greenBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: isVerySmall ? 11 : 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },

  greenText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: isVerySmall ? 13 : 14,
  },

  darkBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: isVerySmall ? 11 : 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },

  darkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: isVerySmall ? 13 : 14,
  },
});