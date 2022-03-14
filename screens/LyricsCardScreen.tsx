import React from 'react'
import WebView from 'react-native-webview'
import { ThemedText, ThemedView } from '../components/Themed'
import { RootStackScreenProps } from '../types'


const LyricsCardScreen = ({route}: RootStackScreenProps<"LyricsCard">) => {
  return (
    <ThemedView style = {{flex: 1}}>
    <WebView
     source={{html: `<body>
       <h1>Hello Web View</h1>
       <canvas id="canvas" width="300" height="300"></canvas>
       <script lang ="text/javascript">
       alert("hello world")
       </script>
     </body>`}}
     onError= {(er)=> console.log(er)}
   />
    </ThemedView>
  )
}


export default LyricsCardScreen
