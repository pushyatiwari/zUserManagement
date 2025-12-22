import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  error?: string;
  testId?: string
};

export const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  testId,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        testID={testId}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, error && styles.inputError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    color: '#777',
    marginBottom: 6,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 40,
  },

  inputError: {
    borderBottomColor: '#d93025',
  },

  error: {
    color: '#d93025',
    fontSize: 13,
    marginTop: 6,
  },
});
