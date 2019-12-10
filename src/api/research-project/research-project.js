/**
 * 科研课题
 */

import ApiCom from '../api'

const baseUrl = '/dr-api/research-project'
const ResearchProjectApi = new ApiCom(baseUrl)

/**
 * 获取当前登录人员的科研课题
 * @returns {*}
 */
ResearchProjectApi.findMyResearchProject = function (obj) {
  return this.ajaxCom(baseUrl + '/find-my-research?size=' + obj.size, 'get')
}
/**
 * 获取当前登录人员的科研课题
 * @returns {*}
 */
ResearchProjectApi.listProjectAdmin = function (id) {
  return this.ajaxCom(baseUrl + '/list-project-admin?projectId=' + id, 'get')
}

/**
 *
 * @returns {*}
 */
ResearchProjectApi.createProjectResearchUser = function (projectId, user) {
  return this.ajaxCom(baseUrl + '/create-research-user?projectId=' + projectId, 'post', user)
}

ResearchProjectApi.getUserList = function () {
  return this.downloadFile(baseUrl + '/find-default-user-list', 'get')
}
/**
 * 删除科研任务
 * @param id [科研任务ID]
 */
ResearchProjectApi.deleteProjectById = function (id) {
  return this.ajaxCom(baseUrl + '/delete?projectId=' + id, 'delete')
}
/**
 * 根据模板创建科研任务
 * @param researchProjectVo
 * @returns {*}
 */
ResearchProjectApi.createResearchProjectWithTemplates = function (researchProjectVo) {
  return this.ajaxCom(baseUrl + '/create-with-template', 'post', researchProjectVo)
}
/**
 * 根据表单类型 查询表单
 * @param obj [{
   String templateMasterName; 表单名称
   Timestamp startTime;开始时间
   Timestamp endTime; 结束时间
   String fillStatus; 0: 未开始 1: 已结束 2: 暂停 3: 填报中
   String operation;大于 等于 小于
   Double percent;百分比
   String done;是否提交 0： 未提交 1: 已提交
   String publishType;发布类型 0 指定填报， 1 公共填报， 2 申请填报
   pageable{分页参数
    size,page
  }]
 */
ResearchProjectApi.getProjectsTemplatesByPublishType = function (obj) {
  return this.ajaxCom(
    baseUrl + '/get-projects-templates?pageNo=' + obj.pageNo + '&pageSize=' + obj.pageSize +
    '&publishType=' + obj.publishType + '&templateMasterName=' + obj.templateMasterName + '&fillStatus=' + obj.fillStatus +
    '&startTime=' + obj.startTime + '&endTime=' + obj.endTime, 'get'
  )
}
/**
 * 获取所有科研任务及其下属表单
 * @param Object
 * @returns {}
 */
ResearchProjectApi.getAllProjects = function (obj) {
  return this.ajaxCom(baseUrl + '/research-projects-query', 'get', obj)
}
/**
 * 获取所有系统或者自定义上传任务及下属数据表
 * @param type [1-用户创建任务 2-自定义数据创建任务]
 * @param name [任务名称]
 */
ResearchProjectApi.getAllProjectsByType = function (obj) {
  return this.ajaxCom('/dr-api/research-project/projects-data-view', 'get', obj)
}

/**
 * 用户上传excel创建科研任务
 * @param name [任务名称]
 */
ResearchProjectApi.ceateProjectWithExcel = function (obj) {
  return this.ajaxCom('/dr-api/research-project/create-with-excel', 'post', obj)
}

/**
 * 用户上传excel编辑科研任务
 * @param name [任务名称]
 */
ResearchProjectApi.modifyProjectWithExcel = function (obj) {
  return this.ajaxCom('/dr-api/research-project/modify', 'post', obj)
}
/**
 * 新建数据分析表
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getCreateDataAnalysis = function (obj) {
  return this.ajaxCom('/dr-api/data-table/merge-data-table', 'post', obj)
}

/**
 * 多任务 新建数据分析子表
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getCreateSubDataAnalysis = function (parentId, obj) {
  return this.ajaxCom('/dr-api/data-table/merge-data-table?parentId=' + parentId, 'post', obj)
}

/**
 * 单任务和多任务 编辑数据分析子表
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getEditSubDataAnalysis = function (obj) {
  return this.ajaxCom('/dr-api/data-table/update-data-table', 'post', obj)
}

/**
 * 单任务 新建数据分析子表
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getCreateSingleSubDataAnalysis = function (obj) {
  return this.ajaxCom('/dr-api/data-table/merge-data-table', 'post', obj)
}

/**
 * 删除数据分析表
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getDeleteDataAnalysis = function (tableId) {
  return this.ajaxCom('/dr-api/data-table/delete-data-table?tableId=' + tableId, 'post')
}

ResearchProjectApi.getMatchFieldData = function (dataTableId, obj) {
  return this.ajaxCom('/dr-api/data-table/build-data-table?dataTableId=' + dataTableId, 'post', obj)
}

/**
 * 数据替换或删除操作
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getDirectReplace = function (obj) {
  return this.ajaxCom('/dr-api/data-table/operate-data-table', 'post', obj)
}

/**
 * 操作历史
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getOperatorHistory = function (obj, dataTable) {
  return this.ajaxCom('/dr-api/operate-history/get-operate-history?page=' + obj.page + '&size=' + obj.size, 'post', dataTable)
}

/**
 * 数据筛选
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getSelectRecord = function (dataTableId, obj) {
  return this.ajaxCom('/dr-api/data-table/get-analysis-data?dataTableId=' + dataTableId, 'post', obj)
}

/**
 * 筛选记录
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getInitRecordData = function (obj, dataTable) {
  return this.ajaxCom('/dr-api/operate-history/get-query-operate-history?page=' + obj.page + '&size=' + obj.size, 'post', dataTable)
}

/**
 * 获取填报人员列表
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getInitFillListPersonnel = function (obj) {
  return this.ajaxCom('/dr-api/template/template-master/create-report-user-with-list', 'post', obj)
}

/**
 * 获取所有分组列表
 * @param obj
 * @returns {*}
 */
ResearchProjectApi.getAllGroupsList = function (templateId) {
  return this.ajaxCom('/dr-api/template/template-page-group/get-template-groups?templateId=' + templateId, 'get')
}

export default ResearchProjectApi
