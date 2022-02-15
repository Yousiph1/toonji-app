import React,{useContext} from 'react'
import {AxiosError} from 'axios'
import {AuthContext} from '../navigation/index'

const {signOut} = useContext(AuthContext)

function logout(err: AxiosError) {

       if(err.response?.status === 401) {
         signOut()
       }
}

export default logout
