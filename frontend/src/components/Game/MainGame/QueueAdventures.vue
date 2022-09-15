<template>
  <!-- QUEUE ADVENTURES COMPONENT -->

  <!-- SHOW IF NO ADVENTURES -->
  <div v-if="events.length === 0" class="home">
    <h3>Adventures</h3>
    <p>No adventures yet.</p>
  </div>

  <!-- SHOW IF EXISTS ADVENTURES -->
  <div v-if="events.length !== 0" class="home">
    <h3>Adventures</h3>
    <div class="tbl">
      <table>
        <tr v-for="event in events" :key="event.time">
          <th class="fw-normal">[{{ event.time }}]</th>
          <th class="fw-normal left">{{ event.queue }}</th>
          <hr>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueueAdventures',
  props: {
    eventsTime: [],
  },
  data: function () {
    return {
      message: "",
      events: []
    }
  },
  methods: {
    updateEvents(eventsTime) {
      this.events = [];

      for (const event of eventsTime) {
        if (event.type === 'adventure') {
          const obj = {};
          obj.type = event.type;
          obj.queue = event.queue;

          const difTime = new Date(event.time) - new Date();

          obj.date = new Date(difTime);
          obj.seconds = Math.round(Math.abs(new Date(event.time) - new Date()) / 1000);
          if (obj.seconds >= 86400) {
            obj.time = '+24:00:00';
          } else {
            obj.time = new Date(difTime).toISOString().substr(11, 8);
          }

          this.events.push(obj);
        }
      }

      for (const event of this.events) {
        if (event.seconds < 86400) {
          window.setInterval(() => {
            const numberOfMlSeconds = event.date.getTime();
            event.date = new Date(numberOfMlSeconds - 1000);
            event.time = new Date(event.date).toISOString().substr(11, 8);

            // refresh land
            if (event.time === '23:59:59') {
              this.$parent.refresh();
            }
          }, 1000);
        }

      }
    }
  },
  beforeMount() {
    this.updateEvents(this.eventsTime);
  },
  watch: {
    eventsTime: function (newVal) {
      this.updateEvents(newVal);
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

.home {
  width: 100%;
  background: #f8f4e5;
  border: 2px solid black;
  justify-content: center;
  padding: 1em 0;
  min-height: 50%;
  max-height: 50%;
  margin-bottom: 1em;
}

.tbl {
  display: flex;
  justify-content: center;
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
</style>