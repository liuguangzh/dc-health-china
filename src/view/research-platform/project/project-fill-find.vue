
<template>
  <div class="layout">
    <!-- 任务填报查询 -->
      <!-- 查询条件 -->
    <Row type="flex" align="bottom" style="margin-bottom:20px;" :gutter='15'>
      <Col span="6"><span>任务名称：</span><Input style="width:70%;" v-model="projectName" clearable placeholder="查询任务名称"></Input></Col>
      <!-- <Col span="4"><span>开始时间：</span>
        <DatePicker type="date" v-model="startFillTime" :editable="false" placeholder="选择开始日期"></DatePicker>
      </Col>
      <Col span="4"><span>结束时间：</span>
        <DatePicker type="date" v-model="endFillTime" :editable="false" placeholder="选择结束日期"></DatePicker>
      </Col> -->
      <Col span="6">
        <span>任务状态：</span>
        <Select style="width:70%;" v-model="findFillStatus" clearable>
          <Option value="0">未开始</Option>
          <Option value="3">填报中</Option>
          <Option value="2">暂停</Option>
          <Option value="1">已结束</Option>
        </Select>
      </Col>
      <Col span="2"><Button type="primary" size="small" @click="findByTerm">查询</Button></Col>
    </Row>
    <!-- 任务列表 -->
    <div class="tmp-item" v-for="(item,index) in tableData" :key="item.id">
      <div class="item-header">
        <Row type='flex' align="middle">
          <Col span="6">
            <p class="tmp-name"><b>{{item.researchProjectName}}</b></p>
          </Col>
          <Col span="8" push="9">
            <div class="tmp-data-analysis" @click="dataAnalysis(item)">数据分析</div>
            <div 
              class="tmp-data-analysis"
              style="margin-left: 10px;color: #ff9900;border: 1px solid #ff9900; border-radius: 5px;"
              @click="dataReportExhibition(item)"
            >报告生成</div>
            <div v-if="item.statusText === '未开始'" class="tmp-status-not">{{item.statusText}}</div>
            <div v-else-if="item.statusText === '填报中'" class="tmp-status-ing">{{item.statusText}}</div>
            <div v-else-if="item.statusText === '暂停'" class="tmp-status-pause">{{item.statusText}}</div>
            <div v-else-if="item.statusText === '已结束'" class="tmp-status-end">{{item.statusText}}</div>
          </Col>
        </Row>
      </div>
      <Table :columns="columnsMy" :data="item.templateMasters" border></Table>
    </div>
    <!-- 列表分页 -->
    <div style="text-align:center;margin-top:10px;">
      <Page :total="totalSize" :current='currentPage' @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total
        show-elevator prev-text="上一页" next-text="下一页" />
    </div>
    <number-list v-if="watchStatus" @on-close="closeNumberList" :templateId="templateId"></number-list>
  </div>
</template>
<script>
import {ResearchProjectApi} from "@/api/"
import NumberList from '../component/fill-number-list/index.js'
export default {
  data() {
    return {
      //查询-任务名称
      projectName: "",
      //查询-开始时间
      startFillTime: "",
      //查询-结束时间
      endFillTime: "",
      //查询-填报状态
      findFillStatus: "",
      //科研任务列表
      columnsMy: [{
          title: '表单名称',
          width: 300,
          key: 'pageName'
        }, {
          title: '填报数量',
          key: 'fillNumber',
          render:(h,params)=>{
            return h('div',[
              h('strong',{
                style:{
                  fontSize:"20px",
                  color:"#2D8CF0",
                  cursor:"pointer"
                },
                on:{
                  click:()=>{
                    this.toWatchNumber(params,'fill');
                  }
                }
              },params.row.fillNumber)
            ])
          }
        }, {
          title: '提交数量',
          key: 'subNumber',
          render:(h,params)=>{
            return h('div',[
              h('strong',{
                style:{
                  fontSize:"20px",
                  color:"#2D8CF0",
                  cursor:"pointer"
                },
                on:{
                  click:()=>{
                    this.toWatchNumber(params,'sub');
                  }
                }
              },params.row.subNumber)
            ])
          }
        },{
          title: '未提交数量',
          key: 'NoSubNumber',
          render:(h,params)=>{
            return h('div',[
              h('strong',{
                style:{
                  fontSize:"20px",
                  color:"#2D8CF0",
                  cursor:"pointer"
                },
                on:{
                  click:()=>{
                    this.toWatchNumber(params,'noSub');
                  }
                }
              },params.row.NoSubNumber)
            ])
          }
        },{
          title: '填报状态',
          key: 'fillStatus',
        }, {
          title: '填报详情',
          key: 'action',
          width: 200,
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
              }, '查看详情'),
            ])
          }
        }
      ],
      //任务列表数据
      tableData:"",
      // 分页-科研任务总条数
      totalSize: 11,
      //列表分页-当前页 后天从零开始
      currentPage: 1,
      //当前页显示条数
      pageSize: 10,
      //列表状态
      watchStatus:false,
      //列表传值
      templateId:""

    }
  },
  components:{
    NumberList
  },
  mounted(){
    this.getProjectList();
  },
  methods: {
    toWatchNumber(v,t){
      if(t === 'sub'){
        this.templateId = v.row.id;
        // this.watchStatus =true
        this.$router.push({
          path:"/fill-index.html",
          query:{
            done: 1,
            templateId:v.row.id, 
            templateName:v.row.pageName,
            projectName:v.row.projectName
          }
        })
      } else {
        this.templateId = v.row.id;
        // this.watchStatus =true
        this.$router.push({
          path:"/fill-index.html",
          query:{
            templateId:v.row.id, 
            templateName:v.row.pageName,
            projectName:v.row.projectName
          }
        })
      }
    },
    //关闭查看列表
    closeNumberList(){  
      this.watchStatus = false
    },
    //查看详情
    toWatchMore(params) {
      this.$router.push({
        path:"/fill-index.html",
        query:{
          templateId:params.row.id, 
          templateName:params.row.pageName,
          projectName:params.row.projectName
        }
      })
    },
    //按照设置条件查询
    findByTerm(){
      this.currentPage = 1
      this.getProjectList();
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
    dataAnalysis(item){ // 数据分析
      this.$router.push({
        name: "dataAnalysisSub",
        params: {
          researchProjectId: item.id,
          projectFlag: '0'
        }
      })
    },
    dataReportExhibition(item){ // 报告生成
      this.$router.push({
        name: "dataReportExhibition",
        params: {
          projectId: item.id,
          projectFlag: '0'
        }
      })
    },
    //获取任务列表
    getProjectList(){
      //查询条件
      let obj={
        //当前页
        pageNo: this.currentPage,
        //每页显示条数
        pageSize: this.pageSize
        }
      if(this.projectName){
        obj.projectName=this.projectName;
      }
      if(this.startFillTime){
        obj.startDate=new Date(this.startFillTime).valueOf();
      }
      if(this.endFillTime){
        obj.endDate=new Date(this.endFillTime).valueOf();
      }
      if(this.findFillStatus){
        obj.projectStatus=this.findFillStatus;
      }
      ResearchProjectApi.getAllProjects(obj).then(res => {
        let obj = JSON.parse(JSON.stringify(res.data.data))
        for (let i = 0; i < obj.data.length; i++) {
          //根据不同状态 推算出‘科研任务’显示状态
          switch(obj.data[i].projectStatus){
            case 0:
            obj.data[i].statusText="未开始";
            break;
            case 1:
            obj.data[i].statusText="已结束";
            break;
            case 2:
            obj.data[i].statusText="暂停";
            break;
            case 3:
            obj.data[i].statusText="填报中"
          };
          if(obj.data[i].templateMasters){
            obj.data[i].templateMasters = obj.data[i].templateMasters.map((item, index) => {
              let fillStatus;
              //根据不同状态  推算出'表单'显示状态
              switch(item.fillStatus){
                case 0:
                fillStatus="未开始";
                break;
                case 1:
                fillStatus="已结束";
                break;
                case 2:
                fillStatus="暂停";
                break;
                case 3:
                fillStatus="填报中"
              };
              //返回table 表格数据
              return {
                id:item.id,
                projectName:obj.data[i].researchProjectName,
                pageName:item.templateName,
                startTime:item.startDat?item.startDate.slice(0,10):"",
                endTime:item.endDate?item.endDate.slice(0,10):"",
                fillNumber:item.fillNum,
                subNumber:item.commitNum,
                NoSubNumber:item.fillNum - item.commitNum,
                fillStatus:fillStatus
              }
            })
          } else {
            obj.data[i].templateMasters = []
          }
        }
        this.totalSize = obj.totalRows;
        this.tableData = obj.data;
      }).catch(err=>{
        this.$Message.error({
          content:"获取任务列表失败",
          duration:2
        })
      })
    }
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
      margin-bottom: 6px;
      .tmp-name {
        font-size: 16px;
        color: #0aa858;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tmp-data-analysis{
        border-radius: 5px;
        margin-top: 7px;
        font-size: 14px;
        width: 100px;
        float: left;
        border: 1px solid #0aa858;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #0aa858;
        cursor: pointer;
      }
      .tmp-status-not {
        margin-top: 7px;
        width: 100px;
        float: right;
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
        margin-top: 7px;
        width: 100px;
        float: right;
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
        margin-top: 7px;
        width: 100px;
        float: right;
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
        margin-top: 7px;
        width: 100px;
        float: right;
        position: relative;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        background: #CCCECF;
        color: #FFFFFF;
        text-indent: 1em;
        &::after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          border-width: 15px 15px 15px 0px;
          border-style: solid;
          border-color: #CCCECF transparent #CCCECF #CCCECF;
          position: absolute;
          top: 0px;
          right: -15px;
        }
      }
    }
  }
}
</style>
