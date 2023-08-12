import axios from 'axios'

export default () => {
  return axios.create({
    // baseURL: `http://localhost:8089/`,
    baseURL: window.location.protocol + '//' + window.location.host,
    withCredentials: true
  })
}