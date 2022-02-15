import React,{useState, useEffect, useCallback, useRef, useContext} from 'react'
import {View, Text, ScrollView, Pressable, Animated, Image, StyleSheet, ActivityIndicator} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import { Link } from '@react-navigation/native';
import  {FontAwesome,Ionicons,MaterialIcons} from '@expo/vector-icons'
import Modal from "react-native-modal"
import { StatusBar } from 'expo-status-bar'
import axios from 'axios'

import {awardReq, brType, RootStackScreenProps} from '../types'
import {ThemedText, ThemedView} from '../components/Themed'
import  Breakdown from '../components/Breakdown'
import {Achievement, AwardInfo} from '../components/General'
import layout from '../constants/Layout'
import colors from '../constants/Colors'
import {BASEURL} from '../constants/Credentials'
import getToken from '../funcs/GetToken';
import { AuthContext } from '../navigation';



const Height_Max =  50/100 * layout.window.height
const Height_Min = 53
const Scroll_Dist = Height_Max - Height_Min;


(async function(){
  const token = await getToken()
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}())
export default function UsersScreen({route, navigation}:RootStackScreenProps<'Users'>) {
  const user = route.params.userName
  const [isLoading, setIsloading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [givingAward, setGivingAward] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [awardData, setAwardData] = useState<awardReq>({type:"breakdown", songId:""})
  const [awardsGiven, setAwardsGiven] = useState<string[]>([])
  const [next, setNext] = useState(9)
  const [following, setFollowing] = useState(false)
  const [breakdowns, setBreakdowns] = useState<breakTyp[]>([])
  const [userInfo, setUserInfo] = useState({name:'-',bio: '-', followers: '-', following: false,
                                             points: '-', battleRecord: '-', picture:""})
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


   useEffect(() => {
     axios.get(BASEURL + 'p/' + user)
     .then(res => {
       setUserInfo(res.data)
     })
     .catch(err => {
       console.log(err)
     })

   },[])

    useEffect(()=> setFollowing(userInfo.following),[userInfo])

   useEffect(() => {
     setIsloading(true)
     axios.get(BASEURL + 'p/breakdowns/'+ user + '/0')
     .then(res => {
       setBreakdowns(res.data.breakdowns)
       setIsloading(false)
       setIsEnd(res.data.isEnd)
       setNext(res.data.nextFetch)
     })
     .catch(err => {
       console.log(err)
       setIsloading(false)
     })
   },[])

   const fetchMore =  useCallback(async ()=>{
     setIsloading(true)
     const token = await getToken()
     const config = {
       headers: {
         Authorization: `Bearer ${token}`
       }
     }
     axios.get(BASEURL + 'p/breakdowns/'+ user + '/' + next,config)
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


   const showModal = (confs: awardReq) => {
     const {type, songId, breakdown, comment} = confs
     if(type == "breakdown") {
      setAwardData({type, songId, breakdown})
    }else {
      setAwardData({type, songId, comment})
    }

     setModalVisible(true);
   }

   const giveAward = async () => {
      const path = awardData.type === "breakdown" ? `${BASEURL}award-breakdown`: ""
      let data = {}
      if(awardData.type === "breakdown") {
        data = {
          songId: awardData.songId,
          punchId: awardData.breakdown?.punchId,
          brId: awardData.breakdown?.brId,
          awardsGiven: awardsGiven
        }
      }
      if(awardsGiven.length < 1) {
        return
      }
      const token = await getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      setGivingAward(true)
      axios.post(path,data,config)
      .then(res => {
        console.log(res.data)
        setGivingAward(false)
      })
      .catch(e => {
        setGivingAward(false)
        console.log(e.response.data)
        if(e.response?.status === 401){
          signOut()
        }
      })
   }

   const follow = async () => {
      setFollowLoading(true)
      const token = await getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      axios.post(`${BASEURL}p/follow/${user}`,{},config)
     .then(res => {
       console.log(res)
       setFollowLoading(false)
       setFollowing(prv => !prv)
     })
     .catch(err => {
       console.log(err)
       setFollowLoading(false)
       if(err.response?.status === 401){
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
    {userInfo.name}
    </Animated.Text>
    </View>

    <View>
    <Pressable
    style={({pressed}) => [styles.button,{opacity: pressed ? 0.7:1,backgroundColor: following ? "white": colors.mainColor}]}
    onPress = {follow}
    >
    {followLoading ? <ActivityIndicator color = "white" size = "small"/>
                                  :
                     <Text
                     style={[styles.text,{color: following ? colors.mainColor:"white"}]}
                     >{userInfo.following ? 'following': 'follow'}</Text>
             }
    </Pressable>
    </View>
    </Animated.View>
    <Pressable
     onPress = {()=> navigation.goBack() }
     style = {({pressed})=>[{opacity: pressed ? 0.5: 1}]}
    >
    <View style = {{marginTop: 3, padding: 7, backgroundColor:'rgba(0, 0, 0, 0.3)', borderRadius:50}}>
    <Ionicons name="ios-arrow-back-sharp" size={25} color={'white'} />
    </View>
    </Pressable>
    </Animated.View>

    <ScrollView contentContainerStyle = {styles.scrollContainer}
    scrollEventThrottle = {16}
    onScroll = {Animated.event([{ nativeEvent: {contentOffset: {y: scrollY}}}])}
    >
    <ThemedView style = {styles.achievementsContainer}>
    <Achievement top = {userInfo.points} bottom = "points" navigate = {false}/>
    <Achievement thisUser = {false} userName = {userInfo.name} top = {userInfo.followers} bottom = "followers" navigate navigation = {navigation}/>
    <Achievement thisUser = {false} userName = {userInfo.name} top = {userInfo.battleRecord} bottom = "battles" navigate navigation = {navigation}/>
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
    return   <BreakView {...a}  key = {indx} showModal = {showModal}/>
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
    <Modal isVisible={isModalVisible}>
      <ThemedView style={{ padding: 40, alignSelf:"center", borderRadius: 5,
                     width: layout.isSmallDevice ? "90%":"60%"}}>
        <ThemedText style = {{fontWeight:"bold", fontSize: 20, marginBottom: 30}}>
        Award {`${awardData.type}`}
        </ThemedText>
        <View>
        <View style = {styles.awardCollContainer}>
        <AwardInfo numberOfCoins = {"10000"} awardName = "Platinum" remove = {(n: string) => {
          setAwardsGiven(prv => [...prv.filter(a => a !== n)])
        }}
         image = {"../assets/images/platinum.png"} add = {(name:string) => setAwardsGiven(prv => [...prv,name])}/>
        <AwardInfo numberOfCoins = {"5000"} awardName = "Diamond" remove = {(n: string) => {
          setAwardsGiven(prv => [...prv.filter(a => a !== n)])
        }}
         image = {"../assets/images/diamond.png"} add = {(name:string) => setAwardsGiven(prv => [...prv,name])}/>
        <AwardInfo numberOfCoins = {"1000"} awardName = "Gold" remove = {(n: string) => {
          setAwardsGiven(prv => [...prv.filter(a => a !== n)])
        }}
         image = {"../assets/images/gold.png"} add = {(name:string) => setAwardsGiven(prv => [...prv,name])}/>
         </View>
         <View style = {styles.awardCollContainer}>
        <AwardInfo numberOfCoins = {"500"} awardName = "Silver" remove = {(n: string) => {
          setAwardsGiven(prv => [...prv.filter(a => a !== n)])
        }}
         image = {"../assets/images/silver.jpg"} add = {(name:string) => setAwardsGiven(prv => [...prv,name])}/>
        <AwardInfo numberOfCoins = {"100"} awardName = "Bronze" remove = {(n: string) => {
          setAwardsGiven(prv => [...prv.filter(a => a !== n)])
        }}
         image = {"../assets/images/bronze.jpg"} add = {(name:string) => setAwardsGiven(prv => [...prv,name])}/>
        <AwardInfo numberOfCoins = {"10"} awardName = "Copper" remove = {(n: string) => {
          setAwardsGiven(prv => [...prv.filter(a => a !== n)])
        }}
         image = {"../assets/images/copper.jpg"} add = {(name:string) => setAwardsGiven(prv => [...prv,name])}/>
         </View>
        </View>

       <View  style = {{flexDirection: "row",
        justifyContent: "space-between", marginTop: 20 }}>

       <Pressable  onPress = {() => setModalVisible(false)}
       style = {({pressed}) => [styles.closeButton, {opacity: pressed ? 0.7: 1}]}>
        <Text style = {styles.buttonText}>close</Text>
       </Pressable>

       <Pressable  onPress = {giveAward}
       style = {({pressed}) => [styles.buttonAw, {opacity: pressed ? 0.7: 1}]}>
        {givingAward ? <ActivityIndicator size = "small" color = "white"/> :
                       <Text style = {styles.buttonText}>Award</Text>}
       </Pressable>

       </View>

      </ThemedView>

    </Modal>
    </View>
  )
}


interface breakTyp {
  artist: string;
  bar: string;
  breakdown: brType;
  showModal: (dd: awardReq) => void;
  punchIndx: number;
  songId: string;
  songTitle: string
}


const BreakView = (props: breakTyp) => {
 const {artist, bar, songId, songTitle, punchIndx, breakdown} = props
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
    <Breakdown {...breakdown} songId = {songId} punchId = {`${punchIndx}`}
                showModal = {props.showModal}/>
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
