import AsyncStorage from "@react-native-async-storage/async-storage"


export const AsyncStore = {
  getItem: async (val: string) => {
    try{
      return (await AsyncStorage.getItem(val))
    }catch{

    }
  },
  setItem: async (key: string, val: string) => {
    try{
      await AsyncStorage.setItem(key, val)
    }catch{

    }
  }
}
