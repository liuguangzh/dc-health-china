<template>
  <div>
    <Row v-if="!tableView" :gutter='20'>
      <Col :span="span" v-for="(item,index) in sysList" :key='item.id'>
        <template-master
          :templateMaster="item"
          @onEdit="editTemplate"
          @on-delete='deleteTemplate({row:item,index})'
          @publishTemplate="publishTemplate"
          @unPublishTemplate="unPublishTemplate"></template-master>
      </Col>
    </Row>
    <div v-if="tableView">
      <Table :columns="columns" :data="sysList" :border="true"></Table>
    </div>
  </div>
</template>
<script>
  import TemplateMaster from "./template-master";
  import UserSelectComponent from "../user-select-component";
  import { TemplateApi } from "@/api/"
  export default {
    components: {
      UserSelectComponent,
      TemplateMaster
    },
    name: "template-list",
    data() {
      return {
        publishModal: false,
        waitPublishTemplate: undefined,
        rows: [],
        sysList:[],
        shareLevel: '0',
        publishToUser: [],
        span: 6,
        userId: "",
        columns: [{
          title: "模板名称",
          key: "templateName",
          with: '50px',
          maxWidth: 180
          }, {
          title: "模板标签",
          key: "templateLabels",
          render: (h, params) => {
            if (params.row.templateLabels) {
              let lables = params.row.templateLabels.split(",");

              let tags = [];
              lables.forEach(item => {
                let tag = h('Tag', {
                  props: {
                    color: 'success'
                  }
                }, item)
                tags.push(tag)
              })
              return h('div', tags);
            }
          },
          with: 200,
          minWidth: 200
          }, {
            title: "发布状态",
            key: 'templateStatus',
            maxWidth: 100,
            minWidth: 100,
            render: (h, params) => {
              let tagLabel = undefined;
              if (params.row.templateStatus == 0) {
                return h('Tag', {
                  props: {
                    color: "default"
                  }
                }, '未发布')
              } else {
                return h('Tag', {
                  props: {
                    color: "success"
                  }
                }, '已发布')
              }

            }
          }, {
            title: '模板类型',
            key: "templateType",
            with: 30,
            maxWidth: 100,
            render: (h, params) => {
              let label = undefined;
              if (params.row.templateType == 1) {
                label = "任务型"
              } else {
                label = "组件型"
              }
              return h('Button', {
                props: {
                  type: 'primary',
                  shape: 'circle',
                  ghost: true,
                  size: 'small'
                }
              }, label)
            }
          }, {
            title: "操作",
            key: 'id',
            width:300,
            render: (h, params) => {
              let actionButtons = [];

              actionButtons.push(h('Button', {
                props: {
                  type: "warning",
                  size: 'small',
                  ghost:true
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: "templateManage",
                      params: {
                        ...params.row,
                        preView: true,
                        isTemplate:true
                      }
                    })
                  }
                }
              }, '预览'))

              if (params.row.creator == this.userId) {
                if(params.row.templateStatus == 1){
                  actionButtons.push(h('Button', {
                    props: {
                      type: "info",
                      size: 'small',
                      ghost:true
                    },
                    on: {
                      click: () => {
                        this.unPublishTemplate(params.row)
                      }
                    }
                  }, '取消发布'))
                }else{
                  actionButtons.push(h('Button', {
                    props: {
                      type: "primary",
                      size: 'small',
                      ghost:true
                    },
                    on: {
                      click: () => {
                        this.editTemplate(params.row);
                      }
                    }
                  }, '编辑'))
                  actionButtons.push(h('Button', {
                    props: {
                      type: "error",
                      size: 'small',
                      ghost:true
                    },
                    on: {
                      click: () => {
                        this.deleteTemplate(params);
                      }
                    }
                  }, '删除'))
                  actionButtons.push(h('Button', {
                    props: {
                      type: "success",
                      size: 'small',
                      ghost:true
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "templateManage",
                          params: {
                            ...params.row,
                            preView: false,
                            isTemplate:true
                          }
                        })
                      }
                    }
                  }, "设计"),)
                  actionButtons.push(h('Button', {
                    props: {
                      type: "info",
                      size: 'small',
                      ghost:true
                    },
                    on: {
                      click: () => {
                        this.publishTemplate(params.row)
                      }
                    }
                  }, '发布'))
                }
              }
            return h('ButtonGroup', actionButtons)
          }
        }]
      }
    },
    props: {
      pageInfo: {
        type: Array,
        default: () => {
          return []
        },
        required: true
      },
      colNum: {
        type: Number,
        default: () => {
          return 4
        },
        required: false,
      },
      tableView: {
        type: Boolean,
        default: () => {
          return false
        }
      },
      systemFlag:{
        type:Boolean,
        default:()=>{
          return true
        }
      }
    },
    beforeMount() {
      this.userId = this.$store.state.user.userId;
    },
    mounted() {
      this.span = 24 / this.colNum
    },
    computed:{
   
    },
    watch: {
      pageInfo: {
        handler:function (val){
          this.getSysList();
        },
        deep:true
      }
    },
    methods: {
      getSysList(){
        if(this.systemFlag){
          let arr = []
          this.pageInfo.forEach(item=>{
            if(item.templateStatus === 0){
              if(item.creator === this.userId){
                arr.push(item)
              }
            }else{
              arr.push(item)
            }
          })
          this.sysList = arr
        }else{
          this.sysList = this.pageInfo
        }
      },
      editTemplate: function (templateMaster) {
        this.$emit('onEdit', templateMaster)
      },
      publishTemplate: function (templateMaster) {
        let that = this ;
        this.$Modal.confirm({
          title:"系统提示",
          content:"确认要发布【"+templateMaster.templateName+"】模板么？",
          onOk:function(){
            templateMaster.templateStatus = 1;
            that.updateTemplate(templateMaster)
          }
        })
      },
      unPublishTemplate(templateMaster){
        let that = this ;
        this.$Modal.confirm({
          title:"系统提示",
          content:"确认要取消发布【"+templateMaster.templateName+"】模板么？",
          onOk:function(){
            templateMaster.templateStatus = 0;
            that.updateTemplate(templateMaster)
          }
        })
      },
      updateTemplate (templateMaster) {
        this.$emit('updateTemplate', templateMaster);
      },
      selectUsers (users) {
        users.forEach(item => {
          let flag = true;
          this.publishToUser.forEach(item1 => {
            if (item1.id == item.id) {
              flag = false
            }
          })
          if (flag) {
            this.publishToUser.push(item)
          }
        })
      },
      // 删除模板
      deleteTemplate(params){
        let _this= this;
        this.$Modal.confirm({
          title:'删除模板',
          content:'确定要删除此模板吗？',
          onOk:()=>{
            TemplateApi.deleteSysTemplateById(params.row.id).then(res=>{
              if(res.data.code === '1'){
                this.$Message.success({
                  content:'删除成功',
                  duration:3
                })
                _this.$emit('on-delete',params.index)
              }else{
                this.$Message.error({
                  content:'删除失败',
                  duration:4
                })
              }
            }).catch(err=>{
              this.$Message.error({
                  content:'删除失败',
                  duration:4
              })
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
</style>
