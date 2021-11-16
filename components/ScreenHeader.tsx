import React,{useState} from 'react'
import {StyleSheet, TextInput} from 'react-native'


import colors from '../constants/Colors'
import layout from '../constants/Layout'
import {ThemedView} from './Themed'


export default function ScreenHeader({placeholder, logo, goBack}:
                                    {placeholder: string; logo?: React.ReactNode, goBack?: React.ReactNode}) {
  const [searchParam, setSearchParam] = useState('')
  return (
    <ThemedView style = {headerStyles.container} >
    {logo}
    <TextInput style = {headerStyles.searchBox} value = {searchParam}
      onChangeText = {(text: string) => setSearchParam(text)} placeholder = {placeholder}/>
    {goBack}
    </ThemedView>
  )
}




const headerStyles = StyleSheet.create({
  container: {
    width: layout.window.width,
    height: 15/ 100  * layout.window.width,
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchBox: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    flexBasis: layout.window.width,
    flexShrink:1,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    color: colors.mainColor,
    fontSize: 17,
    marginHorizontal: 20
  }

})
