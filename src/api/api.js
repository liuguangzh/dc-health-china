import axios from '@/libs/api.request.js'

class ApiCom {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }
  deleteOneByObj (entity) {
    let obj = entity || {}
    return axios.request({
      url: this.baseUrl,
      method: 'delete',
      data: obj
    })
  }
  createOneByObj (entity) {
    let obj = entity || {}
    return axios.request({
      url: this.baseUrl,
      method: 'post',
      data: obj
    })
  }
  /**
   * 新增课题管理人员
   * @param obj
   * @returns {*}
   */
  addProjectAdmin (entity) {
    let obj = entity || {}
    return axios.request({
      url: this.baseUrl + '/add-project-admin',
      method: 'post',
      data: obj
    })
  }
  /**
   * 删除课题管理人员
   * @param obj
   * @returns {*}
   */
  deleteProjectAdmin (entity) {
    let obj = entity || {}
    return axios.request({
      url: this.baseUrl + '/delete-project-admin',
      method: 'delete',
      data: obj
    })
  }
  updateOneByObj (entity) {
    let obj = entity || {}
    return axios.request({
      url: this.baseUrl + '/add-project-admin',
      method: 'post',
      data: obj
    })
  }
  deleteAllByObj (entity) {
    let obj = entity || {}
    return axiox.request({
      url: this.baseUrl + 'delete-all',
      method: 'delete',
      data: obj
    })
  }
  emptyAllByObj (entity) {
    let obj = entity || {}
    return axios.request({
      url: this.baseUrl + 'empty-all',
      method: 'delete',
      data: obj
    })
  }
  getAll () {
    return axios.request({
      url: this.baseUrl + 'find-all',
      method: 'get'
    })
  }
  getAllByPage () {
    return axios.request({
      url: this.baseUrl + 'find-all-by-page',
      method: 'get'
    })
  }
  saveAllByObj (entity) {
    let obj = entity || {}
    return axios.request({
      url: this.baseUrl + 'save-all',
      method: 'post',
      data: obj
    })
  }
  delteOneById (id) {
    return axios.request({
      url: this.baseUrl + '/' + id,
      method: 'delete'
    })
  }
  getOneById (id) {
    return axios.request({
      url: this.baseUrl + '?projectId=' + id,
      method: 'get'
    })
  }
  getitmeClickById (id) {
    return axios.request({
      url: this.baseUrl + '?pageId=' + id,
      method: 'get'
    })
  }
  ajaxCom (url, method, obj) {
    let option = {}
    option.method = method
    option.url = url
    if (method === 'get') {
      option.params = obj
    } else if (method === 'post' || method === 'delete' || method === 'put') {
      option.data = obj
    }
    return axios.request(option)
  }
  downloadFile (url, method, obj) {
    let option = {}
    option.method = method
    option.url = url
    if (method === 'get') {
      option.params = obj
    } else if (
      method === 'post' ||
      method === 'get' ||
      method === 'delete' ||
      method === 'put'
    ) {
      option.data = obj
    }
    option.responseType = 'blob'
    return axios.request(option)
  }
}

export default ApiCom
