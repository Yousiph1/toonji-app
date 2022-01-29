import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import {Text,ActivityIndicator, FlatList, Pressable, ScrollView, View} from 'react-native'
import axios from 'axios'

import {User} from '../components/General'
import {ThemedView} from '../components/Themed'
import {BASEURL} from '../constants/Credentials'
import { FontAwesome } from '@expo/vector-icons'

import colors from '../constants/Colors'

export default function topFansScreen({route, navigation}) {
   const {name} = route.params
   const [topFans, settopFans] = useState<{name: string, picture: string, points: string}[]>([])
   const [loading, setLoading] = useState(false)
   const [isEnd, setIsEnd] = useState(false)
   const [nextFech, setNextFech] = useState(0)
   const url = `${BASEURL}p/top-fans/${name}/${nextFech}`
   useLayoutEffect(()=> {
     navigation.setOptions({
       title: `${name}'s topFans`
     })
   })

   useEffect(()=> {
    setLoading(true)
    axios.get(url)
    .then(res => {
      settopFans(res.data.data)
      setIsEnd(res.data.isEnd)
      setNextFech(res.data.nextFech)
      setLoading(false)
      console.log(res.data)
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
   })

    const loadMore = useCallback(()=>{
      setLoading(true)
      axios.get(url)
      .then(res => {
        settopFans(prv => [...prv, ...res.data.data])
        setIsEnd(res.data.isEnd)
        setNextFech(res.data.nextFech)
        setLoading(false)
        console.log(res.data)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
    },[])

   return (
     <ThemedView style = {{flex: 1}}>
     <ScrollView>
     {topFans.map((f,ind) => {
       return (
         <View style = {{flex: 1, flexDirection: 'row'}}>
         <Text> {ind + 1} </Text>
         <User name = {f.name} points = {f.points} picture = {f.picture} />
         </View>
       )
     })}
     {(!loading && !isEnd) &&
       <Pressable onPress = {loadMore}>
        <FontAwesome name = "refresh" size = {23} color = {colors.mainColor} />
        </Pressable>
      }
     {loading && <ActivityIndicator  color = {colors.mainColor} />}</ScrollView>
     </ThemedView>
   )
}
