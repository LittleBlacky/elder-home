// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus' //全局引入
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')

