/**
 * api管理
 */
import request from './../utils/request'
export default {
  login(params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params,
    })
  },
  noticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {},
      mock: true,
    })
  },
  getMenuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: params,
      mock: false,
    })
  },
  getUserList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params,
      mock: false,
    })
  },
  getAllUserList(data = {}) {
    return request({
      url: '/users/all/list',
      method: 'get',
      data,
      mock: false,
    })
  },
  userDel(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params,
      mock: false,
    })
  },
  getRoleAllList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      data: {},
      mock: false,
    })
  },
  getRoleList(params) {
    return request({
      url: '/roles/list',
      method: 'get',
      data: params,
      mock: false,
    })
  },
  getDeptList(data = {}) {
    return request({
      url: '/dept/list',
      method: 'get',
      data,
      mock: false,
    })
  },
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params,
      mock: false,
    })
  },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params,
      mock: false,
    })
  },
  roleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
      mock: false,
    })
  },
  updatePermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      data: params,
      mock: false,
    })
  },
  deptListApi(data) {
    return request({
      url: '/dept/list',
      method: 'get',
      data,
      mock: false,
    })
  },
  deptOperateApi(data) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data,
      mock: false,
    })
  },
  // 获取当前角色的权限
  getPermissionList(data = {}) {
    return request({
      url: '/users/getPermissionList',
      method: 'get',
      data,
      mock: false,
    })
  },
}
