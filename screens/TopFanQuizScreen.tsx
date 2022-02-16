import React from 'react'
import {View, Text, Pressable} from 'react-native'
import { RootStackScreenProps } from '../types'


const TopFanQuizScreen: React.FC<RootStackScreenProps<'TopFanQuiz'>> = ({route,navigation}) => {
  const {name} = route.params
  return(
    <View>
    <Text>HI top fans {name}</Text>
    </View>
  )
}

export default TopFanQuizScreen
