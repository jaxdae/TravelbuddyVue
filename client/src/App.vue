<template>
  <div id="app">
    <router-view></router-view>

  </div>
</template>

<script>
import Home from './components/Home.vue'
import CreateTrip from './components/CreateTrip'
import VisitedCountries from './components/VisitedCountries'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Home,
    CreateTrip,
    VisitedCountries,
    Footer
    
  }
}
</script>

<style>
.content{
    height: 195px;
    overflow: hidden;
}
body{
  margin:0;
}
video{
  position: absolute;
  z-index: -1;
}
.header{
      width: 100%;
    height: 100%;
    position: absolute;
}
.large-header{
  border-radius:10px;
  overflow: hidden;
  width: calc(100% - 30px);
  height: calc(100vh - 120px);
  position: relative;
  margin:15px 15px 0 15px;
}
 .large-header::before{
   content:'';
   position: absolute;
    width: 100%;
    height: calc(100vh - 120px);
    background: linear-gradient(193.65deg, rgba(40,40,40,0.1) 0%, rgba(40,40,40,0.85) 100%);
    border-radius:10px;
  }
.headline{
  color: #FFFFFF;
    font-family: Poppins;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 1px;
    line-height: 70px;
    margin-top:0;
}
.subheadline{
  position: relative;
   font-size: 12px;
}
.content-headline {
  color: #282828;
  margin: 0;
  font-family: Poppins;
  font-weight: 600;
  letter-spacing: 1px;
}
.content-headline::before {
  position: relative;
  content: "";
  display: block;
  margin-right: 5px;
  height: 3px;
  background-color:white;
}
.headline::before{
display: none;
}
.mapboxgl-ctrl-geocoder--icon-search{
  top:8px;
}
p{
  color: #EBEBEB;
  font-family: Montserrat;
  font-size: 12px;
  letter-spacing: 1px;
  line-height: 18px;
  width:100%;
  font-weight: 100;
}
.mapboxgl-ctrl-bottom-right{
    bottom: -30px;
    width: calc(100% - 30px);
    right: 15px;
top: auto;
}
.content{
  margin:30% 10%;
}
.headline{
      font-size: 30px;
}
.headline::before{
    width: 83px;
    right: 108px;
}
.subheadline{
  position: relative;
   font-size: 12px;
   top:20px;
}
.mapboxgl-popup-content{
  width: 200px;
}


@media only screen and (min-width: 425px){
  .content{
    height: auto;
    overflow:auto;
}
  .headline{
    font-size:30px;
    margin-left:60px;
  }
  .subheadline{
        margin-left: 60px;

    position: relative;
    font-size:10px;
  }
  .headline::before{
    width:45px;
    right:60px;
    display:block;
  }
  .large-header{
    margin: 30px 0 0 30px;
    width: calc(100% - 60px)
  }
  .content-tripstops {
 margin: 30px 30px;
}
.content-headline{
    margin-left: 60px;
}
.content-headline::before{
  width: 40px;
  bottom: -28px;
    right: 60px;
}
.content-subheadline{
  letter-spacing: 2px;
  font-size:10px;
}
.mapboxgl-ctrl-bottom-right{
   width: 60%;
}
.mapboxgl-ctrl-geocoder--icon-search{
  top:8px;
}
.all-tripstops{
      margin-top: 30px;
}
}

@media only screen and (min-width: 768px){
  .mapboxgl-ctrl-bottom-right{
    bottom: -15px;
    width: calc(100% - 30px);
    right: 110px;
top: auto;
}
   .content{
    height: 100%;
}
  p{
    font-size:16px;
    line-height:30px;
    height:20px;
  }
  .content{
    margin: 20% 0 0 20%;
  }
.content-tripstops {
 margin: 60px 60px;
}
.content-headline{
      margin-left: 108px;
        color: #282828;
  font-size: 40px;
  margin: 0;
  font-family: Poppins;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-left:108px;
}

.large-header{
  margin: 60px 0 0 60px;
      width: calc(100% - 120px);
}
.content-subheadline{
  letter-spacing: 2.75px;
   font-size: 11px;
   
}
.content-headline {
  color: #282828;
  font-size: 40px;
  margin: 0;
  font-family: Poppins;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-left: 60px;
}
.subheadline{
  top:0;
}
.maxbox-ctrl{
   width:400px;
}

}
@media only screen and (min-width: 992px){
.content-headline {
  color: #282828;
  font-size: 40px;
  margin-left: 130px;
  font-family: Poppins;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 1px;

}
.content-headline::before{
     width: 108px;
    left: -130px;
}
}

@media only screen and (min-width: 1200px){
.content-tripstops {
 margin: 60px 240px;
}
}

.content-subheadline {
 color: #99989C;
 font-family: Montserrat;
 font-size:10px;
 line-height: 14px;
 letter-spacing: 1.5px;
  text-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-weight: 100;
  margin-left:20px;
}
.content-headline{
margin:30px 0 0 20px;
}

.headline::before{
position: relative;
    bottom: -37px;
    content: '';
    margin-right: 5px;
    height: 3px;
    background-color: white;
}
.start-now{
  display: none;
}
.subheadline{
  color: #EBEBEB;
  font-family: Montserrat;
  letter-spacing: 3.5px;
  line-height: 18px;
  text-shadow: 0 0 10px 0 rgba(255,255,255,0.5);
  text-transform: uppercase;
  font-weight:100;
}



.down-icon{
width: 30px;
    height: 30px;
    background: url('./assets/arrow-right-light.png');
    background-size: cover;
    position: absolute;
    bottom: 13px;
    right: 11px;
    z-index: 2;
}
.button{
  height: 50px;
  width: 50px;
  border-radius: 32px;
  background-color: #282828;
  box-shadow: 0 0 10px 0 rgba(40,40,40,0.5);
  position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 1;
}

.button:hover .down-icon{
  background: url('./assets/arrow-down.png');
  background-size:cover;
  cursor:pointer;
}

.down-icon:hover ~ .button{
  background: white;
  cursor:pointer;
   box-shadow: 0 0 20px 0 white;
}
.button:hover{
  background: white;
  cursor:pointer;
  box-shadow: 0 0 20px 0 white;
}
.down-icon:hover{
   background: url('./assets/arrow-down.png');
   background-size:cover;
   cursor:pointer;
}
.content-subheadline{
    margin: 0 15px 0 15px;
  width: calc(100% - 30px);
}
a{
  text-decoration: none;
}
.mapboxgl-ctrl-logo{
  visibility: hidden;
}
.mapboxgl-ctrl-attrib{
  visibility: hidden;
}
.mapboxgl-popup-content{
  padding: 30px;
  border-radius: 10px;
}
.add-btn{
  font-family: Montserrat;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2.75px;
    line-height: 14px;
    text-transform: uppercase;
    width: calc(100% - 30px);
    margin: 0 15px 0 15px;
    border: none;
    background: white;
    box-shadow: 0 0 10px 0 rgba(40,40,40,0.1);
    border-radius: 20px;
    padding: 10px 15px;
    transition: ease all 0.3s;
    z-index: 1;
  position: relative;
  overflow: hidden;
}
.add-btn::before{
  padding-top:10px;
   content: 'Added to trip!';
  z-index: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color:white;
  background-color: #3FB1CD;
  transform-origin: center left;
  transform: translate(-100%,0);
  transition: transform 0.3s ease-out;
}
.save-btn::before{
  padding-top:15px;
   content: 'Successfully saved!';
  z-index: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color:white;
  background-color: #3FB1CD;
  transform-origin: center left;
  transform: translate(-100%,0);
  transition: transform 0.3s ease-out;
}
.add-btn:hover{
  background: #282828;
  color:white;
  cursor: pointer;
}
.animate-added{
  background: #282828;
  z-index: 2;
  position: relative;
}
.animate-added::before{
   transform-origin: center left;
  transform: translate(0,0);
}

.places-headline{
  color: #282828;
  font-family: Poppins;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1.33px;
  line-height: 24px;
}
.places-subheadline{
  font-weight: 100;
    font-family: montserrat;
    font-size: 12px;
    color: #282828;
    padding-bottom: 15px;
}
.mapboxgl-popup-close-button{
  font-size: 30px;
    padding: 10px 15px;
}
.mapboxgl-popup-anchor-bottom{
  max-width:300px;
}

.mapboxgl-ctrl{
  border-radius:30px;
  height:45px;
  margin:0 !important;
}
.mapboxgl-ctrl-geocoder--input{
  height:45px;
  padding-left:45px;
}
.suggestions{
border-radius:15px !important;
margin-bottom:15px !important;
}
.mapboxgl-ctrl-geocoder--icon{
  height:30px;
  left:15px;
}
.mapboxgl-ctrl-geocoder--pin-right > *{
right:15px !important;
top:1px !important;
height:38px !important;
}
input:focus, textarea:focus button:focus{
    outline: 0;
}
button:focus {outline:0;}
.fade-enter-active, .fade-leave-active {
transition: all .5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.fade-move {
  transition: transform 1s;
}
.fade-leave-active{
  position: absolute;
}
.mapboxgl-popup{
position: absolute;
z-index: 3;
}

.element::-webkit-scrollbar { width: 0 !important }
::-webkit-scrollbar { 
    display: none; 
}
</style>
