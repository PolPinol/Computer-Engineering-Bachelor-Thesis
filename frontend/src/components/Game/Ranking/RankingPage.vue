<template>
  <!-- TIMELINE POPUP -->
  <div class="overlay">
    <div class="overlay2" @click="back()"></div>

    <div class="home">
      <a @click="back()" class="close">&times;</a>
      <h3>Ranking Top 10</h3>
      <div class="tbl content-table">
        <table>
          <thead>
            <tr>
              <th class="fw-bold">Rank</th>
              <th class="fw-bold">Username</th>
              <th>Resources</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pos, index) in ranking" :key="pos.playerId">
              <td class="fw-normal">{{ index+1 }}</td>
              <td class="fw-normal">{{ pos._id }}</td>
              <td class="fw-normal">{{ pos.val }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="fw-bold">Your current position is {{ position }}</p>
    </div>
  </div>

</template>

<script>
import { player } from "@/stores/player.js"

export default {
  name: 'RankingPage',
  props: {
  },
  data: function () {
    return {
      ranking: [],
      player: player(),
      position: 0
    }
  },
  methods: {
    back() {
      this.$parent.showHomeGame();
    }
  },
  beforeMount() {
    this.position = this.player.$state.position;
    this.ranking = this.player.$state.ranking;
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

.overlay2 {
  display: flex;
  z-index: 100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0);
  transition: opacity 500ms;
  opacity: 1;
  justify-content: center;
  align-items: center;
}

.overlay {
  display: flex;
  z-index: 100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  transition: opacity 500ms;
  opacity: 1;
  justify-content: center;
  align-items: center;
}

.home {
  z-index: 102;
  position: absolute;
  transition: all 5s ease-in-out;
  background: #f8f4e5;
  border: 2px solid black;
  box-shadow: 8px 8px 1px #FFC174, 8px 8px 1px 1px black;
  width: 40%;
  justify-content: center;
  align-items: center;
  padding: 1em;
}

.tbl {
  display: flex;
  justify-content: center;
}

th, td {
  padding: 15px;
  padding-right: 4em;
  padding-left: 4em;
}

.content-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  min-width: 400px;
  border-radius: 5px 5px 0 0;
  overflow: hidden;

  width: 100%;
}

.content-table thead tr {
  color: rgba(24, 24, 24, 0.7);
  text-align: left;
  font-weight: bold;
}

.content-table th,
.content-table td {
  padding: 12px 15px;
}

p {
  font-size: 13px;
  padding: 0;
  margin: 1em;
}

.close {
  position: absolute;
  top: 5px;
  right: 30px;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  z-index: 220;
  cursor: pointer;
}

.close:hover {
  color: #FFC174;
}


</style>