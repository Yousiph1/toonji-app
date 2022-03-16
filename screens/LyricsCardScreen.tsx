import React from 'react'
import WebView from 'react-native-webview'
import { ThemedText, ThemedView } from '../components/Themed'
import { RootStackScreenProps } from '../types'


const LyricsCardScreen = ({route}: RootStackScreenProps<"LyricsCard">) => {
  return (
    <ThemedView style = {{flex: 1,}}>
    <WebView
     source={{html: `<!DOCTYPE html>
     <html lang="en" dir="ltr">
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
          #bar-container {
            text-align: left;
            float: left;
            padding-left: 10px;
            width: 60%;
            position: relative;
            background-color: green;
          }
          #bar {
            position: absolute;
            bottom: 0;
            padding: 5px;
            text-align: left;
            font-size: 25px;
            font-weight: bold;
            text-shadow: 0 0 10px blue
          }
          textarea {
            position: absolute;
            width: 100%;
            text-align: left;
            top: 0;
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
         <div id="bar-container">
         <p  id="bar">Blue Origin for the boys</p>
         <textarea onchange="alert('You just changed the textarea.')" placeholder="Type in this box. When you click away an alert will be generated.">
         </textarea>
         </div>
         </div>
         <div id = "footer">
         <p>Artist Name</p>
         <p>SongTitle </p>
         </div>
         </div>
         </center>
         <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
         <script lang ="text/javascript">
         function updateBar(e) {
           let bar = document.getElementById("bar")
           bar.innerText = e.target.value
           console.log(e)
         }

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
