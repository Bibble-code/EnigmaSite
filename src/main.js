import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(Toast, {
  // Hier kannst du Optionen einstellen (optional)
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
})

app.mount('#app')
