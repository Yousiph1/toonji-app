import React from 'react'
import {Text, StyleSheet, View} from 'react-native'

import colors from './Colors'

export default function Logo() {
  return (
    <View>
    <Text style = {styles.logo}>Toonji</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  logo: {
    color: colors.mainColor,
    fontSize: 30,
    fontWeight: 'bold'
  },
})
