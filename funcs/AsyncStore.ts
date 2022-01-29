import {AsyncStorage} from 'react-native'


export const AsyncStore = {
  getItem: async (val: string) => {
    try{
      return (await AsyncStorage.getItem(val))
    }catch{

    }
  },
  setItem: async (key: string, val: string) => {
    try{
      await AsyncStore.setItem(key, val)
    }catch{

    }
  }
}
