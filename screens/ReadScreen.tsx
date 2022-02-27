import React,{useContext, useEffect,useRef,useState} from 'react'
import {Text, View,ScrollView, StyleSheet, Switch, ActivityIndicator, Pressable, TextInput} from 'react-native'
import { Link } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Modal from "react-native-modal"
import axios from 'axios'

import {awardReq, RootStackScreenProps} from '../types'
import {ThemedText, ThemedView} from '../components/Themed'
import CardIcon from '../components/LyricsIcons'
import ScreenHeader from '../components/ScreenHeader'
import Comments from '../components/Comment'
import Back from '../constants/Back'
import Bar from '../components/Bar'
import colors from '../constants/Colors'
import layout from '../constants/Layout'
import {BASEURL} from '../constants/Credentials'
import useColorScheme from '../hooks/useColorScheme';
import { AwardInfo } from '../components/General';
import EditBrModal from '../components/EditBrModal';
import getToken from '../funcs/GetToken';
import { AuthContext } from '../navigation';
import { NotifyContext } from '../components/Notify';
import WebView from 'react-native-webview';

let color: 'light' | 'dark' = "light";

export default function ReadScreen({route,navigation}: RootStackScreenProps<'Read'>) {
 const [isLoading, setIsLoading] = useState(false)
 const [showIcons, setShowIcons] = useState(false)
 const [givingAward, setGivingAward] = useState(false)
 const [isModalVisible, setModalVisible] = useState(false);
 const [isModalEditVisible, setEditModalVisible] = useState(false)
 const [editData, setEditData] = useState({br:"", songId:"", punchId:"",id:""})
 const [awardData, setAwardData] = useState<awardReq>({type:"breakdown", songId:""})
 const [awardsGiven, setAwardsGiven] = useState<string[]>([])
 const [bars, setBars] = useState([])
 const [pData, setPData] = useState([])
 const {signOut} = useContext(AuthContext)
 const [headerData, setHeaderData] = useState({songTitle:'-',songArtist: '-', rating: '-', raters:'-',
                                               views:'-', favourited:false, noFavourited: '-',
                                               otherArtists: '-',youtubeVideo:''})
const [userRating, setUserRating] = useState(0)

const {newNotification} = useContext(NotifyContext)

const showModal = (confs: awardReq) => {
  const {type, songId, breakdown, comment} = confs
  if(type == "breakdown") {
   setAwardData({type, songId, breakdown})
 }else {
   setAwardData({type, songId, comment})
 }

  setModalVisible(true);
}

const showEditModal = (data:{br:string; songId: string; punchId: string; id: string})  => {
   setEditData(data)
   setEditModalVisible(true)
}

 color = useColorScheme()

 useEffect(()=> {
   setIsLoading(true)
   axios.get(BASEURL + route.params.songId)
   .then(res => {
     const {punchlines, ...otherKeys} = res.data.modefiedData
     setBars(punchlines)
     setHeaderData(otherKeys)
     setUserRating(otherKeys.userRating)
     setPData(res.data.performanceData)
     setIsLoading(false)
   })
   .catch(err => {
     setIsLoading(false)
     newNotification(err.response?.data.msg, 'ERROR')
   })
 },[])

const giveAward = () => {
   const path = awardData.type === "breakdown" ? `${BASEURL}award-breakdown`: `${BASEURL}award-comment`
   let data = {}
   if(awardData.type === "breakdown") {
     data = {
       songId: awardData.songId,
       punchId: awardData.breakdown?.punchId,
       brId: awardData.breakdown?.brId,
       awardsGiven: awardsGiven.map(a => a.toLowerCase())
     }
   }else {
     data = {
       awardsGiven: awardsGiven.map(a => a.toLowerCase()),
       songId: awardData.songId,
       commentId: awardData.comment?.commentId,
     }
   }
   if(awardsGiven.length < 1) {
     return
   }

   setGivingAward(true)
   axios.post(path,data)
   .then(res => {
     setGivingAward(false)
     newNotification(res.data.msg, 'SUCCESS')
   })
   .catch(e => {
     setGivingAward(false)
     if(e.response?.status === 401) {
       signOut()
     }else {
       newNotification(e.response?.data.msg, 'ERROR')
     }
   })
}

 const giveStar = (num: number) => {
   if(userRating > 0) return

   axios.post(`${BASEURL}lyrics/rate/${num}/${route.params.songId}`)
   .then(res => {
     newNotification(res.data.msg, 'SUCCESS')
     setUserRating(num)
   })
   .catch(e => {
     if(e.response?.status === 401) {
       signOut()
     }else {
       newNotification(e.response?.data.msg, 'ERROR')
     }
   })
 }

  return (
    <>
    <ScreenHeader placeholder = "search bars" goBack = {<Back goBack = {navigation.goBack}/>}/>
    <ScrollView contentContainerStyle = {styles.container} >
    <View style = {styles.header}>
    <View>
    <ThemedText style = {styles.title}>{headerData.songTitle}</ThemedText>

    <View style = {{flexDirection: 'row'}}>
    <ArtistLink songArtist = {headerData.songArtist} isLast={true} />
    {
      (headerData.otherArtists && headerData.otherArtists !== "undefined" && headerData.otherArtists !== "-")
        &&  <Text style = {styles.artist}>ft. </Text>
    }
    {
      (headerData.otherArtists && headerData.otherArtists !== "undefined" && headerData.otherArtists !== "-")
        &&  headerData.otherArtists.split(",").map((a,ind,arr) =><ArtistLink isLast = {ind === arr.length - 1 } key={a} songArtist = {a.trim()} />)
    }
    </View>


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
                        color = {headerData.favourited ? colors.mainColor : 'lightgray'}/>}
                        number = {<ThemedText>{headerData.noFavourited}</ThemedText>} />
    <View style = {styles.stars}>
      <Pressable onPress = {() => giveStar(1)}>
      <CardIcon icon = {<FontAwesome size={20} name = 'star'
             color = {userRating >= 1 ? colors.mainColor : 'lightgray'}/>}/>
      </Pressable>
      <Pressable onPress = {() => giveStar(2)}>
      <CardIcon icon = {<FontAwesome size={20} name = 'star'
            color = {userRating >= 2 ? colors.mainColor : 'lightgray'}/>}/>
      </Pressable>
      <Pressable onPress = {() => giveStar(3)}>
      <CardIcon icon = {<FontAwesome size={20} name = 'star'
           color = {userRating >= 3 ? colors.mainColor : 'lightgray'}/>}/>
      </Pressable>
      <Pressable onPress = {() => giveStar(4)}>
      <CardIcon icon = {<FontAwesome size={20} name = 'star'
          color = {userRating >= 4 ? colors.mainColor : 'lightgray'}/>}/>
      </Pressable>
      <Pressable onPress = {() => giveStar(5)}>
      <CardIcon icon = {<FontAwesome size={20} name = 'star'
             color = {userRating >= 5 ? colors.mainColor : 'lightgray'}/>}/>
      </Pressable>
    </View>
    </View>
    {isLoading && <ActivityIndicator size = "large" color = {colors.mainColor} />}
    {bars.map((bar, indx)=> <Bar key = {indx} indx = {indx} songId = {route.params.songId}
     {...bar} enabled = {showIcons} showModal = {showModal} showEditModal = {showEditModal}/> )}
     <ArtistPerformance data = {pData} />

     <WebView
      style={{height: 200, width: layout.window.width * 0.8}}
      source={{uri: `https://www.youtube.com/embed/${headerData.youtubeVideo}`}}
      />
     <Comments songId = {route.params.songId} showModal = {showModal} />

    </ScrollView>

      <Modal isVisible={isModalVisible}>
        <ThemedView style={{ padding: 20, alignSelf:"center", borderRadius: 5,
                       width:"98%"}}>
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
         style = {({pressed}) => [styles.button, {opacity: pressed ? 0.7: 1}]}>
          {givingAward ? <ActivityIndicator size = "small" color = "white"/> :
                         <Text style = {styles.buttonText}>Award</Text>}
         </Pressable>

         </View>

        </ThemedView>

      </Modal>
       <EditBrModal setModalVisible = {() => setEditModalVisible(false)}
                    isVisible = {isModalEditVisible} editData = {editData}/>
    </>
  )
}


const ArtistLink: React.FC<{songArtist:string; isLast: boolean}> =
 ({songArtist,isLast}) => {
  return (
    <Link to = {{screen: 'Artist',params:{userName: songArtist}}}>
    <Text style = {styles.artist}>{songArtist}{isLast ? "":","} </Text>
    </Link>
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
    color: colors.mainColor,
  },
  lyricsIcons: {
    flexDirection: 'row'
  },
  controllsContainer: {
    flexDirection: 'row'
  },
  stars: {
    flexDirection: "row",
    alignItems: 'center',
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
  },
  awardCollContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 20
  },
  button: {
   paddingVertical: 5,
   paddingHorizontal: 20,
   borderRadius: 4,
   backgroundColor: colors.mainColor,
   marginBottom: 7,
  },
  input : {
     width: '100%',
     borderWidth: 1,
     borderColor: colors.mainColor,
     padding: 10,
     marginBottom: 5
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
