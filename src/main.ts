import { createApp } from 'vue'
import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persistedstate';

import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'


createApp(App)
    .use(createPinia().use(piniaPersist))
    .use(router)
    .mount('#app')
