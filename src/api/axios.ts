import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const getAPIClient = async () => {
  const token = await AsyncStorage.getItem('fidelese.token')

  const api = axios.create({
    baseURL: 'http://192.168.0.19:3333',
  })

  api.interceptors.request.use(async (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}
