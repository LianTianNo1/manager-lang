/**
 * 封装storage
 * @author lang
 */
import config from '../config/index'
export default {
  setItem(key, val) {
    const storage = this.getStorage()
    storage[key] = val
    // 每个命名空间指定一个storage
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getItem(key) {
    // 获取指定storage的key
    return this.getStorage()[key]
  },
  getStorage() {
    // 获取对应命名空间的对象,没有就默认为{}
    return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
  },
  clearItem(key) {
    // 删除一个 storage 具体key
    const storage = this.getStorage()
    delete storage[key]
    // 删除之后就重新设置一下
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  clearAll() {
    // 调用原生的clear
    window.localStorage.clear()
  },
}
