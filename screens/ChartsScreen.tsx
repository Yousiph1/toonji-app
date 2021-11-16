import React,{useState} from 'react';
import { StyleSheet, View,Pressable, ScrollView, Image, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { FontAwesome, MaterialIcons} from '@expo/vector-icons';


import { ThemedText, ThemedView } from '../components/Themed';
import CardIcon from '../components/LyricsIcons'
import colors from '../constants/Colors'
import layout from '../constants/Layout'


export default function ChartsScreen(){
  const [selectedValue, setSelectedValue] = useState("java")
  return (
    <View>
    <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Lyrics" value="songs" />
        <Picker.Item label="Bars" value="punchlines" />
        <Picker.Item label="Artists" value="Artists" />
        <Picker.Item label="Users" value="Users" />
      </Picker>
      <ThemedView style = {styles.filterContainer}>
      <Pressable><ThemedText style = {styles.filter}>Today</ThemedText></Pressable>
      <Pressable><ThemedText style = {styles.filter}>Week</ThemedText></Pressable>
      <Pressable><ThemedText style = {styles.filter}>All-Time</ThemedText></Pressable>
      </ThemedView>

      <ScrollView contentContainerStyle = {{paddingBottom: 30}}>
      <ChartCard />
      <ChartCard />
      <ChartCard />
      <ChartCard />
      <ChartCard />
      <ChartCard />
      <ChartCard />
      <ChartCardBar />
      <ChartCardBar />
      <ChartCardBar />
      <ChartCardBar />
      </ScrollView>

    </View>
  )
}


const ChartCard = () => {
  return (
    <ThemedView style = {styles.cardContainer}>
    <ThemedText>1</ThemedText>

    <View style = {styles.cardInfo}>
    <Image source = {require('../assets/images/aotp.jpg')} style = {styles.cardImage} />
    <View style = {{marginLeft: 10}}>
    <ThemedText style = {styles.songTitle}>SongTitle</ThemedText>
    <Text style = {styles.songArtist}>Song Artist </Text>
    </View>
    </View>

    <View>
    <CardIcon icon = {<FontAwesome name = "eye" color = {colors.mainColor} size = {15} />}
                       number = {<ThemedText>100.00k</ThemedText>} />
    <CardIcon icon = {<FontAwesome name = "star" color = {colors.mainColor} size = {15}/>}
                        number = {<ThemedText>100.00k</ThemedText>} />
    </View>

    </ThemedView>
  )
}

const ChartCardBar = () => {

  return (
    <ThemedView style = {{padding: 10, marginBottom: 5}}>

    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
    <View>
    <ThemedText  style = {styles.songTitle}>Song Title </ThemedText>
    <Text style = {styles.songArtist}>song artist </Text>
    </View>
    <CardIcon icon = {<MaterialIcons name = "local-fire-department" size = {18}
              color = {colors.mainColor}/>}  number = {<ThemedText>33.3k</ThemedText>}/>
    </View>

    <ThemedText style = {{paddingVertical:5}}>
    My dog barks some. Mentally you picture my dog, but I have not told you
     the type of dog which I have. Perhaps you even picture Toto,
     from "The Wizard of Oz." But I warn you, my dog is always with me. Woof!
    </ThemedText>

    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>

    <CardIcon icon = {<FontAwesome name = "copy" size = {18} color = {colors.mainColor}/>} />
    <ThemedText>~KSI</ThemedText>
    </View>

    </ThemedView>
  )
}




const styles = StyleSheet.create({
    picker : {
       color: colors.mainColor,
     },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },

    filter: {
      fontWeight: 'bold',
      width: layout.window.width / 3,
      textAlign: 'center',
      paddingVertical: 15,
      borderBottomWidth: 2,
      borderBottomColor: colors.mainColor
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: 2,
      paddingVertical: 10
    },
    cardInfo: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    cardImage: {
      width: 50,
      height: 50
    },
    songTitle: {
     fontWeight: 'bold'
    },
    songArtist: {
      color: colors.mainColor
    },

})
