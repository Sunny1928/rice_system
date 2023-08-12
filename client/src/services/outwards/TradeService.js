import Api from '@/services/Api'

const url = 'api/outwards/trades/'

export default {
  index (customer) {
    // console.log(customer)
    return Api().get(`${url}allTrades/${customer}`)
  },
  indexByDates (dates) {
    return Api().get(`${url}allTradesByDates/${dates}`)
  },
  indexByCashmethodAndDates (cashmethod,dates) {
    return Api().get(`${url}allTradesByCashmethod/${cashmethod}&${dates}`)
  },
  post (item) {
    return Api().post(`${url}addTrade`, item)
  },
  put (item) {
    return Api().put(`${url}${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`${url}${item.id}`)
  }
}