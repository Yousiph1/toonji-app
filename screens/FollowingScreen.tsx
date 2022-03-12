import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {ActivityIndicator, Pressable, ScrollView} from 'react-native'
import axios from 'axios'

import {User} from '../components/General'
import {ThemedView} from '../components/Themed'
import {BASEURL} from '../constants/Credentials'
import { FontAwesome } from '@expo/vector-icons'
import colors from '../constants/Colors'
import { NotifyContext } from '../components/Notify'


export default function FollowingScreen({route, navigation}:any) {
   const {name, thisUser} = route.params
   const [following, setfollowing] = useState<{name: string, picture: string, points: string}[]>([])
   const [loading, setLoading] = useState(false)
   const [isEnd, setIsEnd] = useState(false)
   const [nextFech, setNextFech] = useState(0)
   const {newNotification} = useContext(NotifyContext)

   const url = !thisUser ? `${BASEURL}p/following/${name}/${nextFech}` : `${BASEURL}p/my/following/${nextFech}`
   useLayoutEffect(()=> {
     navigation.setOptions({
       title: `${name}'s following`
     })
   })

   useEffect(()=> {
    setLoading(true)
    axios.get(url)
    .then(res => {
      setfollowing(res.data.data)
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
        setfollowing(prv => [...prv, ...res.data.data])
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
     <ThemedView style = {{flex: 1, padding: 20}}>
     <ScrollView>
     {following.map(f => {
       return (
         <User name = {f.name} points = {f.points} picture = {f.picture} />
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
