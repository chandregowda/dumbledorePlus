import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3100'
  // baseURL: 'https://dumbledore.yodlee.com'
})

export default axiosInstance
