<template>
  <!-- MAP WITH ALL RESOURCES FIELDS-->
  <div class="width">
    <div class="d-flex home">

      <!-- MAP WITH FIELDS AND IMAGE -->
      <div class="distribution-map">
        <img :src="imageSrc" alt=""/>
        <button class="rombo" @click="nextMap()"></button>
        <li v-for="item in resourcesFields" :key="item.nField">
          <button ref="items" @click="mark(item)" class="map-point labels hover" v-bind:style="'top:' + coordsTop[item.nField-1] + '%;left:' + coordsLeft[item.nField-1] + '%'"> {{ item.level }} </button>
        </li>
      </div>

      <!-- POPUP RIGHT TO THE MAP TO SHOW BUILD / UPGRADE INFORMATION -->
      <div class="d-flex align-content-center row descr home3">
        <h3 v-if="upgradeResources.length !== 0 || message !== ''">Upgrade {{ name }}</h3>
        <div class="flexd" v-if="upgradeResources.length !== 0">
          <div class="flexc" v-for="(res, index) in this.upgradeResources" :key="res.type">
            <p>{{ res.quantity.toLocaleString('es') }}</p>
            <img class="imgCost" :src="this.resources[index].src" alt="">
          </div>
        </div>

        <div class="flexdd" v-if="upgradeResources.length !== 0">
          <p v-if="upgradeResources.length !== 0">Level: {{ level - 1 }} &rarr; {{ level }}</p>
          <p v-if="upgradeResources.length !== 0">Production: {{ prodBefore }} &rarr; {{ prodAfter }}</p>
        </div>

        <p v-if="upgradeResources.length !== 0">&#128337; {{ time }}</p>

        <button class="button" @click="levelUp()" v-if="upgradeResources.length !== 0">Level Up</button>
        <p v-if="upgradeResources.length === 0 && message === ''">Select a field to level up.</p>
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
  name: 'ResourcesFields',
  props: {
    resourcesFields: [],
    landType: undefined
  },
  data: function () {
    return {
      message: "",
      coordsTop: [18, 18, 18, 32, 32, 32, 32, 45, 45, 45, 45, 58, 58, 58, 58, 72, 72, 72],
      coordsLeft: [31, 50, 68, 22, 41, 59, 78, 12, 31, 69, 88, 22, 40, 60, 78, 31, 50, 69],
      resources: [],
      holeSelected: -1,
      gamemaster: gamemaster(),
      upgrade: undefined,
      level: 0,
      upgradeResources: [],
      name: '',
      prodBefore: 0,
      prodAfter: 0,
      time: 0,
      land: land(),
      player: player(),
      imageSrc: ''
    }
  },
  methods: {
    mark(item) {
      // Mark item
      for (let resource in this.$refs.items) {
        this.$refs.items[resource].style['background-color'] = 'rgb(255, 255, 255, 0.3)';
      }
      this.$refs.items[item.nField-1].style['background-color'] = 'rgb(255, 255, 255, 0.7)';

      let isUpgrading = false;
      for (const event of this.land.$state.landData.eventsTime) {
        if (event.type === 'upgrade_resource' && event.nField === item.nField) {
          isUpgrading = true;
        }
      }

      if (!isUpgrading) {
        this.resources = this.gamemaster.$state.resources;
        this.upgrade = {};
        this.preUpgrade = {};
        for (const res of this.resources) {
          if (res.resourceId === item.type) {
            if (res.upgrades.length === item.level) {
              // max level
              this.upgradeResources = [];
              this.message = 'Max level';
              return;
            } else {
              this.name = res.name;
              this.upgrade = res.upgrades[item.level];
              this.preUpgrade = res.upgrades[item.level-1];
            }
          }
        }

        this.message = '';
        this.level = this.upgrade.level;
        this.upgradeResources = this.upgrade.resources;
        this.prodBefore = this.preUpgrade.production;
        this.prodAfter = this.upgrade.production;
        this.holeSelected = item.nField;
        this.time = new Date(this.upgrade.time * 1000).toISOString().substr(11, 8);
      } else {
        this.upgradeResources = [];
        this.message = 'Upgrade in queue ...';
      }
    },
    nextMap() {
      this.$parent.showBuildings();
    },
    async levelUp() {
      const check = await this.land.updateResource(this.holeSelected, this.player.$state.authKey);

      this.upgradeResources = [];
      if (check === null) {
        this.message = 'Upgrade in queue ...';
        this.$parent.refresh();
      } else {
        this.message = check;
      }
    }
  },
  beforeMount() {
    for (const el of this.gamemaster.$state.lands.type) {
      if (this.landType === el.typeId)  this.imageSrc = el.src;
    }
  },
  watch: {
    landType: function(newVal) {
      for (const el of this.gamemaster.$state.lands.type) {
        if (newVal === el.typeId)  this.imageSrc = el.src;
      }
    }
  }
}
</script>

<style scoped>
.labels {
  font-weight: 550 !important;
  font-size: 28px;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.distribution-map {
  position: relative;
  width: 65%;
  box-sizing: border-box;
}

.distribution-map > img {
  width: 100%;
  position: relative;
  margin: 0;
  padding: 0;
}

.rombo {
  width: 99px;
  height: 112px;
  border: 0px solid #555;
  background-color: rgb(255, 255, 255, 0.1);
  position: absolute;
  transform: rotate(46deg) skew(-15deg, -16deg);
  top: 29%;
  left: 44%;
  display: block;
  margin: 0;
  padding: 0;
  outline: none;
}

.rombo:hover {
  background-color: rgb(255, 255, 255, 0.4);
}

.distribution-map .map-point {
  cursor: pointer;
  outline: none;
  z-index: 0;
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border-width: 0;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255, 0.3);
}

.hover:hover {
  background-color: rgb(255, 255, 255, 0.7);
}

.descr {
  width: 25%;
}

.error_mess {
  color: red;
}

h3 {
  font-weight: bold;
  font-size: 18px;
  margin: 0 0 1em;
}

.home1 {
  background: #f8f4e5;
  border: 2px solid black;
  box-shadow: 8px 8px 1px #FFC174, 8px 8px 1px 1px black;
}

.home3 {
  padding-top: 1em;
  padding-bottom: 1em;
  background: #f8f4e5;
  border: 2px solid black;
  justify-content: center;
}

.home {
  margin-top: 1em;
  min-height: 25em;
  justify-content: space-around;
  align-items: center;
}

p {
  font-size: 15px;
  padding: 0;
  margin: 0;
}

.button{
  color: #1a1a1a;
  display: block;
  margin: 1em;
  padding: 0 20px;
  background: #FFC174;
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 1px solid black;
  width: 35%;
}

.button:hover {
  background: #fa8d29;
}

.width {
  margin-left: 3%;
  width: 80%;
}

.imgCost {
  height: auto;
  width: auto;
  min-width: 60%;
  min-height: 60%;
  max-width: 60%;
  max-height: 60%;
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

</style>