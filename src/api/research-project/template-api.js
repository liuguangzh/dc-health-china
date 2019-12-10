/***
 * 模板管理及表单
 */
import ApiCom from '../api'
import config from '@/config/index.js'

const baseUrl = '/dr-api/template/template-master'
const TemplateApi = new ApiCom(baseUrl)

TemplateApi.findSysTemplates = function (labels, templateName, pageNo, pageSize) {
  if (!pageNo) {
    pageNo = 0
  }
  return this.ajaxCom(
    baseUrl +
      '/get-sys-template?labels=' +
      labels +
      '&templateName=' +
      templateName +
      '&pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize,
    'GET'
  )
}

TemplateApi.findMyTemplates = function (labels, templateName, pageNo, pageSize) {
  if (!pageNo) {
    pageNo = 0
  }
  return this.ajaxCom(
    baseUrl +
      '/get-my-template?labels=' +
      labels +
      '&templateName=' +
      templateName +
      '&pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize,
    'GET'
  )
}

TemplateApi.loadAllTemplates = function (labels, templateName, pageNo, pageSize, classIds) {
  if (!pageNo) {
    pageNo = 0
  }
  if (!pageSize) {
    pageSize = 1000
  }
  return this.ajaxCom(baseUrl + '/load-templates?labels=' + labels + '&templateName=' + templateName + '&pageNo=' +
  pageNo + '&pageSize=' + pageSize + '&classIds=' + classIds, 'GET')
}

/**
 * 创建表单的填报用户
 * @param users
 * @param templateId
 * @returns {*}
 */
TemplateApi.createReportUserWithList = function (users, templateId) {
  return this.ajaxCom(baseUrl + '/create-report-user-with-array?templateId=' + templateId, 'post', users)
}
TemplateApi.findReportUserByTemplateId = function (templateId) {
  return this.ajaxCom(baseUrl + '/get-report-users?templateId=' + templateId, 'get')
}

/**
 * 删除表单的填报用户
 * @param users
 * @param templateId
 * @returns {*}
 */
TemplateApi.deleteReportUserByTemplateId = function (templateId, userIds) {
  return this.ajaxCom(baseUrl + '/delete-report-users?templateId=' + templateId, 'delete', userIds)
}

/**
 * 下载承诺书或者承诺书模板
 * @param fileId
 */
TemplateApi.downLoadTemplateFile = function (url) {
  return this.downloadFile(config.downLoadAddress + '&url=' + url, 'get')
}

/**
 * 申请填报
 */
TemplateApi.applyReport = function (templateMasterId, obj) {
  return this.ajaxCom(baseUrl + '/apply-report?templateId=' + templateMasterId, 'post', obj)
}

TemplateApi.findCurrentUserApplyRecords = function (templateMasterId) {
  return this.ajaxCom(baseUrl + '/find-current-apply-records?templateId=' + templateMasterId, 'get')
}
/**
 * 表单填报前-查询此表单是否可以填报
 * @param templateId
 */
TemplateApi.queryIfFillOfTemplate = function (templateId) {
  return this.ajaxCom(baseUrl + '/fill-template-master?templateId=' + templateId, 'post')
}
/**
 * 获取所有任务分类
 */
TemplateApi.getClassType = function () {
  return this.ajaxCom('/dr-api/template/template-class-type/get-template-class-types', 'get')
}
// 获取指定表单的所有字段
TemplateApi.getAllFields = function (obj) {
  return this.ajaxCom('/dr-api/template/template-data-element/get-all-template-data-elements', 'get', obj)
}
TemplateApi.getDataAnalysis = function (obj) {
  return this.ajaxCom('/dr-api/data-table/get-data-tables', 'get', obj)
}
/**
 * 发布表单
 * @param id 表单ID
 */
TemplateApi.publishTemplate = function (id) {
  return this.ajaxCom('/dr-api/template/template-master/publish?templateId=' + id, 'get')
}
/**
 * 取消发布表单
 * @param templateMaster
 */
TemplateApi.unPublishTemplate = function (id) {
  return this.ajaxCom('/dr-api/template/template-master/un-publish?templateId=' + id, 'get')
}
/**
 * 查看表单
 * @param id 表单ID
 */
TemplateApi.checkTemplateById = function (id) {
  return this.ajaxCom('/dr-api/template/template-master?templateId=' + id, 'get')
}
/**
 * 删除表单
 * @param id 表单ID
 */
TemplateApi.deleteTemplateById = function (id) {
  return this.ajaxCom('/dr-api/template/template-master/delete?templateId=' + id, 'delete')
}
/**
 * 表单的暂停与恢复填报
 * @param id 表单ID
 * @param fillStatus 2 暂停 3 填报中
 */

TemplateApi.changeTmplateFillStatusById = function (id, fillStatus) {
  return this.ajaxCom('/dr-api/template/template-master/start-pause?templateId=' + id + '&status=' + fillStatus, 'get')
}

/**
  * 添加或者编辑表单
  * @param projectId  科研任务ID
  * @param templateInfo 表单信息表
  */
TemplateApi.addOrEditTemplate = function (projectId, templateInfo) {
  return this.ajaxCom('/dr-api/template/template-master/merge-template-master?projectId=' + projectId, 'post', templateInfo)
}

/**
 * 我的模板编辑模板
 * @param masterId 模板ID
 */
TemplateApi.mergeMyTemplate = function (obj) {
  return this.ajaxCom('/dr-api/template/template-master/merge-my-template', 'post', obj)
}

/**
 * 系统模板编辑模板
 * @param masterId 模板ID
 */
TemplateApi.mergeSysTemplate = function (obj) {
  return this.ajaxCom('/dr-api/template/template-master/merge-sys-template', 'post', obj)
}

/**
 * 删除模板
 * @param masterId 模板ID
 */
TemplateApi.deleteSysTemplateById = function (id) {
  return this.ajaxCom('/dr-api/template/template-master/delete-template?templateId=' + id, 'delete')
}
/**
 * 根据科研任务ID获取下属表单
 * @param projectId
 */
TemplateApi.getTemplateByProjectId = function (projectId) {
  return this.ajaxCom('/dr-api/template/template-master/get-template-by-projectId?projectId=' + projectId, 'get')
}
/**
 * 获取用户待填报表单
 * @param researchName 科研任务名称
 * @param templateName 表单名称
 */
TemplateApi.getWaitTemplate = function (obj) {
  return this.ajaxCom('/dr-api/template/template-master/get-wait-master?pageNo=' + obj.pageNo + '&pageSize=' + obj.pageSize + '&templateName=' + obj.templateName + '&researchName=' + obj.researchName, 'get')
}
/**
 * 获取用户待填报表单数量
 */
TemplateApi.getWaitTemplateNum = function () {
  return this.ajaxCom('/dr-api/template/template-master/get-wait-master-count', 'get')
}
/**
 * 取消表单发布-检查表单是否可以取消
 * @param templateId [表单ID]
 */
TemplateApi.checkAbleUnpublish = function (templateId) {
  return this.ajaxCom('/dr-api/template/template-master/check-able-publish?templateId=' + templateId, 'get')
}
/**
 * 自定义数据表-编辑
 */
TemplateApi.mergeWitchExcel = function (projectId, obj) {
  return this.ajaxCom('/dr-api/template/template-master/merge-with-excel?projectId=' + projectId, 'post', obj)
}
export default TemplateApi
