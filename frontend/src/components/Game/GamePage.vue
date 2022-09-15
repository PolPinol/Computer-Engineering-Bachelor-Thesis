<template>
  <!-- MAIN GAME PAGE WITH ALL COMPONENTS -->
  <div class="height">
    <!-- LOGO OF THE GAME -->
    <div class="logo">
      <img src="@/assets/logo.png" alt="">
    </div>

    <!-- NAVIGATION BUTTONS -->
    <div>
      <div class="config1">
        <button class="button buttonHome" v-on:click="showHomeGame()"><i class="material-icons">home</i></button>
      </div>

      <div class="config2">
        <button class="button buttonHome" v-on:click="showRanking()"><i class="material-icons">assessment</i></button>
      </div>

      <div class="config3">
        <button class="button buttonTimeline" v-on:click="showTimeline()"><i class="material-icons">history</i></button>
      </div>

      <div class="config4">
        <button class="button buttonLogout" v-on:click="popup()"><i class="material-icons">exit_to_app</i></button>
      </div>
    </div>

    <!-- RANKING POPUP -->
    <RankingPage v-if="visualGameMode === 3"/>

    <!-- TIMELINE POPUP -->
    <TimeLinePage v-bind:timeline="this.land.$state.landData.timeline" v-if="visualGameMode === 2"/>

    <!-- LANDS NAVIGATION COMPONENT -->
    <LandsNavigation v-if="visualGameMode !== -1" v-bind:name="this.land.$state.landData.name" v-bind:lands-id="this.player.$state.lands"/>

    <!-- RESOURCES + TROOPS QUANTITY COMPONENTS -->
    <div class="flexx container">
      <ResourcesQuantity v-if="visualGameMode !== -1" v-bind:resources="this.land.$state.landData.resources" v-bind:productions="this.land.$state.landData.productions"/>
      <TroopsQuantity v-if="visualGameMode !== -1" v-bind:troops-quantity="this.land.$state.landData.troops"/>
    </div>

    <!-- MAIN CONTAINER OF THE GAME -->
    <div v-if="visualGameMode !== -1" class="containerBig">
      <!-- QUEUES COMPONENTS -->
      <div class="flexi">
        <QueueAdventures v-if="visualGameMode !== -1" v-bind:events-time="this.land.$state.landData.eventsTime"/>
        <QueueConstructions v-if="visualGameMode !== -1" v-bind:events-time="this.land.$state.landData.eventsTime"/>
      </div>

      <!-- RESOURCES FIELDS COMPONENT -->
      <ResourcesFields v-bind:resources-fields="this.land.$state.landData.resourcesFields" v-bind:land-type="this.land.$state.landData.landType" v-if="visualGameMode !== 4"/>

      <!-- BUILDINGS FIELDS COMPONENT -->
      <BuildingsFields v-bind:buildings-fields="this.land.$state.landData.buildingsFields" v-bind:pyramid-level="this.land.$state.landData.pyramidLevel" v-if="visualGameMode === 4"/>
    </div>

    <!-- ADVENTURE SELECTOR COMPONENT -->
    <div class="d-flex justify-content-around align-self-center container">
      <AdventureSelector v-if="visualGameMode !== -1" />
    </div>
  </div>

  <!-- LOGOUT POPUP -->
  <div ref="pop" class="overlay3">
    <div class="overlay4" @click="unpopup()">
    </div>
    <div class="popup2">
      <h2>Close session</h2>
      <p>Are you sure to logout?</p>
      <a @click="unpopup()" class="close">&times;</a>
      <button class="but" @click="logout()">Logout</button>
    </div>
  </div>

</template>

<script>
import { gamemaster } from "@/stores/gamemaster.js"
import { player } from "@/stores/player.js"
import { land } from "@/stores/land.js"
import QueueConstructions from "@/components/Game/MainGame/QueueConstructions";
import ResourcesQuantity from "@/components/Game/MainGame/ResourcesQuantity";
import LandsNavigation from "@/components/Game/MainGame/LandsNavigation";
import ResourcesFields from "@/components/Game/MainGame/ResourcesFields";
import BuildingsFields from "@/components/Game/MainGame/BuildingsFields";
import TroopsQuantity from "@/components/Game/MainGame/TroopsQuantity";
import QueueAdventures from "@/components/Game/MainGame/QueueAdventures";
import AdventureSelector from "@/components/Game/MainGame/AdventureSelector";
import RankingPage from "@/components/Game/Ranking/RankingPage";
import TimeLinePage from "@/components/Game/Timeline/TimeLinePage";

export default {
  name: 'GamePage',
  components: {
    AdventureSelector,
    ResourcesQuantity,
    QueueConstructions,
    LandsNavigation,
    ResourcesFields,
    BuildingsFields,
    TroopsQuantity,
    QueueAdventures,
    RankingPage,
    TimeLinePage
  },
  data: function () {
    return {
      message: "",
      gamemaster: gamemaster(),
      player: player(),
      land: land(),
      visualGameMode: -1,
      loaded: false,
      render: 0
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
    showHomeGame() {
      this.refresh();
      this.visualGameMode = 0;
    },
    showBuildings() {
      this.visualGameMode = 4;
    },
    showTimeline() {
      this.visualGameMode = 2;
    },
    async showRanking() {
      await this.player.getPosition();
      await this.player.getRanking();
      this.visualGameMode = 3;
    },
    logout() {
      document.cookie = 'authKey=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      this.$parent.showHomePage();
    },
    refresh() {
      this.land.refreshLand(this.player.$state.authKey);
    },
    refreshAll() {
      this.land.refreshLand(this.player.$state.authKey);
      this.player.refreshLands();
    },
    async changeLand(landId) {
      await this.land.getLandInfo(landId, this.player.$state.authKey);
      this.visualGameMode = 0;
    }
  },
  async beforeMount() {
    const firstLandId = await this.player.getLandsId();
    await this.land.getLandInfo(firstLandId, this.player.$state.authKey);
    this.visualGameMode = 0;
  }
}
</script>

<style scoped>
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
a {
  color: #42b983;
}

.logo {
  position:absolute;
  top: 4%;
  left: 1%;
}

img {
  width: 12em;
}

.config1 {
  position:absolute;
  top: 4%;
  left: 87%;
  z-index: 110;
}

.config2 {
  position:absolute;
  top: 4%;
  left: 90%;
  z-index: 110;
}

.config3 {
  position:absolute;
  top: 4%;
  left: 93%;
  z-index: 110;
}

.config4 {
  position:absolute;
  top: 4%;
  left: 96%;
  z-index: 110;
}

.button{
  display: block;
  margin: 0 auto;
  padding: 2px 7px;
  background: rgb(0,0,0,0);
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 0 solid black;
}

i:hover {
  opacity: 0.5;
}

.containerBig {
  width: 100%;
  padding-right: var(--bs-gutter-x, 0.75rem);
  padding-left: var(--bs-gutter-x, 2rem);
  margin-right: auto;
  margin-left: auto;
  display: flex;
  align-items: center;
  min-height: 550px;
}

.flexi {
  display: flex;
  min-height: 550px;
  max-height: 550px;
  flex-direction: column;
  align-content: stretch;
  justify-content: center;
  align-items: center;
  width: 20%;
}

.flexx {
  display: flex;
  justify-content: space-between;
  margin-top: 4em;
}

.overlay4 {
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

.overlay3 {
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

.overlay3:target {
  visibility: visible;
  opacity: 1;
}

.popup2 {
  position: absolute;
  background: #f8f4e5;
  border: 2px solid black;
  box-shadow: 8px 8px 1px #FFC174, 8px 8px 1px 1px black;
  width: 20%;
  justify-content: center;
  align-items: center;
  z-index: 200;
  min-height: 10em;
  padding: 1em;
  display: flex;
  flex-direction: column;
}

.popup2 h2 {
  margin-top: 0;
  color: #333;
  font-family: Tahoma, Arial, sans-serif;
}
.popup2 .close {
  position: absolute;
  top: 10px;
  right: 30px;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  cursor: pointer;
}
.popup2 .close:hover {
  color: #FFC174;
}
.popup2 .content {
  max-height: 30%;
  overflow: auto;
}

.but{
  color: #1a1a1a;
  display: block;
  padding: 0 20px;
  background: #FFC174;
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 1px solid black;
  margin: 1em;
}

.but:hover {
  background: #fa8d29;
}

</style>