<template>
  <fill-report
    ref="report"
    menuKind="steps"
    :templateId="templateId"
    :resultMasterId="templateResultId"
    :resultMaster='currentTemplateResultMaster'
    :type='type'>
  </fill-report>
</template>
<script>
import FillReport from "../component/fill-report/fill-report";
import {TemplateResultApi} from '@/api/'
export default {
  components: {FillReport},
  name: "fill-form",
  data(){
    return {
      templateId: '',
      templateResultId: '',
      currentTemplateResultMaster:{},
      type:'edit'
    }
  },
  mounted(){
    this.templateId = this.$route.query.templateId;
    this.templateResultId = this.$route.query.templateResultId;
    if(this.$route.query.hasOwnProperty('type')){ // 查看或者编辑模式
      this.type = this.$route.query.type
    }
    if(!this.templateId){
      this.$Message.error({content:"获取模板信息出错！"})
    }
    if(!this.templateResultId){
      this.$Message.error({content:"获取填报信息出错！"})
    }else{
      this.loadTemplateMasterResult();
    }
  },
  methods:{
    loadTemplateMasterResult(){
      TemplateResultApi.getTemplateResultMaster(this.templateResultId).then(res=>{
        if(res.data.code === '1'){
          this.currentTemplateResultMaster = res.data.data;
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
