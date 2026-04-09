import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { GAME_ITEMS } from '../../data/gameItems';
import { useAppStore } from '../../store/useAppStore';
import images from '../../constants/images';
import ConfirmDialog from '../../components/ConfirmDialog';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const { width, height } = Dimensions.get('window');

const isVerySmall = height < 670;
const isSmall = height < 760;
const isMedium = height < 850;

const ITEMS_PER_LEVEL = 5;
const STORAGE_KEY = 'eco_game_saved_level';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameScreen({ navigation }: Props) {
  const shuffledItems = useMemo(() => shuffle(GAME_ITEMS), []);
  const totalLevels = Math.ceil(shuffledItems.length / ITEMS_PER_LEVEL);

  const [loading, setLoading] = useState(true);
  const [savedLevel, setSavedLevel] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [indexInLevel, setIndexInLevel] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result' | 'finished'>('playing');
  const [exitDlg, setExitDlg] = useState(false);
  const [answerState, setAnswerState] = useState<'correct' | 'wrong' | null>(null);

  const { vibrationEnabled, addPoints } = useAppStore();

  useEffect(() => {
    let mounted = true;

    const loadProgress = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? Number(raw) : 0;
        const safeLevel = Number.isFinite(parsed)
          ? Math.max(0, Math.min(parsed, totalLevels - 1))
          : 0;

        if (mounted) {
          setSavedLevel(safeLevel);
          setCurrentLevel(safeLevel);
        }
      } catch {
        if (mounted) {
          setSavedLevel(0);
          setCurrentLevel(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProgress();

    return () => {
      mounted = false;
    };
  }, [totalLevels]);

  const levelStart = currentLevel * ITEMS_PER_LEVEL;
  const levelEnd = Math.min(levelStart + ITEMS_PER_LEVEL, shuffledItems.length);
  const levelItems = shuffledItems.slice(levelStart, levelEnd);
  const currentItem = levelItems[indexInLevel];
  const itemsInCurrentLevel = levelItems.length;
  const answeredCount = indexInLevel + 1;

  const saveLevelProgress = async (level: number) => {
    const safeLevel = Math.max(0, Math.min(level, totalLevels - 1));
    setSavedLevel(safeLevel);
    await AsyncStorage.setItem(STORAGE_KEY, String(safeLevel));
  };

  const resetLevel = (level: number) => {
    setCurrentLevel(level);
    setIndexInLevel(0);
    setLevelScore(0);
    setAnswerState(null);
    setPhase('playing');
  };

  const handleAnswer = async (pickedEco: boolean) => {
    if (!currentItem || answerState) return;

    const correct = pickedEco === currentItem.isEco;

    if (correct) {
      setAnswerState('correct');
      setLevelScore((prev) => prev + 1);
      setTotalScore((prev) => prev + 1);
      addPoints(1);
    } else {
      setAnswerState('wrong');
      if (vibrationEnabled) Vibration.vibrate(250);
    }

    setTimeout(() => {
      const isLastQuestionInLevel = indexInLevel >= itemsInCurrentLevel - 1;

      if (isLastQuestionInLevel) {
        setPhase('result');
        setAnswerState(null);
      } else {
        setIndexInLevel((prev) => prev + 1);
        setAnswerState(null);
      }
    }, 320);
  };

  const handleNextRound = async () => {
    const nextLevel = currentLevel + 1;

    if (nextLevel < totalLevels) {
      await saveLevelProgress(nextLevel);
      setCurrentLevel(nextLevel);
      setIndexInLevel(0);
      setLevelScore(0);
      setAnswerState(null);
      setPhase('playing');
    } else {
      setPhase('finished');
    }
  };

  const handleRetryLevel = () => {
    resetLevel(currentLevel);
  };

  const handleExit = () => {
    navigation.goBack();
  };

  const handlePlayAgainFromSaved = () => {
    resetLevel(savedLevel);
  };

  const handleRestartFromFirst = async () => {
    await saveLevelProgress(0);
    setTotalScore(0);
    resetLevel(0);
  };

  const passedLevel = levelScore >= 4;

  const cardBorderColor =
    answerState === 'correct'
      ? '#47C363'
      : answerState === 'wrong'
      ? '#E04B4B'
      : 'rgba(255,255,255,0.16)';

  const namePlateStyle =
    answerState === 'correct'
      ? styles.namePlateCorrect
      : answerState === 'wrong'
      ? styles.namePlateWrong
      : null;

  if (loading) {
    return (
      <View style={styles.root}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
        <View style={styles.overlay} />
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </View>
    );
  }

  if (phase === 'finished') {
    return (
      <View style={styles.root}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safe}>
          <View style={styles.resultWrap}>
            <Image source={images.onboardGirl5} style={styles.resultGirl} resizeMode="contain" />

            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>All Rounds Complete</Text>
              <Text style={styles.resultBody}>
                Final score: {totalScore}
              </Text>

              <View style={styles.resultButtonsRow}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleRestartFromFirst}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleExit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryBtnText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (phase === 'result') {
    return (
      <View style={styles.root}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safe}>
          <View style={styles.resultWrap}>
            <Image
              source={passedLevel ? images.onboardGirl5 : images.onboardGirl4}
              style={styles.resultGirl}
              resizeMode="contain"
            />

            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>
                {passedLevel ? `Round ${currentLevel + 1} Complete` : `Round ${currentLevel + 1} Failed`}
              </Text>

              <Text style={styles.resultBody}>
                You answered {levelScore} of {itemsInCurrentLevel} correctly.
              </Text>

              <View style={styles.resultButtonsRow}>
                {passedLevel ? (
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleNextRound}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBtnText}>
                      {currentLevel + 1 < totalLevels ? 'Next Round' : 'Finish'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleRetryLevel}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBtnText}>Try Again</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleExit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryBtnText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <ConfirmDialog
        visible={exitDlg}
        title="Interrupt Game?"
        subtitle="Are you sure?"
        onConfirm={handleExit}
        onCancel={() => setExitDlg(false)}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.headerBox}>
          <View>
            <Text style={styles.levelText}>
              Round {currentLevel + 1}/{totalLevels}
            </Text>
            <Text style={styles.scoreTop}>Score: {totalScore}</Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setExitDlg(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Choose the correct answer for the item below
        </Text>

        <View style={styles.progressRow}>
          {Array.from({ length: itemsInCurrentLevel }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < indexInLevel && styles.progressDotDone,
                i === indexInLevel && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.contentArea}>
          <View style={[styles.imageCard, { borderColor: cardBorderColor }]}>
            <Image source={currentItem.image} style={styles.itemImage} resizeMode="contain" />
          </View>

          <View style={[styles.namePlate, namePlateStyle]}>
            <Text style={styles.itemName}>{currentItem.name}</Text>
          </View>
        </View>

        <View style={styles.bottomWrap}>
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity
              style={[styles.answerBtn, styles.ecoBtn]}
              onPress={() => handleAnswer(true)}
              activeOpacity={0.85}
              disabled={!!answerState}
            >
              <Text style={styles.answerBtnText}>Eco</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.answerBtn, styles.notEcoBtn]}
              onPress={() => handleAnswer(false)}
              activeOpacity={0.85}
              disabled={!!answerState}
            >
              <Text style={styles.answerBtnText}>Not Eco</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const imageCardWidth = isVerySmall ? width * 0.54 : isSmall ? width * 0.58 : width * 0.60;
const imageCardHeight = imageCardWidth * 1.12;

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
    backgroundColor: 'rgba(5,15,40,0.58)',
  },

  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 28 : 18,
    paddingHorizontal: isVerySmall ? 14 : 18,
    paddingBottom: isVerySmall ? 18 : 22,
  },

  headerBox: {
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(7,24,68,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  levelText: {
    color: '#FFFFFF',
    fontSize: isVerySmall ? 13 : 14,
    fontWeight: '600',
    opacity: 0.95,
    marginBottom: 4,
  },

  scoreTop: {
    color: '#FFFFFF',
    fontSize: isVerySmall ? 18 : 20,
    fontWeight: '700',
  },

  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  closeText: {
    color: '#E5E7EB',
    fontSize: 18,
    fontWeight: '700',
  },

  hint: {
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    fontSize: isVerySmall ? 12 : 13,
    lineHeight: isVerySmall ? 18 : 19,
    marginBottom: 14,
    fontWeight: '600',
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: isVerySmall ? 18 : 22,
  },

  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  progressDotDone: {
    backgroundColor: '#42C95A',
  },

  progressDotActive: {
    width: 24,
    backgroundColor: '#FFD54A',
  },

  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: isVerySmall ? 24 : 30,
  },

  imageCard: {
    width: imageCardWidth,
    height: imageCardHeight,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },

  itemImage: {
    width: imageCardWidth * 0.72,
    height: imageCardWidth * 0.72,
  },

  namePlate: {
    width: isVerySmall ? width * 0.66 : isSmall ? width * 0.62 : width * 0.58,
    minHeight: isVerySmall ? 56 : 62,
    borderRadius: 18,
    backgroundColor: 'rgba(13,58,122,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: -12,
  },

  namePlateCorrect: {
    backgroundColor: 'rgba(38,120,72,0.96)',
  },

  namePlateWrong: {
    backgroundColor: 'rgba(181,48,48,0.96)',
  },

  itemName: {
    color: '#FFFFFF',
    fontSize: isVerySmall ? 13 : 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  bottomWrap: {
    paddingHorizontal: isVerySmall ? 12 : 18,
    paddingBottom: isVerySmall ? 18 : 24,
  },

  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  answerBtn: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: isVerySmall ? 13 : 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ecoBtn: {
    backgroundColor: '#45B830',
  },

  notEcoBtn: {
    backgroundColor: '#D93B3B',
  },

  answerBtnText: {
    color: '#FFFFFF',
    fontSize: isVerySmall ? 13 : 14,
    fontWeight: '700',
  },

  resultWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultGirl: {
    width: isVerySmall ? width * 0.42 : isSmall ? width * 0.46 : width * 0.50,
    height: isVerySmall ? height * 0.20 : isSmall ? height * 0.24 : height * 0.28,
    marginBottom: -14,
    zIndex: 1,
  },

  resultCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(10,22,60,0.92)',
    borderRadius: 26,
    paddingHorizontal: isVerySmall ? 18 : 24,
    paddingTop: isVerySmall ? 22 : 26,
    paddingBottom: isVerySmall ? 20 : 24,
    alignItems: 'center',
    zIndex: 2,
  },

  resultTitle: {
    color: '#FFFFFF',
    fontSize: isVerySmall ? 20 : 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  resultBody: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: isVerySmall ? 13 : 14,
    lineHeight: isVerySmall ? 19 : 21,
    textAlign: 'center',
    marginBottom: 22,
  },

  resultButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#34D166',
    borderRadius: 20,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  primaryBtnText: {
    color: '#08250F',
    fontSize: isVerySmall ? 13 : 14,
    fontWeight: '700',
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: isVerySmall ? 13 : 14,
    fontWeight: '700',
  },
});