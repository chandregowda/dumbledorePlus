import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3100',
  timeout: 1000000
  // baseURL: 'https://dumbledore.yodlee.com'
})

export const axiosDumbledore = axios.create({
  baseURL: 'https://dumbledore.yodlee.com'
})

export default axiosInstance
