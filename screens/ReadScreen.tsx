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

let color: 'light' | 'dark' = "light";

(async function(){
  const token = await getToken()
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}())
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
                                               otherArtists: '-'})

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
     setPData(res.data.performanceData)
     setIsLoading(false)
   })
   .catch(err => {
     console.log(err)
     setIsLoading(false)
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
       awardsGiven: awardsGiven
     }
   }else {
     data = {
       awardsGiven,
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
     console.log(res.data)
     setGivingAward(false)
   })
   .catch(e => {
     setGivingAward(false)
     console.log(e.response.data)
     if(e.response?.status === 401) {
       signOut()
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
    <Link to = {{screen: 'Artist',params:{userName: headerData.songArtist}}}>
    <ThemedText style = {styles.artist}>{headerData.songArtist}
    {headerData.otherArtists !== '-' && headerData.otherArtists !== undefined ? ` ft ${headerData.otherArtists}`: ''}</ThemedText>
    </Link>
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
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                       color = {headerData.favourited ? colors.mainColor : 'lightgray'}/>}/>
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                      color = {headerData.favourited ? colors.mainColor : 'lightgray'}/>}/>
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                      color = {headerData.favourited ? colors.mainColor : 'lightgray'}/>}/>
    <CardIcon icon = {<FontAwesome size={20} name = 'star'
                      color = {headerData.favourited ? colors.mainColor : 'lightgray'}/>}/>
    </View>
    </View>
    {isLoading && <ActivityIndicator size = "large" color = {colors.mainColor} />}
    {bars.map((bar, indx)=> <Bar key = {indx} indx = {indx} songId = {route.params.songId}
     {...bar} enabled = {showIcons} showModal = {showModal} showEditModal = {showEditModal}/> )}
     <ArtistPerformance data = {pData} />

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
