import axios from 'axios';

let timeout = 1000 * 60 * 60;
axios.defaults.timeout = timeout;
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3200'
  baseURL: 'https://rti.corp.yodlee.com:3200'
});

axiosInstance.defaults.timeout = timeout;

export default axiosInstance;
