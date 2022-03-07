// createRouter 用来创建路由
// 指定是hash
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import API from '@/api/index.js'
import storage from '@/utils/storage.js'
import utils from '@/utils/utils.js'
//  element的消息组件
import { ElMessage } from 'element-plus'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页',
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎',
        },
        component: () => import('@/views/Welcome.vue'),
      },
      // {
      //   name: 'user',
      //   path: '/system/user',
      //   meta: {
      //     title: '用户管理',
      //   },
      //   component: () => import('@/views/User.vue'),
      // },
      // {
      //   name: 'menu',
      //   path: '/system/menu',
      //   meta: {
      //     title: '菜单管理',
      //   },
      //   component: () => import('@/views/Menu.vue'),
      // },
      // {
      //   name: 'role',
      //   path: '/system/role',
      //   meta: {
      //     title: '角色管理',
      //   },
      //   component: () => import('@/views/Role.vue'),
      // },
      // {
      //   name: 'dept',
      //   path: '/system/dept',
      //   meta: {
      //     title: '部门管理',
      //   },
      //   component: () => import('@/views/Dept.vue'),
      // },
    ],
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/Login.vue'),
  },
  {
    name: '404',
    path: '/404',
    meta: { title: '未找到该页面' },
    component: () => import('@/views/404.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
// 异步加载路由
async function loadAsyncRoutes() {
  // 拿到token，才去创建路由
  let userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    try {
      // 获取该用户的菜单列表
      const { menuList } = await API.getPermissionList()
      // 通过递归获取到所有的路由

      let routes = utils.generateRoute(menuList)
      // 通过遍历递归拼接后的路由，创建动态路由
      routes.map((route) => {
        // 获取到组件的地址
        let url = `../views/${route.component}.vue`
        // debugger

        // 加载组件
        route.component = () => import(/* @vite-ignore */ url)
        console.log('route', route)
        // console.log('route.component', uroute.componentrl)
        // 通过 addRoute 创建动态路由,在 home 路由下面创建
        // route 之前我们就通过 generateRoute 拼装好了只是没有加载组件
        router.addRoute('home', route)
      })
    } catch (error) {
      ElMessage.error(error)
    }
  }
}

// 执行一次异步加载路由
await loadAsyncRoutes()

// 判断当前地址是否可以访问
function checkPermission(path) {
  // 从所有的注册的路由判断当前path是否存在，有的话长度一定大于0
  let hasPermission = router
    .getRoutes()
    .filter((route) => route.path == path).length
  if (hasPermission) {
    return true
  } else {
    return false
  }
}
// 导航守卫
router.beforeEach((to, from, next) => {
  // 如果要去的路由存在 注册的所有的路由上面，进行next()放行
  if (checkPermission(to.path)) {
    // 修改每一页的title
    document.title = to.meta.title
    next()
  } else {
    // 否则去404
    next('/404')
  }
})

export default router
