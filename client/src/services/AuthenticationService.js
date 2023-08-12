import Api from '@/services/Api'

export default {
  register (credentials) {
    return Api().post('api/users/addUser', credentials)
  },
  login (credentials) {
    return Api().post('api/users/login', credentials)
  }
}