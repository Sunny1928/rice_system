import Api from '@/services/Api'

const url = 'api/inwards/ricetrades/'

export default {
  index (customer) {
    return Api().get(`${url}allItems/${customer}`)
  },
  indexByDates (dates) {
    return Api().get(`${url}allItemsByDates/${dates}`)
  },
  getAllItemsByRicekind (type, dates) {
    return Api().get(`${url}allItems/${type}/${dates}`)
  },
  post (item) {
    return Api().post(`${url}addItem`, item)
  },
  get (id) {
    return Api().get(`${url}${id}`)
  },
  put (item) {
    return Api().put(`${url}${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}${item.id}`)
  },
  deleteById (id) {
    return Api().delete(`${url}${id}`)
  }
}