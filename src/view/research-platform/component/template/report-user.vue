<style lang="less">
.modal-report-user .ivu-modal-body{
  padding: 5px 16px;
}
</style>

<template>
    <!--//填报人员设置界面-->
  <div >
    <Modal class="modal-report-user" v-model="reportUserModal" large width="80" :mask-closable="false" title="添加填报人员">
      <!-- <template slot="header">
        <div style="float: left;font-weight: bolder;font-size: 24px">设置填报人员</div>
        <div style="text-align: right">
          <Button type="primary" @click="downLoadDefaultUser">下载模板</Button>
          <file-upload ref="upload"
                       v-model="files"
                       @input-file="inputFile"
                       @input-filter="inputFilter"
                       :data="uploadData"
                       :extensions="['xlsx', 'xls']"
                       :active="true"
                       post-action="/api/template/template-master/create-report-user-with-list"
                       name="file">
            <Button type="primary" icon="ios-cloud-upload-outline">上传名单</Button>
          </file-upload>
        </div>
      </template> -->
      <user-add-component :usersInfos="usersInfos"></user-add-component>
      <div style="margin: 10px 0px; text-align: center;">
        <Button type="primary" @click="saveReportUsers">保存</Button>
        <Button type="primary" style="margin-left: 20px;" @click="closeModal">取消</Button>
      </div>
      <p slot="footer"></p>
    </Modal>
    <Modal v-model="infomationModal" :closable="true" :mask-closable="false" title="系统提示">
      <p style="font-weight: bolder;font-size: 24px;color:red">系统正在处理中，请耐心等候.......</p>
      <p slot="footer"></p>
    </Modal>
  </div>
</template>

<script>
  import UserSelectComponent from "../user-select-component";
  import UserAddComponent from "../user-add-component";
  import FileUpload from 'vue-upload-component'
  import {ResearchProjectApi,TemplateApi} from "@/api";

  export default {
    components: {
      UserAddComponent,
      UserSelectComponent,FileUpload},
    name: "report-user",
    data(){
      return {
        infomationModal:false,
        usersInfos:[],
        reportUserModal:false,
        templateId:"",
        uploadData: {
          templateId: this.templateId
        },
        files: [],
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
        }else{

        }
      }
    },
    methods:{
      getAlreadyAddUser(templateId){
        TemplateApi.findReportUserByTemplateId(templateId).then(res=>{
          if(res.data.hasOwnProperty('reportUserInfos') && res.data.reportUserInfos.length > 0){
            
           let users =res.data.reportUserInfos.map(item=>{
              return item.sysUser
            })
            // this.usersInfos = users
          }
        }).catch(err=>{
          console.log(err.response)
        })
      },
      openReportUserModal:function(templateId){
        if(!templateId){
          this.$Message.error({content:"获取表单信息失败！"})
          return ;
        }
        this.templateId = templateId;
        this.reportUserModal = true ;
        // this.getAlreadyAddUser(templateId);
      },
      /**
       * 下载用户模板
       */
      downLoadDefaultUser: function () {
        ResearchProjectApi.getUserList().then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'excel.xlsx')

          document.body.appendChild(link)
          link.click()
        })
      },
      inputFile: function (newFile, oldFile) {
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
            if (response.length <= 0) {
              this.$Message.success({ content: '创建成功'})

            } else {
              let content = '';
              for (let i = 0; i < response.length; i++) {
                content += '<p>第' + response[i].rowNum + '行，有错误消息：' + response[i].errorMessage + "</p>";
              }
              this.$Modal.info({title: '系统提示', content: content})
            }
            // this.$.Modal.
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

        if (!newFile && oldFile) {
          // 移除文件

          // 拒绝删除文件
          // return prevent()
        }
      },
      saveReportUsers:function(){
        let users = []
        this.usersInfos.forEach(item => {
          users.push(item.id)
        })
        TemplateApi.createReportUserWithList(users,this.templateId).then(res=>{
          if(res.data.code === '1'){
            this.$parent.getInitListFillers();
            // this.getAlreadyAddUser(this.templateId);
            this.closeModal();
            this.$Message.success({content:"添加成功！"})
          } else {
            this.$Message.error({content:"添加失败！"})
          }
        })
      },
      closeModal:function(){
        this.reportUserModal = false;
        this.templateId = "" ;
      }
    }
  }
</script>

<style scoped>
  .file-uploads {
    overflow: visible;
    position: relative;
    text-align: center;
    display: inline-block;
  }
</style>
