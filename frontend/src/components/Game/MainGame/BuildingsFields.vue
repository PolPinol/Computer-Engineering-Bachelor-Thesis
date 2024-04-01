<template>
  <!-- MAP WITH ALL BUILDING FIELDS COMPONENT-->
  <div class="width">
    <div class="d-flex home">
      <!-- ARROW TO GET TO RESOURCES MAP -->
      <div class="config5">
        <button class="button2" v-on:click="this.$parent.showHomeGame()"><i class="material-icons">arrow_back</i></button>
      </div>

      <!-- MAP WITH ALL THE BUILDINGS -->
      <div class="distribution-map">
        <img src="@/assets/map3.png" alt=""/>
        <li v-for="(item, index) in buildings" :key="item.nField">
          <img class="building" v-bind:src="item.src" :style="'top:' + coordsTop[item.nField-1] + '%;left:' + coordsLeft[item.nField-1] + '%;z-index: ' + zindexs[item.nField-1]">
          <button ref="items" @click="mark(item)" class="rombo" v-bind:style="'top:' + coordsTop[item.nField-1] + '%;left:' + coordsLeft[item.nField-1] + '%;'"></button>
          <img class="pyramid" v-if="index === 14" v-bind:src="pyramidInfo.src">
          <button ref="items-2" v-if="index === 14" @click="pyramidMark()" class="rombo-pyramid"></button>
        </li>
      </div>

      <!-- POPUP RIGHT TO MAP INFORMATION ABOUT BUILDINGS -->
      <div class="d-flex align-content-center row descr home3">
        <p v-if="buildInfo.length === 0 && upgradeResources.length === 0 && upgradePyramidResources.length === 0 && actionResources.length === 0">Select a hole to build or level up.</p>

        <!-- Upgrade Pyramid information -->
        <h3 class="fw-bold" v-if="upgradePyramidResources.length !== 0">Upgrade Pyramid</h3>
        <img v-if="upgradePyramidResources.length !== 0" class="pyradDescr" v-bind:src="pyramidUpgrade.src">
        <div class="flexd">
          <div class="flexc" v-for="(res, index) in this.upgradePyramidResources" :key="res.type">
            <p>{{ res.quantity.toLocaleString('es') }}</p>
            <img class="imgCost" :src="this.resources[index].src" alt="">
          </div>
        </div>
        <p v-if="upgradePyramidResources.length !== 0">Level: {{ pyramidUpgrade.level - 1 }} &rarr; {{ pyramidUpgrade.level }}</p>
        <p v-if="upgradePyramidResources.length !== 0">Bonus Production: {{ parseInt((parseFloat(pyramidUpgrade.prodBefore) - 1)*100) }} % &rarr; {{ parseInt((parseFloat(pyramidUpgrade.prodAfter) - 1)*100) }} %</p>
        <p v-if="upgradePyramidResources.length !== 0">&#128337; {{ pyramidUpgrade.time }}</p>
        <button class="button" @click="levelUpPyramid()" v-if="upgradePyramidResources.length !== 0">Level Up</button>

        <!-- Upgrade information -->
        <h3 class="fw-bold" v-if="upgradeResources.length !== 0">Upgrade {{ upgradeInfo.name }}</h3>
        <img v-if="upgradeResources.length !== 0" class="buildingDescr" v-bind:src="upgradeInfo.src">
        <p v-if="upgradeResources.length !== 0" class="description">{{ upgradeInfo.description }}</p>
        <div class="flexd">
          <div class="flexc" v-for="(res, index) in this.upgradeResources" :key="res.type">
            <p>{{ res.quantity.toLocaleString('es') }}</p>
            <img class="imgCost" :src="this.resources[index].src" alt="">
          </div>
        </div>
        <p v-if="upgradeResources.length !== 0">Level: {{ upgradeInfo.level - 1 }} &rarr; {{ upgradeInfo.level }}</p>
        <p v-if="upgradeResources.length !== 0">&#128337; {{ upgradeInfo.time }}</p>
        <button class="button" @click="levelUp()" v-if="upgradeResources.length !== 0">Level Up</button>

        <!-- Build information -->
        <div class="scroll" id="style-1">
          <li class="lidata" v-for="item in buildInfo" :key="item.buildingId">
            <h3 class="fw-bold h4">{{ item.name }}</h3>
            <img class="buildingDescr" v-bind:src="item.src">
            <p class="description">{{ item.description }}</p>
            <div class="flexd">
              <div class="flexc" v-for="(res, index) in item.resources" :key="res.type">
                <p>{{ res.quantity.toLocaleString('es') }}</p>
                <img class="imgCost" :src="this.resources[index].src" alt="">
              </div>
            </div>
            <p>&#128337; {{ item.time }}</p>
            <button class="button" @click="build(item.buildingId)">Build</button>
            <hr>
          </li>
        </div>

        <!-- Action information -->
        <p class="fw-bold" v-if="actionResources.length !== 0">{{ action.name }}</p>
        <img v-if="actionResources.length !== 0" class="troop" v-bind:src="action.src">
        <div class="flexd">
          <div class="flexc" v-for="(res, index) in this.actionResources" :key="res.type">
            <p>{{ res.quantity.toLocaleString('es') }}</p>
            <img class="imgCost" :src="this.resources[index].src" alt="">
          </div>
        </div>
        <div class="inputflex">
          <input v-if="actionResources.length !== 0" type="text" v-model="quantity">
          <button class="button" @click="recruit()" v-if="actionResources.length !== 0">Recruit</button>
        </div>

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
  name: 'BuildingsFields',
  props: {
    buildingsFields: undefined,
    pyramidLevel: undefined
  },
  data: function () {
    return {
      message: '',
      coordsTop:   [-3, -4, -5,  9,  8,  7,  6, 21, 20, 18, 17, 33, 32, 29, 28, 44, 43, 41, 40, 55, 54, 53, 52, 66, 65, 64],
      coordsLeft: [30,  47, 64, 21, 38, 55, 72, 12, 29, 63, 80,  3, 20, 71, 88, 11, 28, 62, 79, 19, 36, 53, 70, 27, 44, 61],
      zindexs: [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7],
      buildings: [],
      holeSelected: -1,
      pyramidInfo: { "src": ''},
      upgradeInfo: {},
      buildInfo: [],
      land: land(),
      player: player(),
      gamemaster: gamemaster(),
      resources: [],
      upgradeResources: [],
      buildingId: '',
      pyramidUpgrade: [],
      upgradePyramidResources: [],
      actionResources: [],
      action: {},
      quantity: 0
    }
  },
  methods: {
    async levelUp() {
      // click on event upgrade
      const check = await this.land.upgradeBuilding(this.holeSelected, this.buildingId, this.player.$state.authKey);

      this.buildingData = [];
      this.upgradeInfo = [];
      this.buildInfo = [];
      this.upgradeResources = [];
      this.upgradePyramidResources = [];
      this.action = {};
      this.actionResources = [];
      if (check === null) {
        this.message = 'Upgrade in queue ...';
        this.$parent.refresh();
      } else {
        this.message = check;
      }
    },
    async build(buildingId) {
      const check = await this.land.build(buildingId, this.holeSelected, this.player.$state.authKey);

      this.buildingData = [];
      this.upgradeInfo = [];
      this.buildInfo = [];
      this.upgradeResources = [];
      this.upgradePyramidResources = [];
      this.action = {};
      this.actionResources = [];
      if (check === null) {
        this.message = 'Build in queue ...';
        this.$parent.refresh();
      } else {
        this.message = check;
      }
    },
    async levelUpPyramid() {
      const check = await this.land.upgradePyramid(this.player.$state.authKey);

      this.buildingData = [];
      this.upgradeInfo = [];
      this.buildInfo = [];
      this.upgradeResources = [];
      this.upgradePyramidResources = [];
      this.action = {};
      this.actionResources = [];
      if (check === null) {
        this.message = 'Upgrade in queue ...';
        this.$parent.refresh();
      } else {
        this.message = check;
      }
    },
    pyramidMark() {
      this.buildingData = [];
      this.upgradeInfo = [];
      this.buildInfo = [];
      this.upgradeResources = [];
      this.upgradePyramidResources = [];
      this.action = {};
      this.actionResources = [];

      // check is pyramid is upgrading
      let isUpgrading = false;
      for (const event of this.land.$state.landData.eventsTime) {
        if (event.type === 'upgrade_pyramid') {
          isUpgrading = true;
        }
      }

      if (!isUpgrading) {
        const level = this.land.$state.landData.pyramidLevel;
        if (level >= this.gamemaster.$state.pyramid.upgrades.length) {
          this.message = 'Max level';
        } else {
          const upgrade = this.gamemaster.$state.pyramid.upgrades[level];
          const preUpgrade = this.gamemaster.$state.pyramid.upgrades[level-1];

          this.pyramidUpgrade.src = upgrade.src;
          this.message = '';
          this.pyramidUpgrade.level = upgrade.level;
          this.upgradePyramidResources = upgrade.resources;
          this.pyramidUpgrade.prodBefore = preUpgrade.bonusProd;
          this.pyramidUpgrade.prodAfter = upgrade.bonusProd;
          this.resources = this.gamemaster.$state.resources;
          this.pyramidUpgrade.time = new Date(upgrade.time * 1000).toISOString().substr(11, 8);
        }
      } else {
        this.message = 'Upgrade in queue ...';
      }
    },
    mark(item) {
      // mark item

      this.holeSelected = item.nField;
      this.buildingId = item.type;
      
      // item -> nField, type, level, src

      let isUpgrading = false;
      for (const event of this.land.$state.landData.eventsTime) {
        if (event.type === 'build' && event.nField === item.nField) {
          isUpgrading = true;
        } else if (event.type === 'upgrade_build' && event.nField === item.nField) {
          isUpgrading = true;
        }
      }

      if (!isUpgrading) {
        this.message = '';
        if (item.level === 0) {
          // Case build
          this.buildingData = [];
          this.upgradeInfo = [];
          this.buildInfo = [];
          this.upgradeResources = [];
          this.upgradePyramidResources = [];
          this.action = {};
          this.actionResources = [];
          this.resources = this.gamemaster.$state.resources;

          for (const building of this.gamemaster.$state.buildings) {
            const obj = {};
            obj.buildingId = building.buildingId;
            obj.name = building.name;
            obj.description = building.description;
            obj.src = building.src;
            obj.resources = building.upgrades[0].resources;
            obj.time = new Date(building.upgrades[0].time * 1000).toISOString().substr(11, 8);
            this.buildInfo.push(obj);
          }
        } else {
          // Case upgrade
          this.upgradeInfo = {};
          this.buildInfo = [];
          this.upgradePyramidResources = [];
          this.action = {};
          this.actionResources = [];

          this.resources = this.gamemaster.$state.resources;
          this.buildingData = this.gamemaster.$state.buildings;
          let upgrade = {};
          for (const buil of this.buildingData) {
            if (buil.buildingId === item.type) {
              if (buil.upgrades.length === item.level) {
                // max level
                this.buildingData = [];
                this.upgradeInfo = [];
                this.buildInfo = [];
                this.upgradeResources = [];
                this.upgradePyramidResources = [];
                this.action = {};
                this.actionResources = [];

                if (buil.action.type === 'NOT_IMPLEMENTED') {
                  this.message = 'Max level';
                } else {
                  if (buil.action.type === 'TROOP') {
                    for (const troop of this.gamemaster.$state.troops) {
                      if (troop.troopId === buil.action.troopId) {
                        this.action.name = 'Recruit ' + troop.name;
                        this.action.src = troop.src;
                        this.actionResources = troop.resources;
                      }
                    }
                  } else {
                    // Other actions TODO: v2.0
                    this.message = 'Max level';
                  }
                }

                return;
              } else {
                this.upgradeInfo.name = buil.name;
                upgrade = buil.upgrades[item.level];
                this.upgradeInfo.description = buil.description;
                this.upgradeInfo.src = buil.src;
              }
            }
          }

          this.message = '';
          this.upgradeInfo.level = upgrade.level;
          this.upgradeResources = upgrade.resources;
          this.holeSelected = item.nField;
          this.upgradeInfo.time = new Date(upgrade.time * 1000).toISOString().substr(11, 8);
        }
      } else {
        this.buildingData = [];
        this.upgradeInfo = [];
        this.buildInfo = [];
        this.upgradeResources = [];
        this.upgradePyramidResources = [];
        this.action = {};
        this.actionResources = [];
        this.message = 'Build or Upgrade in queue ...';
      }
    },
    updateBuildings(buildingsFields, pyramidLevel) {
      this.pyramidInfo.level = pyramidLevel;
      this.pyramidInfo.src = this.gamemaster.$state.pyramid.upgrades[this.pyramidInfo.level-1].src;

      for (let i = 1; i < 27; i++) {
        let check = false;
        for (const building of buildingsFields) {
          if (building.nField === i) {
            const obj = {};
            obj.nField = building.nField;
            obj.type = building.type;
            obj.level = building.level;
            obj.src = '../assets/buildings/empty.png'; // default in case there is an error

            for (const buildData of this.gamemaster.$state.buildings) {
              if (buildData.buildingId === obj.type) {
                obj.src = buildData.src;
                break;
              }
            }

            check = true;
            this.buildings.push(obj);
            break;
          }
        }
        if (!check) {
          // empty field
          const obj = {};
          obj.nField = i;
          obj.type = '';
          obj.level = 0;
          obj.src = '../assets/buildings/empty.png';
          this.buildings.push(obj);
        }
      }
    },
    async recruit() {
      let troopId = '';

      for (const building of this.gamemaster.$state.buildings) {
        if (building.buildingId === this.buildingId) {
          troopId = building.action.troopId;
        }
      }

      const check = await this.land.recruitTroops(this.player.$state.authKey, troopId, this.quantity);

      this.buildingData = [];
      this.upgradeInfo = [];
      this.buildInfo = [];
      this.upgradeResources = [];
      this.upgradePyramidResources = [];
      this.action = {};
      this.actionResources = [];

      if (check === null) {
        this.$parent.refresh();
      } else {
        this.message = check;
      }
    }
  },
  beforeMount() {
    this.updateBuildings(this.buildingsFields, this.pyramidLevel);
  },
  watch: {
    buildingsFields: function(newVal) {
      this.updateBuildings(newVal, this.pyramidLevel);
    },
    pyramidLevel: function(newVal) {
      this.updateBuildings(this.buildingsFields, newVal);
    }
  }
}
</script>

<style scoped>
.distribution-map {
  max-height: 350px;
  max-width: 850px;
}
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
  width: 70px;
  height: 70px;
  border: 0px solid #555;
  background-color: rgb(255, 255, 255, 0);
  position: absolute;
  transform: rotate(45deg) skew(-15deg, -15deg);
  top: 36%;
  left: 38%;
  z-index: 30;
}

.rombo-pyramid{
  top: 20%;
  left: 41%;
  width: 140px !important;
  height: 145px !important;
  border: 0px solid #555;
  background-color: rgb(255, 255, 255, 0);
  position: absolute;
  transform: rotate(45deg) skew(-15deg, -15deg);
  z-index: 30;
}

.rombo-pyramid:hover {
  background-color: rgb(255, 255, 255, 0.4);
}

.buildingDescr {
  margin: -15% 0 10% 0;
  width: 50%;
}

.troop {
  width: 40%;
  margin: 1em;
}

.pyradDescr {
  margin: -75px 0 1em;
  width: 70%;
}

.building {
  position: absolute;
  width: 140px;
  transform: translate(-25%, -45%);
}

.pyramid {
  position: absolute !important;
  width: 284px !important;
  transform: translate(-25%, -45%);
  top: 20%;
  left: 41%;
  z-index: 4;
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

.home1 {
  background: #f8f4e5;
  border: 2px solid black;
}

.scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 28em;
}


.home3 {
  padding: 1em;
  background: #f8f4e5;
  border: 2px solid black;
  justify-content: center;
}

.lidata {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.description {
  margin-bottom: 5%;
}

.width {
  margin-left: 3%;
  width: 80%;
}

.inputflex {
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  width: 20%;
}

h3 {
  font-weight: bold;
  font-size: 18px;
  margin: 0 0 1em;
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
  margin-bottom: 1em;
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

hr {
  border: 1px solid;
  width: 100%;
}

.config5 {
  position:absolute;
  top: 25%;
  left: 25%;
  z-index: 200;
}

.button2 {
  display: block;
  margin: 0 auto;
  padding: 2px 7px;
  background: rgb(0,0,0,0);
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 0 solid #ffffff;
  color: #FBC174;
}

i:hover {
  opacity: 0.5;
}

</style>