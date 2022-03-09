import { FontAwesome, MaterialIcons, Ionicons, AntDesign, Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          ...FontAwesome5.font,
          ...MaterialIcons.font,
          ...Ionicons.font,
          ...AntDesign.font,
          ...Entypo.font,
          ...MaterialCommunityIcons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'helvetica': require('../assets/fonts/Helvetica.ttf'),
          'roboto': require('../assets/fonts/roboto.regular.ttf'),
          'san francisco': require('../assets/fonts/SF-UI-Display-Regular.otf')
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
