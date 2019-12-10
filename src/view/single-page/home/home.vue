<template>
  <div style="height:100%;background:#FFF;">
    <create-guide ref="createGuide"></create-guide>
  </div>
</template>

<script>
// import InforCard from '_c/info-card'
// import CountTo from '_c/count-to'
// import { ChartPie, ChartBar } from '_c/charts'
// import Example from './example.vue'
import CreateGuide from "./create-guide";
export default {
  name: 'home',
  components: {
    CreateGuide,
    // InforCard,
    // CountTo,
    // ChartPie,
    // ChartBar,
    // Example
  },
  data () {
    return {
      createGuideModal:false
    }
  },
  mounted () {
    //
    let that = this ;
    // this.$Modal.confirm({
    //   title:"系统提示",
    //   content:"欢迎使用科研工作平台进行科研管理，是否要打开科研任务创建向导，创建您的第一个科研任务？",
    //   onOk:function(){
    //     that.createGuideModal=true ;
    //   }
    // })
    if(this.$route.query.pageNum){
      this.$refs.createGuide.toTheNum(Number(this.$route.query.pageNum))
      this.$refs.createGuide.currentResearchProject = JSON.parse(window.sessionStorage.getItem('ResearchProject'))
      this.$refs.createGuide.currentTemplateMaster = JSON.parse(window.sessionStorage.getItem('CurrentTmplate'))
    }
  },
  methods:{
    nextPage:function(){
      this.$refs.createGuide.nextPage() ;
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
