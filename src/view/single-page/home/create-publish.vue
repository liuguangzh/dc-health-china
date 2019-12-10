<template>
  <div>
    <div v-if="false" style="padding:10px  20px;">
      <Table :columns='MyColumns' :data='researchProject.templateMasters' border></Table>
    </div>
  </div>
</template>

<script>
  import {ResearchProjectApi, TemplateApi} from "@/api/"
  import ModalAlert from "../../../components/modal-alert/modal-alert";
  export default {
    components: {ModalAlert},
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
      }
    },
    name: "create-publish",
    data(){
      return {
        publishConfirmModal:false,
        MyColumns:[{
          title:'表单名称',
          key:'templateName'
        },{
          title:'操作',
          render:(h,params)=>{
            return('div',[h('Button',{
              props:{
                type:'primary',
                ghost:true,
                size:'small',
                disable:params.row.templateStatus !== '0'
              },
              on:{
                click:()=>{
                  let _this = this
                  this.$Modal.confirm({
                    title:'发布表单',
                    content:'确定要发布此表单吗？',
                    onOk:()=>{
                      _this.publish(params)
                    } 
                  })
                }
              }
            },params.row.templateStatus === '0'?'发布':'已发布')])
          }
        }]
      }
    },
    methods:{
      publish(params) {
        let that = this;
        TemplateApi.publishTemplate(this.templateMaster.id).then(res => {
          if (res.status == 200) {
            //先删除data中对应表单
            that.$Message.success({
              content: "发布成功",
              duration: 2
            })
          }
        }).catch(err => {
          this.$Message.error({content: "指定填报类型表单请前往-科研任务管理-设置科研任务添加填报人员",duration:5})
        })
      },
    },
    mounted(){
      this.$router.push({
        path:'/set-research-project.html'
      })
    }
  }
</script>

<style scoped>

</style>
