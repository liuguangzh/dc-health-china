/**
 * 创建科研任务接口
 */

import ApiCom from '../api'

const baseUrl = '/dr-api/research-project'
const CreateResearchProjectApi = new ApiCom(baseUrl)

/**
 * 获取创建的科研任务
 * @param obj
 * @returns {*}
 */
CreateResearchProjectApi.getResearchProject = function (obj) {
  return this.ajaxCom(baseUrl + '/find-projects-by-page', 'get', obj)
}

/**
 * 删除科研任务
 * @param string
 * @returns {*}
 */
CreateResearchProjectApi.deleteResearchProject = function (id) {
  return this.ajaxCom(baseUrl + '/delete?projectId=' + id, 'delete')
}

/**
 * 查看科研任务详情
 * @param string
 * @returns {*}
 */
CreateResearchProjectApi.checkResearchProject = function (id) {
  return this.ajaxCom(baseUrl + '?projectId=' + id, 'get')
}

/**
 * 编辑科研任务
 * @param obj
 * @returns {*}
 */
CreateResearchProjectApi.editResearchProject = function (obj) {
  return this.ajaxCom(baseUrl + '/modify', 'post', obj)
}

export default CreateResearchProjectApi
