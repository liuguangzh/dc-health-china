<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <div class="layout">
    <Tabs type="card">
      <TabPane label="我主导的课题" name="name2">
        <Table border :columns="columnsMy" :data="MyTableData" no-data-text="没有主导的课题"
               @on-row-dblclick="toFormPage"></Table>
      </TabPane>
      <TabPane label="我参与的课题" name="name3">
        <Table border :columns="columnsIn" :data="InTableData" no-data-text="没有参与的课题"></Table>
      </TabPane>
      <Button @click="addNewProject" type="primary" slot="extra">新建课题</Button>
    </Tabs>
    <!--新建/编辑课题 -->
    <Modal v-model="handleProState" :title="handleProTitle" @on-ok="sureAdd" @on-cancel="cancelAdd">
      <Form ref="newProForm" :model="newProInfo" :rules="rulesVali" :label-width="80">
        <FormItem label="课题名称" prop="researchProjectName">
          <Input v-model="newProInfo.researchProjectName" placeholder="请填写课题名称"></Input>
        </FormItem>
        <FormItem label="课题描述">
          <Input v-model="newProInfo.description" type="textarea" :autosize="{minRows:3}" placeholder="请填写课题描述"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 删除课题 -->
    <Modal v-model="deleteProState" title="删除课题" @on-ok="sureDelete">
      <Alert type="error">确定要删除此课题吗？</Alert>
    </Modal>

  </div>
</template>

<script>
  import {ResearchProjectApi} from '@/api/'
  import Editor from '_c/editor'

  export default {
    name: "project",
    data() {
      return {
        //新建/编辑课题弹窗状态值
        handleProState: false,
        //删除课题弹窗状态值
        deleteProState: false,
        //操作类型
        handleType: "",
        //选中删除课题信息
        cheackedProInfo: "",
        //新建课题弹窗头部标题
        handleProTitle: "",
        //新建课题传值
        newProInfo: {
          researchProjectName: "",
          description: ""
        },
        //验证添加
        rulesVali: {
          researchProjectName: [{
            required: true,
            message: "请填写课题名称",
            trigger: "blur"
          }]
        },
        //表单头部信息
        //我主导的
        columnsMy: [{
          title: "科研课题",
          key: "projectName"
        }, {
          title: "课题描述",
          key: "description"
        }, {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
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
              }, '人员管理'),
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
            ]);
          }
        }],
        //我参与的
        columnsIn: [{
          title: "科研课题",
          key: "projectName"
        }, {
          title: "课题描述",
          key: "description"
        }],
        //表单主体信息
        InTableData: [],
        MyTableData: [],
        //原始数据
        inOldData: [],
        myOldData: []

      }
    },
    components: {
      Editor
    },
    methods: {
      //进入课题人员管理
      proStaff(val) {
        this.$router.push({
          name: 'projectMemeber',
          params: {
            projectId: val.row.id,
          }
        })
      },
      //进入表单页
      toFormPage(row,index){
        this.$router.push({
          path: '/form-page.html',
          query: {
            id: row.id,
            ProName: row.projectName
          }
        })
      },
      //新建课题
      addNewProject() {
        this.handleType = 'add';
        this.handleProTitle = "新建课题";
        this.handleProState = true;
      },
      //确认新建
      sureAdd() {
        let _this = this;
        if (this.handleType === "add") {
          ResearchProjectApi.ajaxCom("/dr-api/research-project/create", "post", this.newProInfo).then(res => {
            this.newProInfo = {
              researchProjectName: "",
              description: ""
            }
            this.getMyProjectList();
          }).catch(err => {
            this.$Message.error({
              content: "新建失败,请重试",
              duration: 2
            })
          })
        }
        if (this.handleType === "edit") {
          ResearchProjectApi.ajaxCom("/api/research-project", "put", this.newProInfo).then(res => {
            if (res.status == 200) {
              let obj = JSON.parse(JSON.stringify(this.newProInfo));
              //改变本地数据显示
              this.MyTableData[this.cheackedProInfo.index].projectName = obj.researchProjectName;
              this.MyTableData[this.cheackedProInfo.index].description = obj.description;

              this.newProInfo = {
                researchProjectName: "",
                description: ""
              }
            }
          }).catch(err => {
            this.$Message.error({
              content: "编辑失败,请重试",
              duration: 2
            })
          })
        }
      },
      //取消新建
      cancelAdd() {
        //清空选项
        this.newProInfo = {
          researchProjectName: "",
          description: ""
        }
      },
      //编辑课题
      editPro(row) {
        this.handleType = "edit";
        this.handleProTitle = "编辑课题";
        this.cheackedProInfo = row;
        this.handleProState = true;
        this.newProInfo = this.myOldData[row.index];
      },
      //删除课题
      removePro(row) {
        alert("nima")
        this.cheackedProInfo = row;
        this.deleteProState = true;
      },
      //确定删除
      sureDelete() {
        let obj = JSON.parse(JSON.stringify(this.myOldData[this.cheackedProInfo.index]));
        ResearchProjectApi.ajaxCom('/api/research-project/delete/'+obj.id, 'delete').then(res => {
          if (res.status == 200) {
            this.MyTableData.splice(this.cheackedProInfo.index, 1);
            this.$Message.success({
              content: "删除成功",
              duration: 2
            })
          }
        }).catch(err => {
          console.log(err.response)
        });
      },
      //获取我主导的课题
      getMyProjectList() {
        ResearchProjectApi.ajaxCom('/api/research-project/find-my-research', 'get', {}).then(res => {
          this.myOldData = res.data;
          this.MyTableData = res.data.map(item => {
            return {
              id: item.id,
              projectName: item.researchProjectName,
              description: item.description
            }
          })
        });
      },
      //获取我参与的课题
      getInProjectList() {
        ResearchProjectApi.ajaxCom('/api/research-project/find-in-research', 'get', {}).then(res => {
          this.inOldData = res.data;
          this.InTableData = res.data.map(item => {
            return {
              projectName: item.researchProjectName,
              description: item.description
            }
          })
        })
      }
    },
    mounted() {
      //我主导的课题
      this.getMyProjectList();
      //我参与的课题
      this.getInProjectList();
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
