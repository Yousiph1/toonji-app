import React,{useState,useEffect, useCallback, useContext} from 'react';
import {Picker, View, StyleSheet, ScrollView,  RefreshControl, ActivityIndicator} from 'react-native';
//import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from 'axios'




import colors from '../constants/Colors'
import layout from '../constants/Layout'
import {BASEURL} from '../constants/Credentials'
import {ChartCard, ChartCardBar, ChartCardUser} from '../components/ChartCard'
import { NotifyContext } from '../components/Notify';
import { ThemeContext } from '../navigation/context';



export default function ChartsScreen(){

  return (
    <MyTabs />
  )
}


const Tab = createMaterialTopTabNavigator();

const marL = ((layout.window.width / 3)/2) - 5


function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Today"
      screenOptions={{
        tabBarActiveTintColor: colors.mainColor,
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarIndicatorStyle: {
                                backgroundColor: colors.mainColor,marginLeft: marL,
                                width: 10, height: 10, borderRadius: 50},
        tabBarStyle: {
                     borderBottomColor: colors.mainColor,
                      elevation: 0
          },
      }}
    >
      <Tab.Screen
        name="Today"
        component={Today}
        options={{ tabBarLabel: 'Today' }}
      />
      <Tab.Screen
        name="Week"
        component={Week}
        options={{ tabBarLabel: 'This Week' }}
      />
      <Tab.Screen
        name="AllTime"
        component={AllTime}
        options={{ tabBarLabel: 'All Time' }}
      />
    </Tab.Navigator>
  )
}

const Today = () => {
  const [selectedValue, setSelectedValue] = useState<'Songs'|'Punchlines'>("Songs")
  const [isLoading, setIsloading] = useState(false)
  const [songs, setSongs] = useState<unknown[]>([])
  const [bars, setBars] = useState<unknown[]>([])
  const [refresh, setRefresh] = useState(false)

  const {newNotification} = useContext(NotifyContext)
  const {color} = React.useContext(ThemeContext)

  useEffect(()=> {
    setIsloading(true)
    axios.get(BASEURL + `m/charts/${selectedValue}/TODAY`)
    .then(res => {
      selectedValue === "Songs" ? setSongs(res.data) : setBars(res.data)
      setIsloading(false)
    })
    .catch(err => {
      setIsloading(false)
      newNotification(err.response?.data.msg, 'ERROR')
    })

  },[selectedValue])


 const onRefresh = useCallback(()=> {
   setRefresh(true)
   axios.get(BASEURL + `m/charts/${selectedValue}/TODAY`)
   .then(res => {
     selectedValue === "Songs" ? setSongs(res.data) : setBars(res.data)
     setRefresh(false)
   })
   .catch(err => {
     setRefresh(false)
     newNotification(err.response?.data.msg, 'ERROR')
   })
 },[])


  return (
<>
    <View style = {{width: layout.window.width}}>

      <RNPickerSelect
           onValueChange={(value) => setSelectedValue(value)}
           items={[
               { label: 'Lyrics', value: 'Songs' },
               { label: 'Bars', value: 'Punchlines' },
           ]}
           style = {pickerSelectStyles}
       />
      </View>
      <ScrollView contentContainerStyle = {{backgroundColor: colors[`${color}` as const].darkgray}}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={onRefresh}
        />
      }
      >
      {isLoading &&  <ActivityIndicator size="large" color={colors.mainColor}/>}
      {selectedValue === "Songs" && songs.map((bar,indx) => <ChartCard {...bar} pos = {indx + 1} key = {indx}/>)}
      {selectedValue === "Punchlines" && bars.map((bar,indx)=> <ChartCardBar {...bar} key = {indx}/> )}
      </ScrollView>
      </>
  )
}

const Week = () => {
  const [selectedValue, setSelectedValue] = useState<'Songs'|'Punchlines'>("Songs")
  const [isLoading, setIsloading] = useState(false)
  const [songs, setSongs] = useState<unknown[]>([])
  const [bars, setBars] = useState<unknown[]>([])
  const [refresh, setRefresh] = useState(false)

  const {newNotification} = useContext(NotifyContext)
  const {color} = useContext(ThemeContext)

  useEffect(()=> {
    setIsloading(true)
    axios.get(BASEURL + `m/charts/${selectedValue}/WEEK`)
    .then(res => {
      selectedValue === "Songs" ? setSongs(res.data) : setBars(res.data)
      setIsloading(false)
    })
    .catch(err => {
      setIsloading(false)
      newNotification(err.response?.data.msg, 'ERROR')
    })

  },[selectedValue])


  const onRefresh = useCallback(()=> {
   setRefresh(true)
   axios.get(BASEURL + `m/charts/${selectedValue}/WEEK`)
   .then(res => {
     selectedValue === "Songs" ? setSongs(res.data) : setBars(res.data)
     setRefresh(false)
   })
   .catch(err => {
     setRefresh(false)
     newNotification(err.response?.data.msg, 'ERROR')

   })
  },[])

  return (
    <>
  <View style = {{width: layout.window.width}}>
       <RNPickerSelect
            onValueChange={(value) => setSelectedValue(value)}
            items={[
                { label: 'Lyrics', value: 'Songs' },
                { label: 'Bars', value: 'Punchlines' },
            ]}
            value= "Songs"
            style = {pickerSelectStyles}
        />
    </View>
      <ScrollView
      contentContainerStyle = {{paddingBottom: 10, backgroundColor: colors[`${color}` as const].darkgray}}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={onRefresh}
        />
      }
      >
        {isLoading &&  <ActivityIndicator size="large" color={colors.mainColor}/>}
      {selectedValue === "Songs" && songs.map((bar,indx) => {
        return <ChartCard {...bar} pos={indx + 1} key={indx} />;
      })}
      {selectedValue === "Punchlines" && bars.map((bar,indx)=> {
        return <ChartCardBar {...bar} key={indx} />;
      } )}
      </ScrollView>
      </>
  )
  }


const AllTime = () => {
  const [selectedValue, setSelectedValue] = useState<'Songs'|'Punchlines' | 'Users' | 'Artists'>("Songs")
  const [isLoading, setIsloading] = useState(false)
  const [songs, setSongs] = useState<unknown[]>([])
  const [bars, setBars] = useState<unknown[]>([])
  const [users, setUsers]  = useState<unknown[]>([])
  const [artists, setArtists]  = useState<unknown[]>([])
  const [refresh, setRefresh] = useState(false)
  const {newNotification} = useContext(NotifyContext)
  const {color} = useContext(ThemeContext)
  useEffect(()=> {
    setIsloading(true)
    axios.get(BASEURL + `m/charts/${selectedValue}/AllTime`)
    .then(res => {
      if(selectedValue === "Songs") {
        setSongs(res.data)
      }else if(selectedValue === "Punchlines"){
        setBars(res.data)
      }else if (selectedValue === "Artists") {
        setArtists(res.data)
      }else {
        setUsers(res.data)
      }
      setIsloading(false)
    })
    .catch(err => {
      setIsloading(false)
      newNotification(err.response?.data.msg, 'ERROR')
    })

  },[selectedValue])


  const onRefresh = useCallback(()=> {
   setRefresh(true)
   axios.get(BASEURL + `m/charts/${selectedValue}/AllTime`)
   .then(res => {
     selectedValue === "Songs" ? setSongs(res.data) : setBars(res.data)
     setRefresh(false)
   })
   .catch(err => {
     setRefresh(false)
     newNotification(err.response?.data.msg, 'ERROR')
   })
  },[])

  return (
    <>
    <View style = {{width: layout.window.width}}>
      <RNPickerSelect
           onValueChange={(value) => setSelectedValue(value)}
           items={[
               { label: 'Lyrics', value: 'Songs' },
               { label: 'Bars', value: 'Punchlines' },
               { label: 'Artists', value: "Artists"},
               { label: "Users", value: "Users"}
           ]}
           value = "Songs"
           style = {pickerSelectStyles}
       />
      </View>
      <ScrollView
      contentContainerStyle = {{paddingBottom: 10, backgroundColor: colors[`${color}` as const].darkgray}}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={onRefresh}
        />
      }
      >

      {isLoading &&  <ActivityIndicator size="large" color={colors.mainColor}/>}
      {selectedValue === "Songs" && songs.map((bar,indx) => <ChartCard {...bar} pos = {indx + 1} key = {indx}/>)}
      {selectedValue === "Punchlines" && bars.map((bar,indx)=> <ChartCardBar {...bar} key = {indx}/> )}
      {selectedValue === "Artists" && artists.map((item, indx) => <ChartCardUser {...item} pos = {indx + 1} key = {indx} verified = {true}/>)}
      {selectedValue === "Users" && users.map((item, indx) => <ChartCardUser {...item} pos = {indx + 1} key = {indx}/>)}
      </ScrollView>
      </>
  )
  }



const styles = StyleSheet.create({

    picker : {
       color: 'white',
       fontWeight: 'bold',
       backgroundColor: colors.mainColor
     },
     itemStyle: {
       color: 'white',
       fontWeight: 'bold'
     },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: 2,
      paddingVertical: 10
    },

})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: colors.mainColor,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: colors.mainColor,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
