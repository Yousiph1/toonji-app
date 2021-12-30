import * as SecureStore from 'expo-secure-store';


const getToken = async () => {
  let token = await SecureStore.getItemAsync("userToken")
  return token
}

export default getToken
