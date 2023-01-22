<template>
  <div class="container home">

    <div class="left-container">
      <div v-if="resources.length === 0">
        <p>No resources yet.</p>
      </div>

      <div v-if="resources.length !== 0">
        <h3>Resources:</h3>
        <div class="scrollQueueC">
          <div class="tbl">
            <div v-for="item in resources" :key="item.resourceId" class="flexi">
              <table>
                <tr class="fw-normal">ResourceId: {{ item.resourceId }}</tr>
                <tr class="fw-normal">Name: {{ item.name }}</tr>
                <img class="buildingDescr" v-bind:src="item.src">
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-container">
      <h3>Add new resources:</h3>

      <form @submit.prevent="add">
        <div class="form-group">
          <label for="resourceId">ResourceId</label>
          <input v-model="resourceId" type="text" class="insert" id="floatingInput" name="resourceId" placeholder="String" required>
        </div>
        <br/>

        <div class="form-group">
          <label for="name">Name</label>
          <input v-model="name" type="text" class="insert" id="floatingInput" name="name" placeholder="String" required>
        </div>
        <br/>

        <div class="form-group">
          <label for="src">Src</label>
          <input v-model="src" type="text" class="insert" id="floatingInput" name="src" placeholder="String" required>
        </div>
        <br/>




        <div class="form-group">
          <label for="upgrades">Upgrades</label>
          <div class="scrollQueueC2">
            <div class="flexc" v-for="up in this.upgrades" :key="up.level">
              <div class="desUp">
                <div>Level: {{up.level}}</div>
                <div>Time: {{up.time}}</div>
                <div>Production: {{up.production}}</div>
              </div>
              <div class="flexd">
                <div class="flexc" v-for="(res, index) in up.resources" :key="res.type">
                  <p>{{res.quantity}}</p>
                  <img class="imgCost" :src="this.resourcesData[index].src" alt="">
                </div>
              </div>
            </div>

            <div class="flexx">
              <hr>
              <div>
                <div class="form-group">
                  <label for="prod">Production</label>
                  <input v-model="prod" type="text" class="insert" id="floatingInput" name="prod" placeholder="Integer">
                </div>

                <div class="form-group">
                  <label for="time">Time</label>
                  <input v-model="time" type="text" class="insert" id="floatingInput" name="time" placeholder="Integer">
                </div>
              </div>
              <div class="flexd">
                <div class="flexc" v-for="(res, index) in this.resourcesData" :key="res.resourceId">
                  <input v-model="this.resourcesUpgrade[index]" type="text" class="insert" id="floatingInput" placeholder="Integer">
                  <img class="imgCost" :src="res.src" alt="">
                </div>
                <button type="button" class="button3" v-on:click="update()">+</button>
              </div>
            </div>
          </div>
        </div>
        <br/>




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
  name: 'ResourceEdit',
  props: {
    msg: String
  },
  data: function () {
    return {
      gamemaster: gamemaster(),
      player: player(),
      resources: [],
      resourceId: "",
      name: "",
      src: "",
      upgrades: [],
      message: "",
      resourcesUpgrade: [],
      resourcesData: [],
      level: 1,
      prod: "",
      time: ""
    }
  },
  methods: {
    async add() {
      let obj = {
        resourceId: this.resourceId,
        name: this.name,
        src: this.src,
        upgrades: this.upgrades
      }

      const check = await this.gamemaster.addResource(obj, this.player.$state.authKey);
      if (check === null) {
        // refresh
      } else {
        this.message = check;
      }
    },
    update() {
      let res = [];
      for (let i = 0; i < this.resourcesUpgrade.length; i++) {
        let obj = {
          type: this.resourcesData[i].resourceId,
          quantity: this.resourcesUpgrade[i]
        }
        res.push(obj);
      }

      let obj = {
        level: this.level,
        resources: res,
        time: parseInt(this.time),
        production: parseInt(this.prod)
      }

      // append obj to upgrades
      this.upgrades.push(obj);

      this.prod = "";
      this.time = "";
      this.resourcesUpgrade = [];
      this.level++;
    }
  },
  created() {
    this.resources = this.gamemaster.$state.resources;
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

.scrollQueueC2 {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-height: 16em;
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

.buildingDescr {
  width: 20%;
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

.flexx {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.imgCost {
  height: auto;
  width: auto;
  min-width: 30%;
  min-height: 30%;
  max-width: 30%;
  max-height: 30%;
}

.desUp {
  display: flex;
  flex-direction: row;
  font-size: 13px;
  justify-content: space-evenly;
  width: 100%;
}

</style>