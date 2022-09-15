<template>
    <div class="">
      <HomeButtons v-if="mode === 0"/>
      <SignUpForm v-if="mode === 1"/>
      <LogInForm v-if="mode === 2"/>
      <GamePage v-if="mode === 3"/>
    </div>
</template>

<script>
import { gamemaster } from "./stores/gamemaster.js"
import { player } from "./stores/player.js"
import HomeButtons from './components/HomePage.vue';
import SignUpForm from "./components/SignUp/SignUpForm.vue";
import LogInForm from "./components/LogIn/LogInForm.vue";
import GamePage from "./components/Game/GamePage.vue";

export default {
  name: 'App',
  components: {
    LogInForm,
    SignUpForm,
    HomeButtons,
    GamePage,
  },
  data: function () {
    return {
      gamemaster: gamemaster(),
      mode: 0,
      auth_key: "",
      landIdSelected: undefined,
      resources: Array,
      serverSelected: undefined,
      player: player()
    }
  },
  methods: {
    showHomePage() {
      this.mode = 0;
    },
    showSignUp() {
      this.mode = 1;
    },
    showLogIn() {
      this.mode = 2;
    },
    accessGame() {
      this.mode = 3;
    }
  },
  async beforeMount() {
    await this.gamemaster.getGameMasterInfo();

    const match = document.cookie.match(new RegExp('(^| )' + 'authKey' + '=([^;]+)'));

    if (match) {
      this.player.setAuthKey(match[2]);
      this.accessGame();
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-image: url("./assets/bg3.jpg");
  background-repeat:no-repeat;
  -webkit-background-size:cover;
  -moz-background-size:cover;
  -o-background-size:cover;
  background-size:cover;
}

/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #d1d1d1 #f8f4e5;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 11px;
}

*::-webkit-scrollbar-track {
  background: #f8f4e5;
}

*::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 15px;
  border: 3px solid #f8f4e5;
}
</style>
