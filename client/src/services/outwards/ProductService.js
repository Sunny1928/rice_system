import Api from '@/services/Api'

const url = 'api/outwards/'

export default {
  index () {
    return Api().get(`${url}products/allProducts`)
  },
  post (item) {
    return Api().post(`${url}products/addProduct`, item)
  },
  put (item) {
    return Api().put(`${url}products/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}products/${item.id}`)
  }
}