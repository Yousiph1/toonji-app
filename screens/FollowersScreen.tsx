import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import {Text, ActivityIndicator, Pressable, ScrollView} from 'react-native'
import axios from 'axios'

import {User} from '../components/General'
import {ThemedView} from '../components/Themed'
import {BASEURL} from '../constants/Credentials'
import { FontAwesome } from '@expo/vector-icons'

import colors from '../constants/Colors'

export default function FollowersScreen({route, navigation}) {
   const {name, thisUser} = route.params
   const [followers, setFollowers] = useState<{name: string, picture: string, points: string}[]>([])
   const [loading, setLoading] = useState(false)
   const [isEnd, setIsEnd] = useState(false)
   const [nextFech, setNextFech] = useState(0)
   const url = !thisUser ? `${BASEURL}p/followers/${name}/${nextFech}` : `${BASEURL}p/my/followers/${nextFech}`
   useLayoutEffect(()=> {
     navigation.setOptions({
       title: `${name}'s followers`
     })
   })

   useEffect(()=> {
    setLoading(true)
    axios.get(url)
    .then(res => {
      setFollowers(res.data.data)
      setIsEnd(res.data.isEnd)
      setNextFech(res.data.nextFech)
      setLoading(false)
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
  },[])

    const loadMore = useCallback(()=>{
      setLoading(true)
      axios.get(url)
      .then(res => {
        setFollowers(prv => [...prv, ...res.data.data])
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
     <ThemedView style = {{flex: 1, padding: 20}}>
     <ScrollView>
     {followers.map(f => {
       return (
         <User name = {f.name} points = {f.points} picture = {f.picture} />
       )
     })}
     {(!loading && !isEnd) &&
       <Pressable onPress = {loadMore}>
        <FontAwesome name = "refresh" size = {23} color = {colors.mainColor} />
        </Pressable>
      }
     {loading && <ActivityIndicator  color = {colors.mainColor} />}
     </ScrollView>
     </ThemedView>
   )
}
