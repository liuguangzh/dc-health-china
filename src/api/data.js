import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  // return axios.request({
  //   url: 'api/error',
  //   data: info,
  //   method: 'post'
  // })
  console.log('请求失败，请检查失败原因：')
  console.log(info)
}
