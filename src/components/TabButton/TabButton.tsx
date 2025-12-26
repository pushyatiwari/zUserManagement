import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Tab } from '../../constants/tabs';
import { TAB_WIDTH } from '../../screens/Home/homeStyles';

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
      testID={title.toLowerCase() + '_id'}
      style={styles.tabBtn}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBtn: {
    width: TAB_WIDTH,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#444',
    fontWeight: '600',
  },

  tabTextActive: {
    color: '#2c6bed',
    fontWeight: '700',
  },
});
