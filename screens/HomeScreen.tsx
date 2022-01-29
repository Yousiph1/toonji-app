import React,{useEffect,useState} from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Text, View, Image, Pressable} from 'react-native';
import axios from 'axios'
import { Link } from '@react-navigation/native';

//import { RootTabScreenProps } from '../types';
import LyricCard from '../components/Lyricscard'
import colors from '../constants/Colors'
import Logo from '../constants/Logo'
import {BASEURL} from '../constants/Credentials'

import ScreenHeader from '../components/ScreenHeader'
import { ThemedText, ThemedView } from '../components/Themed';
import getToken from '../funcs/GetToken';

(async function(){
  const token = await getToken()
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}())
export default function HomeScreen() {
  const [data,setData] = useState({songs:[],newArrivals:[]})
  const [isLoading, setIsLoading] = useState(false)
//  const [searching, setSearching] = useState(false)
  const [searchData, setSearchData] = useState({songs: [], users:[]})

  useEffect(()=> {
    setIsLoading(true)
     axios.get(BASEURL)
     .then(res => {
       setData(res.data)
       setIsLoading(false)
     })
     .catch(err => {
       console.log(err)
       setIsLoading(false)
     })
  },[])

  const getSearchResults = (query: string) => {
    if(query.trim() === "") {
      setSearchData({songs:[], users: []})
      return
    }

    axios.get(`${BASEURL}search/${query}`)
    .then(res => {
      setSearchData(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <>
    <ScreenHeader  placeholder = "search toonji" logo = {<Logo />} searchFunc = {getSearchResults}/>
     {(searchData.songs.length > 0 || searchData.users.length > 0) && <SearchResults songs = {searchData.songs} users = {searchData.users}/>}
    <ScrollView contentContainerStyle={styles.container}>
    <Text style = {styles.header}>recommended</Text>
    { isLoading &&  <ActivityIndicator size="large" color={colors.mainColor} />}
    {data.songs.map((song,indx) => <LyricCard key = {indx} data = {song} />)}
    <Text style = {styles.header}>new arrivals</Text>
    { isLoading &&  <ActivityIndicator size="large" color= {colors.mainColor} />}
    {data.newArrivals.map((song,indx)=> <LyricCard key = {indx} data = {song} />)}
    </ScrollView>
    </>
  );
}

const SearchResults = ({songs, users}:{songs:
         {songCover: string, songTitle: string, songArtist: string, songId: string}[],
          users: {points: string; name: string, verified: boolean, picture: string}[]}) => {
   return (
     <ThemedView style = {{position: "absolute", top: 50, paddingVertical: 20, paddingHorizontal: 10,
                           zIndex: 22, width: '95%', height: "70%", alignSelf: 'center'}}>
      <ScrollView>
     {
      (songs.length > 0) && songs.map(song => {
        return (<View style = {styles.searchItemContainer} key = {song.songId}>
          <Image source = {{uri: song.songCover}} style = {{height: 70, width: 70}}/>
          <View style ={{marginLeft: 20}}>

          <Pressable  style = {({pressed}) => [{opacity: pressed ? 0.7 : 1}]} >
          <Link to = {{screen: 'Read', params:{songId: song.songId}}}>
          <ThemedText style = {{fontWeight: "bold"}}>{song.songTitle}</ThemedText>
          </Link>
          </Pressable>

          <Pressable style = {({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
          <Link to = {{screen: 'Artist', params:{userName: song.songArtist}}}>
          <Text style = {{color: colors.mainColor}}>{song.songArtist}</Text>
          </Link>
          </Pressable>

          </View>
        </View>
        )
      })
     }
      {
         (users.length > 0) && users.map( user => {
           return (
             <View style = {styles.searchItemContainer} key = {user.name}>
               <Image source = {{uri: user.picture}} style = {{height: 70, width: 70}}/>
               <View style ={{marginLeft: 20}}>

               <Pressable style = {({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
               <Link to = {user.verified ? {screen: 'Artist', params:{userName: user.name}} : {screen:'Users', params:{userName: user.name}}}>
               <ThemedText style = {{fontWeight: "bold"}}>{user.name}
               <Text style = {{color: colors.mainColor}}> {user.points} points</Text>
               </ThemedText>
                </Link>
               </Pressable>

               <Text style = {{color: colors.mainColor}}>{user.verified ? "verified artist" : "user"}</Text>
               </View>

             </View>
           )
         })
      }
      </ScrollView>
     </ThemedView>
   )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 20
  },

  header: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: "flex-start",
    color: 'lightgray',
    marginBottom: 20,
    marginLeft: 10
  },
   searchItemContainer: {
     paddingVertical: 5,
     flexDirection: "row",
     alignItems: 'center',
     borderBottomWidth: 1,
     borderBottomColor: "lightgray"
   }

});
