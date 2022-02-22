import React,{useState, useEffect, useCallback, useRef, useContext} from 'react'
import {View, Text, ScrollView, Pressable, Animated, Image, StyleSheet, ActivityIndicator, RefreshControl} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import { Link } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  {FontAwesome,Ionicons,MaterialIcons} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

import {brType, RootStackScreenProps, RootTabScreenProps, ThisUserParamList} from '../types'
import {ThemedText, ThemedView} from '../components/Themed'
import  Breakdown from '../components/Breakdown'
import EditProfileScreen from './EditProfileScreen'
import {Achievement} from '../components/General'
import layout from '../constants/Layout'
import colors from '../constants/Colors'
import {BASEURL} from '../constants/Credentials'
import EditBrModal from '../components/EditBrModal';
import FollowersScreen from './FollowersScreen'
import FollowingScreen from './FollowingScreen'
import BattlesScreen from './BattlesScreen'
import SettingsScreen from './SettingsScreen'
import { AuthContext } from '../navigation';
import { NotifyContext } from '../components/Notify';

const Height_Max =  50/100 * layout.window.height
const Height_Min = 53
const Scroll_Dist = Height_Max - Height_Min

const ProfileNav = createNativeStackNavigator<ThisUserParamList>()


export default function ProfileScreen() {

  return (
    <ProfileNav.Navigator>
    <ProfileNav.Screen name = "Profile" component = {Profile} options = {{headerShown:false}}  />
    <ProfileNav.Screen name = "Battles" component = {BattlesScreen} options = {{title: 'Battles'}}  />
    <ProfileNav.Screen name = "Following" component = {FollowingScreen} />
    <ProfileNav.Screen name = "Followers" component = {FollowersScreen} options = {{}}  />
    <ProfileNav.Screen name = "Settings" component = {SettingsScreen} />
    <ProfileNav.Screen name = "Edit" component = {EditProfileScreen} options = {{title: "Edit Profile", presentation: 'modal'}} />
    </ProfileNav.Navigator>
  )
}

 function Profile({navigation}: any) {

  const [isLoading, setIsloading] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [next, setNext] = useState(0)
  const [reload, setReload] = useState(false)
  const [isModalEditVisible, setEditModalVisible] = useState(false)
  const [editData, setEditData] = useState({br:"", songId:"", punchId:"",id:""})
  const [breakdowns, setBreakdowns] = useState<breakTyp[]>([])
  const [userInfo, setUserInfo] = useState({name:'-',bio: '-', followers: '-', following:'-',
                                             points: '-', battleRecord: '-', picture:"", coins:'-'})

 const showEditModal = (data:{br:string; songId: string; punchId: string; id: string})  => {
    setEditData(data)
    setEditModalVisible(true)
 }
  const {signOut} = useContext(AuthContext)
  const {newNotification} = useContext(NotifyContext)

   const scrollY = useRef(new Animated.Value(0)).current
   const height = scrollY.interpolate({
     inputRange: [0,Scroll_Dist],
     outputRange: [Height_Max, Height_Min],
     extrapolate: 'clamp'
   })


  const nameSize =  scrollY.interpolate({
    inputRange: [0,Scroll_Dist * 2],
    outputRange: [1,  0.7],
    extrapolate: 'clamp',
  })


   const imageOpacity = scrollY.interpolate({
     inputRange: [0,Scroll_Dist/2,Scroll_Dist],
     outputRange: [1, 1, 0],
     extrapolate: 'clamp'
   })

   const shiftX = scrollY.interpolate({
     inputRange: [0,Scroll_Dist * 2],
     outputRange: [0,  45],
     extrapolate: 'clamp',
   })

   async function getToken() {
     try {
       return await SecureStore.getItemAsync("userToken")
     }catch(er) {
       console.log(er)
     }
   }

   useEffect(() => {
    const token = getToken()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
     axios.get(BASEURL + 'my/profile',config)
     .then(res => {
       if(res.data.type !== 'ERROR') {
          setUserInfo(res.data)
       }
       setReload(false)
     })
     .catch(err => {
       console.log(err)
       setReload(false)
       if(err.response?.status === 401){
         signOut()
       }
     })

   },[reload])

   useEffect(() => {
     setIsloading(true)
     const token = getToken()
     const config = {
       headers: {
         Authorization: `Bearer ${token}`
       }
     }
     axios.get(BASEURL + 'p/my/breakdowns/0',config)
     .then(res => {
         setBreakdowns(res.data.breakdowns)
         setIsloading(false)
         setIsEnd(res.data.isEnd)
         setNext(res.data.nextFetch)
         setReload(false)
     })
     .catch(err => {
       console.log(err)
       setIsloading(false)
       setReload(false)
       if(err.response?.status === 401){
         signOut()
       }
     })
   },[reload])

   const fetchMore =  useCallback(()=>{
     setIsloading(true)
     axios.get(BASEURL + 'p/my/breakdowns/' + next)
     .then(res => {
       setBreakdowns(prev => prev.concat(res.data.breakdowns))
       setIsloading(false)
       setIsEnd(res.data.isEnd)
       setNext(res.data.nextFetch)
     })
     .catch(err => {
       console.log(err)
       setIsloading(false)
     })

   },[])

   const onRefresh = () => {
     setReload(true)
   }


  return (
    <View>
    <StatusBar  style = "light" backgroundColor = "black"/>
    <Animated.View style = {[{position:'absolute', zIndex:1},{height}]}>

    <Animated.View style = {[styles.imageGradient,{backgroundColor:'black'},{height}]}>
    </Animated.View>
    {
      //{uri: userInfo.picture}
     }
    <Animated.Image source = {require('../assets/images/aotp.jpg')}
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
    {userInfo.name}
    </Animated.Text>
    </View>

    <View>

    <Pressable
     style = {({pressed}) => [{opacity: pressed ? 0.7: 1},styles.button]}
     onPress = {()=> navigation.navigate('Edit',{bio: userInfo.bio, prevName: userInfo.name, image: userInfo.picture})}
     >
     <Text style={styles.text}>Edit <FontAwesome name = "edit" size = {15}/></Text>
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

    <Animated.View style = {[{padding: 7, backgroundColor:'rgba(0, 0, 0, 0.3)', borderRadius: 50},{opacity: imageOpacity}]}>
    <Pressable
     onPress = {()=> navigation.navigate("Settings") }
     style = {({pressed})=>[{opacity: pressed ? 0.5: 1}]}
    >
    <Ionicons name= "settings" size = {25} color = "white"/>
    </Pressable>
    </Animated.View>

    </View>

    </Animated.View>

    <ScrollView contentContainerStyle = {styles.scrollContainer}
    scrollEventThrottle = {16}
    refreshControl = {
      <RefreshControl
        refreshing={reload}
        onRefresh={onRefresh}
      />
    }
    onScroll = {Animated.event([{ nativeEvent: {contentOffset: {y: scrollY}}}])}
    >
    <ThemedView style = {styles.achievementsContainer}>
    <Achievement top = {userInfo.points} bottom = "points" navigate ={false} />
    <Achievement top = {userInfo.coins} bottom = "coins" navigate = {false} />
    <Achievement thisUser = {true} userName = {userInfo.name} top = {userInfo.followers} bottom = "followers" navigate navigation = {navigation}/>
    <Achievement thisUser = {true} userName = {userInfo.name} top = {userInfo.following} bottom = "following" navigate navigation = {navigation}/>
    <Achievement thisUser = {true} userName = {userInfo.name} top = {userInfo.battleRecord} bottom = "battles" navigate navigation = {navigation}/>
    </ThemedView>

    <ThemedView style = {{padding: 20,marginHorizontal:5, borderRadius: 10}}>
    <ThemedText style = {{fontWeight: 'bold'}}>Bio</ThemedText>
    <View style = {{height: 3, width: 20, backgroundColor: colors.mainColor, marginBottom:10}}></View>
    <ThemedText>{userInfo.bio}</ThemedText>
    </ThemedView>

    <View style = {styles.songsContainer}>
    <ThemedText style = {{fontWeight: 'bold'}}>Breakdowns</ThemedText>
    <View style = {{height: 3, width: 80, backgroundColor: colors.mainColor, marginBottom:10}}></View>
     <ThemedView style = {{width: layout.window.width, alignItems:'center', paddingVertical: 20}}>
    {breakdowns.map((a,indx) => {
    return   <BreakView {...a}  key = {indx} showEditModal = {showEditModal}/>
    })}
    {(!isLoading && !isEnd) &&
      <Pressable onPress = {fetchMore}>
       <FontAwesome name = "refresh" size = {23} color = {colors.mainColor} />
       </Pressable>
     }
    {isLoading && <ActivityIndicator  color = {colors.mainColor} />}
    </ThemedView>
    </View>
    </ScrollView>
    <EditBrModal setModalVisible = {() => setEditModalVisible(false)}
                 isVisible = {isModalEditVisible} editData = {editData}/>
    </View>
  )
}


interface breakTyp {
  artist: string;
  bar: string;
  breakdown: brType;
  punchIndx: number;
  songId: string;
  songTitle: string;
  showEditModal: (dd:{br:string; songId: string; punchId: string, id: string}) => void
}


const BreakView = (props: breakTyp) => {
 const {artist, bar, songId, songTitle, punchIndx, breakdown, showEditModal} = props
  return (

    <View style = {styles.breakViewContainer}>
    <View>
    <Link to = {{screen:'Read',params:{songId}}}>
    <ThemedText>{songTitle}</ThemedText>
    </Link>
    <Link to = {{screen:'Artist',params:{userName: artist}}}>
    <Text style = {{color: colors.mainColor}}>{artist}</Text>
    </Link>
    </View>
    <ThemedText style = {{marginBottom: 10, fontSize: 16}}>{bar}</ThemedText>
    <Breakdown {...breakdown} showEditModal = {showEditModal} songId = {songId} punchId = {`${punchIndx}`}/>
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
    left: 0,
    backgroundColor: "black"
  },
  optionDot: {
    marginBottom: 3,
    width: 5,
    height: 5,
    borderRadius: 50,
    backgroundColor: "white"
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
   achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  songsContainer: {
     marginTop: 20,
     alignItems: 'center',
  },
  breakViewContainer: {
    width: '90%',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    padding: 20,
    marginBottom: 10
  },
  awardCollContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 20
  },
  buttonAw: {
   paddingVertical: 5,
   paddingHorizontal: 20,
   borderRadius: 4,
   backgroundColor: colors.mainColor,
   marginBottom: 7,
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: "gray",
    marginBottom: 7,
  },
  buttonText: {
   color: 'white',
   fontWeight: 'bold',
  }
})
