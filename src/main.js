import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { createI18n } from 'vue-i18n'
import eng from './locales/eng.json'
import ukr from './locales/ukr.json'

import App from './App.vue'
import router from './router'

const i18n = createI18n({
    locale: 'eng',
    legacy: false,
    messages: {
        eng: eng,
        ukr: ukr,
    }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(i18n)
app.mount('#app')
