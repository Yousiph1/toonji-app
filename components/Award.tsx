import React from 'react'
import {Image, View, Text, StyleSheet} from 'react-native'

import colors from '../constants/Colors'


const Award = ({awards}) => {

  return (
    <>
      <View style = {styles.awardContainer}>
     {
       awards && awards['platinum'] > 0 ?
       <>
       <Image source = {require('../assets/images/platinum.png')} style = {styles.awardImage}/>
       <Text style = {styles.awardCount}>{awards['platinum']}</Text>
       </>
         :
        null
     }
      </View>
      <View style = {styles.awardContainer}>
     {
       awards && awards['diamond'] > 0 ?
       <>
       <Image source = {require('../assets/images/diamond.png')} style = {styles.awardImage}/>
       <Text style = {styles.awardCount}>{awards['diamond']}</Text>
       </>
         :
        null
     }
      </View>
      <View style = {styles.awardContainer}>
     {
      awards && awards['gold'] > 0 ?
       <>
       <Image source = {require('../assets/images/gold.png')} style = {styles.awardImage}/>
       <Text style = {styles.awardCount}>{awards['gold']}</Text>
       </>
         :
        null
     }
      </View>
      <View style = {styles.awardContainer}>
     {
       awards && awards['silver'] > 0 ?
       <>
       <Image source = {require('../assets/images/silver.jpg')} style = {styles.awardImage}/>
       <Text style = {styles.awardCount}>{awards['silver']}</Text>
       </>
         :
        null
     }
      </View>
      <View style = {styles.awardContainer}>
     {
      awards && awards['bronze'] > 0 ?
       <>
       <Image source = {require('../assets/images/bronze.jpg')} style = {styles.awardImage}/>
       <Text style = {styles.awardCount}>{awards['bronze']}</Text>
       </>
         :
        null
     }
      </View>
      <View style = {styles.awardContainer}>
     {
      awards && awards['copper'] > 0 ?
       <>
       <Image source = {require('../assets/images/copper.jpg')} style = {styles.awardImage}/>
       <Text style = {styles.awardCount}>{awards['copper']}</Text>
       </>
         :
        null
     }
      </View>
      </>
  )
}


const styles = StyleSheet.create({
   awardContainer: {
     position: 'relative',
     paddingHorizontal: 7
   },
   awardImage: {
     height: 20,
     width: 20,
     borderRadius: 50,
   },
   awardCount: {
     position: 'absolute',
     left: 20,
     padding: 3,
     backgroundColor: colors.mainColor,
     color: 'white',
     borderRadius: 50,
     fontSize: 8,
   }

})


export default Award
