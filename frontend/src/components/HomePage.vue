<template>
  <!-- PAGE HOME WITH BUTTONS SIGN UP AND SIGN IN -->
  <div class="home">
    <!-- MAIN LOGO -->
    <img src="@/assets/logo.png" alt="">

    <div class="d-flex container">
      <!-- SIGN UP -->
      <button class="button" v-on:click="showSignUp">Sign Up</button>

      <!-- SIGN IN -->
      <button class="button" v-on:click="showLogIn">Log In</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeButtons',
  props: {
    msg: String
  },
  methods: {
    showSignUp() {
      this.$parent.showSignUp();
    },
    showLogIn() {
      this.$parent.showLogIn();
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

button {
  margin: 2%;
}

.home {
  margin-top: 15%;
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
  margin-top: 5em;
  width: 30%;
}

</style>