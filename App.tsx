import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//import {StatusBar as bar} from 'react-native'
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {AsyncStore as AsyncStorage} from './funcs/AsyncStore';
import { ThemeContext } from './navigation/context'
import Constants from 'expo-constants'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [colorScheme, setColorScheme] = useState<"light"|"dark">(useColorScheme());
  useEffect(()=>{

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('theme') as "light" | "dark"
        if(value) setColorScheme(value)
      } catch(e) {
        // error reading value
      }
    }
     getData()

  },[])

  const status = useMemo(()=> {
    return  <StatusBar style = {colorScheme === "dark" ? "light":"dark"} backgroundColor = {colorScheme === "dark" ? "black" : "white"}/>
  },[colorScheme])

  const themeContext = useMemo(()=> ({
    changeTheme: (val: "light" | "dark") => {
      setColorScheme(val)
    },
    color: colorScheme
  }),[colorScheme])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeContext.Provider value = {themeContext} >
      <SafeAreaProvider style = {{marginTop: Constants.statusBarHeight}}>
        <Navigation colorScheme={colorScheme} />
        {status}
      </SafeAreaProvider>
      </ThemeContext.Provider>
    );
  }
}
