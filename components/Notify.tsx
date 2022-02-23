import React, { useEffect, useRef} from 'react'
import {StyleSheet, Animated} from 'react-native'

export const NotifyContext = React.createContext<any>(null)

import layout from "../constants/Layout"
import colors from "../constants/Colors"
import { ThemedText, ThemedView } from './Themed'

const Notify: React.FC<{message: string, type: 'ERROR'|'SUCCESS' |'NEUTRAL', setMessage: (ms: string) => void}> = ({message, type, setMessage}) => {

  const popup = useRef(new Animated.Value(0)).current
     useEffect(()=> {
       if(message !== "") {
         Animated.sequence([
           Animated.timing(popup,{toValue: -130,duration: 200,useNativeDriver: true}),
           Animated.timing(popup,{toValue: -170, duration: 100, useNativeDriver: true, delay: 3000}),
           Animated.timing(popup,{toValue: 0, duration: 200, useNativeDriver: true})
         ]).start(()=> {
            setMessage("")
         });
       }

     },[message])

    return (
      <Animated.View style = {[{transform: [{translateY:popup}]}]}>
      <ThemedView style = {[styles.container,
       {borderLeftColor: type === 'ERROR' ? 'red' : type === 'SUCCESS' ? "green":colors.mainColor}]}>
      <ThemedText style = {{textAlign: 'center', fontSize: 17}}>{message}</ThemedText>
      </ThemedView>
      </Animated.View>
    )
}


const styles = StyleSheet.create({
   container: {
     alignSelf: 'center',
     borderRadius: 8,
     bottom: -60,
     width: layout.isSmallDevice ? layout.window.width * 0.8 : layout.window.width * 0.7,
     position: 'absolute',
     padding: 10,
     backgroundColor: "white",
     borderLeftWidth: 10,
     elevation: 5,
     shadowOffset: {width: 0, height: 0},
     shadowRadius: 5,
     shadowOpacity: 0.2,
     shadowColor: 'black',
   }
})

export default Notify
