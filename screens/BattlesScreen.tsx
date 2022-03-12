import { Link } from '@react-navigation/native'
import React,{ useCallback, useContext, useEffect, useState } from 'react'
import {View,Text,ScrollView, ActivityIndicator, Image, StyleSheet, Pressable} from 'react-native'
import axios from 'axios'
import { ThemedView } from '../components/Themed'
import { FontAwesome } from '@expo/vector-icons'
import { BASEURL } from '../constants/Credentials'
import colors from '../constants/Colors'
import { RootStackScreenProps } from '../types'
import { NotifyContext } from '../components/Notify'

const BattlesScreen = ({route}:RootStackScreenProps<"Battles">) => {
  const [loading, setLoading] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
//  const [nextFetch, setNextFech] = useState(false)
  const [faceoffData, setFaceOffData] = useState<{userOne: battleData, userTwo:battleData}[]>([])
  const {name, thisUser} = route.params
  const path = thisUser ? 'my/battle-records' : `battle-records/${name}`
  const {newNotification} = useContext(NotifyContext)
  useEffect(()=> {
    axios.get(BASEURL + path)
            .then(res =>{
               setFaceOffData(res.data)
            }).catch(e =>{
               newNotification(e.response?.data.msg, 'ERROR')
            })
  },[])

  const loadMore = useCallback(() => {
    setLoading(true)
    axios.get(BASEURL + path)
    .then(res => {
      setFaceOffData(prv => [...prv, ...res.data.data])
      setIsEnd(res.data.isEnd)
    //  setNextFech(res.data.nextFech)
      setLoading(false)
      console.log(res.data)
    })
    .catch(err => {
      setLoading(false)
      newNotification(err.response?.data.msg, 'ERROR')
    })
  },[])

  return (
    <ThemedView style ={{flex:1, paddingVertical: 20}}>
    <ScrollView contentContainerStyle ={{flex: 1, alignItems: 'center'}}>
    {
      faceoffData.map((a,indx)=> {
            return (
              <Battle userData = {a.userOne} opponentData = {a.userTwo}  key = {indx}/>
            )
          })
        }
        {(!loading && !isEnd) &&
          <Pressable onPress = {loadMore}>
           <FontAwesome name = "refresh" size = {20} color = {colors.mainColor} />
           </Pressable>
         }
        {loading && <ActivityIndicator  color = {colors.mainColor} />}
        </ScrollView>
    </ThemedView>
  )
}

interface battleData {
  name: string;
  points: number;
  picture: string;
}

const Battle: React.FC<{userData: battleData; opponentData: battleData}> = (props) => {
  let userPoints = props.userData.points
     let oppPoints = props.opponentData.points
   return (
     <View style = {{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
      <View style = {styles.userInfoContainer}>
      <Image source = {{uri: props.userData.picture}} style = {styles.image}/>
      <Link to = {{screen:"Users",params:{userName: props.userData.name}}}><Text>{'  ' + props.userData.name}</Text></Link>
      <Text style = {[{color: userPoints > oppPoints ? "green": userPoints < oppPoints ? "red":colors.mainColor}]}>{'  '+userPoints}</Text>
      </View>
      <Text style = {{marginRight: 10, fontWeight: 'bold'}}> vs </Text>
      <View style = {styles.userInfoContainer}>
      <Image source = {{uri: props.opponentData.picture}} style = {styles.image}/>
      <Link to = {{screen:"Users",params:{userName: props.opponentData.name}}}><Text>{'  ' + props.opponentData.name}</Text></Link>
      <Text style = {[{color: userPoints > oppPoints ? "red": userPoints < oppPoints ? "green":colors.mainColor}]}>{'  '+ oppPoints}</Text>
      </View>
     </View>
   )
}

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexBasis: '40%',
  },
   image: {
     height: 40,
     width: 40,
     borderRadius: 50,
     backgroundColor: 'gray'
   },
   userInfoTextContainer: {
     marginLeft: 10,
   },
})

export default BattlesScreen
