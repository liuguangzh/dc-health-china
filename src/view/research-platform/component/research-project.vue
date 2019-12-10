<template>
  <div>
    <Card :bordered="false" :dis-hover="true" :shadow="false" style="margin: 5px;" >
      <p class="tmp-name"><b>{{researchProject.researchProjectName}}</b></p>
      <Table :data="researchProject.templateMasters" :columns="colDefs" :border="true"></Table>
    </Card>
    <Modal large v-model="applyRecordModal" :closable="false" :mask-closable="false" width="800">
      <p slot="header">申请记录查询</p>
      <apply-record-list :applyRecords="applyRecords"></apply-record-list>
       <div slot="footer">
            <Button type="primary" @click="applyRecordModal= false">关闭</Button>
      </div>
    </Modal>
    <!-- 上传承诺书 -->
    <Modal title="提示信息" v-model="uploadPromiseFileStatus">
      <p class="tipText">请确保您的承诺书已经签字盖章！</p>
      <p class="tipText">提示信息：支持文件类型：pdf、jpg、jpeg、png、doc、docx,文件最大为50M</p>
      <upload-btn  @uploadSuccess="uploadSuccess"></upload-btn>
    </Modal>
    <Modal title="申请填报" v-model="applyModalStatus">
        <Form ref="applyModal" :model="applyRecord" :label-width='90' :rules='applyRules'>
            <FormItem prop='applyPersonName' label='申请人姓名:'>
                <Input v-model="applyRecord.applyPersonName" placeholder="请填写申请人姓名"></Input>
            </FormItem>
            <FormItem prop='unitName' label='申请人单位:'>
                <Input v-model="applyRecord.unitName" placeholder="请填写申请人单位"></Input>
            </FormItem>
            <FormItem prop='applyPhone' label='申请人电话:'>
                <Input v-model="applyRecord.applyPhone" placeholder="请填写申请人电话"></Input>
            </FormItem>
            <FormItem prop='applyDesc' label='申请描述:'>
                <Input v-model="applyRecord.applyDesc" type="textarea" max='50' placeholder="请填写申请描述"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="applyModalStatus= false">取消</Button>
            <Button type="primary" @click="sureApply" :loading='loading'>确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import config from '@/config/index.js'
  import {ResearchProjectApi, TemplateApi, TemplateResultApi} from '@/api/index.js';
  import ApplyRecordList from "./apply-record/apply-record-list";
  import UploadBtn from "@/view/research-platform/component/upload-btn";
  import { getFormartDate } from '@/libs/tools.js'
  export default { //科研任务填报-列表
    name: "research-project",
    data(){
      const validatePhone = (rule, value, callback)=>{
        if(value){
          const phoneVal = /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/
          if(!phoneVal.test(value)){
            callback(new Error('请填写正确手机号'))
          }else{
            callback()
          }
        }else{
          callback()
        }
      }
      return {
        applyRecords: [],
          applyRecordModal: false, // 申请记录
          uploadPromiseFileStatus: false,
          applyModalStatus: false, // 发起申请
          applyRecord: {
            applyPersonName: '',
            unitName: '',
            applyDesc: '',
            applyPhone: ''
          },
          applyRules: {
            applyPersonName: [{
              required: true,
              message: '请填写申请人姓名',
              trigger: 'blur'
            }],
            unitName: [{
              required: true,
              message: '请填写申请人单位信息',
              trigger: 'blur'
            }],
            applyPhone: [{
              validator: validatePhone,
              message: '',
              trigger: 'blur'
            }]
          },
          loading: false,
          currentParams: '', // 当前选中要申请的表单
          colDefs: [{
            title: "表单名称",
            key: "templateName",
            minWidth: 200,
          }, {
            title: '开始时间',
            key: "startDate",
            width: 110,
            render: (h, params) => {
              let time = getFormartDate(params.row.startDate, 'year');
              return h('span', {}, time)
            }
          }, {
            title: "截止时间",
            width: 110,
            key: "endDate",
            render: (h, params) => {
              let time = getFormartDate(params.row.endDate, 'year');
              return h('span', {}, time)
            }
          }, {
            title: "填报状态",
            width: 110,
            key: "endDate",
            render: (h, params) => {
              let fillText = ''
              switch (params.row.fillStatus) {
                case 0:
                  fillText = '未开始';
                  break
                case 1:
                  fillText = '已结束'
                  break
                case 2:
                  fillText = '暂停';
                  break
                case 3:
                  fillText = '填报中'
                  break
                default:
                  fillText = ''
              }
              return h('span', fillText)
            }
          }, {
            title: '承诺书',
            key: 'promiseBook',
            width: 170,
            render: (h, params) => {
              let that = this;
              const needPromiseFile = params.row.needPromiseFile;
              const resultMaster = params.row.resultMaster
              let Buttons = [];

              let downLoadButton = h("Button", {
                props: {
                  type: 'primary',
                  size: "small",
                  ghost: true
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: function () {
                    that.toDownBook(params)
                  }
                }
              }, '下载模板');
              let upButton = h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  ghost: true,
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: function () {
                    that.uploadPromiseFile(params)
                  }
                }
              }, '上传');
              let downloadPromiseFileButton = h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  ghost: true
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: function () {
                    that.downLoadTemplateResultPromiseFile(params);
                  }
                }
              }, '查看')
              let reUploadPromiseFileButton = h("Button", {
                props: {
                  type: 'error',
                  size: 'small',
                  ghost: true,
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: function () {
                    that.uploadPromiseFile(params)
                  }
                }
              }, '重新上传')
              let notNeedButton = h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  ghost: true,
                  disable: true
                },
              }, "无需上传")
              let notCanButton = h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  ghost: true,
                  disable: true
                }
              }, "非填报中,不可上传")
              if (needPromiseFile == 1) {
                if (params.row.fillStatus === 3) {
                  if (resultMaster === null || resultMaster.length === 0) { // 未有填报记录
                    Buttons.push(downLoadButton);
                    Buttons.push(upButton)
                  } else {
                    if (resultMaster.fileStore === null) { // 有填报记录但未上传承诺书
                      Buttons.push(downLoadButton);
                      Buttons.push(upButton)
                    } else { // 有填报记未提交已上传承诺书
                      if (params.row.resultMaster.done === 0) {
                        Buttons.push(downloadPromiseFileButton)
                        Buttons.push(reUploadPromiseFileButton)
                      } else { // 有填报记已提交已上传承诺书
                        Buttons.push(downloadPromiseFileButton)
                      }
                    }
                  }
                } else {
                  Buttons.push(notCanButton)
                }
              } else {
                Buttons.push(notNeedButton)
              }
              return h('div', Buttons)
            }
          }, {
            title: "操作",
            minWidth: 200,
            align: 'center',
            render: (h, params) => {
              let that = this;
              let applyBtn = h('Button', {
                props: {
                  type: "primary",
                  size: 'small',
                  ghost: true,
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: function () {
                    //申请填报
                    that.applyReport(params);
                  }
                }
              }, '申请填报');
              let searchButton = h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  ghost: true
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: function () {
                    that.displayApplyStatus(params);
                  }
                }
              }, '查看申请')
              let fillButton = h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  ghost: true,
                  disable: params.row.fillStatus === 3 ? false : true
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: function () {
                    that.fillButton(params);
                  }
                }
              }, '填报')
              let commitBtn = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost: true,
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.toSubmit(params)
                  }
                }
              }, '提交')
              let readyCommitBtn = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost: true,
                },
                style: {
                  marginLeft: '5px'
                },
              }, '已提交')
              let watchMoreBtn = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost: true
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.watchFillData(params)
                  }
                }
              }, '查看')
              let buttons = [];
              if (params.row.publishType === 2) { // 需要申请的，将申请和查看申请加入
                buttons.push(searchButton)
              }
              if (params.row.fillStatus === 3) { // 不是填报中状态  不放入填报提交
                // 在需要申请并且申请状态为'10' 或者  不需要申请的情况下  将填报 按键加入
                if ((params.row.applyRecord && (params.row.applyRecord.applyStatus === 10 || params.row.applyRecord.applyStatus === 11)) || params.row.publishType !== 2) {
                  if (params.row.resultMaster !== null && params.row.resultMaster.done === 1) {
                    buttons.push(readyCommitBtn)
                  } else {
                    buttons.push(fillButton)
                    buttons.push(commitBtn)
                  }
                }
                // 只在填报中-且没有填报记录，才能申请
                if (params.row.publishType === 2) {
                  if (!params.row.resultMaster || params.row.applyStatus === -1) {
                    buttons.unshift(applyBtn)
                  }
                }
              }
              buttons.push(watchMoreBtn)
              return h('div', buttons)
            }
          }]
        }
        },
    props: {
      researchProject:{
        type:Object,
        default:()=>{
          return {
            id:"",
            researchProjectName:"",
            templateMasters:[],
            currentTemplateResultMaster:'',
          }
        }
      },
      need:{
        type:String,
        default:"yes"
      },
      index:{// 此任务所在列表索引
        type:Number
      }

    },
    methods:{
      // 创建一条新填报结果
      async createNewResult(templateMasterId){
        return await TemplateResultApi.createNewResult(templateMasterId)
      },
      //填报表单
      fillButton(param){
        if(param.row.fillStatus === 3){
          if(param.row.resultMaster === null || param.row.resultMaster.length === 0){
            this.createNewResult(param.row.id).then(res=>{
              if(res.data.code === '1'){
                let obj={
                  projectIndex:this.index,
                  templateIndex:param.index,
                  resultMaster:res.data.data
                }
                this.$emit('on-newResult',obj)
                this.$router.push({
                  path: "/form-fill.html?templateId=" + param.row.id + '&templateResultId=' + res.data.data.id,
                })
              } else {
                this.$Message.error({
                  content:'创建填报记录失败',
                  duration: 3
                })
              }
            }).catch(err=>{
              this.$Message.error({
                content:'创建填报记录失败',
                duration: 3
              })
            })
          }else{
            this.$router.push({
              path:"/form-fill.html?templateId=" + param.row.id + '&templateResultId=' + param.row.resultMaster.id
            })
          }
        }else{
          this.$Message.error({
            content:'此填报状态下表单不可以填报',
            duration:4
          })
        }
      },
      //申请填报
      applyReport(params){
        let that = this;
        this.getCurrentUserApplyRecords(params).then(datas=>{
          this.currentParams = params
          // 返回数据为所有申请记录
          let theApply = datas[0] //取出最近一条申请记录
          //申请记录大于零
          if(datas.length > 0 && theApply.hasOwnProperty('applyStatus')){
            if(theApply.applyStatus == 0){ // 待审核状态
              this.$Message.error("存在正在审核的申请，不能够再次申请")
            } else if (theApply.applyStatus == 10){ // 已通过审核，但数据填报为提交
              this.$Message.error("请先提交表单填报数据后再次申请")
            } else {
              this.$refs.applyModal.resetFields()
              this.applyModalStatus =true
            }
          } else { // 没有申请记录，直接发发起申请
            this.$refs.applyModal.resetFields()
            this.applyModalStatus =true
          }
        })
      },
      // 申请填报
      sureApply(){
        this.$refs.applyModal.validate((valid)=>{
          if(valid){
            this.loading = true
            TemplateApi.applyReport(this.currentParams.row.id,this.applyRecord).then(res=>{
              if(res.data.code === '1'){
                this.$Message.success("申请成功！")
                this.applyModalStatus = false
                this.loading = false
              } else {
                this.$Message.error("申请失败！")
                this.applyModalStatus = false
                this.loading = false
              }
            }).catch(err=>{
              this.$Message.error("申请失败！")
              this.applyModalStatus = false
              this.loading = false
            })
          }else{
            this.loading = false
          }
        })
      },
      getCurrentUserApplyRecords(params){
        let p = new Promise((resolve, reject) => {
          TemplateApi.findCurrentUserApplyRecords(params.row.id).then(res=>{
            resolve(res.data.data);
          }).catch(error=>{
            reject(error);
          }) ;
        })
        return p ;
      },
      // 查看审核结果
      displayApplyStatus(params){
        this.applyRecordModal = true ;
        let templateMasterId = params.row.id ;
        TemplateApi.findCurrentUserApplyRecords(templateMasterId).then(res=>{
          if(res.data.code === '1'){
            this.applyRecords = res.data.data;
          } else {
            this.$Message.error("获取审核结果数据失败！")
          }
        })
      },
       //提交已填报数据
      toSubmit(params) {
        //done 1  已提交   0未提交
        if(params.row.resultMaster === null){ // 验证是否有待填报记录
          this.$Message.error({
            content:'请先填报再提交!',
            duration:3
          })
          return 
        }
        if(params.row.complete > params.row.resultMaster.completeRate){// 验证填报比例是否达标
          this.$Message.error({
            content:"目前完成百分比:"+ params.row.resultMaster.completeRate+"%,未达设定值:" +params.row.complete+"%",
            duration:3
          })
          return;
        }
        if(params.row.needPromiseFile === 1){//验证需要上传承诺书情况下，是否已经上传承诺书
          if(params.row.resultMaster === null ||params.row.resultMaster.fileStore === null){
            this.$Message.error({
              content:'请上传承诺书！',
              duration:3
            })
            return
          }
        }
        if (params.row.resultMaster.done == 0) {
          //提交
          let _this = this;
          let obj = JSON.parse(JSON.stringify(params.row.resultMaster));
          obj.done = 1
          this.$Modal.confirm({
            title: "提交已保存数据",
            content: "确定要提交已保存数据吗？",
            onOk: function () {
              TemplateResultApi.commitResultMaster(obj.id).then(res=>{
                if(res.data.code === '1'){
                  _this.$Message.success({
                    content: '提交成功',
                    duration: 2
                  })
                  //提交成功刷新列表
                  _this.$emit('on-newResult')
                } else {
                  obj.templateStatus = '0'
                  _this.$Message.error({
                    content: "提交失败，请重试",
                    duration: 2
                  })
                }
              }).catch(err => {
                obj.templateStatus = '0'
                _this.$Message.error({
                  content: "提交失败，请重试",
                  duration: 2
                })
              })
            }
          })
        }
      },
      // 查看填报数据
      watchFillData(params){
        if(params.row.resultMaster === null){
          this.$Message.error({
            content:'没有正在填报记录',
            duration:3
          })
        }else{
          this.$router.push({
          path: "/form-fill.html?templateId=" + params.row.id + '&templateResultId=' + params.row.resultMaster.id+'&type=notEdit'
          })
        }
      },
      // 下载模板
      async toDownBook(params) {
        window.open(config.downLoadAddress + '?url=' + params.row.promiseFilePath)
      },
      // 上传承诺书
      uploadPromiseFile(params){
        if(params.row.publishType === 2 && params.row.applyStatus !== 10){
          this.$Message.error({
            content:'此审核状态下不可以上传承诺书！',
            duration: 4
          })
          return
        }
        if(params.row.resultMaster === null || params.row.resultMaster.length === 0){
          this.createNewResult(params.row.id).then(res=>{
            if(res.data.code === '1'){
              this.$emit('on-newResult')
              this.currentTemplateResultMaster = res.data
              this.uploadPromiseFileStatus=true
            }
          }).catch(err=>{
            console.log(err)
          })
        }else{
          this.currentTemplateResultMaster = params.row.resultMaster
          this.uploadPromiseFileStatus=true
        }
      },
        //上传成功！
      uploadSuccess(fileStore){
        this.currentTemplateResultMaster.fileStore = fileStore ;
        let obj={
          fileStoreId: fileStore.id,
          resultMasterId: this.currentTemplateResultMaster.id,
          fileStorePath: fileStore.url
        }
        TemplateResultApi.mergeTemplateResultMasterPut(obj).then(res=>{
          this.$Message.success({
            content:"承诺书上传成功！"
          })
          this.$emit('on-newResult')
          this.uploadPromiseFileStatus=false
        })
      },
      //下载已经上传的承诺书
      downLoadTemplateResultPromiseFile(params){
        window.open(config.downLoadAddress + '?url=' + params.row.promiseFilePath)
      },
    },
    components: {ApplyRecordList ,UploadBtn}
  }
</script>
<style scoped>
  .tmp-name {
      margin-bottom: 10px;
      font-size: 16px;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tipText{
      font-size:14px;
      margin-bottom: 30px;
    }
</style>
