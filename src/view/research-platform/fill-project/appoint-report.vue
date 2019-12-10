<template>
  <div class="layout">
      <!-- 查询条件 -->
    <research-project-search @on-search='searchByTerm' ></research-project-search>
    <research-project
      v-for="(project,index) in needApplyData.data"
      :index='index'
      :key="project.value"
      :researchProject="project"
      @on-newResult='getNewResult'
      need="no">
    </research-project>
    <Page
      :showTotal="true"
      :current='pageNo'
      :page-size='pageSize'
      :total="needApplyData.totalRows"
      @on-change="changePage"
      style="text-align: center;">
    </Page>
  </div>
</template>
<script>
  import {ResearchProjectApi} from '@/api/'
  import ResearchProject from "../component/research-project";
  import ResearchProjectSearch from '@/view/research-platform/component/reasearch-project-search.vue'
  export default {
    name: "public-report",
    data(){
      return {
        needApplyData:{},
        researchProjects:[],
        pageNo: 1,
        pageSize: 5,
        masterQueryVo: {
          templateMasterName:'',// 表单名称
          startTime:'' ,//开始时间
          endTime:'',//结束时间
          fillStatus:'',// 0: 未开始 1: 已结束 2: 暂停 3: 填报中
          operation:'',//大于 等于 小于
          percent:'',//百分比
          done:'',//是否提交 0： 未提交 1: 已提交
          publishType: 0,//发布类型 0 指定填报， 1 公共填报， 2 申请填报
        }
    }},
    mounted() {
      this.loadNeedApply();
    },
   methods: {
      searchByTerm(newMater){ // 按照条件查询
        this.masterQueryVo = newMater
        newMater.publishType = 0
        newMater.pageNo = this.pageNo
        newMater.pageSize = this.pageSize
        ResearchProjectApi.getProjectsTemplatesByPublishType(newMater).then(res => {
          if(res.data.code === '1'){
            this.needApplyData = res.data.data;
          }
        });
      },
      changePage(currentPage){// 切换分页
       this.pageNo = currentPage
        this.loadNeedApply() ;
      },
      loadNeedApply(){// 获取列表
        if(this.masterQueryVo === ''){
          this.masterQueryVo = {
            templateMasterName:'',// 表单名称
            startTime:'' ,//开始时间
            endTime:'',//结束时间
            fillStatus:'',// 0: 未开始 1: 已结束 2: 暂停 3: 填报中
            operation:'',//大于 等于 小于
            percent:'',//百分比
            done:'',//是否提交 0： 未提交 1: 已提交
            publishType:0
          }
        }
        this.masterQueryVo.pageNo = this.pageNo
        this.masterQueryVo.pageSize = this.pageSize
        ResearchProjectApi.getProjectsTemplatesByPublishType(this.masterQueryVo).then(res => {
          if(res.data.code === '1'){
            this.needApplyData = res.data.data;
          }
        });
      },
      getNewResult(obj){// 将新创建记录回填
        this.loadNeedApply()
      }
    },
    components: {
      ResearchProject,
      ResearchProjectSearch
    },
  }
</script>
<style lang="less" scoped>
  .layout{
    padding: 5px;
    background: #FFFFFF;
     min-height: 100%;
  }
</style>

