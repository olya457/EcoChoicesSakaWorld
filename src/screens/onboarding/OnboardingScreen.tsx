import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import images from '../../constants/images';

const { width, height } = Dimensions.get('window');

const isVerySmall = height < 670;
const isSmall = height < 760;
const isMedium = height < 850;

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const SLIDES = [
  {
    id: '1',
    girl: images.onboardGirl1,
    title: 'Your choices shape the planet',
    body: 'Small everyday decisions have a real impact. See how your choices can change the world around you.',
    btn: 'Next',
  },
  {
    id: '2',
    girl: images.onboardGirl2,
    title: 'Think before you choose',
    body: 'Test yourself in real-life scenarios and discover smarter, eco-friendly options.',
    btn: 'Next',
  },
  {
    id: '3',
    girl: images.onboardGirl3,
    title: 'Learn what actually matters',
    body: 'Simple insights without overload. Just the things you can apply every day.',
    btn: 'Next',
  },
  {
    id: '4',
    girl: images.onboardGirl4,
    title: 'Play. React. Improve.',
    body: 'Quick decisions, instant feedback. Train your eco instinct through interaction.',
    btn: 'Next',
  },
  {
    id: '5',
    girl: images.onboardGirl5,
    title: 'Build your version of Earth',
    body: 'Your progress transforms the planet. What would the world look like if everyone chose like you?',
    btn: 'Begin',
  },
];

function AnimatedSlide({
  item,
  index,
  currentIndex,
  onNext,
}: {
  item: typeof SLIDES[0];
  index: number;
  currentIndex: number;
  onNext: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (index === currentIndex) {
      opacity.setValue(0);
      translateY.setValue(30);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentIndex, index, opacity, translateY]);

  const liftUp = 50;

  const imageHeight = isVerySmall
    ? height * 0.26
    : isSmall
    ? height * 0.29
    : isMedium
    ? height * 0.33
    : height * 0.36;

  const imageWidth = isVerySmall
    ? width * 0.62
    : isSmall
    ? width * 0.66
    : width * 0.70;

  const cardHorizontal = isVerySmall ? 18 : isSmall ? 22 : 24;
  const cardTop = isVerySmall ? 18 : isSmall ? 22 : 26;
  const cardBottom = isVerySmall ? 18 : isSmall ? 24 : 30;

  const titleSize = isVerySmall ? 18 : isSmall ? 20 : 22;
  const bodySize = isVerySmall ? 12 : isSmall ? 13 : 14;
  const bodyLineHeight = isVerySmall ? 18 : isSmall ? 20 : 22;

  const buttonVertical = isVerySmall ? 11 : 13;
  const buttonHorizontal = isVerySmall ? 36 : 54;

  return (
    <View style={styles.slide}>
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.centerBlock,
          {
            opacity,
            transform: [{ translateY }],
            marginTop: -liftUp,
          },
        ]}
      >
        <View style={styles.imageWrap}>
          <Image
            source={item.girl}
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
            resizeMode="contain"
          />
        </View>

        <View
          style={[
            styles.card,
            {
              paddingTop: cardTop,
              paddingBottom: cardBottom,
              paddingHorizontal: cardHorizontal,
              marginTop: 30,
            },
          ]}
        >
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>

          <Text style={[styles.title, { fontSize: titleSize }]}>
            {item.title}
          </Text>

          <Text
            style={[
              styles.body,
              {
                fontSize: bodySize,
                lineHeight: bodyLineHeight,
              },
            ]}
          >
            {item.body}
          </Text>

          <TouchableOpacity
            style={[
              styles.btn,
              {
                paddingVertical: buttonVertical,
                paddingHorizontal: buttonHorizontal,
              },
            ]}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{item.btn}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList<typeof SLIDES[0]>>(null);

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      const next = index + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: false });
      setIndex(next);
    } else {
      navigation.replace('Main', { screen: 'Articles' });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index: i }) => (
          <AnimatedSlide
            item={item}
            index={i}
            currentIndex={index}
            onNext={goNext}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  bg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,15,40,0.38)',
  },

  centerBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: -34,
    zIndex: 1,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(10,22,60,0.94)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.22)',
    alignItems: 'center',
    zIndex: 3,
  },

  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 3,
  },

  dotActive: {
    width: 20,
    backgroundColor: '#4CAF50',
  },

  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  body: {
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    marginBottom: 18,
  },

  btn: {
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: isVerySmall ? 145 : 170,
  },

  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});