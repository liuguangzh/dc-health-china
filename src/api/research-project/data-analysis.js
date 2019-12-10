import ApiCom from '../api'

const DataAnalysisApi = new ApiCom()

/**
 * 获取数据表的定义
 * @param id
 * @returns {*}
 * 获取自定义数据表下属字段
 */
DataAnalysisApi.getDataTableById = function (id) {
  return this.ajaxCom('/dr-api/data-table?dataTableId=' + id, 'get')
}

DataAnalysisApi.getDatasFromTable = function (dataTable) {
  return this.ajaxCom('/dr-api/data-table/get-data-table-datas?dataTableId=' + dataTable, 'get')
}

/**
 *获取已选字段的提交的数据
 * id 表单ID
 * obj 为字段名称以及筛选条件
 * */
DataAnalysisApi.getCommitData = function (id, obj, pageable) {
  if (obj) {
    return this.ajaxCom('/dr-api/data-analysis/list-all-commit-datas?templateId=' + id + '&pageNo=' + pageable.page + '&pageSize=' + pageable.size, 'post', obj)
  } else {
    return this.ajaxCom('/dr-api/data-analysis/list-all-commit-datas?templateId=' + id + '&pageNo=' + pageable.page + '&pageSize=' + pageable.size, 'post')
  }
}
/**
 * 数据分析-获取所有自定义的数据表
 */
DataAnalysisApi.getAllTables = function (obj) {
  return this.ajaxCom('/dr-api/data-table/get-data-tables', 'get', obj)
}
/**
 * 数据分析-获取指定自定义数据表-数据
 */
DataAnalysisApi.getTableDatas = function (obj) {
  return this.ajaxCom('/dr-api/data-table/get-data-table-datas?dataTableId=' + obj.id, 'get')
}
/**
 * 自定义报表设计器-选取字段-对Y轴选取字段进行验证-
 * 只能为数字
 */
DataAnalysisApi.validateY = function (obj) {
  return this.ajaxCom('/dr-api/data-analysis/check-yaxis', 'post', obj)
}
/**
 * 报告展示-获取所有报告分组及下属报告
 * @param projectFlag [0:单任务  1：多任务 非必传]
 * @param projectName [任务名称 非必传]
 * @param projectId [任务名称 非必传]
 */
DataAnalysisApi.getAllReport = function (obj) {
  return this.ajaxCom('/dr-api/template/rule/all', 'get', obj)
}

/**
 * 报告展示-分组与报告为同一接口   删除为逻辑删除   status= "-1"
 */
DataAnalysisApi.saveReport = function (obj) {
  return this.ajaxCom('/dr-api/template/rule/merge', 'post', obj)
}

/**
 * 报告展示-分组与报告删除接口
 */
DataAnalysisApi.deleteReportGroup = function (ruleId) {
  return this.ajaxCom('/dr-api/template/rule/delete?ruleId=' + ruleId, 'delete')
}

/**
 * 获取指定报告数据
 */
DataAnalysisApi.getReportData = function (obj) {
  return this.ajaxCom('/dr-api/data-analysis/get-many-report-statistics', 'post', obj)
}
/**
 * 数据分析-数据去重
 * @param DataTable [对象]
 */
DataAnalysisApi.removeDuplicateData = function (obj) {
  return this.ajaxCom('/dr-api/data-table/remove-duplicate-data', 'post', obj)
}
export default DataAnalysisApi
