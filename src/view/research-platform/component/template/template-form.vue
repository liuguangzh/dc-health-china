<template>
  <div class="templateForm">
    <Form ref="templateForm" :model="templateMaster" :rules="formRules" label-position="left" :label-width="80">
      <Row>
        <Col span="12">
          <FormItem prop="templateName" label="模板名称">
            <Input type="text" v-model="templateMaster.templateName" placeholder="模板名称">
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem prop="templateType" label="模板类型">
            <Select v-model="templateMaster.templateType" ref="selectInfo">
              <Option :value="0" selected>组件型模板</Option>
              <Option :value="1" selected>任务型模板</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem prop="templateLabels" label="模板分类">
        <Cascader style="width:50%;z-index:300;" trigger="hover" :data="kindType"
          v-model="templateMaster.templateClasses"></Cascader>
      </FormItem>
      <FormItem prop="templateLabels" label="模板标签">
        <Input type="text" v-model="templateMaster.templateLabels" placeholder="请输入标签并以英文状态下的逗号隔开"></Input>
      </FormItem>
      <FormItem prop="templateDesc" label="模板描述">
        <editor valueType="text" ref="editor1" v-model="templateMaster.templateDesc"></editor>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import Editor from "@/components/editor/editor";

  import {
    TemplateApi
  } from "@/api"
import { constants } from 'crypto';

  export default {
    components: {
      Editor
    },
    name: "template-form",
    props: {},
    data() {
      const templateNameValidate = (rule, value, callback) => {
        if (!value) {
          callback("模板名称不能为空")
        } else {
          callback();
        }
      }
      const templateDescValidate = (rule, value, callback) => {
        if (!value || value.length < 40) {
          callback("模板名称不能为空,请编写模板描述，不少于20个字")
        } else {
          callback();
        }
      };
      const templateTypeValidate = (rule, value, callback) => {
        if (!value && value != 0) {
          callback("请选择模板类型")
        } else {
          callback();
        }
      }
      const templateClassesValidate = (rule, value, callback) => {
        if (!value) {
          callback("请选择分类")
        } else {
          callback()
        }
      }
      return {
        formRules: {
          templateName: [{
            validator: templateNameValidate,
            trigger: "blur",
            required:true
          }],
          // templateDesc: [{
          //   validator: templateDescValidate,
          //   trigger: "blur"
          // }],
          templateType: [{
            validator: templateTypeValidate,
            trigger: "blur",
            required:true
          }],
          templateClasses: [{
            validator: templateClassesValidate,
            trigger: "change"
          }]
        },
        templateMaster: {
          id: "",
          templateName: "",
          templateLabels: "",
          templateDesc: "",
          templateType: "",
          templateFlag: 1,
          templateStatus: 0,
          templateClasses: [], // 新增模板分类
          isSys:'',//1 系统模板  0非系统模板
        },
        //任务分类
        kindType: [],
        //所有任务分类
        allKinds:[],
        selectArr:[]
      }
    },
    methods: {
      //将多维任务数据展开成一维数组
      resetType(data,selectArr=[]) {
        let _this = this;
        data.forEach(item => {
          if (item.children && item.children.length) {
            selectArr.push(item)
            _this.resetType(item.children,selectArr)
          } else {
            selectArr.push(item)
          }
        })
        return selectArr
      },
      //回显分类-编辑
      getType(data){
        this.selectArr.push(data.id)
        if(data.hasOwnProperty('parentClass') && data.parentClass){
          this.selectArr.unshift(data.parentClass.id)
            if(data.parentClass.hasOwnProperty('templateClassType') && data.parentClass.templateClassType){
              this.selectArr.unshift(data.parentClass.templateClassType.id)
            }
          }
      },
      //获取所有分类
      getClassType() {
        TemplateApi.getClassType().then(res => {
          if(res.data.code == '1'){
            this.kindType = res.data.data;
            this.allKinds= this.resetType(JSON.parse(JSON.stringify(res.data.data)));
          } else {
            this.$Message.error({
              content:"获取分类失败",
              duration:2
            })
          }
        }).catch(err => {
          this.$Message.error({
            content:"获取分类失败",
            duration:2
          })
        })
      },
      saveTemplateMaster (isSys) {
        this.$refs.templateForm.validate(valid => {
          if (valid) {
            //如果验证通过，则保存模板
            let templateMaster = JSON.parse(JSON.stringify(this.templateMaster))
            templateMaster.isSys = isSys;
            templateMaster.templateStatus = 0
            templateMaster.templateFlag = 1;
            templateMaster.creator = this.$store.state.user.userId
            let allKinds = JSON.parse(JSON.stringify(this.allKinds))
            for(let i = 0 ;i<allKinds.length;i++){
              if(templateMaster.templateClasses[templateMaster.templateClasses.length-1] == allKinds[i].value){
                if(allKinds[i].children){
                  delete allKinds.children;
                }
                if(allKinds[i]){
                  templateMaster.templateClasses =[allKinds[i]];
                } else {
                  templateMaster.templateClasses =[];
                }
                
                break;
              }
            }
            if(isSys === 0){
              TemplateApi.mergeMyTemplate(templateMaster).then(res => {
                this.$emit("on-save", res.data.data)
                this.templateMaster = this.createEmptyTemplateMaster();
              })
            } else {
              TemplateApi.mergeSysTemplate(templateMaster).then(res => {
                this.$emit("on-save", res.data.data)
                this.templateMaster = this.createEmptyTemplateMaster();
              })
            }
          }else{
            this.$Message.error({
              content:"请将表单填写完整",
              duration:2
            })
          }
        })
      },
      resetForm: function () {
        this.templateMaster = this.createEmptyTemplateMaster();
        this.$refs.editor1.setHtml("")
      },
      fillTemplateMaster: function (master) {
        this.selectArr = [];
        if(master.templateClasses){
          if( master.templateClasses[0]){
            this.getType(master.templateClasses[0])
            master.templateClasses = this.selectArr;
          }
        }
        this.templateMaster = master;
        if(!this.templateMaster.templateClasses){
          this.templateMaster.templateClasses = []
        }
        this.$refs.editor1.setHtml(this.templateMaster.templateDesc)
      },
      createEmptyTemplateMaster: function () {
        return {
          id: "",
          templateName: "",
          templateLabels: "",
          templateDesc: "",
          templateType: 0,
          templateFlag: "",
          templateStatus: ""
        };
      },
      updateDropDownStyle: function () {
        this.$refs.selectInfo.$el.childNodes[2].style['z-index'] = 10002;
      }
    },
    mounted() {
      this.updateDropDownStyle();
      this.resetForm();
      this.getClassType();
    },
    update() {
      this.updateDropDownStyle();
      this.resetForm();
    }
  }
</script>
<style lang="less">
  .templateForm .ivu-select-dropdown {
    z-index: 10002;
  }
</style>
