import Api from '@/services/Api'

const url = 'api/inwards/ricekinds/'

export default {
  index () {
    return Api().get(`${url}allItems`)
  },
  post (item) {
    return Api().post(`${url}addItem`, item)
  },
  put (item) {
    return Api().put(`${url}${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}${item.id}`)
  }
}