<template>
  <!-- RESOURCES QUANTITY COMPONENT -->
  <div class="flexa">
    <div class="columni" v-for="(resource, index) in resources" v-bind:key="resource.resourceId">
      <img :src="this.defaultSrc[index]" alt="">
      <div>
        <p class="fw-bold">{{ resource.quantity.toLocaleString('es') }}</p>
        <div v-for="prod in productions" v-bind:key="prod.type">
          <span v-if="resource.type === prod.type">(+{{ prod.production.toLocaleString('es') }} / s)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gamemaster } from "@/stores/gamemaster.js"

export default {
  name: "ResourcesQuantity",
  props: {
    resources: undefined,
    productions: undefined
  },
  data: function () {
    return {
      gamemaster: gamemaster(),
      resourceInfo: undefined,
      defaultSrc: []
    }
  },
  methods: {
    clear() {
      const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

      // Clear any timeout/interval up to that id
      for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
      }
    }
  },
  created() {
    this.clear();

    // get src info about resources
    const info = this.gamemaster.$state.resources;

    let it = 0;
    for (const res of this.resources) {
      for (const resInfo of info) {
        if (res.type === resInfo.resourceId) {
          this.defaultSrc[it] = resInfo.src;
          it++;
        }
      }
    }

    for (const res of this.resources) {
      for (const prod of this.productions) {
        if (res.type === prod.type) {
          window.setInterval(() => {
            res.quantity = parseInt(res.quantity) + parseInt(prod.production);
          }, 1000);
        }
      }
    }
  },
  watch: {
    resources: function(newVal) {
      this.clear();

      for (const res of newVal) {
        for (const prod of this.productions) {
          if (res.type === prod.type) {
            window.setInterval(() => {
              res.quantity = parseInt(res.quantity) + parseInt(prod.production);
            }, 1000);
          }
        }
      }
    }
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

img {
  margin-right: 1em;
  height: auto;
  width: auto;
  min-width: 40%;
  min-height: 60%;
  max-width: 40%;
  max-height: 60%;
}

.columni {
  display: flex;
}

p {
  margin: 0;
}

.flexa {
  display: flex;
  align-items: center;
  width: 45%;
}

</style>