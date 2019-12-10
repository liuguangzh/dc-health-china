
<template>
  <div class="layout">
    <!--任务填报查询-查看详情-->
    <Row type="flex" align="middle" justify="space-between">
      <Col>
        <Breadcrumb>
          <BreadcrumbItem>任务填报查询</BreadcrumbItem>
          <BreadcrumbItem>{{researchProjectName}}</BreadcrumbItem>
          <BreadcrumbItem>{{pageName}}</BreadcrumbItem>
        </Breadcrumb>
      </Col>
    </Row>
    <!-- 查询条件 -->
    <Row type="flex" align="middle" justify="start" style="margin-top:20px;margin-bottom:20px;" :gutter="20">
      <Col span="6">
        <span>填报人：</span>
        <Input  v-model="resultMasterDetail.fillName" placeholder="请输入填报人姓名" style="width: 80%"></Input>
      </Col>
      <Col span="7">
        <span>完成百分比：</span>
        <Select clearable v-model="operator" style="width:100px;">
            <Option :value="1">大于</Option>
            <Option :value="-1">小于</Option>
            <Option :value="0">等于</Option>
        </Select>
        <InputNumber :max="100" :min="-1" v-model="completeRate" :formatter="value => `${value}%`" 
          :parser="value => value.replace('%', '')" style="width: 100px">
        </InputNumber>
      </Col>
      <Col span="8">
        <span>提交状态：</span>
        <Select clearable v-model="resultMasterDetail.done" style="width:100px;">
            <Option :value="0">未提交</Option>
            <Option :value="1">已提交</Option>
        </Select>
        <Button type="primary" size="small" @click="searchByTerm" style="margin-left:20px;">查询</Button>
        <Button type="primary" size="small" style="margin-left:10px;" @click="$router.go(-1)">返回</Button>
      </Col>
    </Row>
    <!-- 科研任务下 表单列表 -->
    <Table :columns="columnsMy" :data="tmpData" border></Table>
    <div style="text-align:center;margin-top:10px;">
      <Page :page-size='pageSize' :current='pageNo' :total='totalNum' show-total @on-change='changePage'></Page>
    </div>
  </div>
</template>
<script>
  import {TemplateResultApi ,TemplateApi} from "@/api/"
  import { getFormartDate } from '@/libs/tools.js'
  export default {
    data() {
      return {
        //表单所属科研任务名称
        researchProjectName: "",
        //表单名称
        pageName: "",
        completeRate:0,
        operator:'',
        resultMasterDetail: {
          templateId:'',
          fillName:'',
          done:'',
        },
        pageSize: 10,
        pageNo: 1,
        totalNum:10,
        //科研任务列表
        columnsMy: [{
            title: '填报人',
            key: 'fillName',
          },{
            title: '填报时间',
            key: 'fillDate',
            render:(h,params)=>{
              return h('div',getFormartDate(params.row.fillDate,'all'))
            }
          },{
            title: '提交时间',
            key: 'commitTime',
            render:(h,params)=>{
              return h('div',getFormartDate(params.row.commitTime,'all'))
            }
          }, {
            title: '完成百分比',
            key: 'completeRate',
            width:100,
            render: (h, params) => {
              return h('div', [
                h('p', {
                style:{
                    textAlign:"center"
                }
                },params.row.completeRate+'%'),
                h('Progress', {
                  props: {
                    percent:params.row.completeRate,
                    status:"success",
                    "hide-info":true
                  }
                }),
              ])
            }
          }, {
            title: '承诺书',
            key: 'promiseBook',
            width:120,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: "primary",
                    size: "small",
                    ghost:true
                  },
                  style:{
                    display:params.row.fileId === null?'none':'inline-block'
                  },
                  on: {
                    click: () => {
                      this.toDownBook(params)
                    }
                  }
                }, "查看承诺书"),
                 h('Button', {
                  props: {
                    type: "primary",
                    size: "small",
                    ghost:true
                  },
                  style:{
                    display:params.row.fileId === null?'inline-block':'none'
                  },
                }, "无需上传"),
              ])
            }
          }, {
            title: '提交状态',
            key: 'done',
            width:100,
            render:(h,params)=>{
              return h('div',params.row.done === 0?'未提交':'已提交')
            }
          }, {
            title: '操作',
            key: 'action',
            width: 190,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
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
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    ghost:true
                  },
                  style: {
                    marginRight: '5px',
                    display:params.row.done === 0?'none':'inline-block'
                  },
                  on: {
                    click: () => {
                      this.rejectSub(params)
                    }
                  }
                }, '驳回')
              ])
            }
          }
        ],
        //表格数据
        tmpData: [],
      }
    },
    computed:{
      userId(){
        return this.$store.state.user.userId
      }
    },
    methods: {
    //按条件查询
    searchByTerm() {
      this.getTemplateResults()
    },
    //查看承诺书
    async toDownBook(params){
      let fileData = await TemplateApi.downLoadTemplateFile(params.row.fileId)
      const type = "text/plain; charset=UTF-8";
      let filename = params.row.fileOriginName
      let blob = new Blob([fileData.data], { type: type })
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
    //查看填报数据
    toWatchMore(params){
      this.$router.push({
        path:"/form-fill.html?templateId=" + params.row.templateId+ '&templateResultId=' + params.row.resultMasterId+'&type=notEdit'
      })
    },
    //打印已填报数据
    printPage(params){
        window.open('/print-page.html?templateId=' + params.row.templateId + '&masterId=' + params.row.resultMasterId)
    },
    //驳回已提交数据
    rejectSub(params){
      this.$Modal.confirm({
        title:'驳回提交数据',
        content:'您确定要驳回此数据吗？',
        onOk:()=>{
          TemplateResultApi.rejectResultMaster(params.row.resultMasterId).then(res=>{
            if(res.data.code === '1'){
              this.$Message.success('驳回成功')
              this.getTemplateResults()
            }else{
              this.$Message.error('驳回失败')
            }
          }).catch(err=>{
            this.$Message.error(err)
          })
        }
      })
    },
    // 改变分页
    changePage(index){
      this.pageNo = index;
      this.getTemplateResults()
    },
    getTemplateResults(){
      let obj = JSON.parse(JSON.stringify(this.resultMasterDetail))
      obj.pageSize = this.pageSize
      obj.pageNo = this.pageNo
      if(!obj.done){
        obj.done = ''
      }
      if(this.operator){
        obj.operator = this.operator
        obj.rate = this.completeRate
      } else {
        obj.operator = ''
        obj.rate = ''
      }
      TemplateResultApi.getTemplateResults(obj).then(res=>{
        if(res.data.code === '1'){
          if(res.data.data.data){
            this.tmpData = res.data.data.data
            this.totalNum = res.data.data.totalRows
          }
        } else {
          this.$Message.error('填报详情信息获取失败')
        }
      }).catch(err=>{
        this.$Message.error(err)
      })
    }
  },
  mounted(){
    this.researchProjectName=this.$route.query.projectName;
    this.pageName=this.$route.query.templateName;
    this.resultMasterDetail.templateId=this.$route.query.templateId;
    if(this.$route.query.done){
      this.resultMasterDetail.done = this.$route.query.done
    }
    this.getTemplateResults();
  }
}
</script>
<style lang="less" scoped>
  .layout {
    padding: 10px;
     min-height: 100%;
    background: #fff;
    border-radius: 4px;

    .selfSelect {
      position: relative;
      float: left;
      margin-left: 20px;
      height: 32px;
      width: 80px;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      border: 1px solid #dddee1;
      background: #eee;
      cursor: pointer;

      .selfIpt {
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 32px;
        padding-left: 4px;
        padding-right: 20px;
        background: transparent;
        border: none;
      }

      .sanjiao {
        display: block;
        position: absolute;
        top: 12px;
        right: 16px;
        width: 0px;
        height: 0px;
        border-width: 5px 5px 0;
        border-style: solid;
        border-color: #515a6e transparent transparent;
        z-index: 1000;
      }

      .active {
        display: block !important;
      }

      .selfUl {
        display: none;
        position: absolute;
        top: 35px;
        left: 0px;
        width: 100%;
        z-index: 1000;
        border-radius: 4px;
        border: 1px solid #dddee1;
        background: #fff;
        height: 75px;

        li {
          list-style: none;
          height: 30px;
          line-height: 30px;
          padding-left: 5px;
          background: #FFF;
          margin-top: 5px;

          &:hover {
            background: #eee;
          }
        }
      }
    }
  }

</style>
