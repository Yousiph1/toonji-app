import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from '../components/Themed';

import { RootStackScreenProps } from '../types';

export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>This screen doesn't exist.</ThemedText>
      <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
        <ThemedText style={styles.linkThemedText}>Go to home screen!</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkThemedText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
