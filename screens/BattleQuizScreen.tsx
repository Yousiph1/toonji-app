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
import strSimilarity from 'string-similarity'

import { ThemedText, ThemedView } from '../components/Themed';
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
  const [connect, setConnect] = useState(false)

  useEffect(()=> {
    if(!connect) return
    socket = io(SOCKETURL +"-battle",{transports: ["websocket"]});
    socket.on("connect_error", (err) => {
     socket.disconnect()
   });

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
    return () => {
      socket.disconnect()
    }
  },[connect])

const getBattleId = (text: string) => {
  let isUrl = text.lastIndexOf("/")
  if(isUrl > 0) {
    text = text.substr(isUrl + 1)
  }
  setBattleId(text)
}
const emitForQuestions = () => {
   try{
   socket.emit("get-questions",battleId)
   setHasStarted(true)
  } catch (e) {
   }
}

  return (
  <ThemedView style = {{flex: 1, justifyContent: 'center'}}>

  <View style = {{flexDirection: 'row',paddingHorizontal: 10}}>
  <TextInput
    style={styles.input}
    placeholder= "Enter battle ID"
    value = {battleId}
    onChangeText = {getBattleId}
   />
   <Pressable onPress = {()=> setConnect(true)} style = {({pressed})=> [styles.button, {opacity: pressed ? 0.7 : 1}]}>
   <Text style = {{color: 'white'}}>Connect</Text>
   </Pressable>
   </View>

   <View>
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
    <View>
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
    <Text style = {styles.battleMessage}>this link has expired or it's invalid </Text>
  )
}

function BattleInProgress() {
  return (
  <Text style = {styles.battleMessage}>there's a battle in progress on this link</Text>
  )
}

function JoinedLink() {
  return (
    <View>
    <Text style = {styles.battleMessage}>waiting for opponent to join </Text>
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
    {!hasclick && <Pressable style = {styles.button} onPress = {startClick}><Text style = {{color:'white'}}>start </Text></Pressable>}
    {hasclick && <p>loading...</p>}
    </View>
  )
}

function WaitingForOwner() {
  return (
    <View>
    <Text style = {styles.battleMessage}>
    all set waiting for link owner to start battle
    </Text>
    </View>
  )
}

function LinkFull() {
  return (
    <Text style = {styles.battleMessage}>
    this battle link is currently full
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

         useEffect(()=>{

              socket.on("opponent-points", points => {

              })
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
        props.socket.emit("new-points",[newPoint,props.roomId])
      }
    }



   const nextQ = () => {
     if(current === props.questions.length - 1 ){
       setFinished(true)
       return
     }
     setInput("")
     setCurrent(current + 1)
   }


  return (
    <>

    {!finished && <View>

    <ThemedText style = {{fontSize: 20, fontWeight: 'bold',marginBottom: 20}}>{question.questionTitle}</ThemedText>
    <ThemedText style = {{fontSize: 18, marginBottom: 20}}>{question.questionText}</ThemedText>

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
    <Pressable style = {({pressed})=> [styles.button,{opacity: pressed ? 0.7 : 1}]}
      onPress = {updatePoint}
    >
    <Text style = {{color: 'white'}}>
    Submit
    </Text>
    </Pressable>
    </View>

    </View>
  }

   {finished && <View>
    <ThemedText style = {{fontSize: 20}}>End of Battle</ThemedText>
    <ThemedText>your points <Text style = {{color : colors.mainColor}}>{totalPoints}</Text> : opponent's points <Text style = {{color: colors.mainColor}}>{opponentPoints}</Text></ThemedText>
    </View>
  }
    </>
  )
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
 },
 battleMessage: {
   color: "white",
   padding: 10,
   backgroundColor: colors.mainColor,
   marginTop: 20
 }
})
