import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  ArticleDetail: { articleId: string };
  Quiz: undefined;
  QuizResult: { score: number; total: number };
  Game: undefined;
};

export type TabParamList = {
  Articles: undefined;
  QuizTab: undefined;
  GameTab: undefined;
  Saved: undefined;
  Progress: undefined;
  Settings: undefined;
};