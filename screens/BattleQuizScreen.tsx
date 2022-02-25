import { DefaultEventsMap } from '@socket.io/component-emitter';
import React,{useEffect, useState, useContext} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,

} from 'react-native';
import {io, Socket} from 'socket.io-client'
import strSimilarity from 'string-similarity'

import { ThemedText, ThemedView } from '../components/Themed';
import colors from '../constants/Colors'
import { SOCKETURL } from '../constants/Credentials';
import layout from '../constants/Layout'
import { RootStackParamList, RootStackScreenProps } from '../types';
import {NotifyContext} from '../components/Notify'
import { AuthContext } from '../navigation';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;



export default function BattleQuizScreen({route}:RootStackScreenProps<"BattleQuizReady">){
  const battleId = route.params.roomId
  const [getQuestions,setGetQuestions] = useState(false)
  const [questions,setQuestions] = useState([])
  const [joined,setJoined] = useState(false)
  const [isValidLink,setIsValidLink] = useState(true)
  const [showGetQuestion,setShowGetQuestions]  = useState(false)
  const [waitingForOwner,setWaitingForOwner] = useState(false)
  const [linkFull,setLinkFull] = useState(false)
  const [opponentName,setOpponentName] = useState("")
  const [ownersName, setOwnersName] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [battleInProcess,setBattleInProcess] = useState(false)

 const {newNotification} = useContext(NotifyContext)
 const {signOut} = useContext(AuthContext)

socket = io(SOCKETURL +"-battle",{transports: ["websocket"]});
  useEffect(()=> {

    socket.on("connect_error", (err) => {
     socket.disconnect()
   });

    socket.on("connect", () => {
       socket.emit("join-room", battleId)
     })

    socket.on("all-set",(msg)=> {
      setOpponentName(msg)
      setShowGetQuestions(true)
    })
    socket.on("opponent-disconnected",() => {
      if(!hasStarted) {
        setShowGetQuestions(false)
      }else {
      newNotification("opponent has disconnected",'ERR0R')
      }
    })

    socket.on("login required",() => {
      newNotification("You have to login to continue",'ERR0R')
      socket.disconnect()
      signOut()
    })

    socket.on("invalid link", () => {
      setIsValidLink(false)
    })

    socket.on("in-process", () => {
      setBattleInProcess(true)
    })

    socket.on("questions", msg => {
      setLoading(false)
      setQuestions(msg)
      setGetQuestions(true)
    })

    socket.on("joined",() => {
       setJoined(true)
    })
    socket.on("set", msg => {
       setWaitingForOwner(true)
       setOpponentName(msg)
    })

    socket.on("opponent-ended",(msg: string) => {
       newNotification(msg,'NEUTRAL')
    })
    socket.on("link-full", () => {
      setLinkFull(true)
    })
    return () => {
      socket.disconnect()
    }
  },[])


const emitForQuestions = () => {
   try{
    setLoading(true)
   socket.emit("get-questions",battleId)
   setHasStarted(true)
  } catch (e) {
      newNotification("Something went wrong",'ERR0R')
   }
}

  return (
  <ThemedView style = {{flex: 1, justifyContent: 'center'}}>

   <View style = {{flex: 1}}>
    {loading && <ActivityIndicator size = "small" color = {colors.mainColor} /> }
      {!getQuestions && <NotStartQuiz isValidLink = {isValidLink} joined = {joined}
      sGetQuestions = {emitForQuestions} showGetQuestion = {showGetQuestion}
       waitingForOwner = {waitingForOwner} linkFull = {linkFull} opponentName = {opponentName} inP = {battleInProcess}/>}
      {getQuestions && <StartQuiz roomId = {battleId} questions = {questions} socket = {socket}  oppName = {opponentName} owName = {ownersName}/>}
    </View>

  </ThemedView>
  );
}

interface notStartQuiz {
  isValidLink: boolean;
  joined: boolean;
  sGetQuestions: () => void;
  showGetQuestion: boolean;
  waitingForOwner: boolean;
  linkFull: boolean;
  opponentName: string;
  inP: boolean
}

function NotStartQuiz(props:notStartQuiz) {
  return (
    <View style  = {{flex: 1, justifyContent: 'center'}}>
    {!props.isValidLink && <InvalidLink />}
    {props.inP && <BattleInProgress />}
    {props.linkFull && !props.joined && <LinkFull />}
    {props.joined && !props.showGetQuestion && ! props.waitingForOwner && <JoinedLink />}
    {props.waitingForOwner && <WaitingForOwner />}
    {props.showGetQuestion && <ShowGetQuestions opponent = {props.opponentName} sGetQuestions = {props.sGetQuestions}/>}
    </View>
  )
}

function InvalidLink() {
  return (
    <Text style = {styles.battleMessage}>This link has expired or it's invalid </Text>
  )
}

function BattleInProgress() {
  return (
  <Text style = {styles.battleMessage}>There's a battle in progress on this link</Text>
  )
}

function JoinedLink() {
  return (
    <View>
    <Text style = {styles.battleMessage}>Waiting for opponent to join </Text>
    </View>
  )
}

function ShowGetQuestions(props: {opponent: string, sGetQuestions: () => void}) {
   const [hasclick,setHasClick] = useState(false)
   const startClick = () => {
       if(!hasclick) {
         props.sGetQuestions()
       }
        setHasClick(true)
   }
  return (
    <View>
    <Text style = {styles.battleMessage}>{props.opponent} joined click start to begin</Text>
    {!hasclick && <Pressable style = {styles.button} onPress = {startClick}><Text style = {{color:'white'}}>Start</Text></Pressable>}
    {hasclick && <p>loading...</p>}
    </View>
  )
}

function WaitingForOwner() {
  return (
    <View>
    <Text style = {styles.battleMessage}>
    All set waiting for link owner to start battle
    </Text>
    </View>
  )
}

function LinkFull() {
  return (
    <Text style = {styles.battleMessage}>
    This battle link is currently full
    </Text>
  )
}

function StartQuiz(props:any) {
       const [current,setCurrent] = useState(0);
       const [timeStart,setTimeStart] = useState(0);
       const [finished, setFinished] = useState(false)
       const [totalPoints,setTotalPoints] = useState(0)
       const [question, setQuestion] = useState<{questionText: string; questionTitle: string; questionAnswer: string}>({questionText:"-", questionTitle:"-", questionAnswer:"-"})
       const [opponentPoints,setOpponentPoints] = useState(0)
       const [input, setInput] = useState("")
       const [answered, setAnswered] = useState(false)
       const [correct, setCorrect] = useState(false)

         useEffect(()=>{
            if(props.socket){
              props.socket.on("opponent-points", (points: number) => {
                     setOpponentPoints(prv => prv + points)
              })
            }

         },[])

         useEffect(()=> {
           if(props.questions.length > 0) {
             setQuestion(props.questions[current])
           }
         },[current, props.questions])


    function updatePoint() {
      let inpt = input
      let ans = question.questionAnswer.toLowerCase()
      inpt = inpt.toLowerCase()
      ans = ans.replace(/in'/g,'ing')
      ans = ans.replace(/\W/g,'')
      inpt = inpt.replace(/in'/g,'ing')
      inpt =  inpt.replace(/\W/g,'')
      let isCorrect = strSimilarity.compareTwoStrings(ans,inpt)
      let timeUsed = Date.now() - timeStart;
      console.log(isCorrect)
      let newPoint = 0
      if(isCorrect > 0.8) {
        if(timeUsed <= 10000) {
           newPoint += 10
        }else if(timeUsed <= 15000 && timeUsed > 10000) {
          newPoint += 7
        }else if(timeUsed <= 20000 && timeUsed > 15000) {
          newPoint += 5
        }else {
          newPoint += 3
        }

        if(isCorrect <= 0.85) {
            newPoint += 1
        }else if(isCorrect <= 0.90 && isCorrect > 0.85) {
          newPoint += 2
        }else if(isCorrect <= 0.95 && isCorrect > 0.90) {
          newPoint += 3
        }else {
        newPoint += 5
        }
        setTotalPoints(prv => prv + newPoint)
        setCorrect(true)
        props.socket.emit("new-points",[newPoint,props.roomId])
      }else {
         setCorrect(false)
      }
       setAnswered(true)
    }



   const nextQ = () => {
     if(current === props.questions.length - 1 ){
       setFinished(true)
       return
     }
     setInput("")
     setAnswered(false)
     setCurrent(current + 1)
   }


  return (
    <>

    {!finished && <View style = {{flex: 1, justifyContent: 'center', paddingTop: 50, marginHorizontal: 20, position: 'relative'}}>
    <View style = {{flexDirection:"row", justifyContent: "space-between", marginBottom: 10}}>

    <View style = {styles.pointsContainer}>
    <Text style = {styles.point}>{opponentPoints}</Text>
    <ThemedText style = {styles.player}>{props.oppName}</ThemedText>
    </View>

    <View  style={styles.pointsContainer}>
    <Text style={styles.point}>{totalPoints}</Text>
    <ThemedText style={styles.player}>You</ThemedText>
    </View>

    </View>
     <ScrollView contentContainerStyle = {{height: layout.window.height * 0.5, paddingBottom: 20}}>
    <ThemedText style = {{fontSize: 20, fontWeight: 'bold',marginBottom: 20}}>{question.questionTitle}</ThemedText>
    <ThemedText style = {{fontSize: 18, marginBottom: 20}}>{question.questionText}</ThemedText>
    </ScrollView>
    <View>
    <TextInput
      style={styles.input}
      placeholder="Answer"
      value = {input}
      onChangeText = {(text) => setInput(text)}
     />
    <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
    <Pressable
     onPress = {nextQ}
    >
    <Text>
    Skip
    </Text>
    </Pressable>
    { !answered &&
    <Pressable style = {({pressed})=> [styles.button,{opacity: pressed ? 0.7 : 1}]}
      onPress = {updatePoint}
    >
     <Text style = {{color: 'white'}}>
    Submit
    </Text>
    </Pressable>
  }
    </View>
  </View>
    </View>
  }

  {
    (answered && !finished)  &&   <View style = {[styles.popup,{backgroundColor: correct ? "green":'red'}]}>
   <Text style = {{color: 'white', fontSize: 25, marginBottom: 20}}>{correct ? "Correct answer" : "Wrong answer"}</Text>
   <Pressable style = {({pressed})=> [styles.button,{opacity: pressed ? 0.7 : 1}]}
     onPress = {nextQ}
   >
         <Text style = {{color: 'white'}}>
         {current === props.questions.length - 1 ? "Finish": "Next"}
           </Text>
   </Pressable>
   </View>
 }

   {finished && <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ThemedText style = {{fontSize: 20,color:'green', marginBottom: 30}}>End of Battle</ThemedText>
    <ThemedText style = {{fontSize: 18}}>Your points <Text style = {{color : colors.mainColor}}>{totalPoints}</Text> : Opponent's points <Text style = {{color: colors.mainColor}}>{opponentPoints}</Text></ThemedText>
    </View>
  }
    </>
  )
}


const styles = StyleSheet.create({
  input : {
    borderBottomWidth: 1,
    borderBottomColor: colors.mainColor,
    paddingHorizontal: 10,
    marginBottom: 10,
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
 },
 battleMessage: {
   textAlign: "center",
   color: "white",
   padding: 10,
   backgroundColor: colors.mainColor,
   margin: 20
 },
 pointsContainer: {
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 20
 },
 point: {
   color : colors.mainColor,
   fontSize: 30,
   marginBottom: 10,
   fontWeight: 'bold'
 },
 player: {
   fontWeight: 'bold'
 }
})
