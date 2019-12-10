<template>
  <Menu :accordion="true" style="width:100%;" @on-select="changeTemplate">
    <Submenu :name="item.id" v-for="(item,index) in projectList" :key="item.id">
      <template slot="title">
        <P class="sub-item" :title="item.researchProjectName">{{item.researchProjectName}}</P>
      </template>
      <MenuItem :name="opt.id" v-for="(opt,index) in item.templateMasters" :key="opt.id">{{opt.templateName}}
      </MenuItem>
    </Submenu>
  </Menu>
</template>
<script>
  import {ResearchProjectApi} from "@/api/"
  export default {
    name:"TheSiderBar",
    data() {
      return {
        projectList: []
      }
    },
    methods: {
      getAllProjects() { //获取科研任务列表
        let obj = {
          page: 0, //当前页
          size: 99999 //每页显示条数
        }
        ResearchProjectApi.getAllProjects(obj).then(res => {
          if (res.status == 200) {
            this.projectList = res.data.content;
          } else {
            this.$Message.error({
              content: "未获取任务列表,请刷新重试",
              duration: 3
            })
          }
        }).catch(err => {
          console.log(err.response)
          this.$Message.error({
            content: "未获取任务列表,请刷新重试",
            duration: 3
          })
        })
      },
      changeTemplate(temolateId){
          this.$emit("on-select",temolateId)
      }
    },
    mounted() {
      this.getAllProjects();
    }
  }

</script>
<style lang="less" scoped>

</style>
