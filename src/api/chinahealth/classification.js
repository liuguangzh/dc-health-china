import ApiCom from '../api'

const baseUrl = 'api/health-china/class-type/'

let ClassificationApi = new ApiCom(baseUrl)

ClassificationApi.getTypes = function (name) {
  return this.ajaxCom(baseUrl + 'get-types?typeName=' + name, 'get')
}

ClassificationApi.getClassifications = function (typeId, parent) {
  return this.ajaxCom(baseUrl + 'get-classification?typeId=' + typeId + '&parentId=' + parent, 'post')
}

ClassificationApi.saveClassification = function (classification) {
  return this.ajaxCom(baseUrl + 'save-classification', 'post', classification)
}

ClassificationApi.deleteClassification = function (classificationId) {
  return this.ajaxCom(baseUrl + 'delete-classification?classificationId=' + classificationId, 'post')
}

/**
 * 保存分类方法
 * @param classificationType
 * @returns {*}
 */
ClassificationApi.saveClassificationType = function (classificationType) {
  return this.ajaxCom(baseUrl + 'save-classification-type', 'post', classificationType)
}

/**
 * 删除分类方法
 * @param typeId
 * @returns {*}
 */
ClassificationApi.deleteClassificationType = function (typeId) {
  return this.ajaxCom(baseUrl + 'delete-classification-type?typeId=' + typeId, 'post')
}


export default ClassificationApi
