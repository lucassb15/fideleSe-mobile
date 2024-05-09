import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '@env'

export const getAPIClient = async () => {
  const token = await AsyncStorage.getItem('fidelese.token')

  const api = axios.create({
    baseURL: API_URL,
  })

  api.interceptors.request.use(async (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}
