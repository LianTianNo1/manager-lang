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
import * as ElIconModules from '@element-plus/icons' //导入所有element icon图标
const app = createApp(App)

// 自定义指令 判断是否有权限
app.directive('hasrole', {
  // 在挂载之前进行判断
  // el 当前dom元素 ,第二个参数是banding
  beforeMount(el, bandig) {
    const { value } = bandig
    // 从缓存中获取 行为列表
    const actionList = storage.getItem('actionList')
    // 如果当前的权限不存在 权限列表中 对这个按钮进行隐藏
    if (!actionList.includes(value)) {
      el.style.display = 'none'
      // 现在删除的话会报错，等微任务完成后，进行宏任务进行删除
      setTimeout(() => {
        el.parentNode.removeChild(el)
      }, 0)
    }
  },
})

// 挂载到app上
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.use(ElementPlus, { size: 'small' })

// 全局注册element-plus icon图标组件
Object.keys(ElIconModules).forEach((key) => {
  app.component(key, ElIconModules[key])
})

app.use(router).use(store).mount('#app')
