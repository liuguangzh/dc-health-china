<style lang="less">
.project-form-template .ivu-form-item{
  margin-bottom: 30px;
}
</style>

<template>
  <div class="project-form-template">
    <top-title :title='addOrEdit == "add"?"新建表单":"设置表单"' margin="0px 0px 20px 0px"></top-title>
    <Form ref="newForm" :model="newFormInfo" :rules="formValidate" :label-width="80">
      <FormItem label="表单名称" prop="templateName">
        <Input v-model="newFormInfo.templateName" placeholder="请输入表单名称"></Input>
      </FormItem>
      <FormItem label="填写比例" prop="complete">
        <InputNumber :max="100" :min="1" v-model="newFormInfo.complete" :formatter="value => `${value}%`"
                     :parser="value => value.replace('%', '')"
                     style="width: 200px"></InputNumber>
      </FormItem>
      <FormItem label="承诺书" prop="needPromiseFile">
        <Select v-model="newFormInfo.needPromiseFile" style="width: 200px">
          <Option :value="1">需要</Option>
          <Option :value="0">不需要</Option>
        </Select>
      </FormItem>
      <FormItem v-if="newFormInfo.needPromiseFile == '1'" label="上传承诺书" prop="uploadFile">
        <upload-btn @uploadSuccess="fileUploaded" v-if="uploadShowFlag"></upload-btn>
        <Button type="primary" v-if="!uploadShowFlag" @click="uploadShowFlag=true" size="small">重新上传</Button>
        <Button v-if='!uploadShowFlag' type="success" size="small" style="margin-left:10px;" @click="downLoadFile">查看承诺书</Button>
      </FormItem>
      <FormItem style="display:inline-block;" label="填报日期" prop="startDate">
        <DatePicker type="date" :value="newFormInfo.startDate" :editable="false"
                    :clearable='false'
                    placeholder="选择开始日期"
                    :options="optionsStart"
                    @on-change='getStratDate'
                    style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem style="display:inline-block;" label="至:" prop="endDate">
        <DatePicker type="date" :value="newFormInfo.endDate" :editable="false"
                    :clearable='false'
                    placeholder="选择结束日期"
                    :options = "optionsEnd"
                    @on-change='getEndDate'
                    style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="填报类型" prop='publishType'>
       <Select v-model="newFormInfo.publishType" style="width: 200px">
            <Option :value="0">指定填报</Option>
            <Option :value="1">公开填报</Option>
            <Option :value="2">申请填报</Option>
          </Select>
      </FormItem>
      <FormItem label="表单描述">
        <Input v-model="newFormInfo.templateDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
               placeholder="请填写表单描述"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="sureHandle">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import config from '@/config/index.js'
  import {ResearchProjectApi, TemplateApi} from "@/api/"
  import UploadBtn from "./upload-btn";
  import TopTitle from '@/view/research-platform/component/top-title/index.js'
  export default {
    name: "template-master-form",
    watch:{
      setTmp(val){
        if(Object.keys(val).length){
          this.newFormInfo =JSON.parse(JSON.stringify(val))
        }else{
          this.newFormInfo = {
            //表单名称
            templateName: "",
            //是否需要上传承诺书  0不需要 1需要
            needPromiseFile:'1',
            //填报百分比
            complete: 90,
            //填报开始时间
            startDate: "",
            //填报结束时间
            endDate: "",
            //承诺书路径
            promiseFilePath: "",
            //发布状态 0未发布  1发布
            templateStatus: 0,
            //填报状态 0未开始  1已结束  2暂停 3填报中
            fillStatus: 0,
            //表单配置
            displayConfig: "",
            //表单描述
            templateDesc: "",
            //所属课题
            researchProject: '',
            //承诺书
            templateFileStore: '',
            publishType:"",//0，指定填报 1，公开填报 2，申请填报
          }
        }
      }
    },
    props: {
      researchProject: {
        type: Object,
        default: () => {
          return {}
        }
      },
      setTmp:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    computed:{
      addOrEdit(){
        if(Object.keys(this.setTmp).length){
          if(this.setTmp.templateFileStore !== null){
            this.uploadShowFlag = false
          }else{
            this.uploadShowFlag = true
          }
          return "edit"
        }else{
          this.uploadShowFlag = true;
          return "add"
        }
      }
    },
    data() {
      return {
        // 进行下一步标志
        nextFlag:false,
        uploadShowFlag: true,
        //新建表单信息
        newFormInfo: {
          //表单名称
          templateName: "",
          //是否需要上传承诺书  0不需要 1需要
          needPromiseFile: '',
          //填报百分比
          complete: 90,
          //填报开始时间
          startDate: "",
          //填报结束时间
          endDate: "",
          //承诺书路径
          promiseFilePath: "",
          //发布状态 0未发布  1发布
          templateStatus: 0,
          //填报状态 0未开始  1已结束  2暂停 3填报中
          fillStatus: 0,
          //表单配置
          displayConfig: "",
          //表单描述
          templateDesc: "",
          //所属课题
          researchProject: '',
          //承诺书
          templateFileStore: '',
          publishType: "",//0，需要指定填报人1，不需要指定填报人
        },
        //表单验证
        formValidate: {
          templateName: [{
            required: true,
            message: "请填写表单名称",
            tigger: 'blur'
          }],
          needPromiseFile: [{
            required: true,
            type: 'number',
            message: "请选择是否需要上传承诺书",
            tigger: "change"
          }],
          complete: [{
            required: true,
            type: "number",
            message: "请填写提交百分比阈值",
            tigger: "blur"
          }],
          startDate: [{
            required: true,
            message: "请填写填报开始日期",
            tigger: "change"
          }],
          endDate: [{
            required: true,
            message: "请填写填报结束日期",
            tigger: "change"
          }],
          publishType: [{
            required: true,
            type: 'number',
            message: "请选择填报类型",
            tigger: "change"
          }]
        },
        //开始日期禁用日期
        optionsStart: {
          disabledDate(date) {
            return (date && date.valueOf() < Date.now() - 86400000);
          }
        },
        optionsEnd: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
      }
    },
    mounted(){},
    methods: {
      getStratDate(v){//新增表单开始时间
        this.newFormInfo.startDate = v+' '+'00:00:00'
      },
      getEndDate(v){//新增表单结束时间
        this.newFormInfo.endDate = v +' '+'00:00:00'
      },
      //保存并且下一步
      saveAndNext(){
        this.nextFlag = true
        this.sureHandle()
      },
      sureHandle() {
        this.$refs.newForm.validate((valid) => {
          if (valid) {
            if(this.addOrEdit == "add"){
              // 将此表单所属科研任务ID置成选中id
              this.newFormInfo.researchProject = this.researchProject.id;
              if(this.newFormInfo.templateFileStore==""){
                delete this.newFormInfo.templateFileStore
              }
              TemplateApi.addOrEditTemplate(this.researchProject.id,this.newFormInfo).then(res => {
                if (res.data.code == '1') {
                  this.$Message.success({
                    content: "新建成功",
                    duration: 2
                  });
                  this.$emit('onCreateTemplateMasterSuccess', res.data.data)
                } else {
                  this.$Message.error(res.data.data)
                }
              }).catch(err => {
                if(err.response.status === 500){
                  this.$Message.error({
                    content: err.response.data.description,
                    duration:5
                  })
                } else {
                  this.$Message.error({
                    content: '新建失败',
                    duration:5
                  })
                }
              })
            }else{
              TemplateApi.addOrEditTemplate(this.researchProject.id,this.newFormInfo).then(res => {
                if (res.data.code == '1') {
                  this.$Message.success({
                    content: "编辑成功",
                    duration: 2
                  });
                  this.$emit('onCreateTemplateMasterSuccess', res.data.data)
                } else {
                  this.$Message.error(res.data.data)
                }
              }).catch(err => {
                if(err.response.status === 500){
                  this.$Message.error({
                    content: err.response.data.description,
                    duration:5
                  })
                } else {
                  this.$Message.error({
                    content: '编辑失败',
                    duration:5
                  })
                }
              })
            }
          } else {
            this.$Message.error({
              content: "请将必填项填写完整",
              duration: 3
            })
          }
        })
      },
      fileUploaded(response) {
        this.newFormInfo.promiseFilePath = response.url
        this.newFormInfo.templateFileStore = response.id;
        this.uploadShowFlag = false;
      },
      downLoadFile() {
        if (!this.newFormInfo.templateFileStore) {
          this.$Message.error({ content: "未找到对应的承诺书模板！"})
          return;
        }
        window.location.href = this.newFormInfo.promiseFilePath
        window.open(config.downLoadAddress + '?url=' + params.row.promiseFilePath)
      },
    },
    components: {UploadBtn,TopTitle},
  }
</script>
<style scoped>
</style>
