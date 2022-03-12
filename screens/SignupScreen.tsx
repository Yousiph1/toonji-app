import React,{useState, useContext} from 'react'
import {View, Text, TextInput,Pressable, StyleSheet, ActivityIndicator} from 'react-native'
import axios from 'axios'

import {ThemedText, ThemedView} from '../components/Themed'
import colors from '../constants/Colors'
import {RootStackScreenProps} from '../types'
import {BASEURL} from '../constants/Credentials'
import { AuthContext } from '../navigation/context'
import { NotifyContext } from '../components/Notify'
import { ThemeContext } from '../App'

export default function SignUpScreen({navigation}:RootStackScreenProps<'Signup'>) {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [loading, setIsLoading] = useState(false)
  const {signIn} = useContext(AuthContext)
  const {newNotification} = useContext(NotifyContext)
  const {color} = useContext(ThemeContext)

const handleName = (text: string) => {
  if(text.match(/\W/)) return setNameError("Only english characters allowed")
  setNameError("")
  setName(text)
}

const handleEmail = (text: string) => {
  if(!text.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/))
   {
     setEmailError("Not a valid email")
   }else {
     setEmailError("")
   }
   setEmail(text)
}

const handlePassword = (text: string) => {
  if(text.length < 6){
    setPasswordError("Password must be longer than 6 characters")
  } else if(repeatPassword !== "" && repeatPassword !== password) {
    setPasswordError("passwords don't match")
  }else {
    setPasswordError("")
  }

  setPassword(text)
}

const handleRepeatPasswrod = (text: string) => {
  if(password !== text) {
    setPasswordError("passwords don't match")
  }else {
    setPasswordError("")
  }

  setRepeatPassword(text)
}

const handleSignup = async () => {
  if(nameError || emailError || passwordError || loading) {
    newNotification("Check inputs and try again", 'ERROR')
    return
  }
  if(!(name && email && password && repeatPassword)){
    newNotification("Check inputs and try again", 'ERROR')
    return
  }

  try{
    setIsLoading(true)
    const res = await axios.post(`${BASEURL}m/signup`,{name,email,password,repeatPassword})
    if(res.data.type !== 'ERROR') {
      signIn(res.data.token)
    }
  }catch(err){
    setIsLoading(false)
    newNotification(err.response?.data.msg,'ERROR')
  }

}

  return (
    <ThemedView style = {styles.container}>
    <ThemedText style = {{fontSize: 25, fontWeight: 'bold', marginBottom:20}}>
    Sign up
    </ThemedText>
    <View style = {styles.inputContainer}>
    <TextInput
     style = {[styles.input,{color: colors[`${color}` as const].text}]}
     placeholder = "Enter user name"
     onChangeText = {handleName}
     value = {name}
    />
    <Text style = {styles.error}>{nameError ? nameError : ' '}</Text>
    </View>

    <View style = {styles.inputContainer}>
    <TextInput
     style = {[styles.input,{color: colors[`${color}` as const].text}]}
     placeholder = "Enter email"
     onChangeText = {handleEmail}
     value = {email}
    />
    <Text style = {styles.error}>{emailError ? emailError : ' '}</Text>
    </View>

    <View style = {styles.inputContainer}>
    <TextInput
     style = {[styles.input,{color: colors[`${color}` as const].text}]}
     placeholder = "Enter password"
     onChangeText = {handlePassword}
     value = {password}
     secureTextEntry
    />
    <Text style = {styles.error}>{passwordError ? passwordError : ' '}</Text>
    </View>

    <View style = {styles.inputContainer}>
    <TextInput
     style = {[styles.input,{color: colors[`${color}` as const].text}]}
     placeholder = "Repeat password"
     onChangeText = {handleRepeatPasswrod}
     value = {repeatPassword}
     secureTextEntry
    />
    </View>
    <Pressable
     onPress = {handleSignup}
     style = {({pressed}) => [{opacity: pressed ? 0.7 : 1},{alignSelf: 'flex-end'}]}>
     {loading ? <ActivityIndicator color = "white" size = "small"/> : <Text style = {styles.button}> sign up</Text>}
    </Pressable>
    <ThemedText style = {{marginVertical: 20}}>
    Already have an account? <Pressable onPress ={() => navigation.navigate("Login")}>
    <Text style = {{color:colors.mainColor}} >login</Text>
    </Pressable>
    </ThemedText>
    </ThemedView>
  )
}

const styles  = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 3
  },
  input : {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.mainColor,
    paddingHorizontal:10,
    paddingVertical: 7
  },
  error: {
    color: 'red'
  },
  button: {
   color: 'white',
   fontWeight: 'bold',
   alignSelf: 'flex-end',
   paddingVertical: 5,
   paddingHorizontal: 20,
   borderRadius: 4,
   backgroundColor: colors.mainColor,
   marginTop: 10
 },
})
