<template>
  <project-member :transResearchProject="researchProject" :showProjectChange="false"></project-member>
</template>
<script>
import ProjectMember from "../../research-platform/project/project-member";
export default {
  components: {ProjectMember},
  name: "create-research-project-member",
  props:{
    researchProject:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  }
}
</script>
<style scoped>
</style>
