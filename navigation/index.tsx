/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import ChartsScreen from '../screens/ChartsScreen';
import FavoritesScreen from '../screens/FavoritesScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ReadScreen from '../screens/ReadScreen'
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}


/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false}} />
      <Stack.Screen name = "Read" component = {ReadScreen} options ={{headerShown: false}} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
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
          headerShown: true
        }}
      />

      <BottomTab.Screen name="Favorites" component = {FavoritesScreen}
       options = {{
         tabBarIcon: ({color}) => <TabBarIcon name = "heart" color = {color} iconsProvider = "fontawesome"/>
       }}
       />

       <BottomTab.Screen name = "Profile" component = {ProfileScreen}
        options = {{
          headerShown: false,
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
