import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { DynamicRoutingPermission } from '@/router'

/**
 *前置守卫
 *
*/

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo', routes)
      // 注册动态路由的代码 => 获取用户资料之后，跳转首页之前
      const menus = store.getters.menus
      // console.log(store.getters)
      // 筛选路由
      const routes = DynamicRoutingPermission.filter(item => menus.includes(item.path.replace('/', '')))
      // console.log(routes)
      // 将筛选到的动态路由更新到user的routes中
      store.commit('user/setRoutes', routes)
      // 添加动态路由信息到路由表
      router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
      // router添加动态路由之后 需要转发一下
      next(to.path) // 目的是让路由拥有信息 router的已知缺陷
    }
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      // next（地址）并没有执行后置守卫
      nprogress.done()
    } else {
      // 已登录，且去往非登录页面的情况
      await store.dispatch('user/getUserInfo')
      next() // 放行
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // 中转到登录页
      nprogress.done()
    }
  }
})

/** *
 * 后置守卫
 * **/
router.afterEach(() => {
  nprogress.done()
})
