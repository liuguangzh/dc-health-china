import ApiCom from '../api'

const baseUrl = '/dr-api/template/template-page-group/'
let TemplatePageGroupApi = new ApiCom(baseUrl)
/**
 * 获取表单模板下的表单页信息
 * @param templateId  表单模板ID
 */
TemplatePageGroupApi.getTemplatePages = function (params) {
  return this.ajaxCom(baseUrl + 'get-template-groups', 'get', params)
}
/**
 * 删除表单页分组
 * @param id 分组id
 */
TemplatePageGroupApi.deletePageGroup = function (id) {
  return this.ajaxCom(baseUrl + 'delete-template-groups?id=' + id, 'delete')
}

export default TemplatePageGroupApi
