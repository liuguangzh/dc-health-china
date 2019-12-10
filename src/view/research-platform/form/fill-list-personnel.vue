<style lang="less">
.ivu-upload-select{
  width: 80%;
  cursor: pointer;
}
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <div class="layout">
    <Row type="flex" align="middle" justify="space-between">
      <Col style="margin-top: 20px;">
        <Button type="primary" style="margin-bottom: 30px;" @click="addFillers">添加填报人员</Button>
        <Button type="primary" style="margin-left: 10px;margin-bottom: 30px;" @click="downLoadDefaultUser">下载批量添加模板</Button>
        <!-- <Button type="primary" style="margin-left: 10px;" @click="batchRegisteredFillers">批量添加填报人员</Button> -->
        <file-upload ref="upload"
          style="margin-left: 10px;cursor: pointer;"
          v-model="files"
          :headers='headers'
          @input-file="inputFile"
          @input-filter="inputFilter"
          :data="uploadData"
          :extensions="['xlsx', 'xls']"
          :active="true"
          post-action="/dr-api/template/template-master/create-report-user-with-list"
          name="file">
          <!-- <Input search enter-button="选择文件" placeholder="请选择文件" /> -->
          <Button type="primary">批量添加填报人员</Button>
        </file-upload>
        <Button type="error" style="margin-left: 10px;margin-bottom: 30px;" @click="deleteFillers">批量删除填报人员</Button>
        <Button type="primary" style="margin-left: 10px;margin-bottom: 30px;" @click="exportFillers">导出Excel</Button>
      </Col>
      <Col>
        <Button style="margin-bottom: 30px;" type="primary" @click="returnMainPage">返回</Button>
      </Col>
    </Row>
    <div>
      <Table :columns="tableHead" :data="fillerList" border @on-select="selectFillers" @on-select-all="selectFillers"></Table>
    </div>
    <report-user ref="reportUserModal"></report-user>
    <Modal v-model="infomationModal" :closable="true" :mask-closable="false" title="系统提示">
      <p style="font-weight: bolder;font-size: 16px;color:red">系统正在处理中，请耐心等候.......</p>
      <p slot="footer"></p>
    </Modal>
  </div>
</template>
<script>
import ReportUser from "../component/template/report-user";
import { ResearchProjectApi, TemplateApi } from '@/api/'
import FileUpload from 'vue-upload-component'
import toExcel from '../template-data/excelOut/excelOut'
import {getToken} from '@/libs/util.js'
import Vue from 'vue'

Vue.prototype.$toExcel = toExcel;
export default {
  name: "fill-list-personnel",
  components: {
    ReportUser,
    FileUpload
  },
  data() {
    return {
      headers:{},
      templateId: '',
      tableHead: [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
      },
      {
        title: "真实姓名",
        key: "name",
        align: 'center'
      },
      {
        title: "登录名",
        key: "username",
        align: 'center'
      },
      {
        title: "手机号码",
        key: "phone",
        align: 'center'
      },
      {
        title: "邮箱",
        key: "email",
        align: 'center'
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 120,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
                ghost:true
              },
              on: {
                click: () => {
                  this.deleteRowFillers(params.row)
                }
              }
            }, '删除')
          ])
        }
      }],
      fillerList: [],
      deleteContent: [], // 删除填报人员
      showDeleteFillers: false, // 删除填报人员弹窗
      showJudgeDelete: false, // 是否删除弹窗
      files: [], 
      infomationModal: false, // 系统提示弹窗
      uploadData: {
        templateId: this.templateId
      },
      deleteParams: [] // 删除参数
    }
  },
  watch: {
    templateId(newValue) {
      this.uploadData.templateId = newValue;
    },
    files(newValue) {
      if (newValue.length > 0) {
        if (newValue.success) {
          //文件上传成功
          this.$Message.success({content: '文件上传成功'})
        }
      }
    }
  },
  mounted(){
    this.getInitListFillers()
    let token = getToken()
    this.headers.authorization = token
  },
  methods: {
    getInitListFillers(){
      this.templateId = this.$route.params.id
      TemplateApi.findReportUserByTemplateId(this.templateId).then(res => {
        if(res.data.code === '1'){
          this.reportUser = res.data.data;
          this.fillerList = [];
          if (this.reportUser) {
            this.reportUser.forEach(item => {
              this.fillerList.push(item)
            })
          }
        } else {
          this.$Message.error('获取填报人员信息失败')
        }
      })
    },
    selectFillers(selections,item){ // 选择框改变
      this.deleteContent = selections
    },
    addFillers(){ // 添加填报人员
      this.$refs.reportUserModal.openReportUserModal(this.templateId)
    },
    deleteFillers(){ // 删除多选填报人员
      this.deleteParams = []
      if(this.deleteContent.length === 0){
        this.$Message.error('请选择需要删除的填报人员')
      } else {
        this.deleteContent.forEach(item => {
          this.deleteParams.push(item.id)
        })
        this.$Modal.confirm({
          title:'批量删除填报人员',
          content:'您确定要删除选中填报人员吗？',
          onOk:()=>{
            this.checkDeleteFillers()
          }
        })
      }
    },
    deleteRowFillers(item){ // 删除行填报人员
      this.deleteParams = []
      this.deleteParams.push(item.id)
      this.$Modal.confirm({
        title:'删除填报人员',
        content:'您确定要删除此填报人吗？',
        onOk:()=>{
          this.checkDeleteFillers()
        }
      })
    },
    checkDeleteFillers(){ // 确认删除填报人员
      TemplateApi.deleteReportUserByTemplateId(this.templateId, this.deleteParams).then(res => {
        if(res.data.code === '1'){
          this.getInitListFillers()
          this.$Message.success('删除表单指定人员成功')
        } else {
          this.$Message.error({
            content: '删除表单指定人员失败',
            duration:4
          })
        }
      })
    },
    downLoadDefaultUser(){ //  下载用户模板
      ResearchProjectApi.getUserList().then(res => {
        const type = "text/plain; charset=UTF-8";
        let filename = '批量上传人员模板.xlsx'
        let blob = new Blob([res.data], { type: type })
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
              window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);
          var a = document.createElement("a");
          if (typeof a.download === 'undefined') {
            window.location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a)
          }
        }
      })
    },
    inputFile(newFile, oldFile){
      // 自动上传
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadData.templateId) {
          if (!this.$refs.upload.active) {
            this.$refs.upload.active = true
            this.infomationModal = true ;
          }
        } else {
          this.$Message.error({content: '请选择表单！'})
        }
      }

      if (newFile && oldFile) {
        if (newFile.success !== oldFile.success) {
          this.infomationModal = false ;
          const response = newFile.response;
          this.getInitListFillers()
          if (response.length <= 0) {
            this.$Message.success({content: '创建成功'})
          } else {
            let content = '';
            for (let i = 0; i < response.length; i++) {
              content += '<p>第' + response[i].rowNum + '行，有错误消息：' + response[i].errorMessage + "</p>";
            }
            this.$Modal.info({title: '系统提示', content: content})
          }
        }
        if (newFile.error !== oldFile.error) {
          this.$Message.error('上传失败')
          this.infomationModal = false ;
        }
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // 添加文件
        // 过滤非图片文件
        // 不会添加到 files 去
        if (!/\.(xls|xlsx)$/i.test(newFile.name)) {
          this.$Message.error({content: "只能上传Excel格式的文件"})
          return prevent()
        }
      }
      if (newFile && oldFile) {
        // 更新文件
        // 增加版本号
        if (!newFile.version) {
          newFile.version = 0
        }
        newFile.version++
      }
    },
    exportFillers(){ // 导出Excel
      let th = JSON.parse(JSON.stringify(this.tableHead))
          th.splice(0,2)
          th.pop()
      let filterVal = this.fillerList
      let arr = []
      let col = []
      th.forEach(item => {
        arr.push(item.key)
        for(let i in filterVal[0]){
          if(item.key === i){
            col.push(i)
          }
        }
      })
      const data = filterVal.map(v => 
        col.map(k =>
          v[k]
        )
      );
      const [fileName, fileType, sheetName] = ['填报人员列表', 'xlsx', '填报人员列表'];
      this.$toExcel({th, data, fileName, fileType, sheetName})
    },
    returnMainPage(){ // 返回首页
      this.$router.push('/set-research-project.html?currentPage=' + this.$route.params.currentPage)
    }
  }
}
</script>
<style lang="less" scoped>
.ivu-table-header th{
  color:#FFD3B4;
  font-weight: bold;
  background-color: #212c31;
  border: none;
}
.layout{
  padding: 10px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
}
</style>

