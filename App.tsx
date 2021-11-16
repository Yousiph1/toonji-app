import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {StatusBar as bar} from 'react-native'
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider style = {{marginTop: bar.currentHeight}}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar backgroundColor = "#764abc"/>
      </SafeAreaProvider>
    );
  }
}
