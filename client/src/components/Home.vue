<template>
<div>
    <div id="map" class="large-header">
    <video autoplay muted loop id="myVideo">
       <source src="../assets/wave.mp4" type="video/mp4">
      </video>
       <Menu></Menu>
      <div class="header">
      <div class="content">
      <h2 class="subheadline">ready for new</h2>
      <h1 class="headline">Adventures?</h1>
      <p>With Travelbuddy you can plan new journeys, destinations and routes with ease - and access it from everywhere.<br><br>
Write your new bucket list and watch how satisfying it gets to cross things off. New destinations can be tracked within the large map, showing you the countries you’ve been to and giving you access to your own travel diary.<br><br>
So whenever you’re feeling ready for a travel but can’t actually go somewhere, take your time and through yourself back in your past vacation memories.</p>
      </div>
      
      <div class="button" @click="scrolldown"><div class="down-icon" @click="scrolldown"></div></div>
      </div>
      </div>
           <div id="content" class="content-tripstops">
      <h1 class="content-headline">Upcoming Trips</h1>
      <h2 class="content-subheadline">Watch and edit your planned trips</h2>
   <div v-if="plannedTrips2" class="planned-trips-wrapper">
         <div v-for="trip in plannedTrips2" v-bind:key="trip.tripName" class="planned-trips">
          <div class="zoomWrapper" v-bind:style="{ backgroundImage: 'url(' + trip.imgUrl + ')' }"></div>
          <div class="planned-trips-headline">{{trip.name}}</div>
           <router-link :to="{ name: 'trip', params: {name2: trip.name, imgUrl2: trip.imgUrl, stops2: trip.stops, substops2:trip.substops}}">
             <a class="button-goto"><a class="arrow-icon"></a></a>
           </router-link>
          </div>
          <i class="hiddentrip" aria-hidden="true"></i>
      <i class="hiddentrip" aria-hidden="true"></i>
      <i class="hiddentrip" aria-hidden="true"></i>
       <i class="hiddentrip" aria-hidden="true"></i>
      <i class="hiddentrip" aria-hidden="true"></i>
      </div>
      <div v-else>
        <router-link to="createtrip">
            <button id="save" class="add-btn create-btn">Create your first trip</button>
        </router-link>
      </div>
      </div>
      <Footer></Footer>
      </div>
</template>

<script scoped>
import Footer from './Footer.vue'
import Menu from './Menu.vue'
import TripService from '@/services/TripService'

export default {
  name: 'Home',
  data (){
    return{
      plannedTrips2: []
    }
  },
  components: {
    Footer,
    Menu
  },
  methods:{
     scrolldown: function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('#content').offset().top - 90
      }, 800);
    },
  },
    async mounted () {
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
  }
}

</script>

<style>
.create-btn{
  height:45px;
  margin-top:30px;
}
@media only screen and (min-width: 768px){
  #home{
    margin-left:15px;
  }
  p{
    width:70%;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 22px
  }
  .headline{
    font-size:60px;
    margin-left:80px;
  }
  .headline::before{
    width: 60px;
    right:80px;
  }
  .subheadline{
    margin-left:80px;
    font-size: 13px;
  }

}
*:focus {
    outline: none;
}

.zoomWrapper::after{
  content:'';
  position: absolute;
  top:0;
  border-radius:10px;
  width:100%;
  height:100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 100%);
}
.zoomWrapper{
  height: 100%;
    border-radius: 10px;
    background-size:cover;
    background-position: center;
     transition: all 0.5s ease;
}
.zoomWrapper:hover{
  transform: scale(1.1);
}
.button-goto:hover .arrow-icon{
  background: url('../assets/arrow-dark.png');
  background-size:cover;
  cursor:pointer;
}

.arrow-icon:hover ~ .button-goto{
  background: white;
  cursor:pointer;
   box-shadow: 0 0 20px 0 white;
}
.button-goto:hover{
  background: white;
  cursor:pointer;
  box-shadow: 0 0 20px 0 white;
}
.arrow-icon:hover{
   background: url('../assets/arrow-dark.png');
   background-size:cover;
   cursor:pointer;
}
.button-goto{
  height: 50px;
  width: 50px;
  border-radius: 32px;
  background-color: #282828;
  box-shadow: 0 0 10px 0 #282828;
  position: absolute;
    bottom: 15px;
    right: 15px;
}
.arrow-icon{
  background: url('../assets/arrow-right.png');
      background-size: cover;
    height: 28px;
    width: 23px;
    position: absolute;
        bottom: 12px;
    right: 18px;
    z-index: 3;
}
.hiddentrip{ 
    min-width:300px;
    margin:5px;
    position: relative;
    flex: 1 1 0;
}
.button{
      bottom: 15px;
    right: 15px;
}
.planned-trips-wrapper{
  display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin:30px 10px 0 10px;
}
.planned-trips:hover .zoomWrapper{
  transform: scale(1.1)
}
.planned-trips{
    height:470px;
    min-width:290px;
    border-radius:10px;
    margin:5px;
    position: relative;
    flex: 1 1 0;
    background-size: cover;
    background-position: center;
    overflow: hidden;
}
.planned-trips-headline{
      position: absolute;
    top: 0;
   color: #FFFFFF;
 	font-family: Poppins;
   font-weight: 600;
   font-size:30px;
   letter-spacing: 1px;
   line-height: 40px;
  padding:15px 20px;
    z-index: 2;
    hyphens: auto;
}
</style>
