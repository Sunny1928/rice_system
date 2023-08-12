import Api from '@/services/Api'

const url = 'api/inwards/othertrades/'

export default {
  index (customer) {
    return Api().get(`${url}allItems/${customer}`)
  },
  getLastTrade (customer) {
    return Api().get(`${url}lastItem/${customer}`)
  },
  indexByDates (dates) {
    return Api().get(`${url}/allItemsByDates/${dates}`)
  },
  getAllItemsByProduct (type, dates) {
    return Api().get(`${url}allItems/${type}/${dates}`)
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
