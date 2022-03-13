import React, {useEffect, useState, useContext } from 'react'
import { Pressable, TextInput, View , Text, StyleSheet, ActivityIndicator} from 'react-native'
import Modal from "react-native-modal"

import { ThemedText, ThemedView } from './Themed'
import colors from '../constants/Colors'
import layout from '../constants/Layout'
import axios from 'axios'
import { BASEURL } from '../constants/Credentials'
import { AuthContext } from '../navigation/context';
import { NotifyContext } from './Notify'
import { ThemeContext } from '../navigation/context';

export default function EditBrModal ({setModalVisible, isVisible, editData}:
  {setModalVisible:()=>void; isVisible:boolean; editData:{br: string; punchId: string; songId: string; id: string}}) {

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const {signOut} = useContext(AuthContext)
  const {newNotification} = useContext(NotifyContext)
  const {color} = useContext(ThemeContext)

  useEffect(()=> {
    setText(editData.br)
  },[editData])

  const handleTextChange = (text: string) => {
    setText(text)
  }

  const editBreakdown = () => {
  if(text.trim() === "") return
   setLoading(true)
   axios.post(`${BASEURL}edit-breakdown/${editData.songId}/${editData.punchId}/${editData.id}`,{newBreakdown: text})
   .then(res => {
     setLoading(false)
     newNotification(res.data.msg, 'SUCCESS')
     setModalVisible()
   })
   .catch(e => {
      setLoading(false)
     if(e.response?.satus === 401){
       signOut()
     }else {
       newNotification(e.resonse?.data.msg, 'ERROR')
     }
   })
  }

  return (
  <Modal isVisible = {isVisible}>
   <ThemedView style={{ padding: 20, alignSelf:"center", borderRadius: 5,
                  width: layout.isSmallDevice ? "95%":"90%"}}>
   <ThemedText style = {{marginBottom: 20, fontWeight: "bold"}}>Edit Breakdown</ThemedText>
   <TextInput
     multiline = {true}
     value = {text}
     style={[styles.input,{color: colors[`${color}` as const].text},{height: 150, marginBottom: 20,textAlignVertical: "top"}]}
     onChangeText= {handleTextChange}
   />

   <View  style = {{flexDirection: "row",
    justifyContent: "space-between", marginTop: 20 }}>

   <Pressable  onPress = {() => setModalVisible()}
   style = {({pressed}) => [styles.closeButton, {opacity: pressed ? 0.7: 1}]}>
    <Text style = {styles.buttonText}>close</Text>
   </Pressable>

   <Pressable  onPress = {editBreakdown}
   style = {({pressed}) => [styles.button, {opacity: pressed ? 0.7: 1}]}>
    {loading ? <ActivityIndicator size = "small" color = "white"/> :
                   <Text style = {styles.buttonText}>Edit</Text>}
   </Pressable>

   </View>
   </ThemedView>
  </Modal>
)
}


const styles = StyleSheet.create({
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
