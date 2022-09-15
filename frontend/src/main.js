import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

app.mount('#app');