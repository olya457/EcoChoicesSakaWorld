
export interface Article {
  id: string;
  title: string;
  text: string;
  image: any;
}

export interface QuizQuestion {
  id: string;
  situation: string;
  options: string[];
  correctIndex: number;
}

export interface GameItem {
  id: string;
  name: string;
  image: any;
  isEco: boolean;
}

export interface AppState {
  ecoPoints: number;
  readArticles: string[];
  savedArticles: string[];
  musicEnabled: boolean;
  vibrationEnabled: boolean;

  addPoints: (pts: number) => void;
  markArticleRead: (id: string) => void;
  toggleSaveArticle: (id: string) => void;
  setMusic: (val: boolean) => void;
  setVibration: (val: boolean) => void;
  resetProgress: () => void;
  clearSaved: () => void;
}