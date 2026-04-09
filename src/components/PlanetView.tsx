import React from 'react';
import { Image, StyleSheet } from 'react-native';
import images from '../constants/images';

interface Props { points: number; size?: number; }

export function getPlanetImage(points: number) {
  if (points < 25)  return images.planet1;
  if (points < 50)  return images.planet2;
  if (points < 75)  return images.planet3;
  if (points < 100) return images.planet4;
  return images.planet5;
}

export default function PlanetView({ points, size = 220 }: Props) {
  return (
    <Image
      source={getPlanetImage(points)}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="contain"
    />
  );
}