import React, { useState } from 'react'
import {View,Text, Image, StyleSheet, Pressable,TouchableOpacity} from 'react-native'
import { Link } from '@react-navigation/native';
import {ThemedText, ThemedView} from './Themed'
import colors from '../constants/Colors'



export const Achievement = (props:{thisUser?: boolean; userName?: string; navigation?: any; top:string;bottom:string, navigate: boolean}) => {
  const {navigate, navigation, userName, top, bottom, thisUser} = props
  const handleNavigation  = () => {
    if(!navigate) return
    let screen = bottom.split(" ").map(w => w[0].toUpperCase() + w.substr(1)).join("")
    navigation.navigate(screen,{name: userName, thisUser})
  }
  return (
  <Pressable style = {({pressed}) => [{opacity: pressed && navigate ? 0.7:1},{
    flexBasis: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5
  }]} onPress = {handleNavigation}>
    <ThemedText>{top}</ThemedText>
    <Text>{bottom}</Text>
    </Pressable>
  )
}

export const UserInfo = ({name,points,date, options, picture}:{name:string;points:string;date:string;
  picture: string; options: {data:{id: string, indx?:string,songId: string}, list: {name:string,func:()=>void}[]}}) => {

  date = new Date(date).toLocaleString()
  return (
   <View style = {{flexDirection: 'row', justifyContent: "space-between", paddingRight: 20, alignItems: "center"}}>
    <View style = {styles.userInfoContainer}>
    <Image source = {{uri: picture}} style = {styles.image}/>
    <View style = {styles.userInfoTextContainer}>
    <Link to = {{screen:"Users",params:{userName: name}}}>
    <ThemedText style = {{fontWeight: 'bold'}}>
    {name} <Text style = {{color: colors.mainColor}}> {points} points</Text>
    </ThemedText>
    </Link>
    <ThemedText style = {{color: "gray"}}>{date}</ThemedText>
    </View>
    </View>
    <Options options = {options.list} data = {options.data}/>
    </View>
  )

}

export const User: React.FC<{name: string; points: string; picture: string}> = ({name, points, picture}) => {
  return (
    <View style = {{flexDirection: 'row', justifyContent: "space-between", paddingRight: 20, alignItems: "center"}}>
     <View style = {styles.userInfoContainer}>
     <Image source = {{uri: picture}} style = {styles.image}/>
     <View style = {styles.userInfoTextContainer}>
     <Link to = {{screen:"Users",params:{userName: name}}}>
     <ThemedText style = {{fontWeight: 'bold', fontSize: 20}}>
     {name} <Text style = {{color: colors.mainColor}}>{ points} points</Text>
     </ThemedText>
     </Link>
     </View>
     </View>
     </View>
  )
}


 const Options = ({options, data}:{options: {name: string; func : ()=> void}[], data: {id: string, indx?:string,songId: string}}) => {
   const [show, setShow] = useState(false)
  return (
    <View style = {{position: 'relative', zIndex: 1}}>
    <Pressable onPress = {() => setShow(prev => !prev)}>
    <View style = {{paddingHorizontal: 10}}>
    <View style = {styles.optionDot}></View>
    <View style = {styles.optionDot}></View>
    <View style = {styles.optionDot}></View>
    </View>
    </Pressable>
    {
    show && <ThemedView style = {styles.optionList}>
    {
      options.map((option) => {
        return (
        <TouchableOpacity
         key = {option.name}
         activeOpacity = {0.7}
         style = {[{paddingVertical:7, paddingHorizontal: 10}]}
         onPress = {() => option.func()}>
        <ThemedText >{option.name}</ThemedText>
        </TouchableOpacity>
      )
      })
    }
    </ThemedView>
     }
    </View>
  )
}


export const AwardInfo = (props:{image: string; awardName: string; remove: (n:string) => void,
                                 numberOfCoins: string, add: (n:string) => void}) => {
   const [selected, setSelected] = useState(false)
  //const sour = require(props.image)
  return (
    <Pressable onPress = {() => {
      if(selected) {
        setSelected(false)
        props.remove(props.awardName)
      }else {
        setSelected(true)
        props.add(props.awardName)
      }

    }}
    style = {({pressed}) => [{opacity: pressed? 0.7: 1},styles.awardContainer,
                             {backgroundColor: selected ? "green":colors.mainColor}]}>
    <Text style = {styles.awardText}>{props.awardName}</Text>
    <Image source = {require('../assets/images/platinum.png')} style = {styles.awardImage}/>
    <Text style = {styles.awardText}>{props.numberOfCoins}</Text>
    </Pressable>
  )
}


const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10
  },
   image: {
     height: 50,
     width: 50,
     borderRadius: 50,
     backgroundColor: 'gray'
   },
   userInfoTextContainer: {
     marginLeft: 10
   },
   optionDot: {
     marginBottom: 3,
     width: 5,
     height: 5,
     borderRadius: 50,
     backgroundColor: "darkgray"
   },
   optionList: {
     position: 'relative',
     paddingVertical: 5,
     elevation: 5,
     shadowOffset: {width: 0, height: 0},
     shadowRadius: 5,
     shadowOpacity: 0.2,
     shadowColor: 'darkgray',
     right: 20,
     alignItems: 'center'
   },
   awardContainer : {
     justifyContent: "center",
     alignItems: 'center',
     padding: 5,
     width: "30%",
     borderRadius: 5,
   },
   awardImage: {
    borderRadius: 50,
    width: "90%",
    height: 70
  },
  awardText: {
    fontWeight: "bold",
    color: "white"
  }
})
