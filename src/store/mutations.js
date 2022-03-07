/**
 * Mutations业务层数据提交
 */
// 之前自己对localStorage的封装，具体用来保存数据
import storage from './../utils/storage'

export default {
  // 保存用户信息的方法
  saveUserInfo(state, userInfo) {
    // 保存到vuex中一份
    state.userInfo = userInfo
    // 保存到localstorage一份
    storage.setItem('userInfo', userInfo)
  },
  saveMenuList(state, list) {
    state.menuList = list
    storage.setItem('menuList', list)
  },
  saveActionList(state, list) {
    state.actionList = list
    storage.setItem('actionList', list)
  },
  // 设置需要审批的总数
  setLeaveCount(state, count) {
    state.leaveCount = count
  },
}
