import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
// 导入二次分装的axios
import request from './utils/request'
// 导入自己封装的storage
import storage from './utils/storage'
// 导入用来管理接口的api
import api from './api/index'
// 导入vuex
import store from './store'
const app = createApp(App)
// 挂载到app上
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
