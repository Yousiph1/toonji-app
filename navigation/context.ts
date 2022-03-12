import React from 'react'


export const AuthContext = React.createContext<{signIn:()=> void, signOut: ()=> void}>({signIn: ()=>{}, signOut: ()=>{}});
