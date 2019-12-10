import axios from '@/libs/api.request'
// import config from '@/config'
// const baseUrl = '/da-'
const userUrl = '/da-'
/**
 * 登录
 */
export const login = (obj) => {
  // let loginUrl = config.loginServicePath
  return axios.request({
    url: userUrl + 'login',
    method: 'post',
    data: obj
  })
}
/**
 * 获取菜单栏
 */
export const getMenuInfo = () => {
  return axios.request({
    url: 'permit/list-permit-all?projectId=2',
    method: 'get'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: userUrl + 'user/get-current',
    method: 'get'
  })
}

export const getUserAuthorities = (sysUser) => {
  return axios.request({
    url: '/dr-api/user/get-authorities',
    method: 'post',
    data: sysUser
  })
}

export const getUsersByRole = (roleId) => {
  return axios.request({
    url: '/dr-api/user/user-by-role-id?roleId=' + roleId,
    method: 'get'
  })
}

/**
 * 菜单列表
 */
export const getMenuList = () => {
  return axios.request({
    url: userUrl + 'menu/list-menu?projectCode=RESEARCH_MANAGE',
    method: 'get'
  })
}

/**
 * 退出
 */
export const logout = (token) => {
  return axios.request({
    url: userUrl + 'logout',
    method: 'put'
  })
}

export const findAllUser = () => {
  return axios.request({
    url: '/dr-api/user/find-all',
    method: 'GET'
  })
}

export const findUserByLoginName = (loginName) => {
  return axios.request({
    url: userUrl + 'user/get-user-by-username?username=' + loginName,
    method: 'GET'
  })
}

export const findUsersByName = (name) => {
  return axios.request({
    // url: '/api/user/find-user-by-name?name=' + name,
    url: userUrl + 'user/get-user-by-name?name=' + name,
    method: 'GET'
  })
}

export const register = (user) => {
  return axios.request({
    url: userUrl + 'register',
    data: user,
    method: 'POST'
  })
}
/**
 * 修改用户信息及密码 参数为user对象，ID为必须   剩余选传
 */
export const changeUserInfo = (user) => {
  return axios.request({
    url: '/dr-api/user/update',
    method: 'post',
    data: user
  })
}
/**
 * 填报人员根据发送回来的code进行登录
 * @param code
 */
export const loginWithCode = (code) => {
  return axios.request({
    url: '/dr-api/report-pre-check/' + code,
    method: 'post'
  })
}
/**
 * 注册账号关联其他人为其创建其他账号
 */
export const relateOtherUser = (user) => {
  return axios.request({
    url: '/dr-api/relation/relate-users',
    method: 'post',
    params: user
  })
}
/**
 * 获取用户关联记录
 */
export const getRelateUsers = (obj) => {
  return axios.request({
    url: '/dr-api/relation/get-relate-users',
    method: 'get',
    params: obj
  })
}
/**
 * 全局提示用户 关联账号
 */
export const updateIsAleart = (obj) => {
  return axios.request({
    url: '/dr-api/user/update-is-alert?alertFlag=' + obj,
    method: 'post'
  })
}
