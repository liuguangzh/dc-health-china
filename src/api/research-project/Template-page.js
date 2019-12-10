import ApiCom from '../api'

const baseUrl = '/dr-api/template/template-page'
let TemplatePageApi = new ApiCom(baseUrl)
/**
 * 获取表单页结构及其填报结果
 * @param {
 *    templateId 表单模板ID
 *    masterId 填报数据ID
 *  }
 */
TemplatePageApi.getTemplatePagesAndResults = function (params) {
  return this.ajaxCom(baseUrl + '/get-template-pages-and-results', 'get', params)
}
/**
 * 上传模板缩略图
 * @param {templateId ,base64Img, imgName}
 */
TemplatePageApi.uploadTemplateImg = function (obj) {
  return this.ajaxCom('http://10.1.85.34:9999/upload', 'post', obj)
}
/**
 *  删除表单页
 * @param pageId
 */
TemplatePageApi.deletePageById = function (pageId) {
  return this.ajaxCom('/dr-api/template/template-page/delete-page?pageId=' + pageId, 'delete')
}
export default TemplatePageApi
