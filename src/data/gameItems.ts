import images from '../constants/images';
import { GameItem } from '../store/types';

export const GAME_ITEMS: GameItem[] = [
  { id: 'g1', name: 'Metal Can', image: images.game.item1, isEco: true },
  { id: 'g2', name: 'Wooden Toothbrush', image: images.game.item2, isEco: true },
  { id: 'g3', name: 'Metal Bicycle', image: images.game.item3, isEco: true },
  { id: 'g4', name: 'Car', image: images.game.item4, isEco: false },
  { id: 'g5', name: 'Cardboard Box', image: images.game.item5, isEco: true },
  { id: 'g6', name: 'Ceramic Cup', image: images.game.item6, isEco: true },
  { id: 'g7', name: 'Reusable Towel', image: images.game.item7, isEco: true },
  { id: 'g8', name: 'Energy-saving Light Bulb', image: images.game.item8, isEco: true },
  { id: 'g9', name: 'Reusable Fabric Mask', image: images.game.item9, isEco: true },
  { id: 'g10', name: 'Disposable Batteries', image: images.game.item10, isEco: false },

  { id: 'g11', name: 'Disposable Coffee Cup', image: images.game.item11, isEco: false },
  { id: 'g12', name: 'Disposable Medical Mask', image: images.game.item12, isEco: false },
  { id: 'g13', name: 'Overpackaged Fruit', image: images.game.item13, isEco: false },
  { id: 'g14', name: 'Fruit Basket', image: images.game.item14, isEco: true },
  { id: 'g15', name: 'Glass Bottle', image: images.game.item15, isEco: true },
  { id: 'g16', name: 'Glass Jar', image: images.game.item16, isEco: true },
  { id: 'g17', name: 'Greasy Pizza Box', image: images.game.item17, isEco: false },
  { id: 'g18', name: 'Old Light Bulb', image: images.game.item18, isEco: false },
  { id: 'g19', name: 'Plastic Straw', image: images.game.item19, isEco: false },
  { id: 'g20', name: 'LED Light Bulb', image: images.game.item20, isEco: true },
];