import { DefaultEventsMap } from '@socket.io/component-emitter';
import React,{useEffect, useState} from 'react';
import {
  Pressable,
StyleSheet,
Text,
TextInput,
View,

} from 'react-native';
import {io, Socket} from 'socket.io-client'

import { ThemedView } from '../components/Themed';
import colors from '../constants/Colors'
import { SOCKETURL } from '../constants/Credentials';
import layout from '../constants/Layout'
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
export default function BattleQuizScreen(){
  const [battleId, setBattleId] = useState("")
  const [getQuestions,setGetQuestions] = useState(false)
  const [questions,setQuestions] = useState([])
  const [joined,setJoined] = useState(false)
  const [isValidLink,setIsValidLink] = useState(true)
  const [showGetQuestion,setShowGetQuestions]  = useState(false)
  const [waitingForOwner,setWaitingForOwner] = useState(false)
  const [linkFull,setLinkFull] = useState(false)
  const [opponentName,setOpponentName] = useState("")
  const [ownersName, setOwnersName] = useState("")
  const [hasStarted, setHasStarted] = useState(false)
  const [battleInProcess,setBattleInProcess] = useState(false)

  const connect = () => {
     socket = io(SOCKETURL +"-battle",{transports: ["websocket"]});
     socket.on("connect_error", (err) => {
      socket.disconnect()
    });
  }

  socket.on("connect", () => {
     socket.emit("join-room", battleId)
   })

  socket.on("all-set",(msg)=> {
    setShowGetQuestions(true)
    setOpponentName(msg)
  })
  socket.on("opponent-disconnected",() => {
    if(!hasStarted) {
      setShowGetQuestions(false)
    }else {
    }
  })

  socket.on("login required",() => {
    socket.disconnect()
  })

  socket.on("invalid link", () => {
    setIsValidLink(false)
  })

  socket.on("in-process", () => {
    setBattleInProcess(true)
  })

  socket.on("questions", msg => {
    setQuestions(msg)
    setGetQuestions(true)
  })

  socket.on("joined",() => {
     setJoined(true)
  })
  socket.on("set", msg => {
     setWaitingForOwner(true)
     setOwnersName(msg)
  })

  socket.on("opponent-ended",msg => {

  })
  socket.on("link-full", () => {
    setLinkFull(true)
  })



const emitForQuestions = () => {
   try{
   socket.emit("get-questions",battleId)
   setHasStarted(true)
  } catch (e) {
   }
}

  useEffect(()=> {
    return () => {
      socket.disconnect()
    }
  })

  return (
  <ThemedView style = {{flex: 1, justifyContent: 'center'}}>

  <View style = {{flexDirection: 'row',paddingHorizontal: 10}}>
  <TextInput
    style={styles.input}
    placeholder= "Enter battle ID"
    value = {battleId}
    onChangeText = {(text) => setBattleId(text)}
   />
   <Pressable onPress = {connect} style = {({pressed})=> [styles.button, {opacity: pressed ? 0.7 : 1}]}>
   <Text style = {{color: 'white'}}>Connect</Text>
   </Pressable>
   </View>

  </ThemedView>
  );
}



const styles = StyleSheet.create({
  input : {
    flexBasis: '100%',
    flexShrink:1,
    borderWidth: 1,
    borderColor: colors.mainColor,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginRight: 10
  },
  button: {
   alignItems: 'center',
   paddingVertical: 5,
   paddingHorizontal: 20,
   borderRadius: 4,
   backgroundColor: colors.mainColor,
   marginBottom: 7,
 },
 popup: {
   width: layout.window.width,
   height: "40%",
   position: "absolute",
   alignItems: 'center',
   bottom: 0,
   padding: 20,
   justifyContent: 'center',
 }
})
