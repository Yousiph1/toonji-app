import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text,ActivityIndicator, Pressable, ScrollView, View} from 'react-native'
import axios from 'axios'

import {User} from '../components/General'
import {ThemedText, ThemedView} from '../components/Themed'
import {BASEURL} from '../constants/Credentials'
import { FontAwesome } from '@expo/vector-icons'

import colors from '../constants/Colors'
import { NotifyContext } from '../components/Notify'

export default function topFansScreen({route, navigation}: any) {
   const {name} = route.params
   const [topFans, settopFans] = useState<{name: string, picture: string, points: string}[]>([])
   const [loading, setLoading] = useState(false)
   const [isEnd, setIsEnd] = useState(false)
   const [nextFech, setNextFech] = useState(0)
   const {newNotification} = useContext(NotifyContext)

   const url = `${BASEURL}p/top-fans/${name}/${nextFech}`
   useLayoutEffect(()=> {
     navigation.setOptions({
       title: `${name}'s  Top Fans`
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

    })
    .catch(err => {
      setLoading(false)
      newNotification(err.response?.data.msg, 'ERROR')
    })
  },[])

    const loadMore = useCallback(()=>{
      setLoading(true)
      axios.get(url)
      .then(res => {
        settopFans(prv => [...prv, ...res.data.data])
        setIsEnd(res.data.isEnd)
        setNextFech(res.data.nextFech)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        newNotification(err.response?.data.msg, 'ERROR')
      })
    },[])

   return (
     <ThemedView style = {{flex: 1, padding: 20, justifyContent: 'center'}}>
     <ScrollView  contentContainerStyle = {{}}>
     {topFans.map((f,ind) => {
       return (
         <View key = {f.name} style = {{flex: 1, paddingTop: 5, flexDirection: 'row', alignItems: 'center'}}>
         <ThemedText style = {{marginTop: -7, fontWeight: 'bold', fontSize: 20, flexBasis: '10%'}}> {ind + 1} </ThemedText>
         <User name = {f.name} points = {f.points} picture = {f.picture} topFan/>
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
