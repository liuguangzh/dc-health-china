import { login, logout, getUserInfo, getMenuList } from '@/api/user'
import { setToken, getToken, setDchToken, getDchToken } from '@/libs/util'

export default {
  state: {
    username: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    dchToken: getDchToken(),
    access: '',
    hasGetInfo: false, // 是否获取到用户信息
    urlList: []
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.username = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setDchToken (state, token) {
      state.dchToken = token
      setDchToken(token)
    },
    setUrlList (state, url) {
      state.urlList = url
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit, dispatch }, { username, password }) {
      username = username.trim()
      let obj = { username, password }
      return new Promise((resolve, reject) => {
        login(obj)
          .then(res => {
            //   const authorization = res.headers.authorization
            //   commit('setToken', authorization)
            dispatch('getUserInfo')
            let dchtoken = getDchToken()
            commit('setDchToken', dchtoken)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('setDchToken', '')
            commit('setAccess', [])
            commit('setHasGetInfo', false)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取菜单列表
    getMenuList ({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          getMenuList().then(res => {
            if (res.data.code === '1') {
              commit('setUrlList', res.data.data)
            }
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户相关信息
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo()
            .then(res => {
              if (res.data.code === '1') {
                const userInfo = res.data.data
                commit('setHasGetInfo', true)
                commit('setUserName', userInfo.username)
                commit('setUserId', userInfo.id)
                resolve(res)
              } else {
                reject(res.data.msg)
              }
            })
            .catch(err => {
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
