import config from '@/config/index.js'

// 输出混合
export default {
  methods: {
    /**
     * 处理文件上传、下载、删除等操作
     * @param  {Object} file [文件信息]
     * @param  {String} type [操作类型]
     * @param  {String} code [元数据ID]
     */
    handleFileUploadChange (file, type, data) {
      data = data || []
      // 如果为删除
      if (type === 'remove') {
        let index = M.inArray(data, file)
        data.splice(index, 1)
      } else if (type === 'add') {
        data.push(file)
      } else if (type === 'download') { // 如果为下载
        window.open(config.downLoadAddress + '?url=' + file.response.url)
      }
    }
  }
}
