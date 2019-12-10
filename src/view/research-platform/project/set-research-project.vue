
<template>
  <div class="layout">
    <Row type="flex" align="bottom" style="margin-bottom:20px;" :gutter='15'>
      <Col span="6">
      <span>任务名称：</span><Input v-model="projectName" style="width:70%;" clearable placeholder="查询任务名称"></Input></Col>
      <Col span="4" v-if="false">
      <span>开始时间：</span>
      <DatePicker  style="width:70%;"  type="date" v-model="startFillTime" :editable="false" placeholder="选择开始日期"></DatePicker>
      </Col>
      <Col span="4" v-if="false">
      <span>结束时间：</span>
      <DatePicker  style="width:70%;"  type="date" v-model="endFillTime" :editable="false" placeholder="选择结束日期"></DatePicker>
      </Col>
      <Col span="6">
      <span>填报状态：</span>
      <Select style="width:70%;"  v-model="findFillStatus" clearable>
        <Option value="0">未开始</Option>
        <Option value="3">填报中</Option>
        <Option value="2">暂停</Option>
        <Option value="1">已结束</Option>
      </Select>
      </Col>
      <Col span="2">
      <Button type="primary" size="small" @click="findByTerm">查询</Button>
      </Col>
    </Row>
    <div class="tmp-item" v-for="(item,index) in tableData" :key="item.id">
      <div class="item-header">
        <Row type='flex' align="middle">
          <Col span="10">
          <p class="tmp-name"><b>{{item.researchProjectName}}</b></p>
          </Col>
          <Col span="4" offset="2">
          <Button type="primary" size="small" @click="addNewPage(item.id)">添加表单</Button>
          </Col>
          <Col span="2" push="5">
          <div v-if="item.statusText === '未开始'" class="tmp-status-not">{{item.statusText}}</div>
          <div v-else-if="item.statusText === '填报中'" class="tmp-status-ing">{{item.statusText}}</div>
          <div v-else-if="item.statusText === '暂停'" class="tmp-status-pause">{{item.statusText}}</div>
          <div v-else-if="item.statusText === '已结束'" class="tmp-status-end">{{item.statusText}}</div>
          </Col>
        </Row>
      </div>
      <Table :columns="columnsMy" :data="item.heightStatus?item.templateMasters.slice(0,5):item.templateMasters" border></Table>
      <div class="tmp-item-user" style="text-align:center;" v-if="item.templateMasters.length > 5">
        <Button class="tmp-button" v-if="item.heightStatus" type="primary" ghost size='small' @click="changHeightStatus(index)">展开</Button>
        <Button class="tmp-button" v-if="!item.heightStatus" type="primary" ghost size='small' @click="changHeightStatus(index)">折叠</Button>
      </div>
    </div>
    <div style="text-align:center;margin-top:10px;">
      <Page :total="totalSize" :current='currentPage' @on-change="changePage" @on-page-size-change="changePageSize" 
      show-sizer show-total show-elevator prev-text="上一页" next-text="下一页"/>
    </div>
    <report-user ref="reportUserModal"></report-user>
    <!-- 添加表单 -->
    <Modal class="form-edit" v-model="handleFormState" :title="handleFormTitle">
      <Form ref="newForm" v-if="handleFormState" :model="newFormInfo" :rules="formValidate" :label-width="100">
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
          <upload-btn @uploadSuccess="fileUploaded" :noticeModalView='true'
           v-if="uploadShowFlag"></upload-btn>
          <Button type="primary" v-if="!uploadShowFlag" size="small" @click="uploadShowFlag=true">重新上传</Button>
          <Button v-if='!uploadShowFlag' type="success" size="small" @click="downLoadFile">查看承诺书</Button>
        </FormItem>
        <FormItem label="填报开始日期" prop="startDate">
          <DatePicker type="date" :value="newFormInfo.startDate" :editable="false" :options="optionsStart"
                      placeholder="选择开始日期"
                      @on-change='getStratDate'
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="填报结束日期" prop="endDate">
          <DatePicker type="date" :value="newFormInfo.endDate" :editable="false" :options="optionsEnd"
                      placeholder="选择结束日期"
                      @on-change='getEndDate'
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="填报类型" prop="publishType">
          <Select v-model="newFormInfo.publishType">
            <Option :value="0">指定填报</Option>
            <Option :value="1">公开填报</Option>
            <Option :value="2">申请填报</Option>
          </Select>
        </FormItem>
        <FormItem label="表单描述">
          <Input v-model="newFormInfo.templateDesc" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="请填写表单描述"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-left: 8px" type="text" @click="cancelHandle">取消</Button>
        <Button type="primary" @click="sureHandle" :loading='loading'>确定</Button>
      </div>
    </Modal>
    <ModalAlert ref="modalAlert"></ModalAlert>
    <apply-confirm v-if="confirmApplyFlag && applyTemplateId" :applyTemplateId="applyTemplateId" @now-close="confirmApplyFlag = false"></apply-confirm>
  </div>
</template>
<script>
  import {ResearchProjectApi, TemplateApi} from "@/api/"
  import ReportUser from "../component/template/report-user";
  import FillListPersonnel from '../form/fill-list-personnel'

  import ModalAlert from "@/components/modal-alert"
  import {getToken} from '@/libs/util'
  import UploadBtn from "../component/upload-btn";
  import applyConfirm  from '../component/apply-confirm/index.js'
  import { getFormartDate } from '@/libs/tools.js'
  import {mapMutations} from 'vuex';

  export default {
    components: {
      UploadBtn,
      ModalAlert,
      ReportUser,
      applyConfirm,
      FillListPersonnel
    },
    inject:['reload'],
    data() {
      return {
        publishConfirmModal: false,
        currentObj: undefined,
        currentParam: undefined,
        projectType: "",
        uploadShowFlag: true,
        header: {},
        fileInfos: [],
        //查询-任务名称
        projectName: "",
        //查询-开始时间
        startFillTime: null,
        //查询-结束时间
        endFillTime: null,
        //查询-填报状态
        findFillStatus: "",
        //添加/编辑表单弹窗头部信息
        handleFormTitle: "添加表单",
        //新建表单弹窗状态值
        handleFormState: false,
        //表单操作类型
        handleType: "add",
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
        loading:false,
        //新建表单信息
        newFormInfo: {
          //表单名称
          templateName: "",
          //是否需要上传承诺书  0不需要 1需要
          needPromiseFile: '0',
          //填报百分比
          complete: 90,
          //填报开始时间
          startDate: "",
          //填报结束时间
          endDate: "",
          //承诺书路径
          promiseFilePath: "",
          // 模板 1  表单 0
          templateFlag:'0',
          //发布状态 0未发布  1发布
          templateStatus: 0,
          //填报状态 0未开始  1已结束  2暂停 3填报中
          fillStatus: 0,
          //表单配置
          displayConfig: "",
          //表单描述
          templateDesc: "",
          //所属课题
          researchProject: "",
          //承诺书
          templateFileStore: "",
          publishType:"",//0，指定填报 1，公开填报 2，申请填报
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
            type: "number",
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
            type: "number",
            message: "请选择填报类型",
            tigger: "change"
          }]
        },
        //科研任务列表
        columnsMy: [
          {
            title: '表单名称',
            key: 'pageName',
            minWidth:300,
            fixed:'left'
          }, {
            title: '开始时间',
            key: 'startTime',
            minWidth:105
          }, {
            title: '截止时间',
            key: 'endTime',
            minWidth:105
          },{
            title: '填报类型',
            key: 'publishTypeText',
            minWidth:90
          },{
            title: '表单设置',
            key: 'setPage',
            minWidth: 200,
            render: (h, params) => {
              let templateStatus = params.row.templateStatus;
              let designBtn = h('Button', {
                props: {
                  type: "primary",
                  size: "small",
                  ghost:true
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.designTmp(params)
                  }
                }
              }, '设计表单');
              let writeBtn = h('Button', {
                props: {
                  type: "primary",
                  size: "small",
                  ghost:true
                },
                 style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.getFillUsers(params)
                  }
                }
              }, '填报人员')
              let yulanBtn = h('Button', {
                props: {
                  type: "primary",
                  size: "small",
                  ghost:true
                },
                 style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.yulanTemplate(params)
                  }
                }
              }, '预览表单')

              let actionButtons = [];
              if(params.row.publishType === 0){
                actionButtons.push(writeBtn)
              }
              if (templateStatus == 0) {
                actionButtons.push(designBtn)
              }else{
                actionButtons.push(yulanBtn)
              }
              return h('div', actionButtons)
            }
          },
          {
            title: '发布',
            key: 'publicPage',
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: params.row.publicStatus ? "error" : "primary",
                    size: "small",
                    ghost:true
                  },
                  on: {
                    click: () => {
                      this.toPublicTmp(params)
                    }
                  }
                }, params.row.publicStatus ? "取消发布" : "发布表单"),
              ])
            }
          }, {
            title: '填报状态',
            key: 'fillStatus',
            minWidth: 130,
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    //未发布或者未开始，已结束 为禁用状态
                    disabled: params.row.fillStatus || !params.row.publicStatus,
                    value: params.row.fillValue,
                  },
                  on: {
                    'on-change': (value) => {
                      this.changeFillStatus(params, value)
                    }
                  }
                }),
                h('span', {
                  style: {
                    display: 'inline-block',
                    marginLeft: '5px',
                  }
                }, params.row.fillText)
              ])
            }
          }, {
            title: '操作',
            key: 'action',
            minWidth: 250,
            align: 'center',
            render: (h, params) => {
              let needApply = params.row.needApply;
              let templateStatus = params.row.templateStatus;
              let buttons = [];
              let lookButton = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toWatchMore(params)
                  }
                }
              }, '查看');
              let editButton = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toEdit(params)
                  }
                }
              }, '编辑');
              let delButton = h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toDelete(params)
                  }
                }
              }, '删除');
              let confirmApplyButton = h('Button', {
                props: {
                  type: "info",
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.sureApply(params)
                  }
                }
              }, '审核')
              if (1 == needApply) {
                buttons.push(confirmApplyButton)
              }
              if (0 == templateStatus) {
                buttons.push(editButton)
                buttons.push(delButton)
              }
              buttons.push(lookButton)
              return h('div', buttons)
            }
          }
        ],
        //选中科研任务id
        projectId: "",
        //科研任务列表
        tableData: "",
        //科研任务原始数据-用于表单展示的条数限定
        oldTableData: "",
        // 分页-科研任务总条数
        totalSize: 11,
        //列表分页-当前页 后天从零开始
        currentPage: 1,
        //当前页显示条数
        pageSize: 10,
        //确认申请状态
        confirmApplyFlag:false,
        //申请表单ID
        applyTemplateId:""
      }
    },
    methods: {
      ...mapMutations([
        'fillWaitEmail'
      ]),
      getStratDate(v){//新增表单开始时间
        this.newFormInfo.startDate = v+' '+'00:00:00'
      },
      getEndDate(v){//新增表单结束时间
        this.newFormInfo.endDate = v +' '+'00:00:00'
      },
      //初始化项目信息  用于初始化弹窗数据初始化
      restPageInfo() {
        this.$refs.newForm.resetFields()
      },
      //申请确认
      sureApply(v){
        this.applyTemplateId = v.row.id;
        this.confirmApplyFlag = true;
      },
      //关闭申请
      closeConfirmApply(){
        this.confirmApplyFlag = false;
      },
      //按条件查询任务列表
      findByTerm() {
        this.currentPage = 1
        this.getProjectList();
      },
      //添加表单
      addNewPage(id) {
        this.newFormInfo={
          //表单名称
          templateName: "",
          //是否需要上传承诺书  0不需要 1需要
          needPromiseFile: 0,
          //填报百分比
          complete: 90,
          //填报开始时间
          startDate: "",
          //填报结束时间
          endDate: "",
          //承诺书路径
          promiseFilePath: "",
          // 模板 1  表单 0
          templateFlag: 0,
          //发布状态 0未发布  1发布
          templateStatus: 0,
          //填报状态 0未开始  1已结束  2暂停 3填报中
          fillStatus: 0,
          //表单配置
          displayConfig: "",
          //表单描述
          templateDesc: "",
          //所属课题
          researchProject: "",
          //承诺书
          templateFileStore: "",
          publishType:"",//0，指定填报 1，公开填报 2，申请填报
        }
        this.projectId = id;
        this.handleFormTitle = '添加表单';
        this.handleType = "add";
        this.handleFormState = true;
        this.uploadShowFlag = true;
      },
      //添加表单-上传承诺书成功
      uploadFile(respon, file, fileList) {
      },
      //确定添加、编辑表单
      sureHandle() {
        this.$refs.newForm.validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.handleType == 'add') {
              //将此表单所属科研任务ID置成选中id
              this.newFormInfo.researchProject = this.projectId;
              //不需要上传承诺数
              if(!this.newFormInfo.templateFileStore||!this.newFormInfo.templateFileStore){
                delete this.newFormInfo.templateFileStore
              }

              if(!this.newFormInfo.creator){
                this.newFormInfo.creator=this.$store.state.user.userId
              }
              TemplateApi.addOrEditTemplate(this.projectId,this.newFormInfo)
                .then(res => {
                  if (res.data.code == '1') {
                    this.$Message.success({
                      content: "新建成功",
                      duration: 2
                    });
                    this.getProjectList();
                    this.handleFormState = false;
                    this.loading = false;
                    this.restPageInfo();
                  } else {
                    this.$Message.error({
                      content: "新建失败，请重试",
                      duration: 2
                    })
                    this.loading = false;
                  }
                }).catch(err => {
                this.$Message.error({
                  content: "新建失败，请重试",
                  duration: 2
                })
                this.loading = false;
              })
            }
            if (this.handleType == 'edit') {
              TemplateApi.addOrEditTemplate(this.projectId,this.newFormInfo)
                .then(res => {
                  if (res.data.code == '1') {
                    this.$Message.success({
                      content: "编辑成功",
                      duration: 2
                    });
                    this.getProjectList();
                    this.handleFormState = false;
                    this.loading = false;
                    this.restPageInfo();
                  } else {
                    this.$Message.error({
                      content: "编辑失败，请重试",
                      duration: 2
                    })
                    this.loading = false
                  }
                }).catch(err => {
                this.$Message.error({
                  content: "编辑失败，请重试",
                  duration: 2
                })
                this.loading = false
              })
            }
          } else {
            this.loading = false
            this.$Message.error({
              content: "请将必填项填写完整",
              duration: 3
            })
          }
        })
      },
      //取消添加/编辑表单
      cancelHandle() {
        this.restPageInfo();
        this.handleFormState = false;
      },
      //查看-表单详情
      toWatchMore(params) {
        this.$router.push({
          path: "/page-info.html",
          query: {
            templateId: params.row.id,
            currentPage:this.currentPage,
            publishType:params.row.publishType
          }
        })
      },
      //表单预览
      yulanTemplate(params){
        this.$router.push({
          name: "formManage",
          params: {
            ...params.row,
            preView: true,
            currentPage:this.currentPage,
            isTemplate:false
          }
        })
      },
      //设计表单
      designTmp(params) {
        //进入表单设计
        this.$router.push({
          name: "formManage",
          params: {
            ...params.row,
            currentPage:this.currentPage,
            isTemplate:false
          }
        })
      },
      //设置填报人员
      getFillUsers(params) {
        this.$router.push({
          name: "fillListPersonnel",
          params: {
            ...params.row,
            currentPage:this.currentPage
          }
        })
        // this.$refs.fillListModel.openFillUserListModel(params.row.id)
        // this.$refs.reportUserModal.openReportUserModal(params.row.id)
      },
      //改变填报状态
      changeFillStatus(params, value) {
        if (value) {
          //设置为填报中  状态
          TemplateApi.changeTmplateFillStatusById( params.row.id,3)
            .then(res => {
              this.$Message.success({
                content: "修改成功",
                duration: 2
              })
              //修改源数据-防止编辑时取错值
              this.oldTableData[params.row.templateIdx].templateMasters[params.index].fillStatus = 3
              params.row.fillValue = true;
              params.row.fillText = "填报中"
              this.getProjectList()
            }).catch(err => {
            this.$Message.error({
              content: "修改失败",
              duration: 2
            });
            params.row.fillValue = false;
            params.row.fillText = "暂停"
          })
        } else {
          //设置为暂停 状态
          TemplateApi.changeTmplateFillStatusById( params.row.id,2)
            .then(res => {
              this.$Message.success({
                content: "修改成功",
                duration: 2
              })
              //修改源数据-防止编辑时取错值
              this.oldTableData[params.row.templateIdx].templateMasters[params.index].fillStatus = 2
              params.row.fillValue = false;
              params.row.fillText = "暂停"
              this.getProjectList()
            }).catch(err => {
            this.$Message.error({
              content: "修改失败",
              duration: 2
            });
            params.row.fillValue = true;
            params.row.fillText = "填报中"
          })
        }
      },
      //发布/取消发布表单
      async toPublicTmp(params) {
        let _this = this;
        //取消发布
        if (params.row.publicStatus) {
          let data = await TemplateApi.checkAbleUnpublish(params.row.id)
          if (data.data.code === '1') {
            let obj = this.oldTableData[params.row.templateIdx].templateMasters[params.index];
            obj.templateStatus = 0
            this.$Modal.confirm({
              title: "取消发布",
              content: "确定要取消发布此表单吗？",
              onOk: function () {
                TemplateApi.unPublishTemplate(obj.id).then(res => {
                  if (res.data.code == '1') {
                    //先修改本地数据 发布状态
                    _this.tableData[params.row.templateIdx].templateMasters[params.index].publicStatus = false;
                    _this.$Message.success({
                      content: "取消成功",
                      duration: 2
                    })
                    _this.getProjectList();
                    _this.getListNum()
                  }
                }).catch(err => {
                  obj.templateStatus = 1;
                  _this.$Message.error({
                    content: err.response.data.description,
                    duration: 2
                  })
                })
              }
            })
          } else {
            this.$Message.error('不可取消')
            return false
          }
        } else {
          //发布表单
          let obj = this.oldTableData[params.row.templateIdx].templateMasters[params.index];
          let endtime = new Date(obj.endDate).getTime()
          let now1 = Date.now()
          if(endtime < now1){
            let hs = (now1-endtime)/(24*60*60*1000)
            if(hs > 1){
              this.$Message.error({
                content:'表单截止日期已到期，请修改表单截止日后，再发布表单',
                duration:5
              })
              return
            }
          }
          //验证是否设置填报时间
          if (obj.startDate == null || obj.endDate == null) {
            this.$Message.error({
              content: "请设置填报时间",
              duration: 3
            })
          } else if (obj.publishType === undefined || obj.publishType === null) {
            this.$Message.error({
              content: "请设置填报类型",
              duration: 5
            })
          } else {
            obj.templateStatus = 1
            let publishType = ""
            this.currentObj = obj;
            this.currentParam = params;
            this.$Modal.confirm({
              title: "系统提示",
              content: "是否确认要进行表单发布？",
              okText: "确认",
              cancelText: "取消",
              onOk: () => {
                _this.publish();
              }
            })
          }
        }
      },
      publish() { //发布表单
        let that = this;
        let obj = this.currentObj
        let params = this.currentParam;
        TemplateApi.publishTemplate(obj.id).then(res => {
          if (res.data.code == '1') {
            //先删除data中对应表单
            that.tableData[params.row.templateIdx].templateMasters[params.index].publicStatus = true;
            that.$Message.success({
              content: "发布成功",
              duration: 2
            })
            this.getProjectList()
            this.getListNum()
          } else {
            obj.templateStatus = 0
            that.currentObj = undefined;
            that.currentParam = undefined;
            this.$Message.error({content: res.data.data, duration:3})
          }
        }).catch(err => {
          obj.templateStatus = 0
          that.currentObj = undefined;
          that.currentParam = undefined;
          if(err.response.status === 500){
            this.$Message.error({content: err.response.data.description,duration:3})
          }else{
            this.$Message.error({content: "发布失败",duration:3})
          }
        })
      },
      //获取待填报表单数量
      getListNum(){
        TemplateApi.getWaitTemplateNum().then(res=>{
          this.fillWaitEmail(res.data.data)
        })
      },
      //编辑表单信息
      toEdit(params) {
        this.projectId = params.row.projectId
        this.newFormInfo = this.oldTableData[params.row.templateIdx].templateMasters[params.index];
        this.handleFormTitle = "编辑表单";
        this.handleType = "edit";
        this.handleFormState = true;
        if (params.row.templateFileStore) {
          this.uploadShowFlag = false;
        }
      },
      //删除表单
      toDelete(params) {
        let _this = this;
        if(params.row.templateStatus != 0){
         this.$Message.error({content:"表单已发布，不允许删除！"})
          return ;
        }
        this.$Modal.confirm({
          title: "删除表单",
          content: "确定要删除此表单吗？",
          onOk: function () {
            TemplateApi.deleteTemplateById(params.row.id)
              .then(res => {
                if (res.data.code == '1') {
                  //先删除data中对应表单
                  _this.tableData[params.row.templateIdx].templateMasters.splice(params.index, 1)
                  _this.$Message.success({
                    content: "删除成功",
                    duration: 2
                  })
                } else {
                  _this.$Message.error({
                    content: "删除失败，请重试",
                    duration: 2
                  })
                }
              }).catch(err => {
              _this.$Message.error({
                content: "删除失败，请重试",
                duration: 2
              })
            })
          }
        })
      },
      //打印页面
      printPage(params) {
        window.open('/print-page.html?projectId=' + params.row.projectId + '&masterId=' + params.row.id)
      },
      // 获取我创建的任务
      getProjectList() {
        let obj = {
          //当前页
          pageNo: this.currentPage,
          //每页显示条数
          pageSize: this.pageSize
        }
        //根据是否有值
        if (this.projectName) {
          obj.projectName = this.projectName
        }
        if (this.findFillStatus) {
          obj.projectStatus = this.findFillStatus
        }
        if (this.endFillTime) {
          obj.endDate = new Date(this.endFillTime).getTime();
        }
        if (this.startFillTime) {
          obj.startDate = new Date(this.startFillTime).getTime();
        }
        ResearchProjectApi.getAllProjects(obj).then(res => {
          let obj = JSON.parse(JSON.stringify(res.data.data))
          for (let i = 0; i < obj.data.length; i++) {
            //每个科研任务 下面表单显示条数 当heightStstus为true是 显示2条
            obj.data[i].heightStatus = true;
            //根据不同状态 推算出‘科研任务’显示状态
            switch (obj.data[i].projectStatus) {
              case 0:
                obj.data[i].statusText = "未开始";
                break;
              case 1:
                obj.data[i].statusText = "已结束";
                break;
              case 2:
                obj.data[i].statusText = "暂停";
                break;
              case 3:
                obj.data[i].statusText = "填报中"
            };
            if(obj.data[i].templateMasters){
              obj.data[i].templateMasters = obj.data[i].templateMasters.map((item, index) => {
                let fillStatus, fillValue, fillText ,needApplyText,publishTypeText;
                //根据不同状态  推算出不同显示状态
                switch (item.fillStatus) {
                  case 0:
                    fillStatus = true;
                    fillValue = false;
                    fillText = "未开始";
                    break;
                  case 1:
                    fillStatus = true;
                    fillValue = false;
                    fillText = "已结束";
                    break;
                  case 2:
                    fillStatus = false;
                    fillValue = false;
                    fillText = "暂停";
                    break;
                  case 3:
                    fillStatus = false;
                    fillValue = true;
                    fillText = "填报中"
                    break;
                  default:
                    fillStatus = true;
                    fillValue = false;
                    fillText = "无状态"
                };
                // 申请填报
                switch (item.needApply) {
                  case 0:
                    needApplyText = '不需要申请';
                    break;
                  case 1:
                    needApplyText = '需要申请';
                    break;
                  default :
                    needApplyText = ''
                };
                // 填报范围 0，指定填报 1，公开填报 2，申请填报
                switch (item.publishType) {
                  case 0:
                    publishTypeText = '指定填报';
                    break;
                  case 1:
                    publishTypeText = '公开填报';
                    break;
                  case 2:
                    publishTypeText = '申请填报';
                    break;
                  default :
                    publishTypeText = ''
                };
                //返回table 表格数据
                return {
                  //所在科研任务 在数组中的索引  用于编辑时获取源数据
                  templateIdx: i,
                  //用于打印时传值
                  projectId: obj.data[i].id,
                  //用于发布表单 判断表单是否已经设计完成
                  displayConfig: item.displayConfig,
                  id: item.id,
                  projectNum: index + 1,
                  pageName: item.templateName,
                  startTime: item.startDate ? getFormartDate(item.startDate, 'year') : "",
                  endTime: item.endDate ? getFormartDate(item.endDate, 'year') : "",
                  fillStatus: fillStatus,
                  fillValue: fillValue,
                  fillText: fillText,
                  templateFileStore: item.templateFileStore,
                  needApply: item.needApply, //是否需要申请
                  publishType: item.publishType, //发布的方式， 0，指定填报 1，公开填报 2，申请填报
                  publicStatus: item.templateStatus == 0 ? false : true,
                  templateStatus: item.templateStatus,
                  needApplyText:needApplyText, //是否需要申请
                  publishTypeText:publishTypeText, //填报范围
                  commitNum:item.commitNum,// 此表单已提交数据
                }
              })
            } else {
              obj.data[i].templateMasters = []
            }
          }
          this.oldTableData = JSON.parse(JSON.stringify(res.data.data.data));
          this.totalSize = obj.totalRows;
          this.tableData = obj.data;
        })
      },
      //修改表单数据条数
      changHeightStatus(index) {
        this.tableData[index].heightStatus = !this.tableData[index].heightStatus
      },
      // 改变页码
      changePage(index) {
        this.currentPage = index;
        this.getProjectList();
      },
      // 改变每页条数
      changePageSize(size) {
        this.pageSize = size;
        this.getProjectList();
      },
      fileUploaded (response) {
        this.newFormInfo.promiseFilePath = response.url
        this.newFormInfo.templateFileStore = response.id;
        this.uploadShowFlag = false;
      },
      // 查看承诺书
      async downLoadFile () {
        if (!this.newFormInfo.templateFileStore) {
          this.$Message.error({content: "未找到对应的承诺书模板！"})
          return;
        }
        window.location.href = this.newFormInfo.promiseFilePath
        // let fileData = await TemplateApi.downLoadTemplateFile(this.newFormInfo.templateFileStore.url)
        // const type = "text/plain; charset=UTF-8";
        // let filename = this.newFormInfo.templateFileStore.name
        // let blob = new Blob([fileData.data], { type: type })
        // if (typeof window.navigator.msSaveBlob !== 'undefined') {
        //   window.navigator.msSaveBlob(blob, filename);
        // } else {
        //   var URL = window.URL || window.webkitURL;
        //   var downloadUrl = URL.createObjectURL(blob);
        //   var a = document.createElement("a");
        //   if (typeof a.download === 'undefined') {
        //     window.location = downloadUrl;
        //   } else {
        //     a.href = downloadUrl;
        //     a.download = filename;
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a)
        //   }
        // }
      }
    },
    mounted() {
      const token = getToken();
      this.header.authorization = token;
      if(this.$route.query.currentPage){
        this.currentPage =Number(this.$route.query.currentPage)
      }
      //获取科研任务及下属表单列表
      this.getProjectList();
    }
  }

</script>
<style lang="less" scoped>
.layout {
  padding: 10px 10px;
  min-height: 100%;
  background: #fff;
  border-radius: 4px;
  .file-uploads {
    overflow: visible;
    position: relative;
    text-align: center;
    display: inline-block;
  }
  .tmp-item {
    margin-bottom: 30px;
    border-top: 2px solid #eeeeee;
    border-bottom: 2px solid #eeeeee;

    .item-header {
      margin-bottom: 6px;
      .tmp-name {
        margin-top: 10px;
        font-size: 16px;
        color: #0aa858;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tmp-status-not {
        position: relative;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        background: #2D8CF0;
        color: #FFFFFF;
        text-indent: 1em;

        &::after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          border-width: 15px 15px 15px 0px;
          border-style: solid;
          border-color: #2D8CF0 transparent #2D8CF0 #2D8CF0;
          position: absolute;
          top: 0px;
          right: -15px;
        }
      }

      .tmp-status-ing {
        position: relative;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        background: #21AC43;
        color: #FFFFFF;
        text-indent: 1em;

        &::after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          border-width: 15px 15px 15px 0px;
          border-style: solid;
          border-color: #21AC43 transparent #21AC43 #21AC43;
          position: absolute;
          top: 0px;
          right: -15px;
        }
      }
      .tmp-status-pause {
        position: relative;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        background: #E83E4A;
        color: #FFFFFF;
        text-indent: 1em;

        &::after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          border-width: 15px 15px 15px 0px;
          border-style: solid;
          border-color: #E83E4A transparent #E83E4A #E83E4A;
          position: absolute;
          top: 0px;
          right: -15px;
        }
      }
      .tmp-status-end {
        position: relative;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        background: #E6E7E8;
        color: #FFFFFF;
        text-indent: 1em;

        &::after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          border-width: 15px 15px 15px 0px;
          border-style: solid;
          border-color: #E6E7E8 transparent #E6E7E8 #E6E7E8;
          position: absolute;
          top: 0px;
          right: -15px;
        }
      }
    }
    .tmp-button{
      margin: 0px;
      height: 20px;
      border-top: 0px;
      padding: 0px 20px;
      border-bottom: 0px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
  }
}
</style>
<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
.tmp-item-user .ivu-btn > span{
  color: #000;
  font-size: 9px;
}
.form-edit .ivu-modal-body{
  padding-bottom: 0px;
}
.form-edit .ivu-form-item{
  margin-bottom: 18px;
}
.form-edit .ivu-form-item-content{
  line-height: 28px;
}
.form-edit .ivu-form-item-error-tip{
  padding-top: 3px;
}
</style>
