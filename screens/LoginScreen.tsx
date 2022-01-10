import axios from 'axios'
import React,{useContext, useState} from 'react'
import {View, Text, TextInput,Pressable, StyleSheet, ActivityIndicator} from 'react-native'

import {ThemedText, ThemedView} from '../components/Themed'
import colors from '../constants/Colors'
import { BASEURL } from '../constants/Credentials'
import { AuthContext } from '../navigation'
import { RootStackScreenProps } from '../types'


export default function LoginScreen({navigation}:RootStackScreenProps<"Login">) {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState("")
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(false)
  const {signIn} = useContext(AuthContext)


  const handleName = (text: string) => {
    if(text.match(/\W/)) return setNameError("Only english characters allowed")
    setNameError("")
    setName(text)
  }

  const handlePassword = (text: string) => {
    if(text.length < 6){
      setPasswordError("Password must be longer than 6 characters")
    }else {
      setPasswordError("")
    }
    setPassword(text)
  }


  const handleLogin = async () => {
    if(nameError || passwordError || loading) return
    if(!(name &&  password)) return
    setLoading(true)
    try{
      const res = await axios.post(`${BASEURL}m/login`,{name, password})
      signIn(res.data.token)
    }catch(err) {
      console.log(err)
    }finally {
        setLoading(false)
    }
  }

  return (
    <ThemedView style = {styles.container}>
    <ThemedText style = {{fontSize: 25, fontWeight: 'bold', marginBottom:20}}>
    Login
    </ThemedText>
    <View style = {styles.inputContainer}>
    <TextInput
     style = {styles.input}
     placeholder = "enter name"
     onChangeText = {handleName}
     value = {name}
    />
    <Text style = {styles.error}>{nameError ? nameError : ' '}</Text>
    </View>


    <View style = {styles.inputContainer}>
    <TextInput
     style = {styles.input}
     placeholder = "enter password"
     onChangeText = {handlePassword}
     value = {password}
     secureTextEntry
    />
    <Text style = {styles.error}>{passwordError ? passwordError : ' '}</Text>
    </View>

    <Pressable
    onPress = {handleLogin}
    style = {({pressed}) => [styles.button, {opacity: pressed ? 0.7 : 1}]}>
    {loading ? <ActivityIndicator color = "white" size = "small"/> : <Text style = {styles.buttonText}>Login</Text>}
    </Pressable>
    <ThemedText style = {{marginVertical: 20}}>
    Don't have an account? <Pressable onPress ={() => navigation.navigate("Signup")}>
    <Text style = {{color:colors.mainColor}} >sign up</Text>
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
    color:'red'
  },
  button: {
   alignSelf: 'flex-end',
   paddingVertical: 5,
   paddingHorizontal: 20,
   borderRadius: 4,
   backgroundColor: colors.mainColor,
   marginBottom: 7,
 },
 buttonText: {
   color: 'white',
   fontWeight: 'bold',
 }
})
