import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import SplashScreen from '../screens/splash/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import TabNavigator from './TabNavigator';
import ArticleDetailScreen from '../screens/articles/ArticleDetailScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import QuizResultScreen from '../screens/quiz/QuizResultScreen';
import GameScreen from '../screens/game/GameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash"        component={SplashScreen} />
        <Stack.Screen name="Onboarding"    component={OnboardingScreen} />
        <Stack.Screen name="Main"          component={TabNavigator} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
        <Stack.Screen name="Quiz"          component={QuizScreen} />
        <Stack.Screen name="QuizResult"    component={QuizResultScreen} />
        <Stack.Screen name="Game"          component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}