import Api from '@/services/Api'

const url = 'api/outwards/customers/'

export default {
  index () {
    return Api().get(`${url}allCustomers`)
  },
  get (name) {
    return Api().get(`${url}${name}`)
  },
  post (item) {
    return Api().post(`${url}addCustomer`, item)
  },
  put (item) {
    return Api().put(`${url}${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}${item.id}`)
  }
}