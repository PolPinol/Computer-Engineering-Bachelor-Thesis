<template>
  <!-- TIMELINE POPUP -->
  <div class="overlay">
    <div class="overlay2" @click="back()"></div>

    <div class="home">
      <a @click="back()" class="close">&times;</a>
      <h3>TIMELINE</h3>
      <p v-if="logs.length === 0">There are no logs yet.</p>
      <div class="scroll">
        <div class="tbl">
          <table>
            <tr v-for="log in logs" :key="log.time">
              <th class="fw-normal">[{{ log.time }}]</th>
              <th class="fw-normal left">{{ log.log }}</th>
              <hr>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeLinePage',
  props: {
    timeline: undefined
  },
  data: function () {
    return {
      logs: []
    }
  },
  methods: {
    back() {
      this.$parent.showHomeGame();
    }
  },
  beforeMount() {
    for (const event of this.timeline) {
      this.logs.push(event);
    }

    this.logs.sort(function(a, b) {
      return new Date(b.time) - new Date(a.time);
    });

    for (const event of this.logs) {
      event.time = new Date(event.time).toLocaleString('es', { timeZone: 'Europe/Paris' });
    }
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

.home {
  position: absolute;
  transition: all 5s ease-in-out;
  background: #f8f4e5;
  border: 2px solid black;
  box-shadow: 8px 8px 1px #FFC174, 8px 8px 1px 1px black;
  width: 40%;
  justify-content: center;
  align-items: center;
  z-index: 102;
  padding: 1em;
}

.scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 35em;
  padding: 1em;
}
.tbl {
  display: flex;
  justify-content: center;
}

th, td {
  padding: 15px;
}

.left {
  text-align:left;
}

p {
  font-size: 15px;
  padding: 0;
  margin-top: 1em;
  margin-bottom: 0;
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