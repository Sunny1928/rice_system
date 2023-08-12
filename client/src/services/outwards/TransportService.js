import Api from '@/services/Api'

const url = 'api/outwards/'

export default {
  index () {
    return Api().get(`${url}transports/allTransports`)
  },
  post (item) {
    return Api().post(`${url}transports/addTransport`, item)
  },
  put (item) {
    return Api().put(`${url}transports/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}transports/${item.id}`)
  }
}