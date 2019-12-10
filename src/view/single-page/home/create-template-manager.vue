<template>
    <form-manage :researchProject="researchProject" :templateMaster="templateMaster"></form-manage>
</template>
<script>
  import FormManage from "../../research-platform/form/form-manage";
  export default {
    components: {FormManage},
    name: "create-template-manager",
    props:{
      templateMaster:{
        type:Object,
        default:()=>{
          return {}
        }
      },
      researchProject:{
        type:Object,
        default:()=>{
          return {}
        }
      },
    }
  }
</script>
<style scoped>
</style>
