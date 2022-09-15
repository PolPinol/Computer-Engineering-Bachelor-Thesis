<template>
  <!-- SIGN UP PAGE -->
  <div class="container home">
    <!-- BUTTON RETURN MAIN PAGE -->
    <div class="config4">
      <button class="button2 buttonLogout" v-on:click="back()"><i class="material-icons">reply</i></button>
    </div>

    <!-- FORM TO SIGN UP -->
    <h1>Register to the game!</h1>
    <form @submit.prevent="signup">
      <!-- USERNAME -->
      <div class="form-group">
        <input v-model="username" type="text" class="insert" id="floatingInput" placeholder="Username" required>
      </div>
      <br/>

      <!-- PASSWORD -->
      <div class="form-group">
        <input v-model="password" type="password" class="insert" id="floatingPassword" placeholder="Password" required>
      </div>
      <br/>

      <!-- PASSWORD CONFIRMATION-->
      <div class="form-group">
        <input v-model="confirmPassword" type="password" class="insert" id="floatingPassword2" placeholder="Confirm Password" required>
      </div>
      <br/>
      <input type="submit" class="button" value="Sign Up">
    </form>

    <!-- ERROR MESSAGES -->
    <p>{{ message }}</p>
    <p v-if="username.length < 8">Username has less than 8 characters.</p>
    <p v-if="password.length < 8">Password has less than 8 characters.</p>
    <p v-if="password !== confirmPassword">Password and Confirmation Password doesn't match.</p>
  </div>

</template>

<script>
import { player } from "@/stores/player"

export default {
  name: 'SignUpForm',
  props: {
    msg: String
  },
  data: function () {
    return {
      player: player(),
      username: "",
      password: "",
      confirmPassword: "",
      message: ""
    }
  },
  methods: {
    async signup() {
      if (this.username.length >= 8 && this.username.length >= 8 && this.password === this.confirmPassword) {
        const check = await this.player.createPlayer(this.username, this.password);
        if (check === null) {
          this.$parent.showHomePage();
        } else {
          this.message = check;
        }
      }
    },
    back() {
      this.$parent.showHomePage();
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

p {
  color: red;
  font-size: 10pt;
  margin-bottom: 0;
}

h1 {
  font-size: 40px;
  font-family: egypt;
  margin-bottom: 12%;
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

</style>