import ApiCom from '../api'

const baseUrl = 'api/health-china/'

let IndicatorApi = new ApiCom(baseUrl)

IndicatorApi.getIndicator = function (name) {
  return this.ajaxCom(baseUrl + 'get-indicator?name=' + name, 'get')
}

IndicatorApi.deleteIndicator = function (indicatorId) {
  return this.ajaxCom(
    baseUrl + 'delete-indicator?indicatorId=' + indicatorId,
    'post'
  )
}

IndicatorApi.getValueVos = function (
  indicatorId,
  typeId,
  area,
  date,
  pageNumber
) {
  if (!pageNumber) {
    pageNumber = 0
  }
  return this.ajaxCom(baseUrl + 'get-values', 'get', {
    indicatorId: indicatorId,
    typeId: typeId,
    area: area,
    date: date,
    page: pageNumber
  })
}

IndicatorApi.getIndicatorValueTemplate = function () {
  return this.downloadFile(baseUrl + 'find-indicator-value-template', 'get')
}

export default IndicatorApi
