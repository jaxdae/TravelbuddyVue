import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CreateTrip from '@/components/CreateTrip'
import VisitedCountries from '@/components/VisitedCountries'
import PlannedTrips from '@/components/PlannedTrips'
import SingleTrip from '@/components/SingleTrip'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/createtrip',
      name: 'createtrip',
      props: true,
      component: CreateTrip
    },
    {
      path: '/visited',
      name: 'VisitedCountries',
      component: VisitedCountries
    },
    {
      path: '/plannedtrips',
      name: 'PlannedTrips',
      component: PlannedTrips
    },
    {
      path: '/trip',
      name: 'trip',
      props: true,
      component: SingleTrip
    }
  ]
})
