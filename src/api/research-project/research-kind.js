// 任务分类
import ApiCom from '../api'

const ResearchKindApi = new ApiCom()
/**
 * 创建分类类别
 * {typeCode,typeName}
 */
ResearchKindApi.addTask = function (obj) {
  return this.ajaxCom('/dr-api/template/template-class-type/merge-type', 'post', obj)
}
/**
 * 修改分类类别
 * {typeCode,typeName}
 */
ResearchKindApi.editTask = function (obj) {
  return this.ajaxCom('/dr-api/template/template-class-type/merge-template-class-type', 'post', obj)
}
/**
 * 根据ID删除分类类别
 */
ResearchKindApi.deleteTask = function (obj) {
  return this.ajaxCom('/dr-api/template/template-class-type/delete-type?typeId=' + obj.typeId, 'delete')
}
/**
 * 创建及修改分类
 * typeId(或)parentId templateClass:{className , classCode}
 */
ResearchKindApi.mergeTemplateClass = function (obj) {
  return this.ajaxCom('/dr-api/template/template-class-type/merge-class', 'post', obj)
}

/**
 *根据ID删除分类
  classId
 */
ResearchKindApi.deleteTemplateClass = function (obj) {
  return this.ajaxCom('/dr-api/template/template-class-type/delete-class?classId=' + obj.classId, 'delete')
}

export default ResearchKindApi
