<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <div class="layout">
    <!-- 查询条件 -->
    <Row type="flex" align="middle" justify="start" style="margin-bottom:20px;" :gutter="10">
      <Col span="5">
      <span>任务名称：</span>
      <Input  style="width:70%;"  type="text" v-model="projectName" placeholder="请输入查询任务名称"></Input>
      </Col>
      <!-- <Col span="3">
      <span>开始时间：</span>
      <DatePicker type="date" v-model="startFillTime" :editable="false" placeholder="选择开始日期"></DatePicker>
      </Col>
      <Col span="3">
      <span>结束时间：</span>
      <DatePicker type="date" v-model="endFillTime" :editable="false" placeholder="选择结束日期"></DatePicker>
      </Col> -->
      <Col span="5">
      <span>填报状态：</span>
      <Select style="width:70%;"  v-model="fillStatus" clearable>
        <Option value="0">未开始</Option>
        <Option value="1">已结束</Option>
        <Option value="2">暂停</Option>
        <Option value="3">填报中</Option>
      </Select>
      </Col>
      <Col span="5">
      <span>完成百分比：</span>
      <div  style="width:65%;display:inline-block;" >
        <Select v-model="doRatio" clearable style="width:50%;">
          <Option value="1">大于</Option>
          <Option value="-1">小于</Option>
          <Option value="0">等于</Option>
        </Select>
        <InputNumber :max="100" :min="1" v-model="complete" :formatter="value => `${value}%`"
                     :parser="value => value.replace('%', '')"
                     style="width: 50%"></InputNumber>
      </div>
      </Col>
      <Col span="5">
        <span>是否提交：</span>
        <Select v-model="ifSub" :clearable="true" style="width:70%;">
          <Option value="0">未提交</Option>
          <Option value="1">已提交</Option>
        </Select>
      </Col>
      <Col span="2">
        <Button type="primary" size="small" @click="searchByTerm" style="margin-left:20px;">查询</Button>
      </Col>
    </Row>
    <!-- 科研任务下 表单列表 -->
    <div class="tmp-item" v-for="(item,index) in tableData" :key="item.id">
      <div class="item-header">
        <Row type='flex' align="middle">
          <Col span="10">
          <p class="tmp-name">{{item.projectName}}</p>
          </Col>
        </Row>
      </div>
      <Table :columns="columnsMy" :data="item.resultMasterList" border></Table>
    </div>
    <div v-if="pageStatus" style="text-align:center;margin-top:10px;">
      <Page :total="totalSize" @on-change="changePage" :current='currentPage' @on-page-size-change="changePageSize" show-sizer show-total
            show-elevator prev-text="上一页" next-text="下一页"/>
    </div>
    <Modal v-model="uploadPromiseFileModal" :mask-closable="false" :footer-hide="true">
      <p slot="header" style="text-align: center;font-weight: bolder;font-size: 16px;">当前表单:{{currentTemplateResultMaster.templateName}}</p>
      <upload-btn @uploadSuccess="uploadSuccess"></upload-btn>
    </Modal>
  </div>
</template>
<script>
  import {ResearchProjectApi, TemplateApi,TemplateResultApi} from '@/api/index.js';
  import UploadBtn from "../component/upload-btn";

  export default {
    components: {UploadBtn},
    inject: ['reload'],
    data() {
      return {
        uploadPromiseFileModal:false,
        //查询-任务名称
        projectName: "",
        //查询-任务开始时间
        startFillTime: "",
        //查询-任务结束时间
        endFillTime: "",
        //查询-填报状态
        fillStatus: "",
        //查询条件-百分比关系
        doRatio: "",
        //查询条件-完成百分比
        complete: 0,
        //查询条件-是否提交
        ifSub: "",
        //科研任务列表
        columnsMy: [{
            title: '表单名称',
            key: 'pageName',
            minWidth:200
          }, {
            title: '开始日期',
            key: 'startTime',
            width:100
          }, {
            title: '截止时间',
            key: 'endTime',
            width:100
          }, {
            title: '填报时间',
            key: 'createTime',
            width:100
          }, {
            title: '完成百分比',
            key: 'doRatio',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('p', {
                  style: {
                    textAlign: "center"
                  }
                }, params.row.doRatio + '%'),
                h('Progress', {
                  props: {
                    percent: params.row.doRatio,
                    status: "success",
                    "hide-info": true
                  }
                }),
              ])
            }
          }, {
            title: '承诺书',
            key: 'promiseBook',
            width: 170,
            render: (h, params) => {
              let that = this;
              const needPromiseFile = params.row.needPromiseFile;
              const fileStore = params.row.fileStore;
              let Buttons = [];

              let downLoadButton = h("Button", {
                props: {
                  type: 'primary',
                  size: "small",
                  ghost:true
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
                  ghost:true,
                  disabled: params.row.done == 1 ? true : false
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
                  ghost:true
                },
                on: {
                  click: function () {
                    that.downLoadTemplateResultPromiseFile(fileStore);
                  }
                }
              }, '查看')
              let reUploadPromiseFileButton = h("Button", {
                props: {
                  type: 'error',
                  size: 'small',
                  ghost:true,
                  disabled: params.row.done == 1 ? true : false
                },
                on: {
                  click: function () {
                    fileStore.id = undefined
                  }
                }
              }, '重新上传')
              let notNeedButton = h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  ghost:true,
                  disable: true
                },
              }, "无需上传")
              if (needPromiseFile === 1) {
                if (!fileStore || !fileStore.id) {
                  Buttons.push(downLoadButton);
                  Buttons.push(upButton)
                } else {
                  Buttons.push(downloadPromiseFileButton)
                  Buttons.push(reUploadPromiseFileButton)
                }
              } else {
                Buttons.push(notNeedButton)
              }
              return h('div', Buttons)
            }
          }, {
            title: '填报状态',
            key: 'fillStatus',
            width: 90
          }, {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let that = this;
              let Buttons = []
              let checkToMoreWatch = h('Button', {
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
              }, '查看')
              let toFillReport = h('Button', {
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
                    this.toFill(params)
                  }
                }
              }, '填报')
              let commiteSubmit = h('Button', {
                props: {
                  type: params.row.done == 0 ? 'primary' : 'success',
                  size: 'small',
                  ghost:true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toSubmit(params)
                  }
                }
              }, params.row.done == 0 ? '提交' : '已提交')
              if (params.row.done === 0) {
                Buttons.push(checkToMoreWatch);
                Buttons.push(toFillReport)
                Buttons.push(commiteSubmit)
              } else {
                Buttons.push(checkToMoreWatch);
                Buttons.push(commiteSubmit)
              }
              return h('div', Buttons)
            }
          }],
          //科研任务列表数据
          tableData: "",
          //用于修改表单状态
          oldTableData: "",
          // 分页-科研任务总条数
          totalSize: 0,
          //列表分页-当前页 后天从零开始
          currentPage: 1,
          //当前页显示条数
          pageSize: 10,
          //当前需要处理的TemplateResultMaster
          currentTemplateResultMaster:{
            templateName:''
          }
        }
    },
    computed: {
      pageStatus() {
        if (this.totalSize > 10) {
          return true
        } else {
          return false
        }
      }
    },
    mounted() {
      this.getProjectList();
    },
    methods: {
      //上传成功！
      uploadSuccess(fileStore){
        this.currentTemplateResultMaster.fileStore = fileStore ;
        // TemplateResultApi.mergeTemplateResultMaster(this.currentTemplateResultMaster)
        let obj={
          fileStoreId:fileStore.id,
          resultMasterId:this.currentTemplateResultMaster.id,
          fileStorePath: fileStore.url
        }
        TemplateResultApi.mergeTemplateResultMasterPut(obj)
          .then(res=>{
           this.$Message.success({
              content:"承诺书上传成功能！"
            })
            this.currentTemplateResultMaster = {
              templateName:""
            } ;
            this.uploadPromiseFileModal=false
            this.reload();
          })
        },

      //上传承诺书
      uploadPromiseFile(params){
        this.currentTemplateResultMaster = params.row.templateResultMaster
        this.uploadPromiseFileModal=true
      },
      //下载已经上传的承诺书
      downLoadTemplateResultPromiseFile:function(fileStore){
        console.log(fileStore)
        // TemplateApi.downLoadTemplateFile(fileStore.id).then(res => {
        //   let url = window.URL.createObjectURL(new Blob([res.data]))
        //   let link = document.createElement('a')
        //   link.style.display = 'none'
        //   link.href = url
        //   link.setAttribute('download', fileStore.originName)
        //   document.body.appendChild(link)
        //   link.click()
        //   document.body.removeChild(link)
        // })
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
      //按条件查询
      searchByTerm() {
        this.currentPage = 1
        this.getProjectList();
      },
      //查看填报人员
      toGetFillers(params) {
      },
      //查看承诺书
      toDownBook(params) {
        let that = this;
        TemplateApi.downLoadTemplateFile(params.row.template.templateFileStore.id).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', params.row.template.templateFileStore.originName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      //查看填报数据
      toWatchMore(params) {
        this.$router.push({
          path:"/form-fill.html?templateId=" + params.row.id + '&templateResultId=' + params.row.resultMasterId+'&type=notEdit'
        })
        //window.open("/form-fill.html?templateId=" + params.row.id + '&templateResultId=' + params.row.resultMasterId+'&type=notEdit')
      },
      //填报数据
      toFill(params) {
        //判断是否提交
        if (params.row.done == 1) {
          this.$Message.error({
            content: "数据已提交，不可填报",
            duration: 2
          })
          return;
        }
        let arr = ['未开始', '已结束', '暂停']
        //判断填报状态是否允许填报
        if (arr.indexOf(params.row.fillStatus) === -1) {
          this.$router.push({
            path:"/form-fill.html?templateId=" + params.row.id + '&templateResultId=' + params.row.resultMasterId
          })
          // window.open("/form-fill.html?templateId=" + params.row.id + '&templateResultId=' + params.row.resultMasterId)
        } else {
          this.$Message.error({
            content: "此填报状态下不可填报数据",
            duration: 2
          })
          return;
        }
      },
      //提交已填报数据
      toSubmit(params) {
        //done 1  已提交   0未提交
        if(params.row.doRatio < params.row.complete){
          this.$Message.error({
            content:"完成百分比未达设定值:"+params.row.complete+"%",
            duration:3
          })
          return;
        }
        if (params.row.done == 0) {
          //提交
          let _this = this;
          let obj = this.oldTableData.data[params.row.templateIdx].resultMasterList[params.index];
          obj.done = 1
          this.$Modal.confirm({
            title: "提交已保存数据",
            content: "确定要提交已保存数据吗？",
            onOk: function () {
              // console.log(obj)
              TemplateResultApi.commitResultMaster(obj.id).then(res=>{
                if (res.status == 200) {
                  //先修改对应本地数据值
                  _this.tableData[params.row.templateIdx].resultMasterList[params.index].done = '1'
                  _this.$Message.success({
                    content: '提交成功',
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
      //获取科研任务列表
      getProjectList() {
        let obj = {
          //当前页
          page: this.currentPage,
          //每页显示条数
          size: this.pageSize
        };
        if (this.projectName) {
          obj.projectName = this.projectName;
        }
        if (this.startFillTime) {
          obj.startDate = new Date(this.startFillTime).valueOf();
        }
        if (this.endFillTime) {
          obj.endDate = new Date(this.endFillTime).valueOf();
        }
        if (this.fillStatus) {
          obj.fillStatus = this.fillStatus;
        }
        if (this.doRatio) {
          obj.compareType = this.doRatio;
          obj.complete = this.complete;

        }
        if (this.ifSub) {
          obj.done = this.ifSub
        }
        TemplateResultApi.userReportProjectsQuery( obj)
          .then(res => {
            this.totalSize = res.data.counts;
            let obj = JSON.parse(JSON.stringify(res.data))

            for (let i = 0; i < obj.data.length; i++) {
              obj.data[i].resultMasterList = obj.data[i].resultMasterList.map((item, index) => {
                let fillText;
                //根据不同状态  推算出不同显示状态
                switch (item.masterRe.fillStatus) {
                  case 0:
                    fillText = "未开始";
                    break;
                  case 1:
                    fillText = "已结束";
                    break;
                  case 2:
                    fillText = "暂停";
                    break;
                  case 3:
                    fillText = "填报中"
                }
                ;
                return {
                  templateResultMaster:item,
                  template: item.masterRe,
                  templateIdx: i,
                  createTime:item.createTime?item.createTime.slice(0, 10) : '',
                  needPromiseFile: item.masterRe.needPromiseFile,
                  fileStore: item.fileStore,
                  id: item.masterRe.id,
                  resultMasterId: item.id,
                  pageName: item.masterRe.templateName,
                  startTime: item.masterRe.startDate ? item.masterRe.startDate.slice(0, 10) : '',
                  endTime: item.masterRe.endDate ? item.masterRe.endDate.slice(0, 10) : '',
                  doRatio: item.completeRate,
                  complete:item.masterRe.complete,
                  fillStatus: fillText,
                  done: item.done
                }
              })
            }
            this.tableData = obj.data;
            this.oldTableData = res.data;
          }).catch(err => {
            this.$Message.error({
              content: "获取列表数据失败",
              duration: 2
            })
        })
      },
    }
  }

</script>
<style lang="less" scoped>
  .layout {
    padding: 10px 10px;
     min-height: 100%;
    background: #fff;
    border-radius: 4px;

    .tmp-item {
      margin-bottom: 30px;
      border-top: 2px solid #eeeeee;
      border-bottom: 2px solid #eeeeee;
      .item-header {
        margin-bottom: 15px;

        .tmp-name {
          font-size: 20px;
          color: #009966;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tmp-status {
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
      }
    }
  }

</style>
