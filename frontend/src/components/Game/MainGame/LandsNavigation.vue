<template>
  <!-- LANDS NAVIGATION COMPONENT -->
  <div class="d-flex navi align-content-center container">
    <!-- SHOW ALL LANDS -->
    <div class="firstrow">
      <div v-for="(item, index) in lands" :key="item.landId" class="d-inline-block">
        <h3 ref="elements"><a @click="change(item, index)">{{ item.name }}</a></h3>
      </div>
      <a @click="popup()"><i class="material-icons">add_box</i></a>
    </div>

    <!-- POPUP TO CREATE A NEW LAND -->
    <div ref="pop" class="overlay">
      <div class="overlay2" @click="unpopup()"></div>
      <div class="popup">
        <h2>Create Land</h2>
        <a @click="unpopup()" class="close">&times;</a>
        <div class="content">
          <div class="flexd" v-if="upgradeResources.length !== 0">
            <div class="flexc" v-for="res in this.upgradeResources" :key="res.type">
              <p>{{ res.quantity.toLocaleString('es') }}</p>
              <img class="imgCostNew" :src="res.src" alt="">
            </div>
          </div>
        </div>

        <button class="button" @click="create()">Create</button>

        <p class="error_mess">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { gamemaster } from "@/stores/gamemaster.js"
import { land } from "@/stores/land.js"
import { player } from "@/stores/player.js"

export default {
  name: 'LandsNavigation',
  props: {
    name: undefined,
    landsId: [],
  },
  components: {

  },
  data: function () {
    return {
      lands: [],
      gamemaster: gamemaster(),
      land: land(),
      player: player(),
      message: '',
      index: -1,
      upgradeResources: [],
    }
  },
  methods: {
    popup() {
      this.$refs.pop.style.visibility = 'visible';
      this.$refs.pop.style.opacity = '1';
    },
    unpopup() {
      this.$refs.pop.style.visibility = 'hidden';
      this.$refs.pop.style.opacity = '0';
    },
    back() {
      this.$parent.showHomeGame();
    },
    change(item, index) {
      for (const element of this.$refs.elements) {
        element.style.color = 'black';
        element.style.fontWeight = '500';
      }

      this.index = index;
      this.$refs.elements[this.index].style.color = '#EBAF37';
      this.$refs.elements[this.index].style.fontWeight = '700';

      this.$parent.changeLand(item.landId);
    },
    async create() {
      const check = await this.land.createLand(this.player.$state.authKey);

      this.message = '';
      if (check === null) {
        this.message = 'Created correctly.';
        this.$parent.refreshAll();
        this.unpopup();
      } else {
        this.message = check;
      }
    },
    start(landsId) {
      this.lands = [];
      const actualId = this.land.$state.landData._id;

      let it = 0;
      for (const landId of landsId) {
        const obj = {};
        obj.landId = landId;
        if (actualId === landId) this.index = it;
        obj.name = "Land_" + landId.slice(landId.length - 5, landId.length);
        this.lands.push(obj);
        it++;
      }

      for (const res of this.gamemaster.$state.lands.resources) {
        const obj = {};
        obj.type = res.type;
        obj.quantity = res.quantity;

        for (const resource of this.gamemaster.$state.resources) {
          if (resource.resourceId === res.type) {
            obj.src = resource.src;
            break;
          }
        }

        this.upgradeResources.push(obj);
      }
    }
  },
  beforeMount() {
    this.start(this.landsId);
  },
  mounted() {
    for (const element of this.$refs.elements) {
      element.style.color = 'black';
      element.style.fontWeight = '500';
    }

    this.$refs.elements[this.index].style.color = '#EBAF37';
    this.$refs.elements[this.index].style.fontWeight = '700';
  },
  watch: {
    landsId: function (newVal) {
      this.start(newVal);
    }
  }
}
</script>

<style scoped>
p {
  font-size: 30px;
  padding: 0;
  font-weight: 700;
  margin-top: 0.5em;
  margin-bottom: 1em;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

.navi {
  justify-content: space-evenly;
}

.min-width {
  min-width: 20%;
}

.margin {
  cursor: pointer;
}

.max-w {
  margin-right: 5%;
}

.button{
  display: block;
  padding: 1px 7px;
  background: rgba(248, 244, 229, 0);
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 0;
  margin-left: 10%;
}

i {
  margin-top: 0.3em;
  transition: 0.1s all ease-in-out;
  height: fit-content;
  cursor: pointer;
  margin-left: 1em;
}

i:hover {
  opacity: .7;
  cursor: pointer;
}

.firstrow {
  margin-top: 1.5em;
  align-content: center;
  justify-content: center;
  align-items: center;
  min-width: 0;
  object-fit: contain;
}

p {
  margin: 0 0;
}

.box {
  width: 40%;
  margin: 0 auto;
  background: rgba(255,255,255,0.2);
  padding: 35px;
  border: 2px solid #fff;
  border-radius: 20px/50px;
  background-clip: padding-box;
  text-align: center;
}


.overlay2 {
  display: flex;
  z-index: 100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0);
  opacity: 1;
  justify-content: center;
  align-items: center;
}

.overlay {
  display: flex;
  z-index: 200;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  visibility: hidden;
  opacity: 0;
  justify-content: center;
  align-items: center;
}

.overlay:target {
  visibility: visible;
  opacity: 1;
}

.popup {
  position: absolute;
  background: #f8f4e5;
  border: 2px solid black;
  box-shadow: 8px 8px 1px #FFC174, 8px 8px 1px 1px black;
  width: 30%;
  justify-content: center;
  align-items: center;
  z-index: 200;
  min-height: 10em;
  padding: 1em;
  display: flex;
  flex-direction: column;
}

.popup h2 {
  margin-top: 0;
  color: #333;
  font-family: Tahoma, Arial, sans-serif;
}
.popup .close {
  position: absolute;
  top: 10px;
  right: 30px;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}
.popup .close:hover {
  color: #FFC174;
}
.popup .content {
  max-height: 30%;
  overflow: auto;
}

a {
  width: fit-content;
  height: fit-content;
  color: inherit;
}

.error_mess {
  font-size: 11px;
  font-weight: normal;
  color: red;
}

h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 1em 1em 0;
}

h3:hover {
  opacity: 0.6;
}

@media screen and (max-width: 700px){
  .box{
    width: 70%;
  }
  .popup{
    width: 70%;
  }
}

.container {
  margin-bottom: 1em;
}

a {
  cursor: pointer;
}

i {
  margin: 0;
}

.button{
  color: #1a1a1a;
  display: block;
  padding: 0 20px;
  background: #FFC174;
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 1px solid black;
  margin: 1em 1em 0;
}

.button:hover {
  background: #fa8d29;
}

.width {
  margin-left: 3%;
  width: 80%;
}

.imgCostNew {
  height: auto;
  width: auto;
  min-width: 40%;
  min-height: 40%;
  max-width: 40%;
  max-height: 40%;
}

.flexc {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.flexd {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.flexdd {
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  align-items: center;
}

p {
  font-weight: normal;
  font-size: 15px;
  padding: 0;
  margin: 0;
}

h3 {
  font-weight: bold;
  font-size: 18px;
}

</style>