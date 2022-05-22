import React,{useState, useEffect, useContext, useCallback} from 'react'
import {View, Pressable, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform} from 'react-native'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';

import axios from 'axios'

import {UserInfo} from './General'
import colors from '../constants/Colors'
import layout from '../constants/Layout'
import { ThemedText } from './Themed'
import {BASEURL} from '../constants/Credentials'
import Award from './Award'
import { AuthContext } from '../navigation/context';
import { awardReq } from '../types';
import { NotifyContext } from './Notify';
import { ThemeContext } from '../navigation/context';

type songId = string;



export default function Comments({songId, showModal, showInput, comment}:
  {comment: commentType[] | undefined, showInput: ()=>void, songId: songId, showModal: (dd: awardReq) => void}) {

  const [comments, setComments] = useState([])
  const [nextFetch, setNextFetch] = useState(0)
  const [isEnd, setIsEnd] = useState(0)
  const [isLoading, setIsLoading] = useState(false)


  const {signOut} = useContext(AuthContext)
  const {newNotification} = useContext(NotifyContext)
  const {color} = useContext(ThemeContext)

   useEffect(()=> {
     setIsLoading(true)
     axios.get(BASEURL + `comments/${songId}/${0}`)
              .then(res => {
                setIsLoading(false)
                if(res.data.type === 'ERROR'){
                }else {
                    setComments(res.data.comments)
                    setIsEnd(res.data.isEnd)
                    setNextFetch(res.data.nextFetch)
                }
              })
              .catch(e => {
                setIsLoading(false)
                let msg = e.response?.data.msg
                if(e.response?.status === 401){signOut()}else{newNotification(msg,'ERROR')}

              })
   },[])

   const fetchMore = () => {
     axios.get(BASEURL + `comments/${songId}/${nextFetch}`)
              .then(res => {
                setIsLoading(false)
                if(res.data.type === 'ERROR'){
                }else {
                    setComments(res.data.comments)
                    setIsEnd(res.data.isEnd)
                    setNextFetch(res.data.nextFetch)
                }
              })
              .catch(e => {
                setIsLoading(false)
              setIsLoading(false)
              })
   }


useEffect(() => {
  if(comment !== undefined){
    console.log(comment)
    let comm: never[] = [...comment!,...comments] as never[]
    setComments([])
    setComments(comm)
  }
},[comment])


const deleteComment = (id: string) => {
   axios.post(`${BASEURL}delete/comment/${songId}/${id}`)
   .then(res => {
     newNotification(res.data.msg,'SUCCESS')
   })
   .catch(err => {
     if(err.response?.status === 401) {
       signOut()
     }else {
       newNotification(err.response?.data.msg, 'ERROR')
     }
   })
}


  return (
    <View style = {styles.commentsContainer}>
    <ThemedText style = {styles.title}>Comments</ThemedText>
 <Pressable onPress = {showInput}>
    <ThemedText
      style={[styles.input,{color: colors[`${color}` as const].gray}]}>
      Write comment
      </ThemedText>
    </Pressable>

   <View>
    {comments.map((c,indx) => {
      return <Comment key = {indx} {...c} songId = {songId}
      deleteComment = {deleteComment}
      showModal = {showModal}/>
    })}
    {isLoading && <ActivityIndicator size = "small" color = {colors.mainColor}/>}
    {(!isLoading && !isEnd) && <Pressable onPress = {fetchMore}>
      <FontAwesome name = "refresh" size = {18} color = {colors.mainColor} />
       </Pressable>
    }
    </View>
    </View>
  )
}


export interface commentType {
  name: string;
  points: string;
  date: string;
  likes: string;
  comment: string;
  isThisUser:string;
  songId: string;
  commAwards: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
    copper: number
  };
  id: string;
  liked: "LIKED" | "DISLIKED";
  picture: string;
  showModal: (dd: awardReq) => void;
  deleteComment: (r: string) => void
}


const Comment = (props: commentType ) => {
  const {name, points,date, comment, likes: lks, commAwards,
      deleteComment,
     isThisUser, songId, id, liked, showModal, picture} = props
  const [likes, setLikes] = useState(parseInt(lks) || 0)
  const [reaction, setReaction] = useState(liked)

  const commentReaction = (reactn: 'LIKED' | 'DISLIKED') => {
     if(reactn === reaction) return
     const temp = reaction
     setReaction(reactn)
     axios.post(`${BASEURL}comment-reactions/${songId}/${id}/${reactn}`)
     .then(res => {
       if(res.data.type !== 'ERROR') {

         if(reactn === 'DISLIKED' ) {
           if(temp === 'LIKED') return setLikes(prv => prv - 2)
           setLikes(prv => prv - 1)
         }else {
           if(temp === 'DISLIKED') return setLikes(prv => prv + 2)
           setLikes(prv => prv + 1)
         }
       }
     })
     .catch(err => {
        console.log(err)
     })
  }

  return (
    <View style = {styles.commentContainer}>
    <UserInfo name = {name} points = {points} date = {date} picture = {picture}
     options = {{data:{id, songId},
     list: isThisUser ?
     [{name: "Delete", func: ()=>{deleteComment(id)}}] :
     [{name:"Award",func: () =>showModal({type: "comment", songId, comment: {commentId: id} })}]}} />
    <View >
    <View style = {styles.awardsContainer}>
    <Award  awards = {commAwards}/>
    </View>
    <ThemedText style = {styles.comment}>
     {comment}
    </ThemedText>
    </View>
    <View style = {styles.iconsContainer}>

    <Pressable onPress = {() => commentReaction("LIKED")}>
    <AntDesign name="like2" size={24} color= { reaction === "LIKED" ? colors.mainColor : "grey"} />
    </Pressable>

    <ThemedText>{likes}</ThemedText>

    <Pressable onPress = {() => commentReaction("DISLIKED")}>
    <AntDesign name="dislike2" size={24} color= {reaction === "DISLIKED" ? colors.mainColor : "grey"} />
    </Pressable>

    </View>
    </View>
  )
}



const styles = StyleSheet.create({
   commentsContainer: {
     alignItems: 'center',
     paddingBottom: 20,
     flex: 1
   },
   title: {
     alignSelf: 'flex-start',
     fontSize: 25,
     fontWeight: 'bold',
     marginVertical: 20,
     padding: 20,
     width: layout.window.width
   },
   commentContainer: {
     width:layout.window.width,
     padding: 10,
     borderBottomWidth: 1,
     borderBottomColor: "grey",
   },
   input : {
     width: 95/100 * layout.window.width,
     borderWidth: 1,
     borderColor: colors.mainColor,
     padding: 10,
     fontSize: 17,
     marginBottom: 5
   },
   button: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: colors.mainColor,
    marginBottom: 7,
  },
  awardsContainer: {
     flexDirection: 'row',
     marginBottom: 5
  },
   comment: {
     marginLeft: 20,
     fontSize: 15
   },
   iconsContainer: {
     flexDirection:'row',
     marginTop:10,
     justifyContent: 'flex-end'
   }
})
