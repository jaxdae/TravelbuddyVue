<template>
<div v-if="isBig" class="navbar">
        <div class="navbar-wrapper">
        <router-link to="/" id="home">
        <div id="home" class="navbar-link">Home</div>
        </router-link>
        <router-link to="createtrip">
        <div class="navbar-link">Plan new trip</div>
        </router-link>
        <router-link to="plannedtrips">
        <div class="navbar-link">Planned Trips</div>
        </router-link>
        <router-link to="visited">
        <div class="navbar-link">Countries visited</div>
        </router-link>
        </div>
      </div>
      <div v-else>
        <transition name="fade">
      <div v-if="menuOpen" class="menu-bg">
        <div class="link-wrapper">
        <router-link to="/" id="home">
        <div id="home" class="navbar-link menu">Home</div>
        </router-link>
        <router-link to="createtrip">
        <div class="navbar-link menu">Plan new trip</div>
        </router-link>
        <router-link to="plannedtrips">
        <div class="navbar-link menu">Planned Trips</div>
        </router-link>
        <router-link to="visited">
        <div class="navbar-link menu">Countries visited</div>
        </router-link>
        </div>
      </div>
      </transition>
      <div class="burger" @click="openBurgerMenu">
        <div id="menu" class="menu-trigger" @click="openBurgerMenu">
          <span class="line line-1"></span>
          <span class="line line-2"></span>
          <span class="line line-3"></span>
        </div>
        </div>
      </div>
</template>

<script>

export default {
  name: 'Menu',
  data () {
  return {
    isBig :false,
    menuOpen: false,
  }
},
methods: {
  openBurgerMenu: function() {
    if(!this.menuOpen){
      document.getElementById('menu').classList.add('active')
      document.getElementsByTagName('body')[0].classList.add('noScroll')
      this.menuOpen = true
    }else{
      document.getElementById('menu').classList.remove('active')
      document.getElementsByTagName('body')[0].classList.remove('noScroll')
      this.menuOpen = false
    }
  },
  handleResize(){
     if(window.innerWidth>768){
    this.isBig = true
  }else{
    this.isBig = false
  }
  }
},
mounted () {
  document.getElementsByTagName('body')[0].classList.remove('noScroll')
},
created(){
     window.addEventListener('resize', this.handleResize)
     this.handleResize()
}
}
</script>

<style >
#home {
  margin-right: auto;
}
.navbar {
  position: absolute;
  top:0;
  width: calc(100% - 60px);
  height: 60px;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 0 10px 0 rgba(40, 40, 40, 0.1);
  margin: 30px;
  flex-flow: row wrap;
  align-items: center;
  z-index:3;
}

.navbar-wrapper {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
}
.navbar-link {
  color: #99989c;
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2.75px;
  line-height: 14px;
  text-transform: uppercase;
  
  position: relative;
transition: transform 0.5s ease-in-out;
}

@media only screen and (min-width: 1200px){
.navbar-link{
  margin-left:35px;
}
}

@media only screen and (max-width: 1200px){
.navbar-link {
  color: #99989c;
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2.75px;
  line-height: 14px;
  text-transform: uppercase;
  margin-left: 30px;
  position: relative;
transition: transform 0.5s ease-in-out;
}
}
@media only screen and (max-width: 992px){
.navbar-link {
  color: #99989c;
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2.75px;
  line-height: 14px;
  text-transform: uppercase;
  margin-left: 15px;
  position: relative;
transition: transform 0.5s ease-in-out;
}

@media only screen and (max-width: 768px){
   .navbar{
display:none;
  }
}
}

.navbar-link::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 100%;
  height: 1px;
  background-color: #99989c;
  transform-origin: center;
  transform: translate(-50%, 0) scaleX(0);
  transition: transform 0.3s ease-in-out;
}
.navbar-link:hover::before {
  transform: translate(-50%, 0) scaleX(1);
}
.navbar-link:hover{
  transition: transform 0.5s ease-in-out;
  color:#282828;
}
.burger{
  cursor: pointer;
  width:50px;
  height: 50px;
  background: #282828;
  border-radius:25px;
  position: absolute;
  top:15px;
  left:15px;
  z-index:4;
  box-shadow: 0 0 10px 0 rgba(40,40,40,0.5);
}
.menu-trigger{
  pointer-events: none;
    width: 18px;
  height: 15px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
  margin: 20px;
  top:-3px;
  left:-4px;
}
.line{
     width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    background: #fff;  
    border-radius: 4px;
       transition: 0.3s;
}
.line-1{
  transition: all 0.3s 0.3s, transform 0.3s 0s;
}
.line-2{
  top: 50%;
      margin-top: -1px;
      left: 0;
      transition: all 0.3s 0.3s;
}
.line-3{
   bottom: 0;
      top: auto;
      left: 0;
      transition: all 0.3s 0.3s, transform 0.3s 0s;     
}
.active .line-1{
      top: 50%;
      margin-top: -1px;
      transform: rotate(45deg);
      transition: all 0.3s, transform 0.3s 0.3s;
}
.active .line-2{
       opacity: 0;
      transition: all 0.3s, opacity 0.3s 0s; 
}
.active .line-3{
        bottom: 50%;
      margin-bottom: -1px;
      transform: rotate(-45deg);
      transition: all 0.3s, transform 0.3s 0.3s;  
}
.menu-bg{
  width:100vw;
  height:100vh;
  background:white;
  position: fixed;
  top:0;
left:0;
z-index:4;
display:flex;
align-items: center;
justify-content: center;
}
.menu{
     width: 100%;
    text-align: center;
    margin-top: 60px;
}
body.noScroll{
  overflow:hidden;
}
</style>
