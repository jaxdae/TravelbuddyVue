<template>
<div>
    <div id="map" class="large-header">
      
      <Menu></Menu>
      <div class="header">
      
      <a class="button" @click="scrolldown"><a class="down-icon" @click="scrolldown"></a></a>
      </div>
      </div>
       <div id="content" class="content-tripstops">
      <h1 class="content-headline">Edit Trip Locations</h1>
      <h2 class="content-subheadline">select, add or remove points within the map</h2>
      <div class="contentWrapper">
      <div  class="trip-image">
        <h1 v-if="nameEntered" class="big-card-headline" @click="changeName">{{tripName}}</h1>
        <input id="input" v-model="tripName" v-else class="name-input"  type="text" @blur="changeNameBack">
        <button class="upload-button" @click="enterUrl"><div class="upload-icon" @click="enterUrl"></div></button>
        <transition name="fade">
        <input id="url" v-if="enterNewUrl" placeholder="Enter new image URL!" class="url-input" @blur="changeBackground">
        </transition>
        <div class="overlay"></div>
        <div id="img" class="zoomWrapper"></div>
      </div>
      <div class="all-tripstops">
        <transition-group name="fade" tag="div" class="test">
      <div class="tripstop-wrapper" v-for="item in obj2" v-bind:key="item.name">
        <span class="waypoint"></span>
        <div class="card">
          <div class="delete-card" @click="removeCard"></div>
          <div class="tripstop-card-wrapper">
    <h1 class="card-headline" @click="zoomInMap">{{item.name}}</h1>
    <h1 class="card-subheadline">{{item.subname}}</h1>
    </div>
    </div>
      </div>
      </transition-group>
      </div>
      </div>
      <button id="save" class="add-btn save-btn" @click="saveToDB">Save trip</button>
      <button class="add-btn delete-btn" @click="deleteTrip1">Delete trip</button>
      </div>
      <Footer></Footer>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import Footer from './Footer.vue'
import Menu from './Menu.vue'
import axios from 'axios'
import TripService from '@/services/TripService'

export default {
  name: 'CreateTrip',
  components: {
    Footer,
    Menu
  },
  data () {
    return {
      obj2: [],
      location: null,
      searchQuery: '',
      accessToken:
        'pk.eyJ1IjoiamFja2llZGFlIiwiYSI6ImNqd2J3d21hbDA0cjY0YW81NXY4eWJ4djcifQ.ahDad5WYQKOfYUTk2AGeVA',
      map: null,
      res: null,
      nameEntered: true,
      enterNewUrl: false,
      currentLocation: '',
      currentSubLocation: '',
      markerPos: [],
      markers: [],
      currentQueryMarker: [],
      useComputed: true,
      plannedTrips2: [],
      lngs: [],
      lats: [],
      imgUrl: '',
      tripName: 'Enter trip name',
      stops: [],
      substops: [],
      markersSet: 0,
    }
  },
  props:{
      name2: String,
      imgUrl2: String,
      stops2: Array,
      substops2: Array
    },
  methods: {
    loadMap: function () {
      mapboxgl.accessToken = this.accessToken
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jackiedae/cjwdy6tuj0eqe1cp9ooe3vhlg',
        zoom: '1.6',
        center: [0, 25]
      })

      var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl,
marker: false,
language: 'en'
});
var self = this;
this.map.addControl(geocoder, 'bottom-right')

geocoder.on('result', function(result) {
    self.currentLocation = result.result.text;
    self.currentSublocation = result.result.place_name;
 var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          self.button(result.result.text, result.result.place_name),
          marker
 )
       if(self.currentQueryMarker.length != 0){
        self.currentQueryMarker.remove()
       }
        var marker = new mapboxgl.Marker()
          .setLngLat(result.result.center)
          .setPopup(popup)
          .addTo(self.map)
        self.currentQueryMarker = marker
        self.markers.push(marker)


   popup.on('open', function (e) {
          var addBtn = document.getElementById('add-btn')
          document
            .getElementById('add-btn')
            .addEventListener('click', function () {
              self.obj2.push({name: self.currentLocation, subname: self.currentSublocation})
              addBtn.classList.add('animate-added')
              self.currentQueryMarker = []
            })
        })
})
    },
    getLocationsForMarkers: function(searchQuery, headline){
      var self = this;
      axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchQuery + '.json?access_token=' + this.accessToken)
              .then(response => {
                self.setMarker(response.data.features[0].center, searchQuery, headline)
              })
              .catch(error => {
              })
    },
    setMarker:  function(location, searchQuery, headline){
       var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
         this.buttonActive(headline,searchQuery),
          marker
        )
         var marker = new mapboxgl.Marker()
          .setLngLat(location)
          .setPopup(popup)
          .addTo(this.map)

          this.markers.push(marker)
         this.markersSet = this.markersSet + 1


          if(this.markersSet > this.obj2.length-1){

          var lngs = []
          var lats = []

            for(var i = 0;i<this.markers.length;i++){
                lngs.push(this.markers[i]._lngLat.lng)
                lats.push(this.markers[i]._lngLat.lat)
            }
            
            var lngMax = Math.max.apply(null, lngs)
            var lngMin = Math.min.apply(null, lngs)
            var latMax = Math.max.apply(null, lats)
            var latMin = Math.min.apply(null, lats)

            var bbox1 = [lngMin, lngMax]
            var bbox2 =[latMin, latMax]

             this.map.fitBounds([
          [lngMin, latMin],
          [lngMax, latMax] 
        ], {padding: 200})
          }

            popup.on('open', function (e) {
          var addBtn = document.getElementById('add-btn')
           addBtn.classList.add('animate-added')
          document
            .getElementById('add-btn')
        })
    },
    scrolldown: function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('#content').offset().top - 90
      }, 800);
    },
    button: function (location, locationDetail) {
      var html = ''
      html += '<div>'
      html +=
        '<h1 class="places-headline">' +
        location +
        '</h1>'
      html +=
        '<h2 class="places-subheadline">' +
        locationDetail +
        '</h2>'
      html += '<button class="add-btn" id="add-btn">Add to my trip</button>'
      html += '</div>'
      return html
    },
     buttonActive: function (location, locationDetail) {
      var html = ''
      html += '<div>'
      html +=
        '<h1 class="places-headline">' +
        location +
        '</h1>'
      html +=
        '<h2 class="places-subheadline">' +
        locationDetail +
        '</h2>'
      html += '<button class="add-btn animate-added" id="add-btn">Add to my trip</button>'
      html += '</div>'
      return html
    },
    changeName: function () {
      this.nameEntered = false
      if (this.nameEntered == false) {
       $(document).ready(function () {
        $("#input").focus();
    // document.getElementById("test").focus();
  });
      }
    },
    changeNameBack: function () {
      this.nameEntered = true
    },
    enterUrl: function (e) {
      this.enterNewUrl = true
          $(document).ready(function () {
        $("#url").focus();
    // document.getElementById("test").focus();
  });
    },
    changeBackground: function (e) {
      let img = document.getElementById('img')
      if (e.target.value !== '') {
        img.style.backgroundImage = 'url(' + e.target.value + ')'
        this.imgUrl = e.target.value
      }
      this.enterNewUrl = false
    },
    saveToDB: async function () {

      //check if already exists

      var plannedTripNames = []
      for (var i = 0; i<this.plannedTrips2.length;i++){
        plannedTripNames.push(this.plannedTrips2[i].name)
      }

       var alreadyExisting = (plannedTripNames.indexOf(this.tripName) > -1)

       if(alreadyExisting){
         this.deleteTrip()
         this.saveTrip()
       }else{
         this.saveTrip()
       }
    },
    saveTrip: async function() {
         for(var i = 0; i<this.obj2.length;i++){
      const tripToSave = {
          name: this.tripName,
          imgUrl: this.imgUrl,
          stop: this.obj2[i].name,
          substop: this.obj2[i].subname
        }
      try{
        await TripService.post(tripToSave)
        document.getElementById('save').classList.add('animate-added')

      } catch(err)
      {
        console.log(err)
      }
      }
    },
    deleteTrip: async function() {
      for (var i = 0; i<this.trips.data.length;i++){
          if(this.trips.data[i].name == this.tripName){
            try{
        await TripService.delete(this.trips.data[i].id)
      } catch(err)
      {
        console.log(err)
      }
          }
      }
    },
    deleteTrip1: async function(){
      await this.deleteTrip()
      window.location.replace('http://localhost:8080/#/plannedtrips')
    },
    removeCard: function (e) {
      var newObj2 = this.obj2.filter(function( obj ) {
      return obj.name !== e.target.parentNode.lastChild.firstChild.innerHTML;
      });     
      this.obj2 = newObj2;
       this.getLngLat(e.target.parentNode.lastChild.lastChild.innerHTML)
    },
    getLngLat: function (location) {
    axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + location + '.json?access_token=' + this.accessToken)
              .then(response => {
               this.deleteMarkerOnMap(response.data.features[0].center[0],response.data.features[0].center[1])
              })
              .catch(error => {
              })
    },
    deleteMarkerOnMap: function (lng,lat) {
      for(var i =0;i<this.markers.length;i++){
          if(this.markers[i]._lngLat.lat == lat && this.markers[i]._lngLat.lng == lng){
            this.markers[i].remove();
          }
      }
    },
    zoomInMap: function (e) {
      axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + e.target.parentNode.lastChild.innerHTML + '.json?access_token=' + this.accessToken)
              .then(response => {
               this.Zoom(response.data.features)
              })
              .catch(error => {
              })
    },
     Zoom: function (features) {

        const place = features.filter(function (e) {
            var newid = e.id.split('.')
            var endid = newid.splice(0, 1)
            if (
              endid == 'place' ||
              endid == 'neighborhood' ||
              endid == 'postcode'
            ) {
              return e.id
            }
          })
          var bbox = place[0].bbox
     
        this.map.fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]] 
        ])
         $('html, body').animate({
        scrollTop: $('#map').offset().top - 60
      }, 800);
    },
    getTripsFromDb: async function(){
         var self = this
  this.trips = await TripService.index()

        var tripNames=[]
   for(var i =0;i<self.trips.data.length;i++){
      tripNames.push(self.trips.data[i].name)
    }
    const filteredTripNames = tripNames.filter((v, i, a) => a.indexOf(v) === i); 
  
    let ObjectsOfTrips = []
    let tripArray;
    for(var i =0;i<filteredTripNames.length;i++){
         tripArray = self.trips.data.filter(function(e) {
          
        if (
          e.name == filteredTripNames[i] 
        ) {
          return e.name;
        }
        
      });
      ObjectsOfTrips.push(tripArray)
    }
      for(var i =0; i<ObjectsOfTrips.length;i++){
       var name = ObjectsOfTrips[i][0].name
       var imgUrl = ObjectsOfTrips[i][0].imgUrl
       var stops = []
       var substops = []
        for(var j =0;j<ObjectsOfTrips[i].length;j++){
          stops.push(ObjectsOfTrips[i][j].stop)
          substops.push(ObjectsOfTrips[i][j].substop)
        }
      this.plannedTrips2.push({
        name: name,
        imgUrl: imgUrl,
        stops: stops,
        substops: substops
      })
}
    },
    setMarkersOnMap(){
    var self = this;
      $(document).ready(function () {
    var locationsToDisplay = [...document.getElementsByClassName('card-subheadline')]
    var locationsToDisplayLong = [...document.getElementsByClassName('card-headline')]
    for(var i = 0; i<locationsToDisplay.length;i++){
        self.getLocationsForMarkers(locationsToDisplay[i].innerHTML, locationsToDisplayLong[i].innerHTML)
    }
    })
    },
    selectTheRightTrip: function(){
      console.log(this.plannedTrips2)
      for(var i = 0; i<this.plannedTrips2.length;i++){
        if( i == this.$route.params.id){
          this.tripName = this.plannedTrips2[i].name
          this.imgUrl = this.plannedTrips2[i].imgUrl
          let img = document.getElementById('img')
            img.style.backgroundImage = 'url(' + this.imgUrl + ')'

            this.stops = this.plannedTrips2[i].stops
            this.substops = this.plannedTrips2[i].substops
             for (var i = 0; i<this.substops.length;i++){
     this.obj2.push({name: this.stops[i], subname: this.substops[i]})
     }
            this.setMarkersOnMap()
        }
      }
    }
  },
  async mounted () {
    this.loadMap()
    await this.getTripsFromDb()
        this.tripName = this.name2
    this.imgUrl = this.imgUrl2
    let img = document.getElementById('img')
    img.style.backgroundImage = 'url(' + this.imgUrl + ')'

            this.stops = this.stops2
            this.substops = this.substops2
             for (var i = 0; i<this.substops.length;i++){
     this.obj2.push({name: this.stops[i], subname: this.substops[i]})
     this.setMarkersOnMap()
   // this.selectTheRightTrip()
  }

  }
}
</script>

<style scoped>
.all-tripstops {
  display: inline-block;
  flex-basis: 50%;
  width: calc(100% - 30px);
  margin: 15px 0 0 15px;
}

@media only screen and (min-width: 425px){
.trip-image{
  width:100%;
}
}
@media only screen and (min-width: 768px){
  .contentWrapper{
    display:block;
  }
  .trip-image{
width:100%;
  }
  .all-tripstops{
        width: 100%;
    margin-top: 30px;
    margin-left:15px;
  }
  .card{
    height:60px;
  }
}
@media only screen and (min-width: 992px){
  .contentWrapper{
    display:flex;
    
  }
  .all-tripstops{
      margin-left: 30px;
  }
  .trip-image{
     width: 450px;
  }
}
.headline {
  color: #ffffff;
  font-family: Poppins;
  font-size: 60px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 70px;
  margin-top: 0;
}
#img{
  background: #99989C;
  background-size: cover; 
}

.subheadline {
  color: #ebebeb;
  font-family: Montserrat;
  font-size: 14px;
  letter-spacing: 3.5px;
  line-height: 18px;
  text-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-weight: 100;
}
p {
  color: #ebebeb;
  font-family: Montserrat;
  font-size: 14px;
  letter-spacing: 1px;
  line-height: 22px;
  width: 550px;
  font-weight: 100;
}

*:focus {
  outline: none;
}
.search {
  display:none;
  border-radius: 34px;
  border: none;
  height: 45px;
  padding-left: 30px;
  width: 30%;
      font-family: Montserrat;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2.75px;
    line-height: 14px;
    text-transform: uppercase;
    position: absolute;
    top:105px;
    left: 25px;
    z-index: 2;
    background: #282828;
    color:white;
}
.zoomWrapper{
  overflow: hidden;
  transition: ease all 0.5s;
}

.card {
  padding:10px 0 10px 0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 5px 0 rgb(235, 235, 235);
  display: inline-block;
  display: flex;
    align-items: center;
    margin-left: 10px;
    position: relative;
    padding-right:80px;
    transition: all ease 0.3s;
}
.card:hover{
  box-shadow: 0 0 30px 0 rgb(235, 235, 235);
}
.tripstop-card-wrapper:hover{
  cursor: pointer;
}
.card-headline:hover{
  transform: translate(20px,0px);
}

.card-headline:hover.card-headline:after{
  opacity:1;
}

.card-headline {
  position: relative;
  color: #1d2b15;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1.42px;
  line-height: 25px;
  padding-left: 15px;
  margin:0;
  display:inline-block;
  transition: ease all 0.5s;
}
.card-headline:before{
    content: '';
  position: absolute;
  top: 50%;
  left: 15px;
  right: 0;
  height: 2px;
  background-color: #282828;
  transform-origin: center right;
  transform: scaleX(0) translateY(-45%);
  transition: transform 0.3s ease;
}
.card-headline:after{
  transition: ease all 0.5s;
    content: '';
    top: 4px;
    left: -4px;
    position: absolute;
    width: 10px;
    height: 14px;
    opacity:0;
  background: url('../assets/location-black.png');
  background-size:cover;
}
.card-subheadline{
  font-weight: 100;
    font-family: montserrat;
    font-size: 12px;
    color: #282828;
    padding-left: 15px;
    margin:0;
}

.tripstop-wrapper {
  padding-left: 20px;
  border-left: 1px solid #ebebeb;
}
.waypoint {
  left: -28px;
  top: 50px;
  position: relative;
  width: 15px;
  height: 15px;
  background:#282828;
  box-shadow: 0 0 10px 0 rgb(235, 235, 235);
  display: inline-block;
  border-radius: 15px;
}

.tripstop-wrapper:last-child .card {
  margin-bottom: 0;
}

.trip-image {
  display: inline-block;
  background-size: cover;
  background-position: center;
  width:calc(100% - 30px);
  margin-left:15px;
  height: 400px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  transition: ease all 0.5s;
  flex-basis: 50%;
}
.zoomWrapper{
  height:100%;
  width:100%;
  background-size: cover;
}
.trip-image:hover .zoomWrapper{
  transform: scale(1.1);
}
.upload-button:hover .upload-icon{
  background: url('../assets/share-ios-dark.png');
  background-size:cover;
  cursor:pointer;
}
.button{
  display:none;
}
@media only screen and (min-width: 768px){
.button{
display: block}
.trip-image{
  height:600px;
}
}

.upload-icon:hover ~ .upload-button{
  background: white;
  cursor:pointer;
   box-shadow: 0 0 20px 0 white;
}
.upload-button:hover{
  background: white;
  cursor:pointer;
  box-shadow: 0 0 20px 0 white;
}
.upload-icon:hover{
   background: url('../assets/share-ios-dark.png');
   background-size:cover;
   cursor:pointer;
}
.overlay {
  position: absolute;
  top: 0;
  z-index: 1;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.25) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  transition: ease all 0.5s;
}
.contentWrapper {
  margin-top:30px;
}
.big-card-headline {
  position: absolute;
  top:0;
  z-index: 2;
  color: #ffffff;
  font-family: Poppins;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 40px;
  padding-left: 30px;
}
.upload-button{
  height: 50px;
  width: 50px;
  border-radius: 32px;
  background-color: #282828;
  box-shadow: 0 0 10px 0 #282828;
  position: absolute;
  bottom: 30px;
  right: 30px;
  border: none;
  z-index: 3;
}
.name-input{
  position: absolute;
  z-index: 3;
  top:0px;
   border-radius: 34px;
  padding-left: 14px;
  border: none;
  height: 50px;
  margin-left: 16px;
  margin-top: 21px;
  width: 90%;
  color: #282828;
  background: transparent;
      color: #ffffff;
  font-family: Poppins;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 40px;
}
.url-input{
    position: absolute;
  z-index: 3;
  bottom:110px;
   border-radius: 34px;
  padding: 10px 0 10px 20px;
  border: none;
  height: 30px;
  margin-left: 30px;
  margin-top: 30px;
  width: 82%;
  color: #282828;
    font-size: 10px;
    letter-spacing: 1.25px;
    font-family: Montserrat;
    text-transform: uppercase;
}
.upload-icon{
  width:16px;
  height:23px;
  background:url('../assets/share-ios.png');
     background-size: cover;
    position: absolute;
    bottom: 15px;
    right: 17px;
    z-index: 4;
}
.save-btn{
  height:45px;
  margin-top:60px;
  border-radius: 30px;
  cursor: pointer;
}
.delete-card{
  background: url('../assets/delete.svg');
  background-size: cover;
  right: 20px;
    position: absolute;
       width: 22px;
    height: 22px;
}
.delete-card:hover{
  cursor: pointer;
}

.delete-card:hover ~ .tripstop-card-wrapper .card-headline:before{
  transform-origin: center left;
  transform: scaleX(1) translateY(-50%);
}

.hint{
  position: absolute;
    z-index: 3;
    top: 60px;
    padding:30px;
    width:90%;
}
.animate-added{
  pointer-events: none;
}
.delete-btn{
  height: 45px;
    margin-top: 15px;
    border-radius: 30px;
    cursor: pointer;
    background: #ebebeb;
    
}
.delete-btn:hover{
  background: #282828;
}
</style>
