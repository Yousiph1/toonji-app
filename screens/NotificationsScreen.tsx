import React, { useEffect } from 'react'
import {View,Text, StyleSheet} from 'react-native'
import { ThemedText, ThemedView } from '../components/Themed'
import axios from 'axios'
import { BASEURL } from '../constants/Credentials'

const NotificationsScreen: React.FC = () => {

  useEffect(()=> {
    axios.get(`${BASEURL}p/notifications`)
    .then(res => {
       console.log(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  })

  return (
    <ThemedView style = {{flex: 1}}>
    <ThemedText>Hello notifications </ThemedText>
    </ThemedView>
  )
}


export default NotificationsScreen
