import React, { useEffect, useState } from 'react'
import {View,Text, StyleSheet, ScrollView} from 'react-native'
import { ThemedText, ThemedView } from '../components/Themed'
import axios from 'axios'
import { BASEURL } from '../constants/Credentials'
import { FontAwesome5 } from '@expo/vector-icons'
import colors from '../constants/Colors'

const NotificationsScreen: React.FC = () => {
  const [others, setOthers] = useState<any[]>([])
  const [awards, setAwards] = useState<any[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [upvotes, setUpvotes] = useState<any[]>([])
  const [likes, setLikes] = useState<any[]>([])

  useEffect(()=> {
    axios.get(`${BASEURL}p/notifications`)
    .then(res => {
       console.log(res.data)
       setOthers(res.data.others)
       setAwards(res.data.awards)
       setFollowers(res.data.followers)
       setUpvotes(res.data.upvotes)
       setLikes(res.data.likes)
       axios.delete(`${BASEURL}p/notifications`)
       .then(res => {
       })
       .catch(err => {
       })
    })
    .catch(err => {
    })
  },[])

  return (
    <ThemedView style = {{flex: 1}}>
    <ScrollView contentContainerStyle = {{flex: 1, width: '100%'}}>
    {others && others.map((a,indx)=> {
      return (
      <View key = {indx} style = {styles.mainContainer}>
        <FontAwesome5 name = "bell" size = {24}/>
        <View style = {styles.messageContainer}>
         <ThemedText style = {styles.light}>{a}</ThemedText>
         </View>
        </View>
      )
    })}
    {awards && awards.map((a,indx)=> {
      return (
        <View key = {indx} style = {styles.mainContainer}>
          <FontAwesome5 name = "award" size = {24}/>
        <View style = {styles.messageContainer}>
         <ThemedText style = {styles.bold}>{a.userId}{" "}
          <Text style = {styles.light}>gave your {a.type}{" "}</Text>{a.award}</ThemedText>
         <ThemedText> {a.brORcommentId}</ThemedText>
         </View>
        </View>
      )
    })}

    {followers && followers.map((a,indx)=> {
      return (
        <View key = {indx} style = {styles.mainContainer}>
          <FontAwesome5 name = "user" size = {24} />
        <View style = {styles.messageContainer}>
         <ThemedText style = {styles.bold}>{a} <Text style = {styles.light}>followed you.</Text></ThemedText>
         </View>
        </View>
      )
    })}

    {upvotes && upvotes.map((a,indx)=> {
      return (
        <View key = {indx} style = {styles.mainContainer}>
          <FontAwesome5 name = "angle-up" size = {30} color = "green"/>
         <View style = {styles.messageContainer}>
         <ThemedText style = {styles.bold}>{a.userId}{" "}
         <Text style = {styles.light}>upvoted your breakdown</Text></ThemedText>
         <ThemedText style = {styles.message}> {a.brId}</ThemedText>
         </View>
        </View>
      )
    })}

    {likes && likes.map((a,indx)=> {
      return (
        <View key = {indx} style = {styles.mainContainer}>
          <FontAwesome5 name = "thumbs-up" size = {24} color = {colors.mainColor}/>
        <View style = {styles.messageContainer}>
         <ThemedText style = {styles.bold}>{a.userId}{" "}
          <ThemedText style = {styles.light}>liked your comment</ThemedText></ThemedText>
         <ThemedText style = {styles.message}> {a.commentId}</ThemedText>
         </View>
        </View>
      )
    })}
    </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
      display: "flex",
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      width: '100%',
      justifyContent: 'space-between'
    },
    messageContainer : {
      paddingTop: 5,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
      flexBasis: '85%'
    },
    bold: {
      fontSize: 16,
      fontWeight: "bold"
    },
    light: {
      fontWeight: 'normal'
    },
    message: {
      color: 'gray'
    }
})


export default NotificationsScreen
