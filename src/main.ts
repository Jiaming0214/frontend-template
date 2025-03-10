import { createApp } from 'vue'
import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persistedstate';

import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia().use(piniaPersist)

console.log('initRouter')

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')