import Api from '@/services/Api'

export default {
  index () {
    return Api().get('trips')
  },
  post (tripinfo) {
    return Api().post('trips', tripinfo)
  },
  delete (indexID) {
    return Api().delete(`trips/${indexID}`)
  }
}
