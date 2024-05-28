import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '@env'

export const getAPIClient = async () => {
  const token = await AsyncStorage.getItem('fidelese.token')
  // console.log('API_URL:', API_URL)
  // console.log('Token:', token)

  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  })

  api.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      // console.log('Request config:', config)
      return config
    },
    (error) => {
      console.error('Erro no interceptor de request:', error)
      return Promise.reject(error)
    },
  )

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // console.error('Erro na resposta da API:', error)
      if (axios.isAxiosError(error)) {
        // console.error('Detalhes do erro de rede:', error.toJSON())
      }
      return Promise.reject(error)
    },
  )

  return api
}
