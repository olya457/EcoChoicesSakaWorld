import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  subtitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible, title, subtitle, onConfirm, onCancel,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={styles.row}>
            <TouchableOpacity style={styles.btnConfirm} onPress={onConfirm}>
              <Text style={styles.btnText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  box: {
    backgroundColor: '#1a2d4a', borderRadius: 16, padding: 24,
    width: '80%', alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  subtitle: { color: '#aaa', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  btnConfirm: {
    backgroundColor: '#e53935', paddingVertical: 10,
    paddingHorizontal: 24, borderRadius: 10,
  },
  btnCancel: {
    backgroundColor: '#4CAF50', paddingVertical: 10,
    paddingHorizontal: 24, borderRadius: 10,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});