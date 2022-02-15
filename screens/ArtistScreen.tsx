import React,{useState, useEffect, useCallback,useRef, useContext} from 'react'
import {View, Text, ScrollView, Pressable, Image, Animated, StyleSheet, ActivityIndicator} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import  {FontAwesome,MaterialIcons, Ionicons} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import axios from 'axios'

import {RootStackScreenProps} from '../types'
import {ThemedText, ThemedView} from '../components/Themed'
import LyricsCard from '../components/Lyricscard'
import {Achievement} from '../components/General'
import layout from '../constants/Layout'
import colors from '../constants/Colors'
import {BASEURL} from '../constants/Credentials'
import getToken from '../funcs/GetToken'
import { AuthContext } from '../navigation'




const Height_Max =  50/100 * layout.window.height
const Height_Min = 53
const Scroll_Dist = Height_Max - Height_Min;

(async function(){
  const token = await getToken()
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}())

export default function ArtistScreen({route, navigation}:RootStackScreenProps<'Artist'>) {
  const artist = route.params.userName
  const [isLoading, setIsloading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [following, setFollowing] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [next, setNext] = useState(9)
  const [songs, setSongs] = useState([])
  const [userInfo, setUserInfo] = useState({name:'-',bio: '-', followers: '-', noSongs: '-',
                                            topFans: '-', points: '-', following: false,
                                            picture:''})

  const {signOut} = useContext(AuthContext)

  const scrollY = useRef(new Animated.Value(0)).current
  const height = scrollY.interpolate({
    inputRange: [0,Scroll_Dist],
    outputRange: [Height_Max, Height_Min],
    extrapolate: 'clamp'
  })

  const imageOpacity = scrollY.interpolate({
    inputRange: [0,Scroll_Dist/2,Scroll_Dist],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp'
  })

  const nameSize =  scrollY.interpolate({
    inputRange: [0,Scroll_Dist * 2],
    outputRange: [1,  0.7],
    extrapolate: 'clamp',
  })

  const shiftX = scrollY.interpolate({
    inputRange: [0,Scroll_Dist * 2],
    outputRange: [0,  45],
    extrapolate: 'clamp',
  })
  const shiftI = scrollY.interpolate({
    inputRange: [0,Scroll_Dist * 2],
    outputRange: [0,  60],
    extrapolate: 'clamp',
  })

   useEffect(() => {
     axios.get(BASEURL + 'p/' + artist)
     .then(res => {
       setUserInfo(res.data)
     })
     .catch(err => {
       console.log(err)
     })

   },[])

   useEffect(() => {
     setIsloading(true)
     axios.get(BASEURL + 'p/songs/'+ artist + '/0')
     .then(res => {
       setSongs(res.data.songs)
       setIsloading(false)
       setIsEnd(res.data.isEnd)
       setNext(res.data.nextFetch)
     })
     .catch(err => {
       console.log(err)
       setIsloading(false)
     })
   },[])

   useEffect(()=> setFollowing(userInfo.following),[userInfo])


   const fetchMore =  useCallback(()=>{
     setIsloading(true)
     axios.get(BASEURL + 'p/songs/'+ artist + '/' + next)
     .then(res => {
       setSongs(prev => prev.concat(res.data.songs))
       setIsloading(false)
       setIsEnd(res.data.isEnd)
       setNext(res.data.nextFetch)
     })
     .catch(err => {
       console.log(err)
       setIsloading(false)
     })

   },[])

   const followFunc = async () => {
     setFollowLoading(true)
     axios.post(`${BASEURL}p/follow/${artist}`)
     .then(res => {
       console.log(res)
       setFollowLoading(false)
       setFollowing(prv => !prv)
     })
     .catch(err => {
       console.log(err)
       setFollowLoading(false)
       if(err.response?.status === 401) {
         signOut()
       }
     })
   }

  return (
    <View>
    <StatusBar  style = "light" backgroundColor = "black"/>

    <Animated.View style = {[{position:'absolute', zIndex:1},{height}]}>

    <Animated.View style = {[styles.imageGradient,{backgroundColor:'black'},{height}]}>
    </Animated.View>

    <Animated.Image source = {{uri: userInfo.picture}}
    style = {[styles.image,{height, opacity: imageOpacity}]} />

    <Animated.View style = {[styles.gradientContainer,{height}]}>
    <LinearGradient
      colors={['transparent', 'black']}
      style={styles.imageGradient}>
    </LinearGradient>
    </Animated.View>

    <Animated.View style = {[styles.nameContainer,{height}]}>
    <View style = {{flexBasis: '70%'}}>
    <Animated.Text style = {[styles.name,{transform:[{translateX: shiftX},{scale:nameSize}]}]}>
    {userInfo.name}{" "}

    {userInfo.name !== "-" && <Animated.View style = {{transform:[{translateX: shiftI},{scale: nameSize}]}}>
    <View style = {{position:'absolute',height: 13, width:13, top: 6, left: 6,
                    backgroundColor: 'white',borderRadius:50}}></View>
    <MaterialIcons name="verified" size={25} color=  {colors.mainColor} />
    </Animated.View>}
    </Animated.Text>
    </View>

    <View>

    <Pressable
    style={({pressed}) => [styles.button,{opacity: pressed ? 0.7:1,backgroundColor: following ? "white": colors.mainColor}]}
     onPress = {followFunc}
     >
     {followLoading ? <ActivityIndicator color = "white" size = "small"/>
                                   :
                      <Text
                      style={[styles.text,{color: following ? colors.mainColor:"white"}]}
                      >{following ? 'following': 'follow'}</Text>
              }
    </Pressable>

    </View>
    </Animated.View>
    <View style = {{width: layout.window.width, flexDirection: 'row', alignItems: 'center',
                   justifyContent: 'space-between', paddingHorizontal:10, marginTop: 3}}>
    <Pressable
     onPress = {()=> navigation.goBack() }
     style = {({pressed})=>[{opacity: pressed ? 0.5: 1}]}
    >
    <View style = {{padding: 3, backgroundColor:'rgba(0, 0, 0, 0.3)', borderRadius:50}}>
    <Ionicons name="ios-arrow-back-sharp" size={25} color={'white'} />
    </View>
    </Pressable>
    </View>

    </Animated.View>

    <ScrollView contentContainerStyle = {styles.scrollContainer}
     scrollEventThrottle = {16}
     onScroll = {Animated.event([{ nativeEvent: {contentOffset: {y: scrollY}}}])}
    >
    <ThemedView style = {styles.achievementsContainer}>
    <Achievement navigate = {false} top = {userInfo.noSongs} bottom = "songs"/>
    <Achievement navigate = {false} top = {userInfo.points} bottom = "points"/>
    <Achievement thisUser = {false} userName = {userInfo.name} top = {userInfo.followers} bottom = "followers" navigate navigation = {navigation}/>
    <Achievement thisUser = {false} userName = {userInfo.name} top = {userInfo.topFans} bottom = "top fans" navigate navigation = {navigation}/>
    </ThemedView>

    <ThemedView style = {{padding: 20,marginHorizontal:5, borderRadius: 10}}>
    <ThemedText style = {{fontWeight: 'bold'}}>Bio</ThemedText>
    <View style = {{height: 3, width: 20, backgroundColor: colors.mainColor, marginBottom:10}}></View>
    <ThemedText>{userInfo.bio}</ThemedText>
    </ThemedView>

    <View style = {styles.songsContainer}>
    <ThemedText style = {{fontWeight: 'bold'}}>Songs</ThemedText>
    <View style = {{height: 3, width: 40, backgroundColor: colors.mainColor, marginBottom:10}}></View>
    {songs.map((a,indx) => <LyricsCard data = {a} key = {indx} />)}
    {(!isLoading && !isEnd) &&
      <Pressable onPress = {fetchMore}>
       <FontAwesome name = "refresh" size = {18} color = {colors.mainColor} />
       </Pressable>
     }
    {isLoading && <ActivityIndicator  color = {colors.mainColor} />}
    </View>

    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
   scrollContainer: {
     marginVertical: Height_Max,
     paddingBottom: Height_Max
   },
   image: {
     width: layout.window.width,
     position: 'absolute',
     top: 0,
     left: 0
   },
   gradientContainer: {
     position: "absolute",
     left: 0,
     top: 0,
     width: layout.window.width,
     overflow: "hidden"
   },
   imageGradient: {
     position: 'absolute',
     width: layout.window.width,
     height: Height_Max

   },
   nameContainer:  {
     position: 'absolute',
     top:0,
     left: 0,
     width: layout.window.width,
     flexDirection: 'row',
     justifyContent:'space-between',
     alignItems: 'flex-end',
     paddingHorizontal: 10,

   },
   name: {
     color: 'white',
     fontSize: 40,
     fontWeight: 'bold',
   },
   button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: colors.mainColor,
    marginBottom: 7
  },
  optionDot: {

  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
   achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  songsContainer: {
     marginTop: 20,
     alignItems: 'center',
     padding: 20,
  }
})

/*
<View style = {{flexBasis: '70%'}}>
<Animated.Text style = {[styles.name,{transform:[{translateX: shiftX},{scale: nameSize}]}]}>
{userInfo.name}{" "}

{userInfo.name !== "-" && <Animated.View style = {{transform:[{translateX: shiftI},{scale: nameSize}]}}>
<View style = {{position:'absolute',height: 13, width:13, top: 6, left: 6,
                backgroundColor: 'white',borderRadius:50}}></View>
<MaterialIcons name="verified" size={25} color=  {colors.mainColor} />
</Animated.View>}

</Animated.Text>

</View>
*/
