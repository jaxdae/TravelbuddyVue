<template>
<div class="Footer__bg">
    <div class="Footer__wrapper">
    <div class="Footer__text">Thank you for using Travel Buddy!</div>
    <div class="Footer__logo"></div>
    <div class="Footer__text">© 2019 Jacqueline Daehn</div>
    </div>
</div>
</template>

<script>

export default {
  name: 'Footer'
}
</script>

<style scoped>
.Footer__wrapper{

    margin: 15px 15px 0 15px;
    flex-wrap: wrap;
    justify-content: center;
display:flex;
align-items: center;
height:100%;
}
.Footer__logo{

  width:100%;
  background-size: contain !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
height:35px;
background: url(../assets/plane.png);
}
@media only screen and (min-width: 425px){

.Footer__logo{
  width:100%;
  background-size: contain !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  
}
}
@media only screen and (min-width: 768px){
.Footer__logo{
  width:35px;
  background-size:cover;
}
.Footer__wrapper{

    flex-wrap: nowrap;
    justify-content: center;
display:flex;
align-items: center;
height:100%;
margin:0 60px 0 60px;
justify-content: space-between;
}
}
.Footer__bg{
margin-top:60px;
width:100%;
height:120px;
background-color: #282828;
}


.Footer__text{
color: #99989C;
font-family: Poppins;
font-size: 13px;
letter-spacing: 1px;
line-height: 25px;
}
</style>
