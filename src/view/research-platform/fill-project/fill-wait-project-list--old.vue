<template>
  <div class="layout">
      <!-- 查询条件 -->
    <research-project-search @on-search='searchByTerm' ></research-project-search>
    <research-project v-for="(project,index) in needApplyData.content" :index='index' :key="project.value" :researchProject="project" @on-newResult='getNewResult' need="no"></research-project>
    <Page  :showTotal="true" :current='pageable.page' :page-size='pageable.size' :total="needApplyData.totalElements" @on-change="changePage" style="text-align: center;"></Page>
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
        needApplyData:{
          content:[],
          totalElements:1
        },
        researchProjects:[],
        pageable:{
          page:1,
          size:5
        },  
        masterQueryVo: {
          templateMasterName:'',// 表单名称
          startTime:'' ,//开始时间
          endTime:'',//结束时间
          fillStatus:'',// 0: 未开始 1: 已结束 2: 暂停 3: 填报中
          operation:'',//大于 等于 小于
          percent:'',//百分比
          done:'',//是否提交 0： 未提交 1: 已提交
        //   publishType:'1',//发布类型 0 指定填报， 1 公共填报， 2 申请填报
        }
      
    }},
    mounted() {
      this.loadNeedApply();
    },
    methods: {
      searchByTerm(newMater){// 按照条件查询
        this.pageable.page = 1
        newMater.pageable = JSON.parse(JSON.stringify(this.pageable));
        newMater.pageable.page =newMater.pageable.page -1
        ResearchProjectApi.getProjectsTemplatesByPublishType(newMater).then(res => {
          this.needApplyData = res.data ;
        });
      },
      changePage(currentPage){// 切换分页
       this.pageable.page = currentPage
        this.loadNeedApply() ;
      },
      loadNeedApply(){// 获取列表
        this.masterQueryVo.pageable = JSON.parse(JSON.stringify(this.pageable));
        this.masterQueryVo.pageable.page =this.masterQueryVo.pageable.page -1
        ResearchProjectApi.getProjectsTemplatesByPublishType(this.masterQueryVo).then(res => {
          this.needApplyData = res.data ;
        });
      },
      getNewResult(obj){// 将新创建记录回填
        this.loadNeedApply()
        // this.needApplyData.content[obj.projectIndex][templateIndex].resultMaster = obj.resultMaster

      }
    },
    components: {ResearchProject ,ResearchProjectSearch},
  }
</script>
<style lang="less" scoped>
  .layout{
    padding: 5px;
    background: #FFFFFF;
     min-height: 100%;
  }
</style>

