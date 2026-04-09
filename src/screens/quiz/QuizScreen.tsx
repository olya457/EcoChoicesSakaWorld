import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Vibration,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { useAppStore } from '../../store/useAppStore';
import images from '../../constants/images';
import ConfirmDialog from '../../components/ConfirmDialog';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const { height } = Dimensions.get('window');
const isVerySmall = height < 670;
const isSmall = height < 760;

export default function QuizScreen({ navigation }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [exitDlg, setExitDlg] = useState(false);

  const { vibrationEnabled, addPoints } = useAppStore();

  const q = QUIZ_QUESTIONS[qIndex];
  const total = QUIZ_QUESTIONS.length;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);

    if (selected === q.correctIndex) {
      setScore((p) => p + 1);
      addPoints(1);
    } else {
      if (vibrationEnabled) Vibration.vibrate(300);
    }
  };

  const handleNext = () => {
    if (qIndex + 1 < total) {
      setQIndex((p) => p + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      navigation.replace('QuizResult', { score, total });
    }
  };

  const optionStyle = (i: number) => {
    if (!confirmed) return i === selected ? styles.optSelected : styles.opt;
    if (i === q.correctIndex) return styles.optCorrect;
    if (i === selected) return styles.optWrong;
    return styles.opt;
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <ConfirmDialog
        visible={exitDlg}
        title="Interrupt Quiz?"
        subtitle="Are you sure?"
        onConfirm={() => navigation.goBack()}
        onCancel={() => setExitDlg(false)}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.centerWrap}>
            <View style={styles.topRow}>
              <Text style={styles.headerTitle}>Quiz</Text>
              <TouchableOpacity onPress={() => setExitDlg(true)} activeOpacity={0.8}>
                <Text style={styles.exitText}>{'✕'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dots}>
              {QUIZ_QUESTIONS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === qIndex && styles.dotActive,
                    i < qIndex && styles.dotDone,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.question}>{q.situation}</Text>

            <View style={styles.options}>
              {q.options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={optionStyle(i)}
                  onPress={() => {
                    if (!confirmed) setSelected(i);
                  }}
                  disabled={confirmed}
                  activeOpacity={0.85}
                >
                  <Text style={styles.optText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {!confirmed ? (
              <TouchableOpacity
                style={[styles.btn, selected === null && styles.btnDisabled]}
                onPress={handleConfirm}
                disabled={selected === null}
                activeOpacity={0.85}
              >
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={handleNext} activeOpacity={0.85}>
                <Text style={styles.btnText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const topInset = 20;

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
    backgroundColor: 'rgba(5,15,40,0.6)',
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? topInset : topInset,
    paddingHorizontal: isVerySmall ? 14 : 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: isVerySmall ? 24 : 34,
  },

  centerWrap: {
    flex: 1,
    paddingTop: isVerySmall ? 6 : 10,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isVerySmall ? 10 : 12,
  },

  headerTitle: {
    color: '#fff',
    fontSize: isVerySmall ? 17 : 18,
    fontWeight: '700',
  },

  exitText: {
    color: '#aaa',
    fontSize: isVerySmall ? 18 : 20,
  },

  dots: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: isVerySmall ? 18 : 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  dot: {
    width: isVerySmall ? 9 : 10,
    height: isVerySmall ? 9 : 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  dotActive: {
    backgroundColor: '#FFD700',
  },

  dotDone: {
    backgroundColor: '#4CAF50',
  },

  question: {
    color: '#fff',
    fontSize: isVerySmall ? 15 : isSmall ? 16 : 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: isVerySmall ? 18 : 24,
    lineHeight: isVerySmall ? 22 : 24,
    paddingHorizontal: isVerySmall ? 6 : 10,
    marginTop: isVerySmall ? 6 : 10,
  },

  options: {
    gap: isVerySmall ? 8 : 10,
    marginBottom: isVerySmall ? 18 : 22,
  },

  opt: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingVertical: isVerySmall ? 12 : 14,
    paddingHorizontal: isVerySmall ? 12 : 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  optSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: isVerySmall ? 11 : 14,
    paddingHorizontal: isVerySmall ? 11 : 14,
    backgroundColor: 'rgba(255,215,0,0.12)',
  },

  optCorrect: {
    borderRadius: 12,
    paddingVertical: isVerySmall ? 12 : 14,
    paddingHorizontal: isVerySmall ? 12 : 14,
    backgroundColor: '#4CAF50',
  },

  optWrong: {
    borderRadius: 12,
    paddingVertical: isVerySmall ? 12 : 14,
    paddingHorizontal: isVerySmall ? 12 : 14,
    backgroundColor: '#e53935',
  },

  optText: {
    color: '#fff',
    fontSize: isVerySmall ? 13 : 14,
    textAlign: 'center',
    lineHeight: isVerySmall ? 18 : 20,
  },

  btn: {
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: isVerySmall ? 12 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  btnDisabled: {
    backgroundColor: 'rgba(76,175,80,0.4)',
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: isVerySmall ? 15 : 16,
  },
});