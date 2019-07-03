import Api from '@/services/Api'

export default {
  index () {
    return Api().get('countries')
  },
  post (country) {
    return Api().post('countries', country)
  },
  delete (indexID) {
    return Api().delete(`countries/${indexID}`)
  }
}
