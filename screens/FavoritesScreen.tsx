import React,{useState, useEffect, useCallback, useContext} from 'react'
import {View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Pressable} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'


import { AuthContext } from '../navigation'
import LyricsCard from  '../components/Lyricscard'
import colors from '../constants/Colors'
import layout from '../constants/Layout'

import { BASEURL } from '../constants/Credentials';
import { ThemedText, ThemedView } from '../components/Themed';
import { Link } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function FavoritesScreen() {

  return (
    <MyTabs />
  )
}


const Tab = createMaterialTopTabNavigator()


function MyTabs() {
  const marL = ((layout.window.width / 2)/2) - 5
  return (
    <Tab.Navigator
      initialRouteName="Today"
      screenOptions={{
        tabBarActiveTintColor: colors.mainColor,
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarIndicatorStyle: {
                                backgroundColor: colors.mainColor,marginLeft: marL,
                                width: 10, height: 10, borderRadius: 50},
        tabBarStyle: {
                      backgroundColor: 'white', borderBottomColor: colors.mainColor,
                      elevation: 0
          },
      }}
    >
      <Tab.Screen
        name="Lyrics"
        component={Lyrics}
        options={{ tabBarLabel: 'Lyrics' }}
      />
      <Tab.Screen
        name="Week"
        component={Bars}
        options={{ tabBarLabel: 'Bars' }}
      />
    </Tab.Navigator>
  )
}



const Lyrics = () => {

  const [isLoading, setIsloading] = useState(false)
  const [songs, setSongs] = useState<unknown[]>([])
  const [refresh, setRefresh] = useState(false)
  const {signOut} = useContext(AuthContext)

  async function getData() {
    try{
      setIsloading(true)
      const token = await SecureStore.getItemAsync("userToken")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const res = await axios.get(BASEURL + `my/favourites/songs`,config)
     if(res.data.type !== 'ERROR') {
       setSongs(res.data)
       return
     }
     if(res.data.msg === "invalid or expired token") {
        signOut()
     }

    }catch(err) {
      console.log(err)
    }finally {
      setIsloading(false)
    }
  }

  useEffect(()=> {
   getData()
  },[])


 const onRefresh = useCallback(()=> {
  getData()
 },[])


  return (
    <View style = {{width: layout.window.width}}>

      <ScrollView
      contentContainerStyle = {{alignItems: 'center', width: '100%', paddingTop: 20}}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={onRefresh}
        />
      }
      >
      {isLoading &&  <ActivityIndicator size="large" color={colors.mainColor}/>}
      {songs.map((song,indx) => <LyricsCard key = {indx} data = {song} />)}
      </ScrollView>
      </View>
  )
}




const Bars = () => {

  const [isLoading, setIsloading] = useState(false)
  const [bars, setBars] = useState<unknown[]>([])
  const [refresh, setRefresh] = useState(false)

  async function getData() {
    try{
      setIsloading(true)
      const token = await SecureStore.getItemAsync("userToken")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
     const res = await axios.get(BASEURL + `my/favourites/bars`,config)
     if(res.data.type !== 'ERROR') setBars(res.data)
     if(res.data.msg === "invalid or expired token") {

     }
    }catch(err) {
      console.log(err)
    }finally {
      setIsloading(false)
    }
  }

  useEffect(()=> {
     getData()
  },[])

console.log(bars)
 const onRefresh = useCallback(()=> {
  getData()
 },[])


  return (
    <View style = {{width: layout.window.width}}>

      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={onRefresh}
        />
      }
      >
      {isLoading &&  <ActivityIndicator size="large" color={ colors.mainColor}/>}
      {bars.map((bar,indx) => <Bar key = {indx} {...bar} />)}
      </ScrollView>
      </View>
  )
}
type favBar = {
  bar: string;
  userFav: boolean;
  saidBy: string;
  songArtist: string;
  otherArtists: string;
  songTitle: string;
  songId: string;
  id: string
}

const Bar = (props: favBar) => {
   const {bar, userFav, songId, songTitle, songArtist, otherArtists, saidBy, id} = props
   const [fav, setFav] = useState(userFav)
   return (
     <ThemedView style = {styles.barContainer}>

     <View style = {{marginBottom: 10}}>

     <Pressable style = {({pressed}) => [{opacity: pressed ? 0.7: 1}]}>
     <Link to = {{screen:'Read', params: {songId}}}>
     <ThemedText>{songTitle}</ThemedText>
     </Link>
     </Pressable>
     <Pressable style = {({pressed}) => [{opacity: pressed ? 0.7: 1}]}>
     <Link to = {{screen:'Artist', params: {userName: songArtist}}}>
     <Text style = {{color: colors.mainColor}}>
     {songArtist} {otherArtists && otherArtists !== "undefined" ? `ft ${otherArtists}`:""}
     </Text>
     </Link>
     </Pressable>

     </View>

     <ThemedText style = {{marginBottom: 10}}>{bar}</ThemedText>

      <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Pressable
      onPress  ={() => setFav(!fav)}
      >
      <FontAwesome name = "heart" size = {20} color = {fav ? colors.mainColor : "gray"} />
      </Pressable>
      <ThemedText>~{saidBy}</ThemedText>
      </View>

     </ThemedView>
   )

}






const styles = StyleSheet.create({
   filtersContainer: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     width: '100%',
     paddingVertical: 10
   },
   filter: {
     padding: 10,
     width: '40%',
     borderRadius: 5,
     borderWidth: 2,
     borderColor: colors.mainColor
   },
   barContainer: {
     padding: 10,
     marginVertical: 5,
     marginHorizontal: 20,
     borderRadius: 5,
   }
})
