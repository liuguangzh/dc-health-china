<template>
<div>
  <Button @click="setReportUser">设置填报人员</Button>
  <report-user ref="reportUserModal"></report-user>
</div>
</template>

<script>
  import ReportUser from "../../research-platform/component/template/report-user";

  export default {
    components: {ReportUser},
    name: "create-report-user",
    props:{
      templateMaster:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    methods:{
      setReportUser(){
        this.$refs.reportUserModal.openReportUserModal(this.templateMaster.id);
      }
    },
    mounted(){
      this.$refs.reportUserModal.openReportUserModal(this.templateMaster.id);
    }
  }
</script>

<style scoped>

</style>
