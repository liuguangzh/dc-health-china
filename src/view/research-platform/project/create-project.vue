<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
</style>

<template>
  <div class="layout">
    <Row type="flex" align="middle" style="margin-bottom:20px;">
      <Col span="6"><span>任务名称：</span><Input v-model="projectName" clearable placeholder="查询任务名称" style="width:70%;"></Input></Col>
      <Col span="6"><span>任务负责人：</span><Input v-model="projectLeader" clearable placeholder="查询任务负责人" style="width:70%;"></Input></Col>
      <Col span="2"><Button type="primary" size="small" @click="findByTerm">查询</Button></Col>
      <Col span="3" push='7'><Button @click="addNewProject" type="primary" size="small">创建科研任务</Button></Col>
    </Row>
    <Table border :columns="columnsMy" :data="MyTableData" no-data-text="没有创建的任务"></Table>
    <div style="text-align:center;margin-top:10px;">
      <Page :total="totalSize" :current="currentPage" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator prev-text="上一页" next-text="下一页"/>
    </div>
    <!--创建/编辑任务 -->
    <Modal v-model="handleProState" :title="handleProTitle">
      <Form ref="newProForm" :model="newProInfo" :rules="rulesVali" :label-width="100">
        <FormItem label="任务名称" prop="researchProjectName">
          <Input v-model="newProInfo.researchProjectName" placeholder="请填写任务名称"></Input>
        </FormItem>
        <FormItem label="任务负责单位" prop="department">
          <Input v-model="newProInfo.department" placeholder="请填写任务负责单位"></Input>
        </FormItem>
        <FormItem label="任务负责人" prop="leader">
          <Input v-model="newProInfo.leader" placeholder="请填写任务负责人"></Input>
        </FormItem>
        <FormItem label="任务描述">
          <Input v-model="newProInfo.description" type="textarea" :autosize="{minRows:3}" placeholder="请填写任务描述"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button type="text" @click="cancelAdd">取消</Button>
          <Button type="primary" @click="sureAdd">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ResearchProjectApi, CreateResearchProjectApi } from '@/api/'
import Editor from '_c/editor'
import { getDate } from '@/libs/tools.js'
export default {
  name: 'ceate-project',
  data () {
    return {
      // 创建/编辑任务弹窗状态值
      handleProState: false,
      // 操作类型
      handleType: '',
      // 选中删除任务信息
      cheackedProInfo: '',
      // 创建任务弹窗头部标题
      handleProTitle: '',
      // 创建任务传值
      newProInfo: {
        // 任务名称
        researchProjectName: '',
        // 任务负责人
        leader: '',
        // 负责单位
        department: '',
        // 任务描述
        description: ''
      },
      // 验证添加
      rulesVali: {
        researchProjectName: [{
          required: true,
          message: '请填写任务名称',
          trigger: 'blur'
        }]
      },
      // 表单头部信息
      // 我创建的
      columnsMy: [{
        title: '序号',
        key: 'projectNum',
        width: 60
        }, {
          title: '科研任务名称',
          key: 'projectName'
        }, {
          title: '任务负责人',
          key: 'projectUser',
          width: 100
        }, {
          title: '创建日期',
          key: 'createTime',
          width: 110
        }, {
          title: '任务描述',
          key: 'description'
        }, {
          title: '操作',
          key: 'action',
          width: 260,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.proStaff(params)
                  }
                }
              }, '管理人员'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editPro(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.getMoreInfo(params)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  ghost:true
                },
                on: {
                  click: () => {
                    this.removePro(params)
                  }
                }
              }, '删除')
            ])
          }
        }],
      // 表单主体信息
      MyTableData: [],
      // 分页-科研任务总条数
      totalSize: 10,
      // 原始数据
      myOldData: [],
      // 查询任务名称
      projectName: '',
      // 查询任务负责人
      projectLeader: '',
      //列表分页-当前页 后天从零开始
      currentPage:1,
      //当前页显示条数
      pageSize:10

    }
  },
  components: {
    Editor
  },
  methods: {
    // 进入任务人员管理
    proStaff (val) {
      this.$router.push({
        name: 'projectMemeber',
        params: {
          projectId: val.row.id,
          currentPage:this.currentPage
        }
      })
    },
    // 创建任务
    addNewProject () {
      this.$router.push('/home.html')
      // this.$router.push("/project-by-template.html")
      // this.handleType = 'add'
      // this.handleProTitle = '创建任务'
      // this.handleProState = true
    },
    // 确认编辑
    sureAdd () {
      let _this = this
      this.$refs.newProForm.validate((valid) => {
        if (valid) {
          if (this.handleType === 'edit') {
            CreateResearchProjectApi.editResearchProject(this.newProInfo).then(res => {
              if(res.data.code === '1'){
                this.$Message.success({
                  content: '编辑成功',
                  duration: 2
                })
                let obj = JSON.parse(JSON.stringify(this.newProInfo))
                // 改变本地数据显示
                this.MyTableData[this.cheackedProInfo.index].projectName = obj.researchProjectName
                this.MyTableData[this.cheackedProInfo.index].description = obj.description

                this.newProInfo = {
                  researchProjectName: '',
                  leader: '',
                  department: '',
                  description: ''
                }
                this.getMyProjectList();
                // 关闭弹窗
                this.handleProState = false
              } else {
                this.$Message.error({
                  content: '编辑失败,请重试',
                  duration: 2
                })

                // 关闭弹窗
                this.handleProState = false
              }
            }).catch(err => {
              this.$Message.error({
                content: '编辑失败,请重试',
                duration: 2
              })

              // 关闭弹窗
              this.handleProState = false
            })
          }
        } else {
          this.$Message.error({
            content: '请填写完整必填项',
            duration: 2
          })
        }
      })
    },
    // 取消编辑
    cancelAdd () {
      // 清空选项
      this.newProInfo = {
        researchProjectName: '',
        leader: '',
        department: '',
        description: ''
      }
      this.handleProState = false
    },
    //查看详细信息
    getMoreInfo(params){
      this.$router.push({
        path:'/project-info.html',
        query:{
          projectId:params.row.id,
          currentPage:this.currentPage
        }
      })
    },
    // 编辑任务
    editPro (row) {
      this.handleType = 'edit'
      this.handleProTitle = '编辑任务'
      this.cheackedProInfo = row
      this.handleProState = true
      //回显值
      this.newProInfo = this.myOldData[row.index]
    },
    // 删除任务
    removePro (value) {
      if(value.row.templateMasters){
        this.$Message.error({
          content:"请先删除下属表单",
          duration:5
        })
      }else{
        this.cheackedProInfo = value
        this.$Modal.confirm({
          title:'删除科研任务',
          content:'确定要删除此科研任务吗?',
          onOk:()=>{
            this.sureDelete()
          }
        })
      }
    },
    // 确定删除
    sureDelete () {
      let obj = JSON.parse(JSON.stringify(this.myOldData[this.cheackedProInfo.index]))
      CreateResearchProjectApi.deleteResearchProject(obj.id).then(res => {
        if (res.data.code == '1') {
          this.MyTableData.splice(this.cheackedProInfo.index, 1)
          this.$Message.success({
            content: '删除成功',
            duration: 2
          })
          this.totalSize = this.totalSize - 1 ;
          // 当前页任务全部删除以后-也跳转
          if(this.MyTableData.length === 0){
            // 如果所在页数不在第一页，删除完成后，前进一页，如果在第一页，页数不做操作
            if(this.currentPage > 1){
              this.currentPage--;
            }
          }
          this.getMyProjectList();
        }
      }).catch(err => {
        this.$Message.error({
          content: '删除失败',
          duration: 2
        })
      })
    },
    // 根据条件查询
    findByTerm () {
      this.currentPage = 1
      this.getMyProjectList();
    },
    // 改变页码
    changePage (index) {
      this.currentPage = index;
      this.getMyProjectList();
    },
    // 改变每页条数
    changePageSize (size) {
      this.pageSize = size;
      this.getMyProjectList();
    },
    // 获取我创建的任务
    getMyProjectList () {
      let obj = {
        //查询任务名称
        projectName:this.projectName,
        //查询任务负责人
        leader:this.projectLeader,
        //当前页
        pageNo:this.currentPage,
        //每页显示条数
        pageSize:this.pageSize
      }
      CreateResearchProjectApi.getResearchProject(obj).then(res =>{
        this.myOldData = res.data.data.data;
        this.totalSize = res.data.data.totalRows;
        this.MyTableData = res.data.data.data.map((item, index) => {
          return {
            projectNum: index + 1,
            id: item.id,
            projectName: item.researchProjectName,
            projectUser: item.leader,
            createTime: item.createDate?item.createDate.substring(0, 10):"",
            description: item.description,
            templateMasters:item.templateMasters
          }
        })
      })
    },
  },
  mounted () {
    // 我创建的任务
    if(this.$route.query.currentPage){
      this.currentPage = Number(this.$route.query.currentPage)
    }
    this.getMyProjectList()
  },
  activated(){
    // 我创建的任务
    if(this.$route.query.currentPage){
      this.currentPage = Number(this.$route.query.currentPage)
    }
    this.getMyProjectList()
  }
}
</script>
<style lang="less" scoped>
  .layout {
    padding: 10px 10px;
    min-height: 100%;
    background: #fff;
    border-radius: 4px;
    .pro-head {
      height: 40px;
      line-height: 40px;
      h2 {
        float: left;
      }
      .head-btn-box {
        float: right
      }
    }
    .pro-item-title {
      margin: 15px 0;
    }
  }
</style>
