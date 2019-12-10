import ApiCom from '../api'

const baseUrl = '/dr-api/template/template-result'
const TemplateResultApi = new ApiCom(baseUrl)

TemplateResultApi.findNeedReportTemplateResultMaster = function () {
  return this.ajaxCom(baseUrl + '-master/get-need-report', 'get')
}

TemplateResultApi.getTemplateResultMaster = function (resultMasterId) {
  return this.ajaxCom(baseUrl + '-master?resultMasterId=' + resultMasterId, 'get')
}
/**
 * 更新TemplateResultMaster
 * @param templateResultMaster
 * @returns {*}
 */
TemplateResultApi.mergeTemplateResultMaster = function (templateResultMaster) {
  return this.ajaxCom(baseUrl + '-master', 'post', templateResultMaster)
}
/**
 * 更新填报信息 -  添加承诺书
 */
TemplateResultApi.mergeTemplateResultMasterPut = function (templateResultMaster) {
  return this.ajaxCom(baseUrl + '-master/update-file-store?resultMasterId=' + templateResultMaster.resultMasterId + '&fileStoreId=' + templateResultMaster.fileStoreId + '&fileStorePath=' + templateResultMaster.fileStorePath, 'get')
}

TemplateResultApi.getFillList = function (obj) {
  return this.ajaxCom(baseUrl + '-master/research-template-result-master-query?templateId=' + obj.templateId + '&done=' + obj.done + '&page=' + obj.page + '&size=' + obj.size, 'get')
}
/**
 * 获取待填报表单
 * 此接口已弃用   新接口在 templateMaster
 */
TemplateResultApi.getWaitFillList = function (obj) {
  return this.ajaxCom(baseUrl + '-master/get-need-report-template-masters?page=' + obj.page + '&size=' + obj.size + '&templateName=' + obj.templateName + '&researchName=' + obj.researchName, 'get')
}

/**
 * 表单数据提交
 * @param resultMasterId
 * @returns {*}
 */
TemplateResultApi.commitResultMaster = function (resultMasterId) {
  return this.ajaxCom(baseUrl + '-master/commit?resultMasterId=' + resultMasterId, 'get')
}
/**
 * 表单提交数据驳回
 * @param resultMasterId
 */
TemplateResultApi.rejectResultMaster = function (resultMasterId) {
  return this.ajaxCom(baseUrl + '-master/reject?resultMasterId=' + resultMasterId, 'get')
}
/**
 * 获取指定用户表单填报记录
 */
TemplateResultApi.userReportProjectsQuery = function (obj) {
  return this.ajaxCom(baseUrl + '-master/user-report-projects-query', 'get', obj)
}
/**
 * 根据表单是否填报过/填报过得记录是否都已提交   来确定是否创建新记录   resultmaster
 * @param templateMasterId
 */
TemplateResultApi.createNewResult = function (templateMasterId) {
  return this.ajaxCom(baseUrl + '-master/create-common?id=' + templateMasterId, 'get')
}

/**
 * 表单填报查询-查看详情   获取表单填报记录
 * @param resultMasterDetail {
 *  templateId 表单ID
 *  fillName 填报人名称
 *  completeRate 填报比例
 *  done 是否提交
 *  operator; //条件查询是填报比例前运算符 1 大于 0 等于 -1 小于
 * }
 * @pageable {page,size}
 */
TemplateResultApi.getTemplateResults = function (obj) {
  return this.ajaxCom(baseUrl + '-master/detail?pageNo=' + obj.pageNo + '&pageSize=' + obj.pageSize + '&templateId=' +
    obj.templateId + '&fillName=' + obj.fillName + '&operator=' + obj.operator + '&rate=' + obj.rate + '&done=' + obj.done, 'get')
}
/**
 * 获取表单页填报结果
 * @param pageId 必传
 * @param resultMasterId 选传
 */
TemplateResultApi.getPageResult = function (obj) {
  return this.ajaxCom(baseUrl + '/get-page-result', 'get', obj)
}
/**
 * 保存表单
 * @param templateResultObj
 */
TemplateResultApi.saveTemplateResult = function (obj) {
  return this.ajaxCom(baseUrl + '/merge', 'post', obj)
}
export default TemplateResultApi
