import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Tab } from '../../constants/tabs';

export const TabButton = ({
  title,
  active,
  onPress,
}: {
  title: Tab;
  active: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.tabBtn, active && styles.tabBtnActive]}
    >
      <Text testID={title.toLowerCase() + '_id'} style={[styles.tabText, active && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2c6bed',
  },

  tabText: {
    color: '#444',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#2c6bed',
  },
});
