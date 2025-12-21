import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserRole } from '../../types/user';

type Props = {
  title: UserRole;
  active: boolean;
  onPress: () => void;
};

export const RoleButton = ({ title, active, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, active && styles.active]}
    >
      <Text style={[styles.text, active && styles.textActive]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },

  active: {
    backgroundColor: '#e9f1ff',
    borderWidth: 1,
    borderColor: '#2c6bed',
  },

  text: {
    color: '#777',
    fontWeight: '600',
  },

  textActive: {
    color: '#2c6bed',
  },
});
