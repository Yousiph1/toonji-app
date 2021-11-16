import React,{useState} from 'react'
import {View, Text, StyleSheet, Pressable} from 'react-native'
import { FontAwesome, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';

import {ThemedText, ThemedView} from './Themed'
import CardIcon from './LyricsIcons'
import layout from '../constants/Layout'
import colors from '../constants/Colors'

const mainColor = colors.mainColor


export default function Bar({punchline,userFav, hasIcons, rated, rating, artist, _id, enabled}:
  {punchline:string; userFav: boolean; hasIcons: boolean;
    rated: boolean; rating: string; _id: string; artist: string; enabled: boolean}) {
  const [isFavorite, setIsFavorite] = useState(userFav)
  const [hasFire, setHasFire] = useState(rated)
  const [fires, setFires] = useState(rating)

  if(!hasIcons) punchline = punchline.substr(0,punchline.length - 3)
  return (
    <ThemedView style = {styles.container} >
    <ThemedText style = {styles.bar}>
    {punchline}
    </ThemedText>
    {(hasIcons && enabled) && <View style = {styles.iconsContainer}>
    <Pressable>
    <CardIcon icon = {<FontAwesome size={18}
                     name = "copy"  color = {mainColor}/>}/>
    </Pressable>

    <Pressable>
    <CardIcon icon = {<FontAwesome5 name="lightbulb" size={18} color="lightgray" />}/>
    </Pressable>

    <Pressable onPress = {()=> setIsFavorite(!isFavorite)}>
    <CardIcon icon = {<AntDesign size={18}  name = "heart" color = {isFavorite ? mainColor : "lightgray"}/>}/>
    </Pressable>

    <Pressable onPress = {()=> setHasFire(!hasFire)}>
    <CardIcon icon = {<MaterialIcons size={20} name = "local-fire-department"
    color = {hasFire ? mainColor : "lightgray"}/>} number = {<ThemedText>{fires}</ThemedText>}/>
    </Pressable>
    </View>
  }
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  container: {
    width: layout.isSmallDevice ? 95/ 100 * layout.window.width : 85 / 100 * layout.window.width,
  },
  bar: {
  
  },
  iconsContainer: {
    flexDirection: "row",
    marginBottom: 5,
  }
})
