/**
 * Vuex状态管理
 */
// createStore 创建store
import { createStore } from 'vuex'
// mutations 自己封装的业务层，用来保存数据业务
import mutations from './mutations'
// 之前自己对localStorage的封装，具体用来保存数据
import storage from './../utils/storage'

const state = {
  // 用户名 “||" 第二个有值就返回第二个
  userInfo: '' || storage.getItem('userInfo'), // 获取用户信息
  menuList: storage.getItem('menuList') || [], //菜单列表
  actionList: storage.getItem('actionList') || [], //按钮列表
}
// 返回给main.js挂载
export default createStore({
  state,
  mutations,
})
