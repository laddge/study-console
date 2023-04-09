import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'

import App from './App.vue'
import router from './router'

import 'vue-final-modal/style.css'
import './index.css'

const app = createApp(App)

app.use(createPinia())
app.use(createVfm())
app.use(router)

app.mount('#app')
