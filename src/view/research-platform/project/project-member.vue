<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
.modal-member .ivu-modal-body{
  padding: 5px 16px;
}
</style>
<template>
  <div>
    <Card
      style="width: 100%;height: 100%"
      :bordered="false" :dis-hover="true">
      <div style="margin-bottom: 10px;">
        <Button type="primary" @click="showNewResearchUserModal">添加课题管理人员</Button>
        <Button type="primary" style="margin-left: 10px;" @click="removeResearchUser">批量删除课题管理人员</Button>
        <Button type="primary" style="margin-left: 10px;" @click="exportExcel">导出</Button>
        <Button type="primary" style="float:right;" @click="$router.back()">返回</Button>
      </div>
      <Table :columns="columnDefsL" :data="currentResearchProject.researchUser" @on-selection-change="changeResearchUsers"></Table>
      <Modal
        class="modal-member"
        width="70"
        :dis-hover="false"
        :mask-closable="false"
        v-model="addNewResearchUserModal">
        <p slot="header" style="color:#000;text-align:left">
          <span>添加课题管理人员</span>
        </p>
        <user-add-component :usersInfos="usersInfos"></user-add-component>
        <div style="margin: 10px 0px;text-align: center;">
          <Button type="primary" style="margin-left: 10px;" @click="saveReportUsers">保存</Button>
          <Button type="primary" style="margin-left: 10px;" @click="addNewResearchUserModal=false">返回</Button>
        </div>
        <p slot="footer">
        </p>
      </Modal>
    </Card>
  </div>
</template>
<script>
import InforCard from "../../../components/info-card/infor-card";
import {ResearchProjectApi, CreateResearchProjectApi} from '@/api/'
import {AgGridVue} from "ag-grid-vue";
import {getWindowHeight} from "@/libs/util"
import {findUserByLoginName,register} from '@/api/user'
import UserAddComponent from "../component/user-add-component";
import toExcel from '../template-data/excelOut/excelOut'
import Vue from 'vue'

Vue.prototype.$toExcel = toExcel;
export default {
  props:{
    transResearchProject:{
      type:Object,
      default:()=>{
        return  {
          researchUser: [],
          name: "",
          username: "",
          email: "",
          tel: ""
        }
      }
    },
  },
  components: {
    UserAddComponent,
    InforCard,
    AgGridVue
  },
  name: "project-member",
  data() {
    return {
      usersInfos:[],
      addNewResearchUserModal: false,
      projectId: '',
      // researchProjects: [],
      currentResearchProject: {
        researchUser: [],
        name: "",
        username: "",
        email: "",
        tel: ""
      },
      columnDefsL: [
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
          title: '真实姓名',
          key: 'name',
          align: 'center',
        },
        {
          title: '登录名',
          key: 'username',
          align: 'center',
        },
        {
          title: '手机号码',
          key: 'phone',
          align: 'center',
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center',
        },
        {
          title: '操作',
          key: '操作',
          align: 'center',
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
                    this.deleteResearchUser(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      selectedRows: []
    }
  },
  mounted() {
    this.projectId = this.$route.params.projectId
    if (!this.projectId) {
      this.projectId = ''
    }
    if(this.transResearchProject.id){
      this.currentResearchProject = this.transResearchProject ;
      this.projectId=this.currentResearchProject.id ;
    }
    this.getListProjectAdmin()
  },
  methods: {
    // 获取课题管理人员信息
    getListProjectAdmin(){
      ResearchProjectApi.listProjectAdmin(this.projectId).then(res => {
        if(res.data.code === '1'){
          if(res.data.data){
            this.currentResearchProject.researchUser = res.data.data
          }
        } else {
          this.$Message.error({content:"课题管理人员加载失败！"})
        }
      })
    },
    changeResearchUsers(item){
      this.selectedRows = item
    },
    removeResearchUser:function(){ // 删除课题管理人员
      if(this.selectedRows.length<=0){
        this.$Message.error({content:"请选择要删除的课题管理人员"})
        return
      }else{
        this.$Modal.confirm({
          title:'批量删除管理员',
          content:'您确定要删除选中的管理员吗？',
          onOk:()=>{
            let obj = {
              projectId: this.projectId,
              userIds: []
            }
            this.selectedRows.forEach(item=>{
              obj.userIds.push(item.id)
            })
            ResearchProjectApi.deleteProjectAdmin(obj).then(res=>{
              if(res.data.code === '1'){
                this.getListProjectAdmin()
                this.$Message.success({content:"删除成功！"})
              } else {
                this.$Message.error({content:"删除失败！"})
              }
            }).catch(err=>{
             this.$Message.error({content:"删除失败！"})
            })
          }
        })
      }
    },
    deleteResearchUser(item){ // 删除课题管理人员
      this.$Modal.confirm({
        title:'删除管理员',
        content:'您确定要删除此管理员吗？',
        onOk:()=>{
          let obj = {
            projectId: this.projectId,
            userIds: []
          }
          obj.userIds.push(item.id)
          ResearchProjectApi.deleteProjectAdmin(obj).then(res=>{
            if(res.data.code === '1'){
              this.getListProjectAdmin()
              this.$Message.success({content:"删除成功！"})
            } else {
              this.$Message.error({content:"删除失败！"})
            }
          }).catch(err=>{
             this.$Message.error({content:"删除失败！"})
          })
        }
      })
    },
    // 添加课题管理人员按钮
    showNewResearchUserModal: function () {
      this.addNewResearchUserModal = true;
    },
    /**
     * 添加科研人员
     */
    saveReportUsers(){
      if(this.usersInfos.length>0){
        let obj = {
          projectId: this.projectId,
          userIds: []
        }
        this.usersInfos.forEach(item => {
          obj.userIds.push(item.id)
        })
        ResearchProjectApi.addProjectAdmin(obj).then(res=>{
          if(res.data.code === '1'){
            this.getListProjectAdmin()
            this.$Message.success({content:"添加成功！"})
            this.addNewResearchUserModal = false
          } else {
            this.$Message.success('添加失败！')
          }
        }).catch(err=>{
          this.$Message.success('添加失败！')
        })
      }
    },
    exportExcel(){ // 导出数据
      let th = JSON.parse(JSON.stringify(this.columnDefsL))
          th.splice(0,2)
          th.pop()
      let filterVal = this.currentResearchProject.researchUser
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
      const [fileName, fileType, sheetName] = ['课题管理人员', 'xlsx', '课题管理人员'];
      this.$toExcel({th, data, fileName, fileType, sheetName})
    },
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
