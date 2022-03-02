/**
 * axios二次封装
 */
import axios from 'axios'
//  config下面的配置文件
import config from './../config'
//  element的消息组件
import { ElMessage } from 'element-plus'
//  导入的路由的实例
import router from './../router'
// 导入自己封装的storage
import storage from './storage'

const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
})

// 请求拦截
service.interceptors.request.use((req) => {
  // 获取到请求头判断是否有token 还没实现
  const headers = req.headers
  // 获取到localstorage中userInfo中的token
  const { token } = storage.getItem('userInfo') || ' '
  // 以后的请求都将携带token去请求
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  //  解构出code data msg
  const { code, data, msg } = res.data
  //  200 成功就返回
  if (code === 200) {
    return data
    //  错误
  } else if (code === 500001) {
    //  使用组件返回默认的信息
    ElMessage.error(TOKEN_INVALID)
    //  隔一段时间再跳到登录页先让他看见消息
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    //  返回promise错误信息
    return Promise.reject(TOKEN_INVALID)
  } else {
    //  返回错误信息，没有的话就返回网络错误
    ElMessage.error(msg || NETWORK_ERROR)
    //  返回promise错误信息
    return Promise.reject(msg || NETWORK_ERROR)
  }
})
/**
 * 请求核心函数
 * @param {*} options 请求配置
 */
function request(options) {
  // 判断请求方式
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    // get处理下请求参数
    options.params = options.data
  }
  // 判断是否mock,config文件之前配置了mock
  let isMock = config.mock
  // 判断是否传入了mock
  if (typeof options.mock != 'undefined') {
    isMock = options.mock
  }
  // console.log(isMock)
  // 根据不同的环境设置不同的baseURL
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  // 返回service
  return service(options)
}

// 给request添加一些方法
;['get', 'post', 'delete', 'put', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      ...options,
    })
  }
})

export default request
