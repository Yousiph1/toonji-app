import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, View } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import ArtistScreen from '../screens/ArtistScreen'
import ChartsScreen from '../screens/ChartsScreen';
import FavoritesScreen from '../screens/FavoritesScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ReadScreen from '../screens/ReadScreen'
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import UsersScreen from '../screens/UsersScreen';
import SignUpScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import { ThemedText } from '../components/Themed';
import axios from 'axios';
import { BASEURL } from '../constants/Credentials';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const AuthContext = React.createContext();

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {



  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  console.log(state)

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await SecureStore.getItemAsync('userToken');
        console.log(userToken)
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(() => ({

      signIn: async (token : string) => {
             SecureStore.setItemAsync('userToken',  token);
             dispatch({ type: 'SIGN_IN', token: token});
      },

      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );


  return (
    <AuthContext.Provider value={authContext}>
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
      { state.isLoading ? <Stack.Screen name = "Splash" component = {SplashScreen} /> :
        !state.userToken ?  <>
      <Stack.Screen name="Signup" component={SignUpScreen} options={{title: 'sign up'}} />
      <Stack.Screen name = "Login" component = {LoginScreen} options ={{title: 'login'}} />
        </> :
        < >
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false}} />
          <Stack.Screen name = "Read" component = {ReadScreen} options ={{headerShown: false}} />
          <Stack.Screen name = "Artist" component = {ArtistScreen} options = {{headerShown: false}} />
          <Stack.Screen name = "Users" component = {UsersScreen} options = {{headerShown: false}} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
        </>
      }
        </Stack.Navigator>

    </NavigationContainer>
    </AuthContext.Provider>
  );
}


  function SplashScreen() {
    return (
      <View>
      <ThemedText>Loading...</ThemedText>
      </View>
    );
  }



const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName= "Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} iconsProvider = "material"/>
        })}
      />
      <BottomTab.Screen
        name="Charts"
        component={ChartsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-graph" color={color} iconsProvider = "entypo"/>,
        }}
      />

      <BottomTab.Screen name="Favorites" component = {FavoritesScreen}
       options = {{
         tabBarIcon: ({color}) => <TabBarIcon name = "heart" color = {color} iconsProvider = "fontawesome"/>
       }}
       />

       <BottomTab.Screen name = "Profile" component = {ProfileScreen}
        options = {{
          tabBarIcon: ({color}) =>  <TabBarIcon name = "user" color = {color} iconsProvider = "fontawesome"/>}}
        />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  iconsProvider: 'entypo' | 'fontawesome' | 'material'
}) {
  const {iconsProvider,...otherProps} = props
  let icon = <FontAwesome size = {25} style = {{}} name = "code"/>

  if(iconsProvider === "material") {
    icon = <MaterialIcons size = {25} style = {{}} {...otherProps} />
  }else if(iconsProvider === 'fontawesome') {
    icon = <FontAwesome size = {25} style = {{}} {...otherProps} />
  }else if(iconsProvider === "entypo") {
    icon = <Entypo size = {25} style = {{}} {...otherProps} />
  }

  return icon
}
