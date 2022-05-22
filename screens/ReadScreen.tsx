import React,{useContext, useEffect,useRef,useState} from 'react'
import {Text, View,ScrollView, StyleSheet, Switch, ActivityIndicator, Pressable, TextStyle, Platform, TextInput, KeyboardAvoidingView} from 'react-native'
import { Link } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal"
import axios from 'axios'

import {awardReq, RootStackScreenProps} from '../types'
import {ThemedText, ThemedView} from '../components/Themed'
import CardIcon from '../components/LyricsIcons'
import ScreenHeader from '../components/ScreenHeader'
import Comments, { commentType } from '../components/Comment'
import Back from '../constants/Back'
import Bar from '../components/Bar'
import colors from '../constants/Colors'
import layout from '../constants/Layout'
import {BASEURL} from '../constants/Credentials'
import { AwardInfo } from '../components/General';
import EditBrModal from '../components/EditBrModal';
import { AuthContext } from '../navigation/context';
import { NotifyContext } from '../components/Notify';
import WebView from 'react-native-webview';
import {AsyncStore as AsyncStorage} from '../funcs/AsyncStore';
import { ThemeContext } from '../navigation/context';

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
 const [FONT_SIZE,setFONT_SIZE] = useState<TextStyle["fontSize"]>(18)
 const [COLOR, setCOLOR] = useState<TextStyle["color"]>('black')
 const [FONT_FAMILY, setFONT_FAMILY] = useState<TextStyle["fontFamily"]>(undefined)
 const [pData, setPData] = useState([])
 const {color} = React.useContext(ThemeContext)
 const {signOut} = useContext(AuthContext)
 const [headerData, setHeaderData] = useState({songTitle:'-',songArtist: '-', rating: '-', raters:'-',
                                               views:'-', favourited:false, noFavourited: '-',
                                               otherArtists: '-',youtubeVideo:''})
 const [userRating, setUserRating] = useState(0)
 const [commentS, setCommentS] = useState<commentType[] | undefined>(undefined)
 const [comment, setComment] = useState("")
 const [showInput, setShowInput] = useState(false)
 const inputRef = useRef<TextInput>(null)

 const [sendingComm, setSendingComm] = useState(false)

 const showInputFunc = () => {
   setShowInput(true)
   inputRef.current?.focus()
 }

 const closeInput = () => {
   setShowInput(false)
   inputRef.current?.blur()
 }

const {newNotification} = useContext(NotifyContext)
const handleTextChange = (text:string) => {
  if(text.length > 500) return
  setComment(text)
}

 useEffect(()=> {
   const getData = async () => {
     try {
       let lyricsSetting = await AsyncStorage.getItem('lyricsSettings')
       if(lyricsSetting) {
          let lyricsSettings: {fontSize: string, color: string, fontFamily: string; theme: string} = JSON.parse(lyricsSetting)
          if(lyricsSettings){
            setFONT_SIZE(Number(lyricsSettings.fontSize))
            setCOLOR(lyricsSettings.color)
            setFONT_FAMILY(lyricsSettings.fontFamily)
          }
       }
     } catch(e) {
       // error reading value
     }
   }
    getData()
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

const showEditModal = (data:{br:string; songId: string; punchId: string; id: string})  => {
   setEditData(data)
   setEditModalVisible(true)
}

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

 const submitComment = async () => {
   setSendingComm(true)
   if(comment === '') return
       axios.post(BASEURL + 'comment/'+ route.params.songId,{comment})
       .then((res)=>{
         setCommentS(res.data.userComment)
         setComment("")
         newNotification(res.data.msg, 'SUCCESS')
         setSendingComm(false)
         closeInput()
       })
       .catch((err)=>{
         setSendingComm(false)
         closeInput()
         let msg = err.response?.data.msg
         if(err.response?.status === 401){signOut()}else{newNotification(msg,'ERROR')}
       })
 }

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

 const remove = (n: string) => {
   setAwardsGiven(prv => [...prv.filter(a => a !== n)])
 }
 const add = (name: string) => {
   setAwardsGiven(prv => [...prv, name])
 }
  return (
    <>
    <ScreenHeader placeholder = "search bars" goBack = {<Back goBack = {navigation.goBack}/>}/>
    <ScrollView contentContainerStyle = {styles.container} >
    <View style = {[styles.header,{backgroundColor: colors[`${color}` as const].gray}]}>
    <View>
    <ThemedText style = {styles.title}>{headerData.songTitle}</ThemedText>

    <View style = {{flexDirection: 'row'}}>
    <ArtistLink songArtist = {headerData.songArtist} isLast={true} />
    {
      (headerData.otherArtists && headerData.otherArtists !== "undefined" && headerData.otherArtists !== "-")
        ?  <Text style = {styles.artist}>ft. </Text> : <Text></Text>
    }
    {
      (headerData.otherArtists && headerData.otherArtists !== "undefined" && headerData.otherArtists !== "-")
        ?
        headerData.otherArtists.split(",").map((a,ind,arr) =><ArtistLink isLast = {ind === arr.length - 1 } key={a} songArtist = {a.trim()} />)
        :
        null
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
     {...bar} COLOR = {COLOR} FONT_SIZE = {FONT_SIZE} FONT_FAMILY = {FONT_FAMILY}
      enabled = {showIcons} showModal = {showModal} showEditModal = {showEditModal}/> )}
     <ArtistPerformance data = {pData} />

     <WebView
      style={{height: 200, width: layout.window.width * 0.8}}
      source={{uri: `https://www.youtube.com/embed/${headerData.youtubeVideo}`}}
      />
     <Comments comment = {commentS} songId = {route.params.songId} showModal = {showModal} showInput = {showInputFunc}/>

    </ScrollView>
    {showInput ? <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style = {{
      width: layout.window.width,
      paddingHorizontal: 10,
     }}
    >
    <TextInput
      ref = {inputRef}
      style={[styles.input,{color: colors[`${color}` as const].text}]}
      placeholder={'Write comment'}
      onChangeText = {handleTextChange}
      value = {comment}
      autoFocus
      multiline
      onBlur = {closeInput}
    />
    <Pressable onPress = {submitComment}
    style = {({pressed}) => [styles.button,{opacity: comment.length ? !pressed ? 1 : 0.7 : 0.7}]}
    >

    {sendingComm ? <ActivityIndicator size = "small" color = 'white' /> :
                 <Ionicons name="send-sharp" size={22} color="white" />}
    </Pressable>
    </KeyboardAvoidingView> : null
  }
      <Modal isVisible={isModalVisible}>
        <ThemedView style={{ padding: 20, alignSelf:"center", borderRadius: 5,
                       width:"98%"}}>
          <ThemedText style = {{fontWeight:"bold", fontSize: 20, marginBottom: 30}}>
          Award {`${awardData.type}`}
          </ThemedText>
          <View>
          <View style = {styles.awardCollContainer}>
          <AwardInfo numberOfCoins = {"10000"} awardName = "Platinum" remove = {remove}
           image = {"../assets/images/platinum.png"} add = {add}
           />
          <AwardInfo numberOfCoins = {"5000"} awardName = "Diamond" remove = {remove}
           image = {"../assets/images/diamond.png"} add = {add}
           />
          <AwardInfo numberOfCoins = {"1000"} awardName = "Gold" remove = {remove}
           image = {"../assets/images/gold.png"} add = {add}
           />
           </View>
           <View style = {styles.awardCollContainer}>
          <AwardInfo numberOfCoins = {"500"} awardName = "Silver" remove = {remove}
           image = {"../assets/images/silver.jpg"} add = {add}
           />
          <AwardInfo numberOfCoins = {"100"} awardName = "Bronze" remove = {remove}
           image = {"../assets/images/bronze.jpg"} add = {add}
           />
          <AwardInfo numberOfCoins = {"10"} awardName = "Copper" remove = {remove}
           image = {"../assets/images/copper.jpg"} add = {add}
           />
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
    const {color} = React.useContext(ThemeContext)
  return (
    <ThemedView style = {[styles.performanceContainer,{backgroundColor: colors[`${color}` as const].gray}]}>
    {data.map((p,indx)=>{
      return (<View key = {indx} style = {styles.artistPerformance}>
              <ThemedText>{p.artist}</ThemedText>
              <Text style = {styles.artistPoints}>{p.points} point{parseInt(p.points) === 1 ? '':'s'}</Text>
              </View>
            )
    })}
    </ThemedView>
  )
}



const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
    flexDirection: 'row',
    paddingVertical: Platform.OS === "ios" ? 10 : 5
  },
  stars: {
    flexDirection: "row",
    alignItems: 'center',
    marginHorizontal: 20
  },

  performanceContainer: {
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
   display: 'flex',
   alignItems: 'center',
   paddingVertical: 5,
   borderRadius: 4,
   backgroundColor: colors.mainColor,
   marginBottom: 7,
   width: 50,
   textAlign: 'center',
   alignSelf: 'flex-end'
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
