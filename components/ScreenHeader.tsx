import React,{useEffect, useState} from 'react'
import {StyleSheet, TextInput} from 'react-native'
import colors from '../constants/Colors'
import layout from '../constants/Layout'
import {ThemedView} from './Themed'

export default function ScreenHeader({placeholder, logo, goBack, searchFunc}:
             {placeholder: string; logo?: React.ReactNode,
              goBack?: React.ReactNode, searchFunc: (str: string) => void}) {
  const [searchParam, setSearchParam] = useState('')
  useEffect(()=> {
    if(searchFunc) {
      searchFunc(searchParam)
    }
  },[searchParam])

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
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  searchBox: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    flexBasis: layout.window.width,
    flexShrink:1,
    backgroundColor: 'lightgray',
    color: colors.mainColor,
    fontSize: 17,
    marginHorizontal: 20
  }

})
