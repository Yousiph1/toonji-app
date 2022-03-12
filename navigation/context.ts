import React from 'react'


export const AuthContext = React.createContext<{signIn:()=> void, signOut: ()=> void}>({signIn: ()=>{}, signOut: ()=>{}});

export const ThemeContext = React.createContext<{changeTheme: (val:"light"|"dark") => void; color: "light"|"dark"}>({changeTheme: ()=>{},color:"light"})
