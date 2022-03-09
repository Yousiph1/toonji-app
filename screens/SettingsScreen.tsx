import React,{ useContext, useEffect, useState } from 'react'
import {Pressable, ScrollView, Text, View, StyleSheet, Alert} from 'react-native'
import { ThemedView, ThemedText } from '../components/Themed'
import {RadioButton} from 'react-native-paper'
import colors from '../constants/Colors'
import {AsyncStore as AsyncStorage} from '../funcs/AsyncStore'
import { AuthContext } from '../navigation'
import { BASEURL } from '../constants/Credentials'
import axios from 'axios'
import { NotifyContext } from '../components/Notify'
import {ThemeContext} from '../App'

const SettingsScreen: React.FC = () => {
  const [checked,setChecked] = useState("15px")
  const [colorChecked, setColorChecked] = useState('grey')
  const [themeChecked, setThemeChecked] = useState("Light")
  const [fontFamily, setFontFamily] = useState("")
  const {signOut} = useContext(AuthContext)
  const {newNotification} = useContext(NotifyContext)
  const {changeTheme} = useContext(ThemeContext)

  useEffect(()=> {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('fontSize')
        if(value) setChecked(value.toString() + "px")
        const cc = await AsyncStorage.getItem("color")
        if(cc) setColorChecked(cc)
        const theme  = await AsyncStorage.getItem("theme")
        if(theme) setThemeChecked(theme)
        const ff = await AsyncStorage.getItem("fontFamily")
        if(ff) setFontFamily(ff)
      } catch(e) {
        // error reading value
      }
    }
     getData()
  },[])


  const  cacheChecked = async (val: string) => {
     const newVal = val.substr(0,2)
     try{
       await AsyncStorage.setItem("fontSize",newVal)
       setChecked(val)
     }catch(e) {
         newNotification("Failed to set font size", 'ERROR')
     }

  }
  const cacheColor = async (val: string) => {
    try {
      await AsyncStorage.setItem("color",val)
      setColorChecked(val)
    }catch(e) {
       newNotification("Failed to set lyrics color", 'ERROR')
    }

  }

  const cacheTheme = async (val: string) => {
    try{
      await AsyncStorage.setItem("theme",val)
      setThemeChecked(val)
      changeTheme(val)
    }catch(e) {
        newNotification("Failed to change theme", 'ERROR')
    }

  }

  const cacheFontFamily = async (val: string) => {
    try{
      await AsyncStorage.setItem("fontFamily", val)
      setFontFamily(val)
    }catch(e) {
        newNotification("Failed to set font family", 'ERROR')
    }
  }

  const logout = () => {
    axios.post(`${BASEURL}p/log-out`)
    .then(res => {
       signOut()
    })
    .catch(err => {
       newNotification("Failed to logout", 'ERROR')
    })
  }

  const openAlert = () =>
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Yes",
          onPress: () => logout(),
          style: "destructive"
        }
      ]
    );

  return (
  <ThemedView style = {{flex: 1,paddingHorizontal:5}}>
  <ScrollView>
  <View style = {styles.itemContainer}>
  <ThemedText  style = {styles.textHeading}>Lyrics Font Size </ThemedText>
  <FontSetting label ={15} value = "15px" checked = {checked} setChecked = {cacheChecked}/>
  <FontSetting label ={18} value = "18px" checked = {checked} setChecked = {cacheChecked}/>
  <FontSetting label ={20} value = "20px" checked = {checked} setChecked = {cacheChecked}/>
  <FontSetting label ={22} value = "22px" checked = {checked} setChecked = {cacheChecked}/>
  </View>

  <View style = {styles.itemContainer}>
  <ThemedText  style = {styles.textHeading}>Lyrics Text Color </ThemedText>
  <ColorSetting color = "black" checked = {colorChecked} setChecked = {cacheColor} />
  <ColorSetting color = "grey" checked = {colorChecked} setChecked = {cacheColor} />
  <ColorSetting color = "yellow" checked = {colorChecked} setChecked = {cacheColor} />
  <ColorSetting color = "blue" checked = {colorChecked} setChecked = {cacheColor} />
  <ColorSetting color = {colors.mainColor} checked = {colorChecked} setChecked = {cacheColor} />
  </View>

  <View style = {styles.itemContainer}>
  <ThemedText  style = {styles.textHeading}>Lyrics Font Family</ThemedText>
  <FontSetting family = "space-mono" value = "space-mono" checked = {fontFamily} setChecked = {cacheFontFamily} theme/>
  <FontSetting family = "helvetica" value = "helvetica" checked = {fontFamily} setChecked = {cacheFontFamily} theme />
  <FontSetting family = "roboto" value = "roboto" checked = {fontFamily} setChecked = {cacheFontFamily} theme />
  <FontSetting family = "san francisco" value = "san francisco" checked = {fontFamily} setChecked = {cacheFontFamily} theme />

  </View>

  <View style = {styles.itemContainer}>
  <ThemedText  style = {styles.textHeading}>Theme</ThemedText>
  <FontSetting value = "light" checked = {themeChecked} setChecked = {cacheTheme} theme/>
  <FontSetting value = "dark" checked = {themeChecked} setChecked = {cacheTheme} theme/>
  </View>

  <View style = {styles.break}></View>
  <Pressable  onPress = {openAlert}
  style = {({pressed}) => [{opacity: pressed ? 0.7 : 1},{padding: 5, width: 100}]}>
  <Text style = {{color: 'red'}}>Log out</Text>
  </Pressable>
  <View style = {styles.break}></View>
  <Pressable style = {({pressed}) => [{opacity: pressed ? 0.7 : 1,marginBottom: 20},{backgroundColor: 'red',padding:5, width: 110,borderRadius:5}]}>
  <Text style ={{color: 'white'}}>Delete Account</Text>
  </Pressable>
  <Text style = {{marginTop: 100,marginBottom:10, alignSelf: 'center', color: 'gray'}}>made in Salaga, Ghana.</Text>
  </ScrollView>
  </ThemedView>
  )
}


const FontSetting: React.FC<{label?:number; value: string; checked: string;
   setChecked: any; theme?:boolean; family?: string}> =
  ({label,value,checked, setChecked, theme,family}) => {
  return (
    <Pressable style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10}}
    onPress = {()=> setChecked(value)}
    >
    {!theme && <ThemedText style = {{fontSize: label }}>{label} px</ThemedText>}
    {theme && <ThemedText style = {{fontSize: 18,fontFamily: family ? family : undefined}}>{value}</ThemedText>}
    <RadioButton
         value={value}
         color= {colors.mainColor}
         status={ checked === value ? 'checked' : 'unchecked' }
         onPress={() => setChecked(value)}
    />
    </Pressable>
  )
}

const ColorSetting: React.FC<{color: string, checked: string, setChecked:any}> = ({color,checked, setChecked}) => {
  return (
    <Pressable style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10}}
    onPress = {()=> setChecked(color)}
    >
    <View style = {{width: 30, height: 30, backgroundColor: color}}></View>
    <RadioButton
         value={color}
         color= {color}
         status={ checked === color ? 'checked' : 'unchecked' }
         onPress={() => setChecked(color)}
    />
    </Pressable>
  )
}


const styles = StyleSheet.create({
   textHeading: {
     fontWeight: "bold",
     fontSize: 20,
     paddingBottom: 7,

   },
   break: {
     marginVertical: 20,
   },
   itemContainer: {
     marginTop: 20,
     borderBottomColor: 'lightgray',
     borderBottomWidth: 1
   }
})

export default SettingsScreen
