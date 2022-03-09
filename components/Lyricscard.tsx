import React,{useContext, useState} from 'react'
import {View, Text, Image, Pressable, StyleSheet} from 'react-native'
import { Link } from '@react-navigation/native';
import { FontAwesome, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient'
import * as Clipboard from 'expo-clipboard'

import colors from '../constants/Colors'
import layout from '../constants/Layout'
import {ThemedText, ThemedView} from './Themed'
import CardIcon from '../components/LyricsIcons'
import useColorScheme from '../hooks/useColorScheme'
import {cardData} from '../types'
import axios from 'axios';
import { BASEURL } from '../constants/Credentials';
import { AuthContext } from '../navigation';
import { NotifyContext } from './Notify';

const {mainColor} = colors
const cardWidth = layout.isSmallDevice ? 90/100 * layout.window.width : 85/100 * layout.window.width
const iconSize = 20

export default function LyricsCard({data} :{data:cardData}){
      const [isFavorite, setIsFavorite] = useState(data.isFav)
      const [copied, setCopied] = useState(false)
      const {signOut} = useContext(AuthContext)
      const theme = useColorScheme()
      const {newNotification} = useContext(NotifyContext)
      const copyToClipboard = () => {
        let str = data.hottesBar + "\n" + "\t \t \t \t ~" + data.artist
        Clipboard.setString(str)
        setCopied(true)
        newNotification("copied", "SUCCESS")
      }

      const addToFavourites = () => {
        axios.post(`${BASEURL}favourited/${data.songId}`)
        .then(res => {
           setIsFavorite(!isFavorite)
           newNotification(res.data.msg, 'SUCCESS')
        })
        .catch(err => {
          if(err.response?.status === 401){
            signOut()
          }else {
            newNotification(err.response?.data.msg, 'ERROR')
          }
        })
      }

     return (
       <ThemedView style = {styles.cardContainer}>
       <Image source = {{uri: data.songCover}} style = {styles.cardImage} />
       <LinearGradient
         colors={['transparent', 'transparent', 'black']}
         style={styles.cardGradient}>
       </LinearGradient>

       <View style = {styles.songInfo}>
       <View >
       <Pressable style = {({pressed})=>[{backgroundColor: pressed ? "lightgray": ""}]}>
       <Link to = {{screen:'Read', params:{songId: data.songId}}}>
       <Text style = {styles.songTitle}>{data.songTitle}</Text>
       </Link>
       </Pressable>

       <Pressable style = {({pressed})=>[{backgroundColor: pressed ? "lightgray": ""}]}>
        <Link to = {{screen: 'Artist', params:{userName: data.songArtist}}} >
       <Text style = {styles.songArtist}>{data.songArtist}</Text>
        </Link>
        </Pressable>
       </View>
       <View>
       <CardIcon  icon = {<FontAwesome size={30}  name = 'star'
                          color = {"gold"}/>} number = {<Text style = {{color: "white", fontSize:20}}>{data.rating}</Text>} />
       </View>
       </View>

       <ThemedView style = {styles.hardestBarView}>
       <ThemedText style = {styles.hardestBar}>{`${data.barPreview}`}</ThemedText>
       <View style = {styles.cardIcons}>
       <View style = {styles.cardsIconsLeft}>

       <CardIcon icon = {<MaterialIcons size={iconSize} name = "local-fire-department"
       color = {mainColor}/>} number = {<ThemedText>{data.fires}</ThemedText>}/>

       <CardIcon icon = {<FontAwesome size={iconSize} name = 'eye'
                          color = {mainColor}/>} number = {<ThemedText>{data.views}</ThemedText>} />
       <CardIcon icon = {<FontAwesome5 size={iconSize}
                          name = "comments" color = {mainColor}/>} number = {<ThemedText>{data.comments}</ThemedText>} />
       </View>
       <View style = {styles.cardIconsRight}>

       <Pressable onPress = {copyToClipboard}>
       <CardIcon icon = {<FontAwesome5 size={iconSize}
                        name = "copy"  color = {copied ? mainColor : "lightgray"}/>}/>
       </Pressable>

       <Pressable onPress = {addToFavourites}>
       <CardIcon icon = {<AntDesign size={iconSize}  name = "heart" color = {isFavorite ? mainColor : "lightgray"}/>}/>
       </Pressable>

       </View>
       </View>
       </ThemedView>

       </ThemedView>
     )
}

const imageHeight = 200

const styles = StyleSheet.create({
    cardContainer: {
      width: cardWidth,
      position: 'relative',
      borderRadius: 5,
      elevation: 10,
      shadowOffset: {width: 0, height: 0},
      shadowRadius: 5,
      shadowOpacity: 0.2,
      shadowColor: 'blue',
      marginBottom: 20,
    },
    cardImage: {
      height: imageHeight,
       width: cardWidth,
       borderRadius: 5
     },
     cardGradient: {
       position: 'absolute',
       top: 0,
       left: 0,
       width: cardWidth,
       height: imageHeight,
     },

     songInfo: {
       flexDirection: "row",
       alignItems: "center",
       justifyContent: "space-between",
       paddingHorizontal: 10,
       marginTop: -55,
     },
     songTitle: {
       fontSize: 20,
       color: "white",
       fontWeight: 'bold',
     },
     songArtist: {
       color:"white",
       fontSize: 18
     },
     hardestBarView: {
       paddingVertical: 10,
       paddingHorizontal: 5,
     },
     hardestBar: {
       fontSize: 18
     },
     cardIcons: {
       flexDirection: "row",
       justifyContent: "space-between",
       marginVertical: 10,
       paddingHorizontal: 5
     },
     cardIconsRight: {
      flexDirection: "row",
     },
     cardsIconsLeft: {
       flexDirection: "row",
     }
})
