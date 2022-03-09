import React from 'react'
import {Pressable, View} from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import colors from './Colors'
import useColorScheme from '../hooks/useColorScheme'

export default function Back({goBack}:{goBack: () => void}) {
   const theme = useColorScheme()
  return (
    <Pressable
     onPress = {()=> goBack() }
     style = {({pressed})=>[{opacity: pressed ? 0.5 : 1}]}
    >
    <View style = {{padding: 5}}>
    <Ionicons name="ios-arrow-back-sharp" size={24} color={colors.mainColor} />
    </View>
    </Pressable>
  )
}
