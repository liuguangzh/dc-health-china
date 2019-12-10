import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { canTurnTo, getDchToken, setDchToken } from '@/libs/util'
import config from '@/config'

const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes: routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
// 路由跳转验证用户权限
// const turnTo = (to, access, next) => {
//   if (to.meta.needLogin !== undefined && to.meta.needLogin === false) {
//     // 判断如果不需要登录则直接访问
//     next()
//   } else {
//     if (canTurnTo(to.name, access, routes)) {
//       next() // 有权限，可访问
//     } else {
//       const token = getDchToken()
//       if (token) {
//         // 已登录
//         next({
//           replace: true,
//           name: 'error_401'
//         }) // 无权限，重定向到401页面
//       } else {
//         next({
//           replace: true,
//           name: 'login'
//         })
//       }
//     }
//   }
// }
// eslint-disable-next-line camelcase
const go_login = () => {
  window.location.href = config.login_url
}
router.beforeEach((to, from, next) => {
  const token = getDchToken()
  if (to.meta.needLogin !== undefined && to.meta.needLogin === false && to.name !== LOGIN_PAGE_NAME) {
    next()
    // go_login()
  } else if (!token && to.name !== LOGIN_PAGE_NAME) {
    // next({ name: 'login' })
    go_login()
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    // next() // 跳转
    go_login()
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    // 已登录且要跳转的不是登录页
    if (store.state.user.hasGetInfo) {
      // 登录时获取用户信息成功
      //   turnTo(to, store.state.user.access, next)
      next()
    } else {
      // 登录后未获取到用户信息，此时重新获取用户信息
      store.dispatch('getUserInfo').then(res => {
        // 成功获取用户信息以后,根据用户权限去判定是否可以跳转
        // turnTo(to, user.access, next)
        if (res.status === 200 && res.data.flag === true) {
          next()
        } else {
          setDchToken('')
          go_login()
          // next({
          //   name: 'login'
          // })
        }
      }).catch(() => {
        // 未成功获取到用户信息，将Token设置为空，并跳转到登录页登录
        setDchToken('')
        go_login()
        // next({
        //   name: 'login'
        // })
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
