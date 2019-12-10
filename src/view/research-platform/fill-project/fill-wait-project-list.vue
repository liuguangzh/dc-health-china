<style lang="less">
  .ivu-table th {
    background: #E6E7E8;
  }
</style>
<template>
  <div class="wait-fill-list">
    <Row type="flex" align="top" style="margin-bottom:20px;">
      <Col span="6">
      <span>任务名称:</span>
      <Input style="width:70%;" type="text" v-model="researchName" placeholder="请输入查询任务名称"></Input>
      </Col>
      <Col span="6">
      <span>表单名称:</span>
      <Input style="width:70%;" type="text" v-model="templateName" placeholder="请输入查询表单名称"></Input>
      </Col>
      <Col span="2">
      <Button type="primary" size="small" @click="searchByTerm">查询</Button>
      </Col>
    </Row>
    <div>
      <Table :columns="columnsMy" :data="resultMasterList" border></Table>
    </div>
    <div style="text-align:center;margin-top:10px;">
      <Page :total="totalSize" :current='currentPage' :page-size='10' @on-change="changePage"
        @on-page-size-change="changePageSize" show-sizer show-total show-elevator prev-text="上一页" next-text="下一页" />
    </div>
    <!-- 上传承诺书 -->
    <Modal title="提示信息" v-model="uploadPromiseFileModal" :closable="true" :mask-closable="false" :footer-hide="true">
      <p class="tipText">上传承诺书，当前表单为：{{currentTemplateResultMaster.templateName}}</p>
      <p class="tipText">请确保您的承诺书已经签字盖章！</p>
      <p class="tipText">提示信息：支持文件类型：pdf、jpg、jpeg、png、doc、docx,文件最大为50M</p>
      <upload-btn v-if="uploadPromiseFileModal" @uploadSuccess="uploadSuccess"></upload-btn>
    </Modal>
    <!-- 申请记录 -->
     <Modal large v-model="applyRecordModal" :closable="false" :mask-closable="false" width="800">
      <p slot="header">申请记录查询</p>
      <apply-record-list :applyRecords="applyRecords"></apply-record-list>
      <div slot="footer">
            <Button type="primary" @click="applyRecordModal= false">关闭</Button>
      </div>
    </Modal>
    <!-- 发起申请 -->
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
  import {ResearchProjectApi,TemplateApi,TemplateResultApi} from '@/api/index.js'
  import UploadBtn from "../component/upload-btn";
  import ApplyRecordList from "@/view/research-platform/component/apply-record/apply-record-list";
  import {mapGetters,mapMutations} from 'vuex';
  import {constants} from 'crypto';
  export default { //待提交任务列表
    components: {UploadBtn,ApplyRecordList},
    inject: ['reload'],
    data() {
      const validatePhone = (rule, value, callback)=>{
        if(value){
          const phoneVal = /^[1][3,4,5,7,8][0-9]{9}$/
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
        researchName: '', // 任务名称
        templateName: '', // 表单名称
        resultMasterList: [],
        applyRecordModal:false,//查看申请记录
        applyRecords:[],//申请记录
        applyModalStatus:false,// 发起申请
        currentParams:'', // 当前申请的表单
        loading:false, // 发起申请按钮状态
        applyRecord:{
          applyPersonName:'',
          unitName:'',
          applyDesc:'',
          applyPhone:''
        },
        applyRules:{
          applyPersonName:[{required: true, message: '请填写申请人姓名', trigger: 'blur' }],
          unitName:[{required: true, message: '请填写申请人单位信息', trigger: 'blur'}],
          applyPhone:[{validator: validatePhone ,message:'' , trigger: 'blur'}]
        },
        columnsMy: [{
            title: '表单名称',
            align: 'center',
            key: 'templateName'
          },
          {
            title: '所属任务',
            align: 'center',
            key: 'researchProjectName',
            render: (h, params) => {
              return h('div', params.row.researchProjectName)
            }
          },
          {
            title: '承诺书',
            align: 'center',
            key: 'promiseBook',
            render: (h, params) => {
              let that = this;
              const needPromiseFile = params.row.needPromiseFile;
              const resultMaster = params.row.resultMaster;

              let Buttons = [];

              let downLoadButton = h("Button", {
                props: {
                  type: 'primary',
                  size: "small",
                  ghost: true
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
                  ghost: true
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
                on: {
                  click: function () {
                    that.downLoadTemplateResultPromiseFile(resultMaster.fileStore);
                  }
                }
              }, '查看')
              let reUploadPromiseFileButton = h("Button", {
                props: {
                  type: 'error',
                  size: 'small',
                  ghost: true,
                  disabled: params.row.done == 1 ? true : false
                },
                on: {
                  click: () => {
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

              if (needPromiseFile == 1) {
                if (!resultMaster) { // 未有填报记录
                  Buttons.push(downLoadButton);
                  Buttons.push(upButton)
                } else {
                  if (!resultMaster.fileStore) { // 有填报记录未上传承诺书
                    Buttons.push(downLoadButton);
                    Buttons.push(upButton)
                  } else { //有填报记录已上传承诺书
                    Buttons.push(downloadPromiseFileButton)
                    Buttons.push(reUploadPromiseFileButton)
                  }
                }
              } else {
                Buttons.push(notNeedButton)
              }

              return h('div', Buttons);
            }
          },
          {
            title: '完成百分比',
            key: 'completeRate',
            width: 100,
            render: (h, params) => {
              let complete = 0
              if (params.row.resultMaster) {
                complete = params.row.resultMaster.completeRate
              }
              return h('div', [
                h('p', {
                  style: {
                    textAlign: "center"
                  }
                }, complete + '%'),
                h('Progress', {
                  props: {
                    percent: complete,
                    status: "success",
                    "hide-info": true
                  }
                }),
              ])
            }
          }, {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let that = this
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
              let fillBtn = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost: true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    that.toFill(params)
                  }
                }
              }, '填报')
              let sunBtn = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost: true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    that.toSubmit(params)
                  }
                }
              }, '提交')
              let Buttons = []
              if(params.row.publishType === 2){
                if(params.row.applyStatus === 10){
                  Buttons.push(fillBtn)
                  Buttons.push(sunBtn)
                }else{
                  Buttons.push(applyBtn)
                  Buttons.push(searchButton)
                }
              }else{
                Buttons.push(fillBtn)
                Buttons.push(sunBtn)
              }
              return h('div', Buttons)
            }
          }
        ],
        totalSize: 0, // 分页-科研任务总条数
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页显示条数
        uploadPromiseFileModal: false, // 上传承诺书显示
        currentTemplateResultMaster: {
          templateName: ''
        },
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      ...mapMutations([
        'fillWaitEmail'
      ]),
      // 创建一条新填报结果
      async createNewResult(templateMasterId) {
        return await TemplateResultApi.createNewResult(templateMasterId)
      },
      // 初始化数据
      getList() {
        let obj = {
          pageNo: this.currentPage,
          pageSize: this.pageSize
        }
        obj.templateName = this.templateName
        obj.researchName = this.researchName
        TemplateApi.getWaitTemplate(obj)
          .then(res => {
            this.totalSize = res.data.data.totalRows
            this.resultMasterList = res.data.data.data;
            this.getListNum()
          })
      },
      //获取待填报表单数量
      getListNum(){
        TemplateApi.getWaitTemplateNum().then(res=>{
            this.fillWaitEmail(res.data.data)
        })
      },
      // 查询按钮
      searchByTerm() {
        this.currentPage = 1
        this.getList();
      },
      // 改变页码
      changePage(index) {
        this.currentPage = index;
        this.getList();
      },
      // 改变每页条数
      changePageSize(size) {
        this.pageSize = size;
        this.getList();
      },
      // 下载承诺书模板
      toDownBook(params) {
        window.open(config.downLoadAddress + '?url=' + params.row.promiseFilePath)
      },
      // 上传承诺书
      uploadPromiseFile(params) {
        if (params.row.resultMaster === null || params.row.resultMaster.length === 0) {
          this.createNewResult(params.row.id).then(res => {
            if (res.status === 200) {
              this.currentTemplateResultMaster = res.data
              this.uploadPromiseFileModal = true
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.currentTemplateResultMaster = params.row.resultMaster
          this.uploadPromiseFileModal = true
        }
      },
      // 上传成功
      uploadSuccess(fileStore) {
        this.currentTemplateResultMaster.fileStore = fileStore;
        let obj = {
          fileStoreId: fileStore.id,
          resultMasterId: this.currentTemplateResultMaster.id,
          fileStorePath: fileStore.url
        }
        TemplateResultApi.mergeTemplateResultMasterPut(obj)
          .then(res => {
           this.$Message.success({
              content: "承诺书上传成功！"
            })
            this.currentTemplateResultMaster = {
              templateName: ""
            };
            this.uploadPromiseFileModal = false
            this.getList()
          })
      },
      // 查看承诺书
      async downLoadTemplateResultPromiseFile(fileStore) {
        let fileData = await TemplateApi.downLoadTemplateFile(fileStore.id)
        const type = "text/plain; charset=UTF-8";
        let filename = fileStore.originName
        let blob = new Blob([fileData.data], {
          type: type
        })
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);
          var a = document.createElement("a");
          if (typeof a.download === 'undefined') {
            window.location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a)
          }
        }
      },
      //填报数据
      toFill(params) {
        if (params.row.resultMaster === null || params.row.resultMaster.length === 0) {
          this.createNewResult(params.row.id).then(res => {
            if (res.data.code === '1') {
              let obj = {
                projectIndex: this.index,
                templateIndex: params.index,
                resultMaster: res.data.data
              }
              this.$router.push({
                path: "/form-fill.html?templateId=" + params.row.id + '&templateResultId=' + res.data.data.id
              })
            } else {
              this.$Message.error({content: '创建填报记录成功', duration: 3})
            }
          }).catch(err => {
            this.$Message.error({content: err, duration: 3})
          })
        } else {
          this.$router.push({
            path: "/form-fill.html?templateId=" + params.row.id + '&templateResultId=' + params.row.resultMaster.id
          })
        }
      },
      // 提交已填报数据
      toSubmit(params) {
        // done 1  已提交   0未提交
        if(params.row.resultMaster){
          let doRatio = params.row.resultMaster.completeRate;
          if (doRatio < params.row.complete) { // 验证填写百分比是否满足设计要求
            this.$Message.error({
              content: "完成百分比未达设定值:" + params.row.complete + "%",
              duration: 3
            })
            return;
          }
        }
        if (params.row.needPromiseFile === 1 && !params.row.fileStore) { //对是否需要上传成功诺书及承诺书时候需要上传
          this.$Message.error({
            content: "请先上传承诺书",
            duration: 3
          })
          return;
        }
        if(params.row.resultMaster){
          if(params.row.resultMaster.done === 1){
            this.$Message.error({
              content: "填报数据已提交",
              duration: 3
            })
          } else {
            //提交
            let _this = this;
            let obj = JSON.parse(JSON.stringify(params.row.resultMaster));
            this.$Modal.confirm({
              title: "提交已保存数据",
              content: "确定要提交已保存数据吗？",
              onOk: function () {
                TemplateResultApi.commitResultMaster(obj.id).then(res => {
                  if (res.data.code === '1') {
                    // 先修改对应本地数据值
                    _this.$Message.success({
                      content: '提交成功',
                      duration: 2
                    })
                    // 如果当前页只有一条待提交数据,且当前页不为第一页，这页数减1.否则不做页数变换
                    if (_this.resultMasterList.length > 1) {
                      if (_this.currentPage > 1) {
                        _this.currentPage = _this.currentPage - 1 
                      }
                      _this.getList()
                    } else {
                      _this.getList()
                    }
                  } else {
                    obj.templateStatus = 0
                    _this.$Message.error({
                      content: "提交失败，请重试",
                      duration: 2
                    })
                  }
                }).catch(err => {
                  obj.templateStatus = 0
                  _this.$Message.error({
                    content: "提交失败，请重试",
                    duration: 2
                  })
                })
              }
            })
          }
        } else {
          this.$Message.error({
            content: "请先填报表单",
            duration: 2
          })
        }
      },
      //申请填报
      applyReport(params){
        let that = this ;
        this.getCurrentUserApplyRecords(params).then(datas=>{
          this.currentParams = params
          // 返回数据为所有申请记录
          let theApply = datas[datas.length - 1] //取出最近一条申请记录
          //申请记录大于零
          if(datas.length > 0 && theApply.hasOwnProperty('applyStatus')){
            if(theApply.applyStatus == 0){ // 待审核状态
              this.$Message.error("存在正在审核的申请，不能够再次申请")
            }else if(theApply.applyStatus == 10){// 已通过审核，但数据填报为提交
              this.$Message.error("请先提交表单填报数据后再次申请")
            }else{
                this.$refs.applyModal.resetFields()
                this.applyModalStatus =true
            }
          }else{// 没有申请记录，直接发发起申请
              this.$refs.applyModal.resetFields()
              this.applyModalStatus =true
          }
        })
      },
      // 查看申请记录
      getCurrentUserApplyRecords(params){
        let p = new Promise((resolve, reject) => {
          TemplateApi.findCurrentUserApplyRecords(params.row.id).then(res=>{
            resolve(res.data);
          }).catch(error=>{
            reject(error);
          }) ;
        })
        return p ;
      },
         // 申请填报
      sureApply(){
        this.$refs.applyModal.validate((valid)=>{
          if(valid){
            this.loading = true
            TemplateApi.applyReport(this.currentParams.row.id,this.applyRecord).then(res=>{
              this.$Message.success("申请成功！")
              this.applyModalStatus = false
              this.loading = false
            }).catch(err=>{
              this.$Message.success("申请失败！")
              this.applyModalStatus = false
              this.loading = false
            })
          }else{
            this.loading = false
          }
        })
      },
      // 查看审核结果
      displayApplyStatus(params){
        this.applyRecordModal = true ;
        let templateMasterId = params.row.id ;
        TemplateApi.findCurrentUserApplyRecords(templateMasterId).then(res=>{
          if(res.data.code === '1'){
            this.applyRecords = res.data.data ;
          } else {
            this.$Message.error("获取申请记录失败")
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .wait-fill-list {
    padding: 10px 10px;
    min-height: 100%;
    background: #fff;
    border-radius: 4px;
  }

  .tipText {
    font-size: 14px;
    margin-bottom: 30px;
  }
</style>