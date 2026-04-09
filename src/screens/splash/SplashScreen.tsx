import React, { useEffect } from 'react';
import {
  View, Image, StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import images from '../../constants/images';

const { width, height } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const LOADER_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .loaders, .loadersB {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader {
    position: absolute;
    width: 1.15em;
    height: 13em;
    border-radius: 50px;
    background: rgba(76,175,80,0.18);
  }
  .loader:after {
    content: "";
    position: absolute;
    left: 0; top: 0;
    width: 1.15em;
    height: 5em;
    background: rgba(76,175,80,0.25);
    border-radius: 50px;
    border: 1px solid rgba(76,175,80,0.4);
    box-shadow:
      inset 5px 5px 15px rgba(76,175,80,0.2),
      inset -5px -5px 15px rgba(76,175,80,0.1);
    mask-image: linear-gradient(
      to bottom,
      black calc(100% - 48px),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      black calc(100% - 48px),
      transparent 100%
    );
  }
  .loader::before {
    content: "";
    position: absolute;
    bottom: 0; right: 0;
    width: 1.15em;
    height: 4.5em;
    background: rgba(76,175,80,0.25);
    border-radius: 50px;
    border: 1px solid rgba(76,175,80,0.4);
    box-shadow:
      inset 5px 5px 15px rgba(76,175,80,0.2),
      inset -5px -5px 15px rgba(76,175,80,0.1);
    mask-image: linear-gradient(
      to top,
      black calc(100% - 48px),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to top,
      black calc(100% - 48px),
      transparent 100%
    );
  }

  .loaderA {
    position: absolute;
    width: 1.15em;
    height: 13em;
    border-radius: 50px;
    background: transparent;
  }

  .ball0,.ball1,.ball2,.ball3,.ball4,
  .ball5,.ball6,.ball7,.ball8,.ball9 {
    width: 1.15em;
    height: 1.15em;
    box-shadow:
      rgba(76,175,80,0.4) 0px -10px 10px 0px inset,
      rgba(76,175,80,0.3) 0px -15px 15px 0px inset,
      rgba(76,175,80,0.2) 0px -40px 20px 0px inset,
      rgba(0,0,0,0.06) 0px 2px 1px,
      rgba(0,0,0,0.09) 0px 4px 2px,
      rgba(0,0,0,0.09) 0px 8px 4px,
      rgba(0,0,0,0.09) 0px 16px 8px,
      rgba(76,175,80,0.15) 0px 32px 16px,
      0px -1px 15px -8px rgba(76,175,80,0.3);
    border-radius: 50%;
    transition: transform 800ms cubic-bezier(1,-0.4,0,1.4);
    background: radial-gradient(circle at 35% 35%, #81C784, #2E7D32);
    animation: 3.63s move ease-in-out infinite;
  }

  .loader:nth-child(2)  { transform: rotate(20deg);  }
  .loader:nth-child(3)  { transform: rotate(40deg);  }
  .loader:nth-child(4)  { transform: rotate(60deg);  }
  .loader:nth-child(5)  { transform: rotate(80deg);  }
  .loader:nth-child(6)  { transform: rotate(100deg); }
  .loader:nth-child(7)  { transform: rotate(120deg); }
  .loader:nth-child(8)  { transform: rotate(140deg); }
  .loader:nth-child(9)  { transform: rotate(160deg); }

  .loaderA:nth-child(2)  { transform: rotate(20deg);  }
  .loaderA:nth-child(3)  { transform: rotate(40deg);  }
  .loaderA:nth-child(4)  { transform: rotate(60deg);  }
  .loaderA:nth-child(5)  { transform: rotate(80deg);  }
  .loaderA:nth-child(6)  { transform: rotate(100deg); }
  .loaderA:nth-child(7)  { transform: rotate(120deg); }
  .loaderA:nth-child(8)  { transform: rotate(140deg); }
  .loaderA:nth-child(9)  { transform: rotate(160deg); }

  .ball1 { animation-delay: 0.2s; }
  .ball2 { animation-delay: 0.4s; }
  .ball3 { animation-delay: 0.6s; }
  .ball4 { animation-delay: 0.8s; }
  .ball5 { animation-delay: 1.0s; }
  .ball6 { animation-delay: 1.2s; }
  .ball7 { animation-delay: 1.4s; }
  .ball8 { animation-delay: 1.6s; }
  .ball9 { animation-delay: 1.8s; }

  @keyframes move {
    0%   { transform: translateY(0em);   }
    50%  { transform: translateY(12em);  }
    100% { transform: translateY(0em);   }
  }
</style>
</head>
<body>
  <div class="main">
    <div class="loaders">
      <div class="loadersB">
        <div class="loader"></div>
        <div class="loader"></div>
        <div class="loader"></div>
        <div class="loader"></div>
        <div class="loader"></div>
        <div class="loader"></div>
        <div class="loader"></div>
        <div class="loader"></div>
        <div class="loader"></div>
      </div>
      <div class="loadersB">
        <div class="loaderA">
          <div class="ball0"></div>
        </div>
        <div class="loaderA">
          <div class="ball1"></div>
        </div>
        <div class="loaderA">
          <div class="ball2"></div>
        </div>
        <div class="loaderA">
          <div class="ball3"></div>
        </div>
        <div class="loaderA">
          <div class="ball4"></div>
        </div>
        <div class="loaderA">
          <div class="ball5"></div>
        </div>
        <div class="loaderA">
          <div class="ball6"></div>
        </div>
        <div class="loaderA">
          <div class="ball7"></div>
        </div>
        <div class="loaderA">
          <div class="ball8"></div>
        </div>
        <div class="loaderA">
          <div class="ball9"></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image
        source={images.bgLoader}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

   
      <View style={styles.overlay} />

      <View style={styles.loaderWrap}>
        <WebView
          source={{ html: LOADER_HTML }}
          style={styles.webview}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
          backgroundColor="transparent"
          androidLayerType="hardware"
        />
      </View>
    </View>
  );
}

const LOADER_SIZE = Math.min(width * 0.7, 280);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,15,40,0.5)',
  },
  loaderWrap: {
    width:  LOADER_SIZE,
    height: LOADER_SIZE,
    alignItems:     'center',
    justifyContent: 'center',
  },
  webview: {
    width:           LOADER_SIZE,
    height:          LOADER_SIZE,
    backgroundColor: 'transparent',
  },
});