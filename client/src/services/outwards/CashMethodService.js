import Api from '@/services/Api'

const url = 'api/outwards/'

export default {
  index () {
    return Api().get(`${url}cashMethods/allcashMethods`)
  },
  post (item) {
    return Api().post(`${url}cashMethods/addcashMethod`, item)
  },
  put (item) {
    return Api().put(`${url}cashMethods/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}cashMethods/${item.id}`)
  }
}