<template>
  <!-- TROOPS QUANTITY COMPONENT -->
  <div class="flexb">
    <div v-for="(troop, index) in this.troops" v-bind:key="troop.troopId">
      <img :src="troop.src" class="troop">
      <span class="fw-bold" v-if="quantity.length !== 0">{{ quantity[index].quantity }}</span>
    </div>
  </div>
</template>

<script>
import { gamemaster } from "@/stores/gamemaster.js"

export default {
  name: "TroopsQuantity",
  props: {
    troopsQuantity: undefined
  },
  data: function () {
    return {
      gamemaster: gamemaster(),
      quantity: [],
      troops: []
    }
  },
  methods: {
    update(quant) {
      this.troops = [];
      this.quantity = [];
      this.troops = this.gamemaster.$state.troops;

      for (const allTroops of this.troops) {
        const obj = {};
        obj.troopId = allTroops.troopId;
        obj.name = allTroops.name;
        obj.src = allTroops.src;
        obj.life = allTroops.life;
        obj.attackDamage = allTroops.attackDamage;
        obj.mobility = allTroops.mobility;
        let it = 0;
        for (const trQuantity of quant) {
          if (allTroops.troopId === trQuantity.troopId) {
            obj.quantity = trQuantity.quantity;
            it++;
            break;
          }
        }

        if (it === 0) {
          obj.quantity = 0;
        }

        this.quantity.push(obj);
      }
    }
  },
  created() {
    this.update(this.troopsQuantity);
  },
  watch: {
    troopsQuantity: function(newVal) {
      this.update(newVal);
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

.troop {
  width: 20%;
  margin-right: 10%;
}

img {
  height: auto;
  width: auto;
  min-width: 30%;
  min-height: 30%;
  max-width: 30%;
  max-height: 30%;
}

.flexb {
  display: flex;
  align-items: center;
  width: 45%;
}

</style>