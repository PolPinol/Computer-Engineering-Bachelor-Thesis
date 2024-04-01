<template>
  <!-- ADMIN PANEL PAGE -->
  <div class="container top">
    <!-- BUTTON RETURN MAIN PAGE -->
    <div class="config4">
      <button class="button2 buttonLogout" v-on:click="back()"><i class="material-icons">reply</i></button>
    </div>

    <h1>Admin Panel</h1>

    <!-- NAVIGATOR EDIT -->
    <div class="home2">
      <div class="adv">
        <button class="button" @click="showAdventureEdit()">Adventures</button>
      </div>

      <div class="adv">
        <button class="button" @click="showBuildingEdit()">Buildings</button>
      </div>

      <div class="adv">
        <button class="button" @click="showResourceEdit()">Resources</button>
      </div>

      <div class="adv">
        <button class="button" @click="showTroopEdit()">Troops</button>
      </div>
    </div>
  </div>

  <AdventureEdit v-if="visualMode === 1"/>
  <BuildingEdit v-if="visualMode === 2"/>
  <ResourceEdit v-if="visualMode === 3"/>
  <TroopEdit v-if="visualMode === 4"/>
</template>

<script>
import ResourceEdit from "@/components/Admin/ResourceEdit";
import TroopEdit from "@/components/Admin/TroopEdit";
import BuildingEdit from "@/components/Admin/BuildingEdit";
import AdventureEdit from "@/components/Admin/AdventureEdit";

export default {
  name: 'AdminPanel',
  components: {AdventureEdit, BuildingEdit, TroopEdit, ResourceEdit},
  props: {
    msg: String
  },
  data: function () {
    return {
      message: "",
      visualMode: 0
    }
  },
  methods: {
    back() {
      this.$parent.showHomePage();
    },
    showAdventureEdit() {
      this.visualMode = 1;
    },
    showBuildingEdit() {
      this.visualMode = 2;
    },
    showResourceEdit() {
      this.visualMode = 3;
    },
    showTroopEdit() {
      this.visualMode = 4;
    },
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

p {
  font-size: 10pt;
  margin-bottom: 0;
}

h1 {
  font-size: 40px;
  font-family: egypt;
  margin-bottom: 2%;
}

.home {
  margin-top: 9%;
  background: #f8f4e5;
  padding: 50px 100px;
  border: 2px solid black;
  box-shadow: 15px 15px 1px #FFC174, 15px 15px 1px 1px black;
}

.insert{
  display: block;
  width: 100%;
  font-size: 14pt;
  line-height: 28pt;
  margin-bottom: 28pt;
  border: none;
  border-bottom: 4px solid black;
  background: #f8f4e5;
  min-width: 250px;
  padding-left: 5px;
  outline: none;
  color: black;
}

.button{
  display: block;
  margin: 0 auto;
  line-height: 28pt;
  padding: 0 20px;
  margin-bottom: 2em;
  background: #FFC174;
  letter-spacing: 2px;
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 1px solid black;
  box-shadow: 3px 3px 1px 1px #DDCCFF, 3px 3px 1px 2px black;
}

.button:hover {
  background: #FFA971;
}

.container {
  width: 30%;
  min-height: 38em;
  padding-bottom: 0;
}

.config4 {
  position:absolute;
  top: 4%;
  left: 92%;
  z-index: 1;
}

.button2{
  display: block;
  margin: 0 auto;
  padding: 1px 7px;
  background: #f8f4e5;
  transition: 0.2s all ease-in-out;
  outline: none;
  border: 1px solid black;
  box-shadow: 4px 4px 1px #FFC174, 4px 4px 1px 1px black;
}

.button2:hover {
  background: #FFA971;
}

.adv {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home2 {
  display: flex;
  justify-content: space-around;
}

.top {
  margin-top: 2%;
  background: #f8f4e5;
  padding: 10px 100px;
  border: 2px solid black;
  box-shadow: 15px 15px 1px #FFC174, 15px 15px 1px 1px black;
  width: 100%;
  min-height: 0em;
}

</style>