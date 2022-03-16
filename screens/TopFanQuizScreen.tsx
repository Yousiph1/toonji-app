import axios from 'axios'
import strSimilarity from 'string-similarity'
import React, { useContext, useEffect, useState } from 'react'
import {View, Text, Pressable, ActivityIndicator, TextInput, StyleSheet, ScrollView} from 'react-native'
import { ThemedText, ThemedView } from '../components/Themed'
import { BASEURL } from '../constants/Credentials'
import { RootStackScreenProps } from '../types'

import colors from '../constants/Colors'
import layout from '../constants/Layout'
import { NotifyContext } from '../components/Notify'
import { AuthContext, ThemeContext } from '../navigation/context'

const TopFanQuizScreen: React.FC<RootStackScreenProps<'TopFanQuiz'>> = ({route}) => {
  const {name} = route.params
  const [current,setCurrent] = useState(0);
  const [timeStart,setTimeStart] = useState(0);
  const [totalPoints,setTotalPoints] = useState(0)
  const [generatedQuestions,setQuestions] = useState<{questionText: string; questionTitle: string; questionAnswer: string}[]>([]);
//  const [getCoins,setGetCoins] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [question, setQuestion] = useState<{questionText: string; questionTitle: string; questionAnswer: string}>({})
  const {newNotification} = useContext(NotifyContext)
  const {signOut} = useContext(AuthContext)
  const {color} = useContext(ThemeContext)

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
              signOut()
            }else {
              newNotification(err.response?.data.msg,'ERROR')
            }
        })
      },[])


      useEffect(()=> {
        if(finished) {
          axios.post(`${BASEURL}top-fan/${name}/${totalPoints}`)
          .then(res => {
              newNotification(res.data.msg,'SUCCESS')
          })
          .catch(e => {
               newNotification(e.response?.data.msg,'ERROR')
          })
        }
      },[finished])

      useEffect(() => {
        setQuestion(generatedQuestions[current])
      },[current,generatedQuestions])

    const submit = () =>{
               if(answered) return
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
     if(current === generatedQuestions.length - 1 ){
       setFinished(true)
       return
     }
     setAnswered(false)
     setInput("")
     setCurrent(current + 1)
     setTimeStart(Date.now())

   }
  return(
    <ThemedView style = {{flex: 1, padding: 20, justifyContent: 'center'}}>
    {loading ? <ActivityIndicator size = "small" color = {colors.mainColor} />  :
    finished ? null :
    <ScrollView contentContainerStyle = {{justifyContent: 'center'}}>
        <ThemedText style = {{fontSize: 20, fontWeight: 'bold',marginBottom: 20}}>{question.questionTitle}</ThemedText>
        <ThemedText style = {{fontSize: 18, marginBottom: 20}}>{question.questionText}</ThemedText>

        <TextInput
          style={[styles.input,{color: colors[`${color}` as const].text}]}
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
         (answered && !finished)  &&   <View style = {[styles.popup,{backgroundColor: correct ? "green":'red'}]}>
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
   height: "40%",
   position: "absolute",
   alignItems: 'center',
   bottom: 0,
   padding: 20,
   justifyContent: 'center',
 }
})

export default TopFanQuizScreen
