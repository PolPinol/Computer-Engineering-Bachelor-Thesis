<template>
  <div class="container home">

    <div class="left-container">
      <div v-if="adventures.length === 0">
        <p>No adventures yet.</p>
      </div>

      <div v-if="adventures.length !== 0">
        <h3>Adventures:</h3>
        <div class="scrollQueueC">
          <div class="tbl">
            <div v-for="ad in adventures" :key="ad.name" class="flexi">
              <table>
                <tr class="fw-normal">Name: {{ ad.name }}</tr>
                <tr class="fw-normal">Difficulty: {{ ad.difficulty }}</tr>
                <tr class="fw-normal">Time: {{ad.time}}</tr>
                <tr class="fw-normal">Attack: {{ ad.attack }}</tr>
                <tr class="fw-normal">Life: {{ ad.life }}</tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-container">
      <h3>Add new adventure:</h3>

      <form @submit.prevent="add">
        <div class="form-group">
          <label for="name">Name</label>
          <input v-model="name" type="text" class="insert" id="floatingInput" name="name" placeholder="String" required>
        </div>
        <br/>

        <div class="form-group">
          <label for="difficulty">Difficulty</label>
          <input v-model="difficulty" type="text" class="insert" id="floatingInput" name="difficulty" placeholder="Integer" required>
        </div>
        <br/>

        <div class="form-group">
          <label for="time">Time</label>
          <input v-model="time" type="text" class="insert" id="floatingInput" name="time" placeholder="Integer" required>
        </div>
        <br/>

        <div class="form-group">
          <label for="attack">Attack</label>
          <input v-model="attack" type="text" class="insert" id="floatingInput" name="attack" placeholder="Integer" required>
        </div>
        <br/>

        <div class="form-group">
          <label for="life">Life</label>
          <input v-model="life" type="text" class="insert" id="floatingInput" name="life" placeholder="Integer" required>
        </div>
        <br/>

        <div class="flexcen">
          <div class="flexd">
            <div class="flexc" v-for="(res, index) in this.resourcesData" :key="res.resourceId">
              <input v-model="resources[index]" type="text" class="insert" id="floatingInput" placeholder="Integer" required>
              <img class="imgCost" :src="res.src" alt="">
            </div>
          </div>
        </div>

        <input type="submit" class="button2" value="Add">
      </form>
    </div>
    <p class="error">{{message}}</p>
  </div>
</template>

<script>
import {gamemaster} from "@/stores/gamemaster";
import {player} from "@/stores/player";

export default {
  name: 'AdventureEdit',
  props: {
    msg: String
  },
  data: function () {
    return {
      gamemaster: gamemaster(),
      player: player(),
      adventures: [],
      name: "",
      difficulty: "",
      time: "",
      attack: "",
      life: "",
      resources: [],
      message: "",
      resourcesData: []
    }
  },
  methods: {
    async add() {
      let res = [];
      for (let i = 0; i < this.resourcesData.length; i++) {
          res[i] = {
            type: this.resourcesData[i].resourceId,
            quantity: parseInt(this.resources[i])
          }
      }

      let adventure = {
        name: this.name,
        difficulty: parseInt(this.difficulty),
        attack: parseInt(this.attack),
        life: parseInt(this.life),
        time: parseInt(this.time),
        resources: res
      }

      const check = await this.gamemaster.addAdventure(adventure, this.player.$state.authKey);
      if (check === null) {
        // refresh
      } else {
        this.message = check;
      }
    }
  },
  created() {
    this.adventures = this.gamemaster.$state.adventures;
    this.resourcesData = this.gamemaster.$state.resources;
  }
}
</script>

<style scoped>
h3 {
  margin: 0 0 2em;
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

.home {
  width: 100%;
  background: #f8f4e5;
  border: 2px solid black;
  justify-content: center;
  padding: 20px 50px !important;
  min-height: 50%;
  max-height: 50%;
  margin-top: 2% !important;
}

.container {
  width: 90% !important;
}

.tbl {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

h3 {
  font-weight: bold;
  font-size: 18px;
}

th, td {
  padding: 0 0.5em;
  font-size: 13px;
}

p {
  font-size: 13px;
  padding: 0;
  margin: 0;
}


.left {
  text-align:left;
}

.scrollQueueC {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-height: 30em;
}

.left-container{
  width: 50%;
  float: left;
}

.right-container{
  width: 50%;
  float: right;
}

table {
  width: 90%;
  border-collapse: collapse;
  margin: 0 auto 1em;
}

.flexi {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #7b7b7b;
  margin-bottom: 1em;
}

.button{
  color: #1a1a1a;
  display: block;
  padding: 0 20px;
  background: #fc152c;
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 1px solid black;
  margin: 1em 1em 0;
  height: fit-content;
}

.button:hover {
  background: #aa0919;
}

.error {
  color: red;
  font-size: 13px;
  padding: 0;
  margin: 0;
}

.insert{
  display: block;
  width: 80%;
  border: none;
  border-bottom: 2px solid black;
  background: #f8f4e5;
  padding-left: 5px;
  outline: none;
  color: black;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button2{
  color: #1a1a1a;
  display: block;
  padding: 0 20px;
  background: #FFC174;
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 1px solid black;
  margin: 1em 1em 0;
  height: fit-content;
}

.button2:hover {
  background: #FFA971;
}

.form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding-left: 2em;
}

.container {
  min-height: 38em !important;
  height: fit-content !important;
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

.imgCost {
  height: auto;
  width: auto;
  min-width: 60%;
  min-height: 60%;
  max-width: 60%;
  max-height: 60%;
}

.flexcen {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>