import React,{useEffect,useState} from 'react'
import {Text, View,ScrollView, StyleSheet, Switch, ActivityIndicator} from 'react-native'
import axios from 'axios'
import { FontAwesome } from '@expo/vector-icons';

import {RootStackScreenProps} from '../types'
import {ThemedText} from '../components/Themed'
import CardIcon from '../components/LyricsIcons'
import ScreenHeader from '../components/ScreenHeader'
import Back from '../constants/Back'
import Bar from '../components/Bar'
import colors from '../constants/Colors'
import layout from '../constants/Layout'
import {BASEURL} from '../constants/Credentials'
import useColorScheme from '../hooks/useColorScheme';

let color: 'light' | 'dark' = "light"
export default function ReadScreen({route,navigation}: RootStackScreenProps<'Read'>) {
 const [isLoading, setIsLoading] = useState(false)
 const [showIcons, setShowIcons] = useState(false)
 const [bars, setBars] = useState([])
 const [pData, setPData] = useState([])
 const [headerData, setHeaderData] = useState({songTitle:'-',songArtist: '-', rating: '-', raters:'-',
                                               views:'-', favorited:false, noFavourited: '-',
                                               otherArtists: '-'})

 color = useColorScheme()
 useEffect(()=> {
   setIsLoading(true)
   axios.get(BASEURL + route.params.songId)
   .then(res => {
     const {punchlines, ...otherKeys} = res.data.modefiedData
     setBars(punchlines)
     setHeaderData(otherKeys)
     setPData(res.data.performanceData)
     setIsLoading(false)
   })
   .catch(err => {
     console.log(err)
     setIsLoading(false)
   })
 },[])

  return (
    <>
    <ScreenHeader placeholder = "search bars" goBack = {<Back goBack = {navigation.goBack}/>}/>
    <ScrollView contentContainerStyle = {styles.container}>
    <View style = {styles.header}>
    <View>
    <ThemedText style = {styles.title}>{headerData.songTitle}</ThemedText>
    <ThemedText style = {styles.artist}>{headerData.songArtist}
    {headerData.otherArtists !== '' && headerData.otherArtists !== undefined ? ` ft ${headerData.otherArtists}`: ''}</ThemedText>
    </View>
    <View style = {styles.lyricsIcons}>
    <CardIcon icon = {<FontAwesome size={20} name = 'eye'
                       color = {colors.mainColor}/>} number = {<ThemedText>{headerData.views}</ThemedText>} />
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                       color = {colors.mainColor}/>} number = {<ThemedText>{`${headerData.rating}(${headerData.raters})`}</ThemedText>} />
    </View>
    </View>
    <View style = {styles.controllsContainer}>
    <Switch
       trackColor={{ false: "darkgray", true: "lightgray" }}
       thumbColor={showIcons ? colors.mainColor : "gray" }
       ios_backgroundColor="#3e3e3e"
       onValueChange={() => setShowIcons(prev => !prev)}
       value={showIcons}
     />
     <CardIcon icon = {<FontAwesome size={20} name = 'heart'
                        color = {headerData.favorited ? colors.mainColor : 'lightgray'}/>}
                        number = {<ThemedText>{headerData.noFavourited}</ThemedText>} />
    <View style = {styles.stars}>
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                       color = {headerData.favorited ? colors.mainColor : 'lightgray'}/>}/>
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                      color = {headerData.favorited ? colors.mainColor : 'lightgray'}/>}/>
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                      color = {headerData.favorited ? colors.mainColor : 'lightgray'}/>}/>
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                      color = {headerData.favorited ? colors.mainColor : 'lightgray'}/>}/>
    </View>
    </View>
    {isLoading && <ActivityIndicator size = "large" color = {colors.mainColor} />}
    {bars.map((bar, indx)=> <Bar key = {indx} {...bar} enabled = {showIcons}/> )}
     <ArtistPerformance data = {pData} />
    </ScrollView>
    </>
  )
}


type  performanceType = {artist: string; points: string}[]

const ArtistPerformance = ({data}:{data: performanceType}) => {
  return (
    <View style = {styles.performanceContainer}>
    {data.map((p,indx)=>{
      return (<View key = {indx} style = {styles.artistPerformance}>
              <ThemedText>{p.artist}</ThemedText>
              <Text style = {styles.artistPoints}>{p.points} point{parseInt(p.points) === 1 ? '':'s'}</Text>
              </View>
            )
    })}
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors[color].background
  },
  header: {
    flex:1,
    width: layout.window.width,
    flexDirection: 'row',
    justifyContent: "space-between",
    backgroundColor: 'lightgray',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  artist: {
    color: colors.mainColor
  },
  lyricsIcons: {
    flexDirection: 'row'
  },
  controllsContainer: {
    flexDirection: 'row'
  },
  stars: {
    flexDirection: "row",
    marginHorizontal: 20
  },
  performanceContainer: {
    backgroundColor: 'lightgray',
    width: 90/100 * layout.window.width,
    borderRadius: 5,
    marginVertical: 20,
    padding: 20
  },
  artistPerformance: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 5
  },
  artistPoints: {
    color: colors.mainColor
  }
})
