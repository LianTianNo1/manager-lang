// import { leaveCountApi } from '@/api/index.js'
import API from '@/api/index.js'

export default {
  async getLeaveCount({ commit }) {
    // const count = await leaveCountApi()
    const count = await API.leaveCountApi()
    commit('setLeaveCount', count)
  },
}
