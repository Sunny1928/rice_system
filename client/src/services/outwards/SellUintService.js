import Api from '@/services/Api'

const url = 'api/outwards/'

export default {
  index () {
    return Api().get(`${url}sellUints/allSellUints`)
  },
  post (item) {
    return Api().post(`${url}sellUints/addSellUint`, item)
  },
  put (item) {
    return Api().put(`${url}sellUints/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}sellUints/${item.id}`)
  }
}