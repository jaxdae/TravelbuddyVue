<template>
<div>
    <div id="map" class="large-header">
      
      <Menu></Menu>
      <div class="header">
      
      <a class="button" @click="scrolldown"><a class="down-icon" @click="scrolldown"></a></a>
      </div>
      </div>
      <div id="content" class="content-tripstops">
      <h1 class="content-headline">Visited Coutries</h1>
      <h2 class="content-subheadline">select, add or remove points within the map</h2>
  
        <transition-group name="fade" tag="div" class="visited-countries-wrapper">
        <div v-for="country in titles" v-bind:key="country" class="visited-country">
          <div class="zoomWrapper" :class="country"></div>
         <div class="country-headline">{{country}}</div>
          
         <a class="show-on-map" @click="showOnMap">
           <a class="map-icon" @click="showOnMapIcon"></a>
         </a>
      
        </div>
        </transition-group>
   
      </div> 
      <Footer></Footer>
</div>
</template>

<script>
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import Footer from './Footer.vue'
import Menu from './Menu.vue'
import CountryService from '@/services/CountryService'

export default {
  name: 'VisitedCoutries',
  data () {
    return {
      location: null,
      searchQuery: '',
      accessToken: 'pk.eyJ1IjoiamFja2llZGFlIiwiYSI6ImNqd2J3d21hbDA0cjY0YW81NXY4eWJ4djcifQ.ahDad5WYQKOfYUTk2AGeVA',
      map: null,
      lng: '',
      lat: '',
      clickedCountry: '',
      testarray: [],
      bbox: [],
      map: null,
      countries: [],
      titles: []
    }
  },
  components: {
    Footer,
    Menu,
  },
  methods: {
    loadMap: function () {
      mapboxgl.accessToken = this.accessToken
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jackiedae/cjwdy6tuj0eqe1cp9ooe3vhlg',
        zoom: '1.6',
        center: [0, 25]
      })
      this.map = map;
      var self = this
      map.on('load', function () {
        var layers = map.getStyle().layers
        var firstSymbolId
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id
            break
          }
        }

        map.addLayer({
          id: 'countries',
          source: {
            type: 'vector',
            url: 'mapbox://jackiedae.bbmaegy6'
          },
          'source-layer': 'ne_10m_admin_0_countries-dq5tk2',
          type: 'fill',
          paint: {
            'fill-pattern': 'gray-pattern',
            'fill-outline-color': '#F2F2F2'
          }
        }, firstSymbolId)

        map.setFilter(
          'countries',
          [
            'match',
            ['get', 'BRK_NAME'],
            self.titles,
            true,
            false
          ]
        )

        getLocationFromCoords()

        function getLocationFromCoords () {
          map.on('click', function (e) {
            axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + e.lngLat.lng + '%2C' + e.lngLat.lat + '.json?access_token=' + self.accessToken)
              .then(response => {
                extractCountry(response.data.features)
              })
              .catch(error => {
              })
          })
        }
        function extractCountry (res) {
          
          const Country = res.filter(function (e) {
            var newid = e.id.split('.')
            var endid = newid.splice(0, 1)
            if (
              endid == 'country'
            ) {
              return e.id
            }
          })

         
          var isAlreadyVisited = (self.titles.indexOf(Country[0].place_name) > -1)
          if (isAlreadyVisited) {
          
            var ids = []
            for(var i =0;i<self.countries.data.length;i++){
              ids.push(self.countries.data[i].id)
            }

            var indexOfCountryToDelete;
            var indexInArray;

             for(var i =0;i<self.countries.data.length;i++){
              if(self.countries.data[i].title == Country[0].place_name){
                indexOfCountryToDelete = self.countries.data[i].id
                indexInArray = i
              }
            }
             self.countries.data.splice(indexInArray,1)
             self.titles.splice(indexInArray,1)
            self.removeFromDb(indexOfCountryToDelete)
            map.setFilter(
              'countries',
              [
                'match',
                ['get', 'BRK_NAME'],
                self.titles,
                true,
                false
              ]
            )
          } else {
            
            self.titles.push(Country[0].place_name)
            map.setFilter(
              'countries',
              [
                'match',
                ['get', 'BRK_NAME'],
                self.titles,
                true,
                false
              ]
            )
            self.pushToDb(Country[0].place_name)
          }
          
        }
      })
    },
    scrolldown: function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('#content').offset().top - 90
      }, 800);
    },
    showOnMap: function (e) {
      this.zoomToMap(e.target.parentNode.children[1].innerHTML)
    
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('#map').offset().top - 60
      }, 800);
      
    },  showOnMapIcon: function (e) {
      e.stopPropagation();
      this.zoomToMap(e.target.parentNode.parentNode.children[1].innerHTML)
     
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('#map').offset().top - 60
      }, 800);
    },
      getLocation: function (country) {
      return axios
        .get(
          'https://api.mapbox.com/v4/geocode/mapbox.places/' +
            country +
            '.json?access_token=' +
            this.accessToken
        )
        .then(response => (this.bbox = response.data.features[0].bbox))
        .catch(error => {})
    },
    zoomToMap: async function (country) {
      var self = this
      try {
        await this.getLocation(country)
        self.map.fitBounds([
          [self.bbox[0], self.bbox[1]],
          [self.bbox[2], self.bbox[3]] 
        ])
    }catch (error) {
}
    },
     pushToDb: async function(countryName){
      const countryToPush = {title: countryName}
      try{
        await CountryService.post(countryToPush)
        this.getCountries()
      } catch(err)
      {
        console.log(err)
      }
    },
     removeFromDb: async function(index){
  
      try{
        await CountryService.delete(index)
      } catch(err)
      {
        console.log(err)
      }
    },
    getCountries: async function () {
      var self = this
  this.countries = await CountryService.index()
   var titles = []
   for(var i =0;i<self.countries.data.length;i++){
      titles.push(self.countries.data[i].title)
    }
  this.titles = titles;
    }
  },
  mounted () {
    this.loadMap()
     this.getCountries()
  
  //request to backend
 
  
  }
}
</script>

<style scoped>
@media only screen and (min-width: 768px){
  .visited-countries-wrapper{
 margin-top:60px;
  }
}
@media only screen and (min-width: 425px){
  .visited-countries-wrapper{
 margin-top:30px;
  }
}
.visited-countries-wrapper{
 margin:15px 15px 0 15px;
grid-gap: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
i{ 
    min-width:200px;
    margin:5px;
    position: relative;
    flex: 1 1 0;
}
.visited-country{ 
    height:300px;
    min-width:200px;
    border-radius:10px;
    margin:5px;
    position: relative;
    flex: 1 1 0; 
    overflow: hidden;
 transition: all 0.5s ease;
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
  border-radius: 34px;
  padding: 5px;
  border: none;
  height: 30px;
  padding-left: 15px;
  margin-top: 15px;
  width: 30%;
}
.country-headline{
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 30px;
  padding:15px 20px;
      position: relative;
    z-index: 3;
    hyphens: auto;
    position: absolute;
    top: 0;
    
}
.visited-country::after{
  content:'';
  position: absolute;
  top:0;
  border-radius:10px;
  width:100%;
  height:100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 100%);
}
.show-on-map{
  height: 50px;
  width: 50px;
  border-radius: 32px;
  background-color: #282828;
  box-shadow: 0 0 10px 0 #282828;
  position: absolute;
    bottom: 15px;
    right: 15px;
    z-index:2;
}
.map-icon{
  background: url('../assets/location.png');
  background-size:cover;
  height: 26px;
  width: 18px;
  position: absolute;
   bottom: 12px;
    right: 17px;
    z-index:3;
}
.show-on-map:hover .map-icon{
  background: url('../assets/location-black.png');
  background-size:cover;
  cursor:pointer;
}

.map-icon:hover ~ .show-on-map{
  background: white;
  cursor:pointer;
   box-shadow: 0 0 20px 0 white;
}
.show-on-map:hover{
  background: white;
  cursor:pointer;
  box-shadow: 0 0 20px 0 white;
}
.map-icon:hover{
   background: url('../assets/location-black.png');
   background-size:cover;
   cursor:pointer;
}


.wrapper{
  display:flex;
}
.zoomWrapper{
  height:100%;
  border-radius: 10px;
     transition: all 0.5s ease;
  
}
.visited-country:hover .zoomWrapper{
  transform: scale(1.1);
}
.visited-country:hover{
  box-shadow: 0 0 10px 0 rgba(40, 40, 40,0.4);
}
.Afghanistan{
  background:url('https://images.unsplash.com/photo-1507234897433-06646bd0e673?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2378&q=80');
  background-size:cover;
  background-position: center;
}
.Albania{
  background:url('https://images.unsplash.com/photo-1503497315185-0b39de6ee6d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}

.Algeria{
  background:url('https://images.unsplash.com/photo-1549145177-238518f1ec1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}

.Andorra{
  background:url('https://images.unsplash.com/photo-1546616722-2b46187dd255?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Angola{
  background:url('https://images.unsplash.com/photo-1532617340138-582b68faac73?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');
  background-size:cover;
  background-position: center;
}
.Antigua{
  background:url('https://images.unsplash.com/photo-1547065983-102e9439a21c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80');
  background-size:cover;
  background-position: center;
}
.Azerbaijan{
  background:url('https://images.unsplash.com/photo-1538340289052-b914faaf3a0d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2174&q=80');
  background-size:cover;
  background-position: center;
}
.Ethiopia{
  background:url('https://images.unsplash.com/photo-1483671174579-bab2a5293389?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Bahamas{
  background:url('https://images.unsplash.com/photo-1533586473300-f66da55c9cf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Bangladesh{
  background:url('https://images.unsplash.com/photo-1559489110-40a90ee4e70a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2243&q=80');
  background-size:cover;
  background-position: center;
}
.Barbados{
  background:url('https://images.unsplash.com/photo-1532485832118-4c7e42b1ba72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3900&q=80');
  background-size:cover;
  background-position: center;
}
.Belgium{
  background:url('https://images.unsplash.com/photo-1542192143-6cb2c972e497?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Belize{
  background:url('https://images.unsplash.com/photo-1544525977-1eb923886ade?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2551&q=80');
  background-size:cover;
  background-position: center;
}
.Benin{
  background:url('https://images.unsplash.com/photo-1549631592-21f0869589e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2268&q=80');
  background-size:cover;
  background-position: center;
}
.Bosnia{
  background:url('https://images.unsplash.com/photo-1544329095-a7c19df83018?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Bolivia{
  background:url('https://images.unsplash.com/photo-1487947366323-374a622aeccf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Bhutan{
  background:url('https://images.unsplash.com/photo-1555821108-3fb2763b226a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');
  background-size:cover;
  background-position: center;
}
.Botswana{
  background:url('https://images.unsplash.com/photo-1534528489707-ef61ee67b566?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Brazil{
  background:url('https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Brunei{
  background:url('https://images.unsplash.com/photo-1536657640475-49372be50bc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Bulgaria{
  background:url('https://images.unsplash.com/photo-1552386200-f0d20cc1bd23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2200&q=80');
  background-size:cover;
  background-position: center;
}
.Burkina{
  background:url('https://images.unsplash.com/photo-1480342740034-d149f44bbeac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2247&q=80');
  background-size:cover;
  background-position: center;
}
.Burundi{
  background:url('https://images.unsplash.com/photo-1531487224138-db602b38e6a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80');
  background-size:cover;
  background-position: center;
}
.Chile{
  background:url('https://images.unsplash.com/photo-1558796522-75dfd33fb008?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: right;
}
.China{
  background:url('https://images.unsplash.com/photo-1554988947-ac7f0ad287b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Costa{
  background:url('https://images.unsplash.com/photo-1536708880921-03a9306ec47d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1568&q=80');
  background-size:cover;
  background-position: center;
}
.Denmark{
  background:url('https://images.unsplash.com/photo-1492352030789-c311213284bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Dominican{
  background:url('https://images.unsplash.com/photo-1522399585117-5f8e8e0ab786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80');
  background-size:cover;
  background-position: center;
}
.Ecuador{
  background:url('https://images.unsplash.com/photo-1559556064-4161b6be179b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');
  background-size:cover;
  background-position: center;
}
.Djibouti{
  background:url('https://images.unsplash.com/photo-1552796220-db7b4c3824a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80');
  background-size:cover;
  background-position: center;
}
.Salvador{
  background:url('https://images.unsplash.com/photo-1547082432-1e2d95b2add2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Estonia{
  background:url('https://images.unsplash.com/photo-1465802954450-8fcef6708c35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Fiji{
  background:url('https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2801&q=80');
  background-size:cover;
  background-position: center;
}
.Finland{
  background:url('https://images.unsplash.com/photo-1536420124982-bd9d18fc47ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2801&q=80');
  background-size:cover;
  background-position: center;
}
.Gabon{
  background:url('https://images.unsplash.com/photo-1528046652967-217fde4a4529?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2775&q=80');
  background-size:cover;
  background-position: center;
}
.Gambia{
  background:url('https://images.unsplash.com/photo-1448099940878-e0c48ea3a165?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size:cover;
  background-position: center;
}
.Ghana{
  background:url('https://images.unsplash.com/photo-1500246432024-efe3c9116a56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2664&q=80');
  background-size:cover;
  background-position: center;
}
.Georgia{
  background:url('https://images.unsplash.com/photo-1549466785-f5c1771646cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2768&q=80');
  background-size:cover;
  background-position: center;
}
.Grenada{
  background:url('https://images.unsplash.com/photo-1500514966906-fe245eea9344?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2767&q=80');
  background-size:cover;
  background-position: center;
}
.Greece{
  background:url('https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size:cover;
  background-position: center;
}
.Iraq{
  background:url('https://images.unsplash.com/photo-1555141318-b50f3d88108e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Indonesia{
  background:url('https://images.unsplash.com/photo-1540504370406-ce7e884d9435?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3100&q=80');
  background-size:cover;
  background-position: center;
}
.Iran{
  background:url('https://images.unsplash.com/photo-1554058922-d51b58b707f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size:cover;
  background-position: center;
}
.Ireland{
  background:url('https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Iceland{
  background:url('https://images.unsplash.com/photo-1504829857797-ddff29c27927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size:cover;
  background-position: center;
}
.Israel{
  background:url('https://images.unsplash.com/photo-1500990702037-7620ccb6a60a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size:cover;
  background-position: center;
}
.Italy{
  background:url('https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2982&q=80');
  background-size:cover;
  background-position: center;
}
.Jamaica{
  background:url('https://images.unsplash.com/photo-1530225029356-e301a685e6b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size:cover;
  background-position: center;
}
.Jordan{
  background:url('https://images.unsplash.com/photo-1551171128-c5b124a4174c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80');
  background-size:cover;
  background-position: center;
}
.Japan{
  background:url('https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2869&q=80');
  background-size:cover;
  background-position: right;
}
.Yemen{
  background:url('https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size:cover;
  background-position: center;
}
.Cambodia{
  background:url('https://images.unsplash.com/photo-1541429464955-87bd98d6d8f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3034&q=80');
  background-size:cover;
  background-position: center;
}
.Cameroon{
  background:url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2851&q=80');
  background-size:cover;
  background-position: center;
}

.India{
  background:url('https://images.unsplash.com/photo-1506462945848-ac8ea6f609cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2252&q=80');
  background-size:cover;
  background-position: center;
}
.Haiti{
  background:url('https://images.unsplash.com/photo-1520454974749-611b7248ffdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Honduras{
  background:url('https://images.unsplash.com/photo-1540933522239-62ac70959838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');
  background-size:cover;
  background-position: center;
}
.Guyana{
  background:url('https://images.unsplash.com/photo-1558374780-1673fe9e121a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2229&q=80');
  background-size:cover;
  background-position: center;
}
.Cyprus{
  background:url('https://images.unsplash.com/photo-1483042253169-6fac649e5723?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.African{
  background:url('https://images.unsplash.com/photo-1453198948940-1786364475fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: left;
}
.Belarus{
  background:url('https://images.unsplash.com/photo-1557936364-a9f23931e529?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Sahara{
  background:url('https://images.unsplash.com/photo-1491425432462-010715fd7ed7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2932&q=80');
  background-size:cover;
  background-position: center;
}
.Vietnam{
  background:url('https://images.unsplash.com/photo-1504457047772-27faf1c00561?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2917&q=80');
  background-size:cover;
  background-position: center;
}
.States,.United{
  background:url('https://images.unsplash.com/photo-1519121785383-3229633bb75b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80');
  background-size:cover;
  background-position: center;
}
.Venezuela{
  background:url('https://images.unsplash.com/photo-1532202509491-ee922e576bb8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2553&q=80');
  background-size:cover;
  background-position: center;
}
.Kingdom{
  background:url('https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3101&q=80');
  background-size:cover;
  background-position: center;
}
.Emirates{
  background:url('https://images.unsplash.com/photo-1528702748617-c64d49f918af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2927&q=80');
  background-size:cover;
  background-position: center;
}
.Vanuatu{
  background:url('https://images.unsplash.com/photo-1547538421-90d360c27717?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: bottom;
}
.Ukraine{
  background:url('https://images.unsplash.com/photo-1545310751-fcdeb3a4981d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Hungary{
  background:url('https://images.unsplash.com/photo-1541343672885-9be56236302a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80');
  background-size:cover;
  background-position: center;
}
.Uruguay{
  background:url('https://images.unsplash.com/photo-1527004915547-aa85e5b90eb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2552&q=80');
  background-size:cover;
  background-position: center;
}
.Uganda{
  background:url('https://images.unsplash.com/photo-1553775927-a071d5a6a39a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2478&q=80');
  background-size:cover;
  background-position: center;
}
.Uzbekistan{
  background:url('https://images.unsplash.com/photo-1557841621-230db92a8a12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Kazakhstan{
  background:url('https://images.unsplash.com/photo-1502022484792-e9e5c7bd707f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Kenya{
  background:url('https://images.unsplash.com/photo-1515658323406-25d61c141a6e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=953&q=80');
  background-size:cover;
  background-position: center;
}
.Kyrgyzstan{
  background:url('https://images.unsplash.com/photo-1488048924544-c818a467dacd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Kiribati{
  background:url('https://images.unsplash.com/photo-1540280369237-dea08361593a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80');
  background-size:cover;
  background-position: center;
}
.Comoros{
  background:url('https://images.unsplash.com/photo-1467377791767-c929b5dc9a23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80');
  background-size:cover;
  background-position: center;
}
.Congo{
  background:url('https://images.unsplash.com/photo-1467221973068-7abf710bbf54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2647&q=80');
  background-size:cover;
  background-position: center;
}
.Colombia{
  background:url('https://images.unsplash.com/photo-1532443603613-61fa154742cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2090&q=80');
  background-size:cover;
  background-position: center;
}
.Croatia{
  background:url('https://images.unsplash.com/photo-1533331639-74f1863c7b3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Kuwait{
  background:url('https://images.unsplash.com/photo-1519288041402-80cc01422667?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Cuba{
  background:url('https://images.unsplash.com/photo-1529426301869-82f4d98d3d81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2175&q=80');
  background-size:cover;
  background-position: center;
}
.Qatar{
  background:url('https://images.unsplash.com/photo-1539475314840-751cecc1dacd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Laos{
  background:url('https://images.unsplash.com/photo-1546292583-ce88ae27e5ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: left;
}
.Lesotho{
  background:url('https://images.unsplash.com/photo-1531395512293-e110f53f63dc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Latvia{
  background:url('https://images.unsplash.com/photo-1521927466543-0cf9a4a2fbac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Lebanon{
  background:url('https://images.unsplash.com/photo-1556997832-64829b58dfed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');
  background-size:cover;
  background-position: center;
}
.Libya{
  background:url('https://images.unsplash.com/photo-1548943767-73978b1751b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Lithuania{
  background:url('https://images.unsplash.com/photo-1533939664942-173b7df71238?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80');
  background-size:cover;
  background-position: center;
}
.Liberia{
  background:url('https://images.unsplash.com/photo-1547932219-39bba3484bf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80');
  background-size:cover;
  background-position: center;
}
.Liechtenstein{
  background:url('https://images.unsplash.com/photo-1512424113276-fa9f6a112384?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80');
  background-size:cover;
  background-position: center;
}
.Luxembourg{
  background:url('https://images.unsplash.com/photo-1433952206545-f507af9b26fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}
.Madagascar{
  background:url('https://images.unsplash.com/photo-1531145686779-c3fa161f3bb1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.Antarctica{
  background:url('https://images.unsplash.com/photo-1550757750-082690a376f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Malaysia{
  background:url('https://images.unsplash.com/photo-1532442782935-dc7ee648a2a5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80');
  background-size:cover;
  background-position: center;
}
.Malawi{
  background:url('https://images.unsplash.com/photo-1470095108684-735fe1f71ab7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2252&q=80');
  background-size:cover;
  background-position: center;
}
.Morocco{
  background:url('https://images.unsplash.com/photo-1527790759621-3699aed69cff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1276&q=80');
  background-size:cover;
  background-position: center;
}
.Maldives{
  background:url('https://images.unsplash.com/photo-1540490190210-9e2825f75418?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80');
  background-size:cover;
  background-position: center;
}
.Mali{
  background:url('https://images.unsplash.com/photo-1526233185109-093c40faef34?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2247&q=80');
  background-size:cover;
  background-position: center;
}
.Mauritius{
  background:url('https://images.unsplash.com/photo-1509619159938-4efea8aa33c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Mauritania{
  background:url('https://images.unsplash.com/photo-1543318557-a11bce6e033a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2555&q=80');
  background-size:cover;
  background-position: center;
}
.Marshall{
  background:url('https://images.unsplash.com/photo-1542233844-2c2c494d80ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1287&q=80');
  background-size:cover;
  background-position: center;
}
.Macedonia{
  background:url('https://images.unsplash.com/photo-1537113799915-0a24165b3f72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3043&q=80');
  background-size:cover;
  background-position: right;
}
.Moldova{
  background:url('https://images.unsplash.com/photo-1526578410734-17a617547636?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80');
  background-size:cover;
  background-position: center;
}
.Mexico{
  background:url('https://images.unsplash.com/photo-1504814532849-cff240bbc503?ixlib=rb-1.2.1&auto=format&fit=crop&w=1936&q=80');
  background-size:cover;
  background-position: center;
}
.Monaco{
  background:url('https://images.unsplash.com/photo-1542346641-2c2a2e92f720?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60');
  background-size:cover;
  background-position: center;
}
.Mongolia{
  background:url('https://images.unsplash.com/photo-1537212429608-6b5f5449cdf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.Myanmar{
  background:url('https://images.unsplash.com/photo-1516527891761-981ae17a53b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Mozambique{
  background:url('https://images.unsplash.com/photo-1544298903-35eee5a95b4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2895&q=80');
  background-size:cover;
  background-position: center;
}
.Montenegro{
  background:url('https://images.unsplash.com/photo-1543417355-60a0b3788831?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Micronesia{
  background:url('https://images.unsplash.com/photo-1553602932-f93f674a9aaa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3171&q=80');
  background-size:cover;
  background-position: center;
}
.Nigeria{
  background:url('https://images.unsplash.com/photo-1528645046579-596f02cf16eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Namibia{
  background:url('https://images.unsplash.com/photo-1536270213414-83e51bdcdd74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Netherlands{
  background:url('https://images.unsplash.com/photo-1485722841820-473e4b6c3bde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2989&q=80');
  background-size:cover;
  background-position: center;
}
.Nepal{
  background:url('https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.North, .Korea{
  background:url('https://images.unsplash.com/photo-1543325768-c2650cc0d8cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Nicaragua{
  background:url('https://images.unsplash.com/photo-1501327825011-e83b7080b0f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Norway{
  background:url('https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Nauru{
  background:url('https://images.unsplash.com/photo-1553947315-bb4e49d6bd66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1276&q=80');
  background-size:cover;
  background-position: center;
}
.Niger{
  background:url('https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2548&q=80');
  background-size:cover;
  background-position: center;
}
.Oman{
  background:url('https://images.unsplash.com/photo-1504257538320-8a5d5f1c0f31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Austria{
  background:url('https://images.unsplash.com/photo-1520503922584-590e8f7a90d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Pakistan{
  background:url('https://images.unsplash.com/photo-1503971090465-19d3c80f81f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2945&q=80');
  background-size:cover;
  background-position: center;
}
.Panama{
  background:url('https://images.unsplash.com/photo-1443181844940-9042ec79924b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1602&q=80');
  background-size:cover;
  background-position: center;
}
.Paraguay{
  background:url('https://images.unsplash.com/photo-1508028337431-ec46df2fdee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1301&q=80');
  background-size:cover;
  background-position: center;
}
.Peru{
  background:url('https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Portugal{
  background:url('https://images.unsplash.com/photo-1511968822213-92de73315bba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.Philippines{
  background:url('https://images.unsplash.com/photo-1521650559166-6b588715bc62?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Palestine{
  background:url('https://images.unsplash.com/photo-1529080666093-e863229ff121?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.Papua{
  background:url('https://images.unsplash.com/photo-1537529028785-ecd2294d210d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Palau{
  background:url('https://images.unsplash.com/photo-1543818872-7a43ea9a7853?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Romania{
  background:url('https://images.unsplash.com/photo-1518887668165-8fa91a9178be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3150&q=80');
  background-size:cover;
  background-position: center;
}
.Rwanda{
  background:url('https://images.unsplash.com/photo-1521278928248-385006e44ade?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2989&q=80');
  background-size:cover;
  background-position: center;
}
.Tajikistan{
  background:url('https://images.unsplash.com/photo-1512491035250-beddf64d1f5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3150&q=80');
  background-size:cover;
  background-position: center;
}
.Taiwan{
  background:url('https://images.unsplash.com/photo-1530324652194-d78318776d5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1301&q=80');
  background-size:cover;
  background-position: center;
}
.Tanzania{
  background:url('https://images.unsplash.com/photo-1511965675262-c4e1e6ac3f06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Thailand{
  background:url('https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1275&q=80');
  background-size:cover;
  background-position: center;
}
.Chad{
  background:url('https://images.unsplash.com/photo-1523375011992-70c0d9653380?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=935&q=80');
  background-size:cover;
  background-position: center;
}
.Togo{
  background:url('https://images.unsplash.com/photo-1548444835-0bc4a7d2a519?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80');
  background-size:cover;
  background-position: center;
}
.Trinidad{
  background:url('https://images.unsplash.com/photo-1534795366056-59754c3c9def?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Turkey{
  background:url('https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.Tunisia{
  background:url('https://images.unsplash.com/photo-1554018411-362847d4da0d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Czech{
  background:url('https://images.unsplash.com/photo-1526997440933-f7ec78a27601?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3034&q=80');
  background-size:cover;
  background-position: center;
}
.Turkmenistan{
  background:url('https://images.unsplash.com/photo-1543145283-0d878a1559ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1297&q=80');
  background-size:cover;
  background-position: center;
}
.Tonga{
  background:url('https://images.unsplash.com/photo-1443181994330-3e365ff8949e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1602&q=80');
  background-size:cover;
  background-position: center;
}
.Timor{
  background:url('https://images.unsplash.com/photo-1553242185-88cbc29642e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80');
  background-size:cover;
  background-position: center;
}
.Tuvalu{
  background:url('https://images.unsplash.com/photo-1557343404-e4be9a89ffb1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60');
  background-size:cover;
  background-position: center;
}
.Spain{
  background:url('https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1301&q=80');
  background-size:cover;
  background-position: center;
}
.Switzerland{
  background:url('https://images.unsplash.com/photo-1462651567147-aa679fd1cfaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Lanka{
  background:url('https://images.unsplash.com/photo-1531201890865-fb64780d16e9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80');
  background-size:cover;
  background-position: center;
}
.Somalia{
  background:url('https://images.unsplash.com/photo-1414489834126-05ccb7db4f79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1276&q=80');
  background-size:cover;
  background-position: center;
}
.Sudan{
  background:url('https://images.unsplash.com/photo-1490463136745-80e3fc793cbd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80');
  background-size:cover;
  background-position: center;
}
.Arabia{
  background:url('https://images.unsplash.com/photo-1540866225557-9e4c58100c67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1240&q=80');
  background-size:cover;
  background-position: center;
}
.South.Africa{
  background:url('https://images.unsplash.com/photo-1522576775862-7168ae29372c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80');
  background-size:cover;
  background-position: center;
}
.South.Korea{
  background:url('https://images.unsplash.com/photo-1541766029309-8d7fa5bb773b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1233&q=80');
  background-size:cover;
  background-position: center;
}
.Senegal{
  background:url('https://images.unsplash.com/photo-1528046652967-217fde4a4529?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80');
  background-size:cover;
  background-position: bottom;
}
.Suriname{
  background:url('https://images.unsplash.com/photo-1556306046-6e15e9d40668?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2544&q=80');
  background-size:cover;
  background-position: center;
}
.Saint.Lucia{
  background:url('https://images.unsplash.com/photo-1450380412196-4e27fb7d2270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2555&q=80');
  background-size:cover;
  background-position: center;
}
.Grenadines{
  background:url('https://images.unsplash.com/photo-1503554976257-62c321b115fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Nevis{
  background:url('https://images.unsplash.com/photo-1467702898878-82e7bba90abb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Zambia{
  background:url('https://images.unsplash.com/photo-1511355823905-f042687908eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Marino{
  background:url('https://images.unsplash.com/photo-1510513260777-51d462dbaec9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2551&q=80');
  background-size:cover;
  background-position: center;
}
.Zimbabwe{
  background:url('https://images.unsplash.com/photo-1488158302608-a31885ac02ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Syria{
  background:url('https://images.unsplash.com/photo-1501311409379-25beadb726c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Sweden{
  background:url('https://images.unsplash.com/photo-1534143340226-6cbc7628dbe5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80');
  background-size:cover;
  background-position: center;
}
.Singapore{
  background:url('https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2149&q=80');
  background-size:cover;
  background-position: center;
}
.Slovakia{
  background:url('https://images.unsplash.com/photo-1470043201067-764120126eb4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Slovenia{
  background:url('https://images.unsplash.com/photo-1478088913771-e3a36f50bb63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2893&q=80');
  background-size:cover;
  background-position: center;
}
.Swaziland{
  background:url('https://images.unsplash.com/photo-1519808805693-e7bf915e7bfc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Leone{
  background:url('https://images.unsplash.com/photo-1509099646481-33260a1c97a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2552&q=80');
  background-size:cover;
  background-position: center;
}
.Seychelles{
  background:url('https://images.unsplash.com/photo-1516534726759-c5ae5aea7965?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Samoa{
  background:url('https://images.unsplash.com/photo-1533105045747-b9d71a0955f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2164&q=80');
  background-size:cover;
  background-position: center;
}
.Solomon{
  background:url('https://images.unsplash.com/photo-1543051824-ebd4aff3001b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Tome{
  background:url('https://images.unsplash.com/photo-1454496872353-3ca1572cad6b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2555&q=80');
  background-size:cover;
  background-position: right;
}
.Svalbard{
  background:url('https://images.unsplash.com/photo-1526923268711-fa1c7e80f0e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Greenland{
  background:url('https://images.unsplash.com/photo-1512554895674-21616256b349?ixlib=rb-1.2.1&auto=format&fit=crop&w=2551&q=80');
  background-size:cover;
  background-position: center;
}
.Faroe{
  background:url('https://images.unsplash.com/photo-1506457469115-39b5cced7b7a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2400&q=80');
  background-size:cover;
  background-position: right;
}
.Argentina{
  background:url('https://images.unsplash.com/photo-1530088018346-02bcdeb1085a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: right;
}
.Guatemala{
  background:url('https://images.unsplash.com/photo-1508035460735-91088c495500?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80');
  background-size:cover;
  background-position: right;
}
.Dominica{
  background:url('https://images.unsplash.com/photo-1499598896209-c62806b9ae75?ixlib=rb-1.2.1&auto=format&fit=crop&w=2991&q=80');
  background-size:cover;
  background-position: right;
}
.Montserrat{
  background:url('https://images.unsplash.com/photo-1481325828126-d57127c9d39f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2534&q=80');
  background-size:cover;
  background-position: right;
}
.Anguilla{
  background:url('https://images.unsplash.com/photo-1551960052-feacdb5db157?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2555&q=80');
  background-size:cover;
  background-position: right;
}
.Virgin{
  background:url('https://images.unsplash.com/photo-1502126402642-07c2b7a9e7d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.Cayman{
  background:url('https://images.unsplash.com/photo-1514295160158-76314286b987?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2991&q=80');
  background-size:cover;
  background-position: center;
}
.Canada{
  background:url('https://images.unsplash.com/photo-1506104489822-562ca25152fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2549&q=80');
  background-size:cover;
  background-position: right;
}
.Cape.Verde{
  background:url('https://images.unsplash.com/photo-1544883549-026239eb46ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1301&q=80');
  background-size:cover;
  background-position: right;
}
.Guinea{
  background:url('https://images.unsplash.com/photo-1509840825703-6af73fa6c128?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: right;
}
.Guinea.Bissau{
  background:url('https://images.unsplash.com/photo-1555142365-e59b7a7b374f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: right;
}
.Ivory{
  background:url('https://images.unsplash.com/photo-1552710307-8d1c604d6319?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2547&q=80');
  background-size:cover;
  background-position: center;
}
.Eritrea{
  background:url('https://images.unsplash.com/photo-1536196112245-64fda3a1df0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1235&q=80');
  background-size:cover;
  background-position: center;
}
.Somaliland{
  background:url('https://images.unsplash.com/photo-1552391696-7db0c92a9eeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.Armenia{
  background:url('https://images.unsplash.com/photo-1528663775703-dba64f806cd1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80');
  background-size:cover;
  background-position: center;
}
.Caledonia{
  background:url('https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=2048&q=80');
  background-size:cover;
  background-position: center;
}
.Falkland{
  background:url('https://images.unsplash.com/photo-1493825402953-2eb41bfdbba2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Antarctic{
  background:url('https://images.unsplash.com/photo-1533833217427-31d3f7bfa051?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2553&q=80');
  background-size:cover;
  background-position: left;
}
.Sandwich{
  background:url('https://images.unsplash.com/photo-1551986782-9fa82053c9b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
  background-position: center;
}
.Serbia{
  background:url('https://images.unsplash.com/photo-1487111023822-2e903e12f6f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80');
  background-size:cover;
  background-position: center;
}
.Kosovo{
  background:url('https://images.unsplash.com/photo-1543952388-ebb0c563ab23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80');
  background-size:cover;
  background-position: center;
}
.hihi{
  background:url('');
  background-size:cover;
  background-position: center;
}
.hihi{
  background:url('');
  background-size:cover;
  background-position: center;
}
.Egypt{
    background:url('https://images.unsplash.com/photo-1542916514-3e2119eefeb7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80');
  background-size:cover;
  background-position: center;
}

.Germany{
  background:url('https://images.unsplash.com/photo-1538685634737-24b83e3fa2f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80');
  background-size:cover;
  background-position: center;
}
.Poland{
  background:url('https://images.unsplash.com/photo-1493542352290-d3f90c0bb920?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80');
  background-size:cover;
  background-position: center;
}
.Zealand{
  background:url('https://images.unsplash.com/photo-1517446915321-65e972f1b494?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3450&q=80');
  background-size:cover;
  background-position: center;
}
.Russia{
  background:url('https://images.unsplash.com/photo-1520106212299-d99c443e4568?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3334&q=80');
  background-size:cover;
  background-position: center;
}
.Australia{
  background:url('https://images.unsplash.com/photo-1530439979708-7327bd7f7c1f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80');
  background-size:cover;
}
.France{
  background:url('https://images.unsplash.com/photo-1529349269623-0f08511ba573?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2690&q=80');
  background-size:cover;
  background-position: center;
}
</style>
