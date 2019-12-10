import axios from '@/libs/api.request'
/**
 * 搜索获取节点
 */
export const getNode = (searchWhat)=>{
    return axios.request({
        url: 'api/health/get-knowledge-query-result',
        method:'get',
        params:{
            label: searchWhat
        }
    })
}
/**
 * 通过ID获取下一级节点
 * @param {*} id 
 * @param {*} kgType 
 */
export const getChildNode = (id, kgType) => {
    return axios.request({
        url: 'api/health/get-around-entity-by-id',
        method:'post',
        data:{
            id,
            kgType
        }
    })
}
 /**
  * 保存，编辑历史记录/收藏记录
  * @param {*} obj
  * type 0为历史  1为收藏  
  * status 0为新增 1为修改 -1为删除
  */
export const saveOrEditHistory = (obj) => {
    return axios.request({
        url: 'api/health/merge',
        method: 'post',
        data: obj
    })
}

/**
 * 获取历史记录/收藏记录
 * @param {*} obj
 * obj = {
   userId: "",
   type: ""
 }
 * type 0为历史  1为收藏  
 */
export const getHistoryList = (obj) => {
    return axios.request({
        url: 'api/health/get-his-knowledge-list',
        method: 'get',
        params: obj
    })
}