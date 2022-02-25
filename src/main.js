import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
// 导入二次分装的axios
import request from './utils/request'
const app = createApp(App)
// 挂载到app上
app.config.globalProperties.$request = request
app.use(ElementPlus)
app.use(router)
app.mount('#app')
