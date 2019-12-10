<template>
  <div style="height: 100%; overflow-y:auto;overflow-x:hidden;">
    <div style="min-height:90%">
    <Row>
      <i-col span="24">
        <div style="height:40px;padding:6px 6px 0px 6px;">
          <Steps :current="currentNum">
            <Step title="创建科研任务" content=""></Step>
            <!-- <Step title="科研成员管理" content=""></Step> -->
            <Step title="新建/设置表单" content=""></Step>
            <Step title="科研表单设计" content=""></Step>
            <!-- <Step title="维护填报人员" content=""></Step> -->
            <Step title="设置科研任务" content=""></Step>
          </Steps>
        </div>
      </i-col>
    </Row>
    <div style="height:2px;background:#E6E7E8;"></div>
    <Row>
      <i-col span="24">
        <!-- 选择模板创建科研任务 -->
        <create-research-project
          v-if="currentNum==0" 
          @ResearchProjectCreateSucess="researchProjectCreateSuccess">
        </create-research-project>
         
          <!-- 科研成员管理 -->
        <!-- <create-research-project-member :researchProject="currentResearchProject" v-if="currentNum==1">
        </create-research-project-member> -->
       
        <!-- 设置/创建科研表单 -->
        <create-template-guide ref="setResearchProject" :researchProject="currentResearchProject" v-if="currentNum==1"
          @onCreateTemplateMasterSuccess="createTemplateMasterSuccess" @on-next='nextPage'></create-template-guide>
         
          <!-- 科研表单设计 -->
        <create-template-manager
          :researchProject="currentResearchProject"
          :templateMaster="currentTemplateMaster"
          v-if="currentNum==2">
        </create-template-manager>
        
        <!-- 维护填报人员 -->
        <!-- <create-report-user :researchProject="currentResearchProject" 
          :templateMaster="currentTemplateMaster" v-if="currentNum == 3"></create-report-user> -->
       
        <!-- 发布 --> 
        <create-publish
          :templateMaster="currentTemplateMaster"
          :researchProject="currentResearchProject"
          v-if="currentNum==3">
        </create-publish>
      </i-col>
    </Row>
    </div>
    <div style="text-align:left;">
      <Button v-if="lastPageStatus" type="primary" style="margin-left:10px;margin-bottom: 10px;" @click="lastPage">上一步</Button>
      <Button v-if="nextPageStatus" type="primary" style="margin-left:10px;margin-bottom: 10px;" @click="nextPage">下一步</Button>
    </div>
  </div>
</template>

<script>
  import { getWindowHeight } from "@/libs/util"
  import CreateResearchProject from "./create-research-project";
  import CreateResearchProjectMember from "./create-research-project-member";
  import CreateTemplateGuide from "./create-template-guide";
  import CreateTemplateManager from "./create-template-manager";
  import CreateReportUser from "./create-report-user";
  import CreatePublish from "./create-publish";
  import { TemplateApi } from '@/api/index.js'
  export default {
    name: 'create-guide',
    components: {
      CreatePublish,
      CreateReportUser,
      CreateTemplateManager,
      CreateTemplateGuide,
      CreateResearchProjectMember,
      CreateResearchProject
    },
    data() {
      return {
        currentNum: 0,
        windowHeight: 300,
        currentResearchProject: undefined,
        currentTemplateMaster: undefined,
      }
    },
    computed:{
      nextPageStatus(){
        if(this.currentNum === 0 || this.currentNum ===3){
          return false
        }else{
          return true
        }
      },
      lastPageStatus(){
        if(this.currentNum === 0){
          return false
        }else{
          return true
        }
      }
    },
    mounted() {
      //
      this.windowHeight = getWindowHeight();
    },
    methods: {
      toTheNum(num){
        this.currentNum = num
      },
      //上一步
      lastPage(){
        if(this.currentNum > 0){// 防止多次点击
          this.currentNum--;
        }
      },
      //下一步
      nextPage() {
        if (this.currentNum == 0) {
          if (this.currentResearchProject && this.currentResearchProject.id) {
            this.currentNum++;
          } else {
            this.$Message.error({
              content: "请先创建科研任务"
            })
            return;
          }
        }
        if(this.currentNum === 1){
          let flag =  this.$refs.setResearchProject.checkInfo()
          if(!flag){
            this.$Message.error({
              content:'请将所有已存在表单填写完整'
            })
            return false
          }
        }
        this.currentNum++;
      },
      completePage() {},
      researchProjectCreateSuccess (researchProject) {
        this.currentResearchProject = researchProject;
        this.currentNum = 1;
      },
      createTemplateMasterSuccess(templateMaster) {
        this.currentTemplateMaster = templateMaster;
        this.getAllTemolates()
      },
      getAllTemolates(){
        TemplateApi.getTemplateByProjectId(this.currentResearchProject.id).then(res=>{
          if(res.data.code === '1'){
            this.currentResearchProject.templateMasters = res.data.data
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    watch: {}
  }
</script>
<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
