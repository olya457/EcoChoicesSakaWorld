import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View, Image, StyleSheet, Platform,
  Dimensions, ImageSourcePropType,
} from 'react-native';
import { TabParamList } from './types';

import ArticlesScreen  from '../screens/articles/ArticlesScreen';
import SavedScreen     from '../screens/saved/SavedScreen';
import ProgressScreen  from '../screens/progress/ProgressScreen';
import SettingsScreen  from '../screens/settings/SettingsScreen';
import QuizIntroScreen from '../screens/quiz/QuizIntroScreen';
import GameIntroScreen from '../screens/game/GameIntroScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const { width } = Dimensions.get('window');
const isSmall = width < 375;

const TAB_ICONS: Record<string, ImageSourcePropType> = {
  Articles: require('../assets/icons/tab_articles.png'),
  QuizTab:  require('../assets/icons/tab_quiz.png'),
  GameTab:  require('../assets/icons/tab_game.png'),
  Saved:    require('../assets/icons/tab_saved.png'),
  Progress: require('../assets/icons/tab_progress.png'),
  Settings: require('../assets/icons/tab_settings.png'),
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const source = TAB_ICONS[name];
  const size   = isSmall ? 22 : 26;

  return (
    <View style={styles.iconOuter}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Image
          source={source}
          style={[
            { width: size, height: size },
            focused ? styles.iconActive : styles.iconInactive,
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export default function TabNavigator() {
  const BAR_HEIGHT = Platform.select({
    ios:     70,
    android: 74,
    default: 70,
  })!;

  const BOTTOM_OFFSET = Platform.select({
    ios:     20,
    android: 30,
    default: 20,
  })!;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:     false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position:        'absolute',
          left:            12,
          right:           12,
          bottom:          BOTTOM_OFFSET,
          height:          BAR_HEIGHT,
          backgroundColor: 'rgba(10, 22, 60, 0.96)',
          borderTopWidth:  0,
          borderRadius:    32,
          borderWidth:     1.5,                        
          borderColor:     'rgba(76, 175, 80, 0.55)',  
          elevation:       16,
          shadowColor:     '#4CAF50',            
          shadowOffset:    { width: 0, height: 6 },
          shadowOpacity:   0.35,
          shadowRadius:    14,
          paddingTop:      0,
          paddingBottom:   0,
        },
        tabBarItemStyle: {
          flex:           1,
          alignItems:     'center',
          justifyContent: 'center',
          paddingTop:     15,
          paddingBottom:  0,
          marginTop:      0,
          marginBottom:   0,
          height:         BAR_HEIGHT,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Articles" component={ArticlesScreen} />
      <Tab.Screen name="QuizTab"  component={QuizIntroScreen} />
      <Tab.Screen name="GameTab"  component={GameIntroScreen} />
      <Tab.Screen name="Saved"    component={SavedScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconOuter: {
    flex:           1,
    width:          '100%',
    height:         '100%',
    alignItems:     'center',
    justifyContent: 'center',
  },

  iconWrap: {
    width:          isSmall ? 40 : 46,
    height:         isSmall ? 40 : 46,
    borderRadius:   isSmall ? 20 : 23,
    alignItems:     'center',
    justifyContent: 'center',
  },

  iconWrapActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.18)',
    borderWidth:     1.5,
    borderColor:     '#4CAF50',
  },

  iconInactive: {
    tintColor: 'rgba(255,255,255,0.45)',
  },

  iconActive: {
    tintColor: '#4CAF50',
  },
});