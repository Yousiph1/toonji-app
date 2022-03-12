import React, { useContext } from 'react';
import { StyleSheet, View, Image, Text} from 'react-native';
import { FontAwesome, MaterialIcons} from '@expo/vector-icons';
import { Link } from '@react-navigation/native';



import { ThemedText, ThemedView } from '../components/Themed';
import CardIcon from '../components/LyricsIcons'
import colors from '../constants/Colors'
import { ThemeContext } from '../navigation/context';


type cardPops = {
                  songTitle: string;
                  songArtist: string;
                  songCover: string;
                  lyricId:string;
                  view: string;
                  rating: number;
                  otherArtists: string;
                  pos: number;
                  key: number;
                }

export const ChartCard = (props: cardPops) => {
  const {songTitle, songArtist, view, rating, otherArtists, pos, lyricId, songCover } = props
  let artistPreview = songArtist
   if(otherArtists !== '' && otherArtists !== undefined && otherArtists !== 'undefined') {
     artistPreview += ' ft ' + otherArtists
     artistPreview = artistPreview.length > 30 ? artistPreview.substring(0,27) + "..." : artistPreview.substring(0,30)
   }else {
     artistPreview = artistPreview.length > 30 ? artistPreview.substring(0,27) + "..." : artistPreview.substring(0,30)
   }
  return (

    <ThemedView style = {styles.cardContainer}>
    <ThemedText style = {{flexBasis: '10%'}}>{pos}</ThemedText>
    <View style = {styles.cardInfo}>
    <Image source = {{uri: songCover}} style = {styles.cardImage} />
    <View style = {{marginLeft: 10}}>
    <Link to = {{screen:'Read', params:{songId: lyricId}}}>
    <ThemedText style = {styles.songTitle}>{songTitle}</ThemedText>
    </Link>
    <Link to  = {{screen:'Artist',params:{userName: songArtist}}}>
    <Text style = {styles.songArtist}>{artistPreview}</Text>
    </Link>
    </View>
    </View>

    <View style = {{flexBasis: '20%'}}>
    <CardIcon icon = {<FontAwesome name = "eye" color = {colors.mainColor} size = {15} />}
                       number = {<ThemedText>{" "}{view}</ThemedText>} />
    <CardIcon icon = {<FontAwesome name = "star" color = {colors.mainColor} size = {15}/>}
                        number = {<ThemedText>{" "}{isNaN(rating) ? "0.0": rating}</ThemedText>} />
    </View>

    </ThemedView>
  )
}

type cardPropsBar = {
                  artist: string;
                  fires: string
                  otherArtists:string;
                  songId: string;
                  punchline: string;
                  songTitle: string;
                  punchlineId:  string;
                  songArtist: string;
                  key: number;
                }

export const ChartCardBar = (props: cardPropsBar) => {
  const {songTitle, songArtist, fires, otherArtists, punchline, artist, songId } = props

  let artistPreview = songArtist
   if(otherArtists !== '' && otherArtists !== undefined && otherArtists !== 'undefined') {
     artistPreview += ' ft ' + otherArtists
     artistPreview = artistPreview.length > 30 ? artistPreview.substring(0,27) + "..." : artistPreview.substring(0,30)

   }else {
     artistPreview = artistPreview.length > 30 ? artistPreview.substring(0,27) + "..." : artistPreview.substring(0,30)
   }

  return (
    <ThemedView style = {{padding: 10, marginBottom: 5,marginHorizontal: 10}}>

    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
    <View>
    <Link to = {{screen:'Read', params:{songId: songId}}}>
    <ThemedText style = {styles.songTitle}>{songTitle}</ThemedText>
    </Link>
    <Link to  = {{screen:'Artist',params:{userName: songArtist}}}>
    <Text style = {styles.songArtist}>{artistPreview}</Text>
    </Link>
    </View>
    <CardIcon icon = {<MaterialIcons name = "local-fire-department" size = {18}
              color = {colors.mainColor}/>}  number = {<ThemedText>{fires}</ThemedText>}/>
    </View>

    <ThemedText style = {{paddingVertical:5,paddingLeft:20}}>
    {punchline}
    </ThemedText>

    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>

    <CardIcon icon = {<FontAwesome name = "copy" size = {18} color = {colors.mainColor}/>} />
    <ThemedText>~{artist}</ThemedText>
    </View>

    </ThemedView>
  )
}


interface userProps {
  name: string;
  points: string;
  followers: string;
  pos: number;
  verified?: boolean;
  picture: string;
}


export const ChartCardUser = (props: userProps) => {
   const {name, points, followers, pos, verified, picture} = props
    const {color} = useContext(ThemeContext)
  return (

    <ThemedView style = {styles.userCardContainer}>

    <ThemedText>{pos}</ThemedText>

    <View style = {{flexDirection: 'row', flexBasis: '70%'}}>
    <Image source = {{uri: picture}} style = {styles.userImage} />

    <View style = {{marginLeft: 10}}>

    <ThemedText style = {styles.songTitle}>{name} {verified ? <MaterialIcons name="verified" size={12} color=  {colors.mainColor} />:''}</ThemedText>
    <View style = {{flexDirection: 'row', marginTop: 7}}>
    <View style = {[styles.userStats,{backgroundColor: colors[`${color}` as const].gray}]}>
    <ThemedText>{points}</ThemedText>
    <ThemedText style = {{color: 'gray'}}>points</ThemedText>
    </View>

    <View style = {[styles.userStats,{backgroundColor: colors[`${color}` as const].gray}]}>
    <ThemedText>{followers}</ThemedText>
    <ThemedText style = {{color: 'gray'}}>followers</ThemedText>
    </View>
    </View>
    </View>

    </View>

    </ThemedView>
  )
}




const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 2,
      paddingVertical: 10,
      paddingHorizontal: 10
    },

    cardInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexBasis: '55%'
    },

    cardImage: {
      width: 50,
      height: 50,
      backgroundColor: 'gray'
    },
    userImage: {
      width: 70,
      height: 70,
      marginTop: 5,
      backgroundColor: 'gray'
    },

    songTitle: {
     fontWeight: 'bold'
    },

    songArtist: {
      color: colors.mainColor,
      fontSize: 11
    },

    userCardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 5,
      paddingVertical: 10
    },
    userStats: {
      backgroundColor: 'lightgray',
      paddingVertical: 3,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      borderRadius: 5
    }

})
