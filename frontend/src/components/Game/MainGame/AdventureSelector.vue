<template>
  <!-- ADVENTURE SELECTOR COMPONENT -->
  <div class="home">
    <div class="home2">
      <div v-for="(ad, index) in this.adventures" class="adv" :key="ad.name">
        <p class="fw-bold">{{ ad.name }} ({{ ad.difficulty }})</p>
        <p>Time: {{ new Date(ad.time * 1000).toISOString().substr(11, 8) }}</p>
        <button class="button" @click="click(index)">Go</button>
      </div>
    </div>
    <p class="error" v-if="this.message !== ''">{{ message }}</p>
  </div>
</template>

<script>
import { gamemaster } from "@/stores/gamemaster.js"
import { land } from "@/stores/land.js"
import { player } from "@/stores/player.js"

export default {
  name: 'AdventureSelector',
  props: {
  },
  data: function () {
    return {
      gamemaster: gamemaster(),
      land: land(),
      player: player(),
      adventures: [],
      message: ''
    }
  },
  methods: {
    async click(index) {
      const check = await this.land.adventure(this.player.$state.authKey, index+1);

      this.message = '';
      if (check === null) {
        this.$parent.refresh();
      } else {
        this.message = check;
      }
    }
  },
  created() {
    this.adventures = this.gamemaster.$state.adventures;
  }
}
</script>

<style scoped>
h3 {
  margin: 0;
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

p {
  margin: 0;
}

.error {
  color: red;
}

.home {
  display: flex;
  background: #f8f4e5;
  border: 2px solid black;
  padding: 1em;
  flex-direction: column;
  min-width: 50em;
}

.home2 {
  display: flex;
  justify-content: space-around;
}

p {
  font-size: 13px;
  padding: 0;
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

.adv {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>