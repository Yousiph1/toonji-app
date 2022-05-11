import React,{useState, useEffect, useContext} from 'react'
import {View, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator, TextStyle} from 'react-native'
import { FontAwesome, MaterialIcons, FontAwesome5, AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import * as Clipboard from 'expo-clipboard'

import {ThemedText, ThemedView} from './Themed'
import {BASEURL} from '../constants/Credentials'
import CardIcon from './LyricsIcons'
import layout from '../constants/Layout'
import colors from '../constants/Colors'
import Breakdown from './Breakdown'
import {AuthContext} from '../navigation/context'
import { awardReq } from '../types';
import { NotifyContext } from './Notify';
import { ThemeContext } from '../navigation/context';

const mainColor = colors.mainColor


type bar = {
  indx: string; punchline:string; userFav: boolean;
  hasIcons: boolean; songId:string;rated: boolean; rating: string;
 _id: string; artist: string; enabled: boolean;
 showModal: (dd:awardReq) => void;
 COLOR: TextStyle["color"];
 FONT_SIZE: TextStyle["fontSize"];
 FONT_FAMILY: TextStyle["fontFamily"];
 showEditModal: (dd:{br: string; punchId: string; songId: string; id: string}) => void
}

export default function Bar({indx, punchline,userFav, hasIcons, rated,
                           rating, artist, _id, enabled,
                           songId, showModal, showEditModal,COLOR, FONT_SIZE, FONT_FAMILY}: bar) {
  const [isFavorite, setIsFavorite] = useState(userFav)
  const [hasFire, setHasFire] = useState(rated)
  const [fires, setFires] = useState(parseInt(rating))
  const [showBreakdowns, setShowBreakdowns] = useState(false)
  const [show, setShow] = useState(enabled)
  const [brDowns, setBrDowns] = useState<unknown[]>([])
  const [br, setBr] = useState("")
  const [inputHeight, setInputHeight] = useState(40)
  const [sending, setSending] = useState(false)
  const {signOut} = useContext(AuthContext)
  const {newNotification} = useContext(NotifyContext)
  const {color} = React.useContext(ThemeContext)
  const [copied, setCopied] = useState(false)

   useEffect(()=> {
     setShow(enabled)
   },[enabled])

   const copyToClipboard = () => {
     let str = punchline + "\n" + "\t \t \t \t ~" + artist
     Clipboard.setString(str)
     setCopied(true)
     newNotification("copied", "SUCCESS")
   }

  const getBreakdowns = () => {
    setShowBreakdowns(!showBreakdowns)
  axios.get(`${BASEURL}breakdowns/${songId}/${indx}`)
   .then(res => {
      setBrDowns([])
      setBrDowns(res.data)
   })
   .catch(er => {
    newNotification(er.response?.data.msg, 'ERROR')
  });

}

const handleTextChange = (text:string) => {
  setBr(text)
}

const addBarToFavourites = () => {
     setIsFavorite(!isFavorite)
     axios.post(`${BASEURL}bar-favourited/${songId}/${_id}`)
     .then(res => {
      newNotification(res.data.msg,'SUCCESS')
     })
     .catch(err => {
       let msg = err.response?.data.msg
       if(err.response?.status === 401){signOut()}else{newNotification(msg,'ERROR')}
     })
  }

 const firePressed = () => {
   if(!hasFire){
     setFires(fires + 1)
     setHasFire(true)
   }else {
     setFires(prev => prev - 1)
     setHasFire(false)
   }

    axios.post(`${BASEURL}lyrics/fire/${songId}/${indx}`)
      .then(res =>{
      newNotification(res.data.msg,'SUCCESS')
    })
     .catch((err)=>{
       let msg = err.response?.data.msg
       if(err.response?.status === 401){signOut()}else{newNotification(msg,'ERROR')}
    })
 }


 const sendBreakdown = () => {
     if(br.trim() === '') return
     setSending(true)

     axios.post(BASEURL + 'breakdown/'+songId+"/"+indx,{breakdown: br.trim()})
     .then((res)=>{
       let message = res.data.msg
       if(res.data.type === "SUCCESS"){
        axios.get(`${BASEURL}breakdowns/${songId}/${indx}`)
        .then(res => {
          setBr('')
          if(res.data.type !== 'ERROR') {
            setBrDowns([])
            setBrDowns(res.data)
            setSending(false)
          }
        })
        .catch(err => {
          let msg = err.response?.data.msg
          if(err.response?.status === 401){signOut()}else{newNotification(msg,'ERROR')}
        })
     }

   })
    .catch((err)=>{
      setSending(false)
      let msg = err.response?.data.msg
      if(err.response?.status === 401){signOut()}else{newNotification(msg,'ERROR')}
   })
   }

   const deleteBreakdown = ({punchId, id}:{punchId:string;id:string}) => {
     axios.post(`${BASEURL}delete/breakdown/${songId}/${punchId}/${id}`)
     .then(res => {
       newNotification(res.data.msg,'SUCCESS')
     })
     .catch(err => {
       let msg = err.response?.data.msg
       if(err.response?.status === 401){signOut()}else{newNotification(msg,'ERROR')}
     })
   }

  if(!hasIcons) punchline = punchline.substr(0,punchline.length - 3)
  return (
    <ThemedView style = {styles.container} >
    <Pressable onPress = {()=>setShow(!show)} style = {{width: "85%"}}>
    <ThemedText style = {[styles.bar,{color:COLOR, fontSize: FONT_SIZE, fontFamily: FONT_FAMILY}]}>
    {punchline}
    </ThemedText>
    </Pressable>
    {(hasIcons && show ) && <View style = {styles.iconsContainer}>
    <Pressable onPress ={copyToClipboard}>
    <CardIcon icon = {<FontAwesome size={18}
                     name = "copy"  color = {copied ? mainColor : "lightgray"}/>}/>
    </Pressable>

    <Pressable onPress = {getBreakdowns}>
    <CardIcon icon = {<FontAwesome5 name="lightbulb" size={18} color= {showBreakdowns ? mainColor : "lightgray"}/>}/>
    </Pressable>

    <Pressable onPress = {addBarToFavourites}>
    <CardIcon icon = {<AntDesign size={18}  name = "heart" color = {isFavorite ? mainColor : "lightgray"}/>}/>
    </Pressable>

    <Pressable onPress = {firePressed}>
    <CardIcon icon = {<MaterialIcons size={20} name = "local-fire-department"
    color = {hasFire ? mainColor : "lightgray"}/>} number = {<ThemedText>{fires}</ThemedText>}/>
    </Pressable>
    </View>
  }
  {showBreakdowns && <View style = {[styles.breakdownsContainer,{backgroundColor: colors[`${color}` as const].gray}]}>
    <ScrollView nestedScrollEnabled = {true} contentContainerStyle = {{  paddingHorizontal: 10,
      paddingTop: 10,}}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style = {{
        width: '100%',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        marginBottom: 20
       }}
      >
      <TextInput
        style={[styles.input,{color: colors[`${color}` as const].text}, {height: inputHeight}]}
        placeholder="write breakdown"
        onChangeText= {handleTextChange}
        onContentSizeChange={(event) => {
             setInputHeight(event.nativeEvent.contentSize.height)
         }}
        value={br}
        multiline
      />
      <Pressable
      style = {({pressed}) => [styles.button,{opacity: br.length ? !pressed ? 1 : 0.7 : 0.7}]}
      onPress = {sendBreakdown}
      >

      {sending ? <ActivityIndicator size = "small" color = 'white' /> :
                   <Ionicons name="send-sharp" size={22} color="white" />}
      </Pressable>
      </KeyboardAvoidingView>

    {brDowns.map((br,i) => (<Breakdown key={i} {...br} songId={songId} showModal={showModal}
      punchId={indx} indx={`${i}`} showEditModal={showEditModal}
      deleteBreakdown={deleteBreakdown} />))}
   </ScrollView>
   </View>
 }
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    width: 0.95 * layout.window.width,
  },
  bar: {
    marginLeft: 20
  },
  iconsContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginLeft: 20
  },
  breakdownsContainer: {
    borderRadius: 5,
    height: 50 / 100 * layout.window.height,
  },
  input : {
     width: '100%',
     borderWidth: 1,
     borderColor: colors.mainColor,
     padding: 10,
     marginBottom: 5
   },
   button: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: colors.mainColor,
    marginBottom: 7,
  },
})
