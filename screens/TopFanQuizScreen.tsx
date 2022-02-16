import axios from 'axios'
import strSimilarity from 'string-similarity'
import React, { useEffect, useState } from 'react'
import {View, Text, Pressable, ActivityIndicator, TextInput, StyleSheet, ScrollView} from 'react-native'
import { ThemedText, ThemedView } from '../components/Themed'
import { BASEURL } from '../constants/Credentials'
import { RootStackScreenProps } from '../types'

import colors from '../constants/Colors'
import layout from '../constants/Layout'

const TopFanQuizScreen: React.FC<RootStackScreenProps<'TopFanQuiz'>> = ({route,navigation}) => {
  const {name} = route.params
  const [current,setCurrent] = useState(0);
  const [timeStart,setTimeStart] = useState(0);
  const [totalPoints,setTotalPoints] = useState(0)
  const [generatedQuestions,setQuestions] = useState<{questionText: string; questionTitle: string; questionAnswer: string}[]>([]);
  const [getCoins,setGetCoins] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [question, setQuestion] = useState<{questionText: string; questionTitle: string; questionAnswer: string}>({})


      useEffect(()=>{
        setLoading(true)
        axios.get(`${BASEURL}top-fan-quiz/${name}`)
        .then(res => {
            setQuestions(res.data)
            setLoading(false)
        })
        .catch(err => {
           setLoading(false)
            if(err.response?.status === 401) {
              console.log(err)
            }
        })
      },[])

      if(finished) {
        axios.post(`${BASEURL}top-fan${name}/${totalPoints}`)
        .then(res => {
        })
        .catch(e => {

        })
      }
      useEffect(() => {
        setQuestion(generatedQuestions[current])
      },[current,generatedQuestions])

    const submit = () =>{
               let inpt = input
               let ans = question.questionAnswer.toLowerCase()
               ans = ans.replace(/in'/g,'ing')
               ans = ans.replace(/\W_/g,'')
               inpt = inpt.replace(/in'/g,'ing')
               inpt =  inpt.replace(/\W_/g,'')
               let isCorrect = strSimilarity.compareTwoStrings(ans,inpt)
               let timeUsed = Date.now() - timeStart;

               if(isCorrect > 0.8) {
                 if(timeUsed <= 10000) {
                   setTotalPoints(totalPoints + 10)
                 }else if(timeUsed <= 15000 && timeUsed > 10000) {
                   setTotalPoints(totalPoints + 7)
                 }else if(timeUsed <= 20000 && timeUsed > 15000) {
                   setTotalPoints(totalPoints + 5)
                 }else {
                   setTotalPoints(totalPoints + 3)
                 }
                 if(isCorrect <= 0.85) {
                   setTotalPoints(totalPoints + 1)
                 }else if(isCorrect <= 0.90 && isCorrect > 0.85) {
                   setTotalPoints(totalPoints + 2)
                 }else if(isCorrect <= 0.95 && isCorrect > 0.90) {
                   setTotalPoints(totalPoints + 3)
                 }else {
                   setTotalPoints(totalPoints + 5)
                 }
                 setCorrect(true)
               }else {
                 setCorrect(false)
               }
               setAnswered(true)
           }

   const nextQ = () => {
     setAnswered(false)
     setInput("")
     setCurrent(current + 1)

   }
  return(
    <ThemedView style = {{flex: 1, padding: 20, justifyContent: 'center'}}>
    {loading ? <ActivityIndicator size = "small" color = {colors.mainColor} />  :
    <ScrollView contentContainerStyle = {{height: '70%', justifyContent: 'center'}}>
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
          onPress = {submit}
        >
        <Text style = {{color: 'white'}}>
        Submit
        </Text>
        </Pressable>
        </View>
        </ScrollView>
      }
       {
         answered &&   <View style = {[styles.popup,{backgroundColor: correct ? "green":'red'}]}>
        <Text style = {{color: 'white', fontSize: 25, marginBottom: 20}}>{correct ? "Correct answer" : "Wrong answer"}</Text>
        <Pressable style = {({pressed})=> [styles.button,{opacity: pressed ? 0.7 : 1}]}
          onPress = {nextQ}
        >
              <Text style = {{color: 'white'}}>
              {current === generatedQuestions.length - 1 ? "Finish": "Next"}
                </Text>
        </Pressable>
        </View>
      }
    {
       finished &&
       <View style = {{alignSelf: 'center', justifyContent:'center'}}>
       <ThemedText style = {{fontSize: 20, color: 'green'}}>Thank you for taking the top fan quiz</ThemedText>
       <ThemedText style = {{fontSize: 18}}>you had a total points of <Text style = {{color: colors.mainColor}}>{totalPoints}</Text></ThemedText>
       </View>
    }
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  input : {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.mainColor,
    padding: 10,
    marginBottom: 5
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
   position: "absolute",
   alignItems: 'center',
   bottom: 0,
   padding: 20,
   justifyContent: 'center',
 }
})

export default TopFanQuizScreen

//
// function StartQuiz() {
//
//     let questions = ""
//     if(generatedQuestions.length > 0){
//     questions = generatedQuestions.map((q,indx)=>{
//         return <QuizQuestion key = {indx} questionTitle = {q.questionTitle}
//         questionText = {q.questionText} id = {indx} inputId = {`${indx}-answer`}
//         questionAnswer = {q.questionAnswer} resultId = {`${indx}-result`}
//         action = {current === generatedQuestions.length - 1 ? "finish":"next"}
//         qDisplay = {indx === current ? "start-quiz-main show-question":"start-quiz-main"}
//          submitClick = {(e)=>{
//              let inpt = document.getElementById(`${indx}-answer`).value.toLowerCase();
//              if(inpt === "") return
//              let ans = q.questionAnswer.toLowerCase()
//              ans = ans.replace(/in'/g,'ing')
//              ans = ans.replace(/\W/g,'')
//              inpt = inpt.replace(/in'/g,'ing')
//              inpt =  inpt.replace(/\W/g,'')
//              let isCorrect = strSimilarity.compareTwoStrings(ans,inpt)
//              let timeUsed = Date.now() - timeStart;
//
//              if(isCorrect > 0.8) {
//                if(timeUsed <= 10000) {
//                  setTotalPoints(totalPoints + 10)
//                }else if(timeUsed <= 15000 && timeUsed > 10000) {
//                  setTotalPoints(totalPoints + 7)
//                }else if(timeUsed <= 20000 && timeUsed > 15000) {
//                  setTotalPoints(totalPoints + 5)
//                }else {
//                  setTotalPoints(totalPoints + 3)
//                }
//                if(isCorrect <= 0.85) {
//                  setTotalPoints(totalPoints + 1)
//                }else if(isCorrect <= 0.90 && isCorrect > 0.85) {
//                  setTotalPoints(totalPoints + 2)
//                }else if(isCorrect <= 0.95 && isCorrect > 0.90) {
//                  setTotalPoints(totalPoints + 3)
//                }else {
//                  setTotalPoints(totalPoints + 5)
//                }
//                document.getElementById(`${indx}-result`).classList.add("show-result-correct")
//              }else {
//                document.getElementById(`${indx}-result`).childNodes[0].innerText = "Wrong answer"
//                document.getElementById(`${indx}-result`).classList.add("show-result-wrong")
//              }
//              e.target.style.display = "none"
//          }}
//        nextClick = {(e)=>{
//          document.getElementById(`${indx}-result`).classList.remove("show-result-correct")
//          document.getElementById(`${indx}-result`).classList.remove("show-result-wrong")
//          setTimeStart(Date.now())
//          setCurrent(current + 1);
//          if(e.target.innerText === "finish") {
//            let path = window.location.pathname;
//            let param = path.substr(path.lastIndexOf('/'))
//            axios.post(`${BASEURL}/top-fan${param}/${totalPoints}`)
//              .then(res => {
//                let msg = res.data.msg;
//                if(res.data.type === 'ERROR') {
//                  errorPrompt(msg)
//                }else {
//                  successPrompt(msg)
//                }
//              })
//              .catch(e => {
//                errorPrompt("something went wrong")
//              })
//            document.getElementById("quiz-finish-result").style.display = "block"
//          }
//        }}
//          />
//     })
//   }else {
//     questions = ""
//   }
//
//   return (
//
//     <div id= "start-quiz-container">
//     {questions}
//     {getCoins && <div>
//       <button className = "profile-buttons"><a href="/buy-coins.html" target ="_BLANK"
//       rel="noopener noreferrer">buy coins</a></button>
//       <button className = "profile-buttons" onClick = {() => window.history.back()}>back</button>
//     </div>}
//     </div>
