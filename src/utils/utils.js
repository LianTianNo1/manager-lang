/**
 * 工具函数封装
 */
export default {
  formateDate(date, rule) {
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    const o = {
      // 'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + ''
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length)
        )
      }
    }
    return fmt
  },
  generateRoute(menuList) {
    // 收集所有的路由
    let routes = []
    // 递归方法
    const deepList = (list) => {
      while (list.length) {
        let item = list.pop()
        if (item.action) {
          // 如果有action说明这是个菜单 例如： User
          routes.push({
            // name就用 组件名
            name: item.component,
            // 路由地址也是存有的 比如： system/user
            path: item.path,
            meta: {
              // title 就叫菜单名
              title: item.menuName,
            },
            // 组件这里只是记个名字 ，等创建路由的时候，在去加载组件
            component: item.component,
          })
        }
        // 如果有孩子，但是没有 action 说明 还没有到底层菜单 例如 System 并不是我们想要的，而是它下面的 User
        if (item.children && !item.action) {
          // 进行递归
          deepList(item.children)
        }
      }
    }
    deepList(menuList)
    return routes
  },
}
