<template>
  <div class="layout">
    <Layout style="height:100%;">
      <report-header :currentTemplateResultMaster="currentTemplateResultMaster"></report-header>
      <!-- 填报组件 -->
      <fill-report v-if="templateId&&templateResultId" :templateId="templateId" :resultMasterId="templateResultId" :resultMaster='currentTemplateResultMaster' :returnKind=false></fill-report>
    </Layout>
  </div>
</template>
<script>
  import {loginWithCode} from '@/api/user'
  import {setToken} from '@/libs/util'
  import {mapActions} from 'vuex'
  import {TemplateResultApi} from '@/api/'
  import FillReport from '../component/fill-report/fill-report.vue'
  import ReportHeader from "./report-header";
  export default {
    name: "report",
    data() {
      return {
        code: "",
        templateId: "",
        templateResultId: "",
        currentTemplateResultMaster:{
          templateName:""
        }
      }
    },
    components:{
      ReportHeader,
      FillReport
    },
    beforeMount() {
      this.code = this.$route.params.code;
    },
    mounted() {
      loginWithCode(this.code).then(res => {
        const authorization = res.headers.authorization
        setToken(authorization)
        this.templateId =res.data.templateId;
        TemplateResultApi.createNewResult(res.data.templateId).then(res=>{
          this.templateResultId = res.data.data.id
          this.currentTemplateResultMaster = res.data.data ;
        })
        this.getUserInfo()
      }).catch(err => {
      })
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
    }
  }
</script>
<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    height: 100%;
  }
</style>
