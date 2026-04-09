import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Share,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import images from '../../constants/images';
import ConfirmDialog from '../../components/ConfirmDialog';

const { width, height } = Dimensions.get('window');
const isVerySmall = height < 670;
const isSmall = height < 760;
const isMedium = height < 850;

export default function SettingsScreen() {
  const {
    musicEnabled,
    vibrationEnabled,
    setMusic,
    setVibration,
    resetProgress,
    clearSaved,
  } = useAppStore();

  const [showReset, setShowReset] = useState(false);
  const [showClear, setShowClear] = useState(false);

  const handleShare = () =>
    Share.share({ message: 'Check out this eco app and help the planet! 🌍' });

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={images.bgMain} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />

      <ConfirmDialog
        visible={showReset}
        title="Reset Progress?"
        subtitle="Are you sure?"
        onConfirm={() => {
          resetProgress();
          setShowReset(false);
        }}
        onCancel={() => setShowReset(false)}
      />

      <ConfirmDialog
        visible={showClear}
        title="Clear Favorites?"
        subtitle="Are you sure?"
        onConfirm={() => {
          clearSaved();
          setShowClear(false);
        }}
        onCancel={() => setShowClear(false)}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.header}>Settings</Text>

          <View style={styles.rows}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Switch
                value={musicEnabled}
                onValueChange={(v: boolean) => setMusic(v)}
                trackColor={{ false: '#555', true: '#4CAF50' }}
                thumbColor="#fff"
                ios_backgroundColor="#555"
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Vibration</Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={(v: boolean) => setVibration(v)}
                trackColor={{ false: '#555', true: '#4CAF50' }}
                thumbColor="#fff"
                ios_backgroundColor="#555"
              />
            </View>

            <TouchableOpacity style={styles.row} onPress={() => setShowReset(true)} activeOpacity={0.85}>
              <Text style={styles.rowLabel}>Reset Progress</Text>
              <Text style={styles.icon}>{'🔄'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.lastRow} onPress={() => setShowClear(true)} activeOpacity={0.85}>
              <Text style={styles.rowLabel}>Clear Favorites</Text>
              <Text style={styles.icon}>{'🗑️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
            <Text style={styles.shareText}>{'Share App  ↗'}</Text>
          </TouchableOpacity>

          <View style={styles.planetWrap}>
            <Image
              source={images.planetSettings}
              style={styles.planet}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const planetSize = isVerySmall ? 150 : isSmall ? 170 : isMedium ? 188 : 200;

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
    backgroundColor: 'rgba(5,15,40,0.5)',
  },

  safe: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 26 : 8,
    paddingHorizontal: isVerySmall ? 14 : 20,
    paddingBottom: isVerySmall ? 96 : isSmall ? 112 : 124,
  },

  header: {
    color: '#fff',
    fontSize: isVerySmall ? 20 : isSmall ? 21 : 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: isVerySmall ? 10 : 14,
    marginBottom: isVerySmall ? 18 : 22,
  },

  rows: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: isVerySmall ? 14 : 18,
    marginTop: isVerySmall ? 6 : 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  row: {
    minHeight: isVerySmall ? 68 : 74,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: isVerySmall ? 10 : 12,
    paddingHorizontal: isVerySmall ? 14 : 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },

  lastRow: {
    minHeight: isVerySmall ? 68 : 74,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: isVerySmall ? 10 : 12,
    paddingHorizontal: isVerySmall ? 14 : 16,
  },

  rowLabel: {
    color: '#fff',
    fontSize: isVerySmall ? 14 : 16,
    flexShrink: 1,
    paddingRight: 12,
  },

  icon: {
    fontSize: isVerySmall ? 18 : 20,
  },

  shareBtn: {
    backgroundColor: '#FFD700',
    borderRadius: 28,
    minHeight: isVerySmall ? 54 : 58,
    paddingVertical: isVerySmall ? 13 : 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isVerySmall ? 12 : 16,
  },

  shareText: {
    color: '#000',
    fontWeight: '700',
    fontSize: isVerySmall ? 15 : 16,
    textAlign: 'center',
  },

  planetWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: isVerySmall ? 4 : 8,
    paddingBottom: isVerySmall ? 0 : 4,
    marginTop: -4,
  },

  planet: {
    width: planetSize,
    height: planetSize,
    alignSelf: 'center',
    marginTop: -30,
  },
});