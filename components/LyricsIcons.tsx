import React from 'react'
import {View, StyleSheet} from 'react-native'

const CardIcon = ({icon, number}:{icon: React.ReactNode, number?:React.ReactNode}) => {

  return (
    <View style = {styles.iconContainer}>
    {icon}
    {number ? number: null}
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
     flexDirection: "row",
     alignItems: 'center',
     marginRight: 10
  },
  iconNumber: {
      fontSize: 12
  },
})


export default CardIcon
