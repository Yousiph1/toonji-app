import React from 'react'
import WebView from 'react-native-webview'
import { ThemedText, ThemedView } from '../components/Themed'
import { RootStackScreenProps } from '../types'


const LyricsCardScreen = ({route}: RootStackScreenProps<"LyricsCard">) => {
  return (
    <ThemedView style = {{flex: 1,}}>
    <WebView
     source={{html: `<html lang="en" dir="ltr">
       <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title></title>

         <style media="screen">
           img {
             height: 70%;
             width: 100%;
           }
          #card-container {
            position: relative;
            width: 95%;
            background-color: blue
          }
          #bar {
            position: absolute;
            bottom: 20px;
            padding: 5px;
            max-width: 60%;
            text-align: left;
            font-size: 25px;
            margin-left: 10px;
            font-weight: bold;
            text-shadow: 0 0 10px blue
          }
          #ii {
            position: relative
          }
          #footer {
            display:flex;

          }
          #footer p{
            margin-left: 10px;
          }
         </style>
       </head>
       <body>
         <center>
         <div id="card-container">
         <div id="ii">
         <img src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/fd/fda14057081dfd6ca4b4715960b70f377dbb6bb2_full.jpg" alt="">
         <p  id="bar" contentEditable="true">I am the est in this business what aboutayou</p>
          </div>
         <div id = "footer">
         <p>Artist Name</p>
         <p>SongTitle </p>
         </div>
         </div>
         </center>
         <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
         <script lang ="text/javascript">

         </script>
       </body>
     </html>
`}}
     onError= {(er)=> console.log(er)}
   />
    </ThemedView>
  )
}


export default LyricsCardScreen
