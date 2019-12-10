import ApiCom from '../api'

const AuditApplyApi = new ApiCom()

// 获取申请列表
AuditApplyApi.applyReport = function (obj) {
  return this.ajaxCom('/dr-api/template/template-master/find-apply-records', 'get', obj)
}
// 审核通过与不通过
// 1待审核  2已通过   -1  未通过
AuditApplyApi.toApply = function (obj) {
  return this.ajaxCom('/dr-api/template/template-master/confirm-apply-record?applyId=' + obj.applyId + '&applyStatus=' + obj.applyStatus, 'post', {
    confirmOpinion: obj.confirmOpinion
  })
}

export default AuditApplyApi
