import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, View } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

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
import EditProfileScreen from '../screens/EditProfileScreen'
import { ThemedText } from '../components/Themed';
import { BASEURL } from '../constants/Credentials';
import BattleQuiz from '../screens/BattleQuizScreen';
import getToken from '../funcs/GetToken';
import FollowersScreen from '../screens/FollowersScreen';
import TopFansScreen from '../screens/TopFansScreen';
import BattlesScreen from '../screens/BattlesScreen';
import TopFanQuizScreen from '../screens/TopFanQuizScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const AuthContext = React.createContext<any>(null);

axios.defaults.withCredentials = true
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
            userToken: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: false,
    }
  );


  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }
      const token = userToken && userToken === "true" ? true : false
      dispatch({ type: 'RESTORE_TOKEN', token });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(() => ({

      signIn: async () => {
             SecureStore.setItemAsync('userToken',  "true");
             dispatch({ type: 'SIGN_IN'});
      },

      signOut: async () =>{
         SecureStore.setItemAsync("userToken", "false")
         dispatch({ type: 'SIGN_OUT' })
      } ,
    }),[]);

//!state.userToken
  return (
    <AuthContext.Provider value={authContext}>
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
      { state.isLoading ? <Stack.Screen name = "Splash" component = {SplashScreen} /> :
         !state.userToken  ?  <>
      <Stack.Screen name="Signup" component={SignUpScreen} options={{title: 'sign up'}} />
      <Stack.Screen name = "Login" component = {LoginScreen} options ={{title: 'login'}} />
        </> :
        < >
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false}} />
          <Stack.Screen name = "Read" component = {ReadScreen} options ={{headerShown: false}} />
          <Stack.Screen name = "Artist" component = {ArtistScreen} options = {{headerShown: false}} />
          <Stack.Screen name = "Users" component = {UsersScreen} options = {{headerShown: false}} />
          <Stack.Screen name = "TopFanQuiz" component = {TopFanQuizScreen} options = {{title: "Top Fan Quiz"}} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name = "Followers" component = {FollowersScreen} />
            <Stack.Screen name = "TopFans" component = {TopFansScreen} />
            <Stack.Screen name = "Battles" component = {BattlesScreen} />
          </Stack.Group>
          <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
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

       <BottomTab.Screen name = "BattleQuiz" component = {BattleQuiz}
        options = {{
          tabBarIcon: ({color}) =>  <MaterialCommunityIcons name="sword-cross" size={24} color= {color} />}}
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
    icon = <MaterialIcons size = {25} {...otherProps} />
  }else if(iconsProvider === 'fontawesome') {
    icon = <FontAwesome size = {25} style = {{}} {...otherProps} />
  }else {
    icon = <Entypo size = {25} style = {{}} {...otherProps} />
  }

  return icon
}
