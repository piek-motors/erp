import axios from 'axios'
import { authStore } from './store/auth.store'

export const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:9000/api'
export const S3_URL =
  process.env.REACT_APP_API_URL + '/s3' || 'http://localhost:9000/api/s3'

export const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

$api.interceptors.request.use(config => {
  config.headers = config.headers ?? {}
  config.headers.Authorization = `Bearer ${authStore.token}`
  return config
})
