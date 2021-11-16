import React,{useEffect,useState} from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Text} from 'react-native';
import axios from 'axios'

//import { RootTabScreenProps } from '../types';
import LyricCard from '../components/Lyricscard'
import colors from '../constants/Colors'
import Logo from '../constants/Logo'
import {BASEURL} from '../constants/Credentials'

import ScreenHeader from '../components/ScreenHeader'

export default function HomeScreen() {
  const [data,setData] = useState({songs:[],newArrivals:[]})
  const [isLoading, setIsLoading]  = useState(false)

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

  return (
    <>
    <ScreenHeader  placeholder = "search toonji" logo = {<Logo />}/>
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
  }

});
