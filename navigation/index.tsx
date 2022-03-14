import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, TextInput, View, StyleSheet,Text } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
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
import NotificationsScreen from '../screens/NotificationsScreen'
import { ThemedText, ThemedView } from '../components/Themed';
import FollowersScreen from '../screens/FollowersScreen';
import TopFansScreen from '../screens/TopFansScreen';
import BattlesScreen from '../screens/BattlesScreen';
import TopFanQuizScreen from '../screens/TopFanQuizScreen';
import BattleQuizScreen from '../screens/BattleQuizScreen'
import LyricsCardScreen from '../screens/LyricsCardScreen'

import Notify, { NotifyContext } from '../components/Notify'
import {AuthContext} from './context'
const Stack = createNativeStackNavigator<RootStackParamList>();

axios.defaults.withCredentials = true
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  const [message,setMessage] = React.useState("")
  const [type, setType] = React.useState<"ERROR" | "SUCCESS" | "NEUTRAL">("NEUTRAL")
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: { type: 'RESTORE_TOKEN' | 'SIGN_IN' | 'SIGN_OUT'; token?: boolean; }) => {
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
             await SecureStore.setItemAsync('userToken',  "true");
             dispatch({ type: 'SIGN_IN'});
      },

      signOut: async () =>{
          await SecureStore.setItemAsync("userToken", "false")
         dispatch({ type: 'SIGN_OUT' })
      } ,
    }),[]);

    const notifyContext = React.useMemo(()=> ({
      newNotification : (mes: string, mesType: 'ERROR' |'SUCCESS'|'NEUTRAL') => {
        setMessage(mes)
        setType(mesType)
      }
    }),[])

//!state.userToken
  return (
    <>
    <AuthContext.Provider value={authContext}>
    <NotifyContext.Provider value = {notifyContext}>
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator >
      { state.isLoading ? <Stack.Screen name = "Splash" component = {SplashScreen} /> :
         !state.userToken  ?  <>
      <Stack.Screen name="Signup" component={SignUpScreen} options={{headerShown: false}} />
      <Stack.Screen name = "Login" component = {LoginScreen} options ={{headerShown: false}} />
        </> :
        < >
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false}} />
          <Stack.Screen name = "Read" component = {ReadScreen} options ={{headerShown: false}} />
          <Stack.Screen name = "Artist" component = {ArtistScreen} options = {{headerShown: false}} />
          <Stack.Screen name = "Users" component = {UsersScreen} options = {{headerShown: false}} />
          <Stack.Screen name = "TopFanQuiz" component = {TopFanQuizScreen} options = {{title: "Top Fan Quiz"}} />
          <Stack.Screen name = "BattleQuizReady" component = {BattleQuizScreen} options = {{title: "Battle Quiz"}} />
          <Stack.Screen name = "Notifications" component = {NotificationsScreen}   />
          <Stack.Screen name = "LyricsCard" component = {LyricsCardScreen} />
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
     <Notify message = {message} type = {type} setMessage = {(msg:string)=> setMessage(msg)}/>
    </NotifyContext.Provider>
    </AuthContext.Provider>
    </>
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
        options={() => ({
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


const BattleQuiz = ({navigation}:RootTabScreenProps<"BattleQuiz">) =>  {
  const [battleId, setBattleId] = React.useState("")
  const getBattleId = (text: string) => {
    let isUrl = text.lastIndexOf("/")
    if(isUrl > 0) {
      text = text.substr(isUrl + 1)
    }
    setBattleId(text)
  }


  return (
    <ThemedView style = {{flex: 1, justifyContent: 'center'}}>

    <View style = {{paddingHorizontal: 10}}>
    <TextInput
      style={styles.input}
      placeholder= "Enter battle ID"
      value = {battleId}
      onChangeText = {getBattleId}
     />

     <Pressable onPress ={()=> navigation.navigate("BattleQuizReady",{roomId: battleId})} style = {({pressed})=> [styles.button, {opacity: pressed ? 0.7 : 1}]}>
     <Text style = {{color: 'white'}}>Connect</Text>
     </Pressable>
     </View>
     </ThemedView>
  )
}

const styles = StyleSheet.create({
  input : {
    flexShrink:1,
    borderWidth: 1,
    borderColor: Colors.mainColor,
    padding: 10,
    marginBottom: 30,
  },
  button: {
   alignItems: 'center',
   paddingVertical: 10,
   paddingHorizontal: 20,
   borderRadius: 4,
   backgroundColor: Colors.mainColor,
   marginBottom: 7,
 }
})


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
