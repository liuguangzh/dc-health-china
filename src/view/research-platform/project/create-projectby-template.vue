<template>
  <div class="layout">
    <div style="margin-bottom:10px;">
      <Row display='flex' align='middle' :gutter='20' justify='space-between'>
        <Col span='17'>
          <template-class @on-search="findByTerm" style></template-class>
        </Col>
        <Col span='7'>
          <Button
            type="primary"
            style="float:right;margin-right:5px;"
            @click="$router.push('/project.html')"
          >返回</Button>
          <div v-if="createBtnStatus"  class="buttom-btn" style="float:right;margin-left:5px;">
            <Button type="primary"  @click="createProjectWithTemplate">创建科研任务</Button>
          </div>
          <Button
            v-if="!createBtnStatus"
            style="float:right;margin-left:5px;margin-right:5px;"
            type="primary"
            @click="ceateProject"
          >创建科研任务</Button>
          <Badge :count="checkedNum" type="error" style="float:right;">
            <Button @click="handleCheckedTmp">已选模板 </Button>
          </Badge>
        </Col>
      </Row> 
    </div>
    <!-- 模板列表 -->
    <div class="item-box">
      <template-item v-for="(item,index) in templates" :ref="'tmpItem'+item.id" :templateMaster="item"
        @selectTemplate="selectTemplate" @unSelectTemplate="unSelectTemplate" :key="item.id"></template-item>
    </div>
    <!-- 模板列表分页 -->
    <Row display="flex" align="middle">
      <!-- 去除分页，每页查询条数为20000 -->
      <Col v-if='false' span="24" class-name="v-center">
        <Page :current="currentPage" show-total :total="totalNum" @on-change="changePage"></Page>
      </Col>
    </Row>
    <!-- 创建科研任务 -->
    <Modal v-model="handleProState" title="创建科研任务">
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
        <FormItem label="已选择表单">
          <Tag color="primary" v-for="(template,index) in selectedTemplates" :key="index">{{template.templateName}}
          </Tag>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelAdd">取消</Button>
        <Button type="primary" @click="sureAdd" :loading='loading'>确定</Button>
      </div>
    </Modal>
    <!-- 已选模板 -->
    <Modal title="已选模板管理" v-model="checkedTmpStatus">
      <div>
        <Tag v-for="(template,index) in selectedTemplates" :key="index" type="dot" closable color="primary"
          @on-close="deleteCheckedTmp(index)">{{template.templateName}}</Tag>
      </div>
      <div slot="footer">
        <Button @click="closeCheckedBox">关闭</Button>
        <Button type="primary" @click="ceateProject">创建科研任务</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    ResearchProjectApi,
    TemplateApi
  } from "@/api/";
  import TemplateItem from "../component/template/template-item";
  import templateClass from '../component/template-class/index.js'

  export default {
    name: 'create-projectby-template',
    components: {
      TemplateItem,
      templateClass
    },
    data() {
      return {
        // 正在保存标志
        loading:false,
        classIds: [],
        selectedTemplates: [],
        templates: [],
        //创建科研任务
        handleProState: false,
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
        currentPage: 1,
        perPage: 20000,
        totalNum: 0,
        // 已选模板管理
        checkedTmpStatus: false
      }
    },
    props: {
      createBtnStatus: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      checkedNum() {
        return this.selectedTemplates.length
      }
    },
    mounted() {
      this.loadTemplates();
    },
    methods: {
      //通过条件查询
      findByTerm(v) {
        this.classIds = v;
        this.loadTemplates()
      },
      //分页切换
      changePage(index) {
        this.currentPage = index;
        this.loadTemplates();
      },
      //打开创建科研任务弹窗
      createProjectWithTemplate: function () {
        this.handleProState = true;
      },
      //根据条件查询模板
      loadTemplates: function () {
        let ids = JSON.parse(JSON.stringify(this.classIds)).join(",")
        TemplateApi.loadAllTemplates("", "", this.currentPage, this.perPage, ids).then(res => {
          if(res.data.code === '1'){
            this.templates = res.data.data.data;
            this.totalNum = res.data.data.totalRows;
          } else {
            this.$Message.error({
              content: '模板加载失败',
              duration: 2
            })
          }
        }).catch(err=>{
          this.$Message.error({
              content: err,
              duration: 2
            })
        })
      },
      // 取消创建
      cancelAdd() {
        // 清空选项
        this.newProInfo = {
          researchProjectName: '',
          leader: '',
          department: '',
          description: ''
        }
        this.handleProState = false
      },
      //确认创建科研任务
      sureAdd() {
        // 将保存按钮这是为正在保存状态
        this.loading = true;
        this.$refs.newProForm.validate((valid) => {
          if (valid) {
            let researchProjectVo = {}
            researchProjectVo = this.newProInfo;
            if(this.selectedTemplates.length>0){
              researchProjectVo.templateMasters = this.selectedTemplates;
            }
            ResearchProjectApi.createResearchProjectWithTemplates(researchProjectVo).then(res => {
              if (res.data.code == '1') {
                this.newProInfo = {
                  researchProjectName: '',
                  leader: '',
                  department: '',
                  description: ''
                }
                this.$Message.success({
                  content: '创建成功',
                  duration: 2
                })
                this.loading =false;
                // 关闭弹窗
                this.handleProState = false

                this.$emit('ResearchProjectCreateSucess', res.data.data)

                // let projectInfo = JSON.parse(JSON.stringify(res.data.data))
                // //将新创建科研任务信息传递回父组件
                // ResearchProjectApi.getOneById(projectInfo.id).then(res => {
                //   console.log(res)
                //   if (res.data.code == '1') {
                //     this.$emit('ResearchProjectCreateSucess', res.data.data)
                //   }
                // })
              } else {
                this.$Message.error({
                  content: '创建失败,请重试',
                  duration: 2
                })
                // 关闭弹窗
                this.handleProState = false
              }
            }).catch(err => {
              this.$Message.error({
                content: '创建失败,请重试',
                duration: 2
              })
              // 关闭弹窗
              this.handleProState = false
            })
          } else {
            this.loading = false;
            this.$Message.error({
              content: '请填写完整必填项',
              duration: 2
            })
          }
        })
      },
      // 关闭模板管理车
      closeCheckedBox() {
        this.checkedTmpStatus = false;
      },
      // 打开模板管理车-对选中模板进行操作
      handleCheckedTmp() {
        this.checkedTmpStatus = true;
      },
      // 创建科研任务
      ceateProject() {
        this.checkedTmpStatus = false;
        this.createProjectWithTemplate();
      },
      // 删除选中模板-模板管理车
      deleteCheckedTmp(index) {
        //获取选中模板ID
        // let id = JSON.parse(JSON.stringify(this.selectedTemplates))[index].id
        //从车中删除选中模板
        this.selectedTemplates.splice(index, 1);
        //调用temolate-item组件方法，改变状态
        // this.$refs['tmpItem'+index]
      },
      //选中模板
      selectTemplate: function (templateMaster) {
        if (!this.whetherInSelected(templateMaster)) {
          this.selectedTemplates.push(templateMaster);
        }
      },
      //取消选中模板
      unSelectTemplate: function (templateMaster) {
        this.selectedTemplates.forEach((item, index) => {
          if (templateMaster.id === item.id) {
            this.selectedTemplates.splice(index, 1)
          }
        })
      },
      //是否已经选择了
      whetherInSelected: function (templateMaster) {
        let flag = false;
        this.selectedTemplates.forEach(item => {
          if (item.id === templateMaster.id) {
            flag = true;
          }
        })
        return flag;
      }
    }
  }
</script>

<style lang="less" scoped>
  .layout {
    padding: 10px 10px;
    min-height: 100%;
    background: #fff;
    border-radius: 4px;

    .item-box {
      overflow: hidden;
    }
    //居中
    .v-center{
      text-align: center;
    }
  }
</style>