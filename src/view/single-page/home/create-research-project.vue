<template>
  <create-projectby-template :createBtnStatus="false" @ResearchProjectCreateSucess="researchProjectCreateSuccess"></create-projectby-template>
</template>

<script>
  import CreateProjectbyTemplate from "../../research-platform/project/create-projectby-template";

  export default {
    components: {CreateProjectbyTemplate},
    name: "create-research-project",
    methods:{
      researchProjectCreateSuccess:function(researchProject){
        this.$emit("ResearchProjectCreateSucess",researchProject)
      }
    }
  }
</script>

<style scoped>

</style>
