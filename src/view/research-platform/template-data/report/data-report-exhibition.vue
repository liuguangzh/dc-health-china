<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <div class="layout-analysis">
    <Row style="height: 100%;" type="flex" align="top" :gutter="10">
      <!-- 报告分组列表 -->
      <Col style="height: 100%;" span="6">
        <div>
          <Row>
            <Col :span="12">
              <div
                class="menu-task-type" 
                :class="menuActive === '0' ? 'active' : ''" 
                @click="changeTask('0')"
              >单任务</div>
            </Col>
            <Col :span="12">
              <div
                class="menu-task-type"
                :class="menuActive === '1' ? 'active' : ''"
                @click="changeTask('1')"
              >多任务</div>
            </Col>
          </Row>
        </div>
        <Input
          style="width: 80%"
          placeholder="请输入分组名称"
          v-model="projectName"
          search
          @on-search="searchByTerm"
          @on-enter="searchByTerm"
        ></Input>
        <Button 
          v-show="showSingleTask"
          size="small" 
          style="margin-left: 8px;" 
          type="primary" 
          @click="addReportTerm"
        >新建</Button>
        <!-- <Button v-show="showSingleTask" type="primary" long @click="addReportTerm">添加报告分组</Button> -->
        <div class="menu-box">
          <Menu :accordion="true" style="width:100%;" ref="side_menu" @on-select="itemClick" :open-names="openNames" :active-name="activeName">
            <Submenu :name="index" v-for="(item,index) in reprotList" :key="item.id">
              <template slot="title">
                <span class="sub-item" :title="item.ruleName">{{item.ruleName}}</span>
                <div class="icon-box">
                  <Icon type="md-add" size="20" color="rgb(25, 190, 107)" @click.stop="addReport(item)" title="新建报告"/>
                  <Icon v-show="showSingleTask" type="md-create" size="20" color="rgb(45, 140, 240)" @click.stop="editReportTerm(item)" title="编辑报告分组"/>
                  <Icon v-show="showSingleTask" type="md-trash" size="20" color="rgb(237, 64, 20)" @click.stop="deleteReportTerm(item)" title="删除报告分组"/>
                </div>
              </template>
              <MenuItem :name="JSON.stringify(opt)" v-for="(opt,idx) in item.children" :key="opt.id">
                <span class="menu-item" :title="opt.ruleName">{{opt.ruleName}}</span>
                <div class="icon-box">
                  <Icon type="md-color-wand" size="20" color="rgb(45, 140, 240)" title="编辑" @click.stop="editReport(opt, item)"/>
                  <Icon type="md-trash" size="20" color="rgb(237, 64, 20)" title="删除" @click.stop="deleteReport(opt)"/>
                </div>
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
      </Col>
      <!-- 右侧数据展示区域 -->
      <Col style="height: 100%;" span="18">
          <div class="top-handele-btns">
            <Button type="primary" @click="exportReport">导出报告</Button>
            <Button v-if="editOrSave" type="success" style="margin-left:10px;" @click="saveReportDesc">保存报告描述</Button>
            <Button v-if="!editOrSave" type="primary" style="margin-left:10px;" @click="editOrSave = true">编辑报告描述</Button>
            <Button style="margin-left:10px;" @click="$router.go(-1)">返回上一步</Button>
          </div>
          <div class="right-content">
            <div  v-for="(item,index) in options" :key="index">
              <div v-if="item.hasOwnProperty('series')"> 
                  <v-echart :options="item" :key="index" @on-dblclick="itemDBclick"></v-echart>
                  <P class="echart-desc" style="text-align:center;">图表名称：{{ item.newText }}</P>
                  <P v-if="!editOrSave" class="echart-desc">{{item.desc }}</P>
                  <Input v-else type="textarea" style="padding:0px 40px;width:100%;box-sizing:border-box" placeholder="请填写此图表描述" v-model="item.desc"></Input>
              </div>
              <div v-else>
                  <Table border :columns="item.tableTitles" :data="item.tableData" :key="index"></Table>
                  <p class="echart-desc" style="text-align:center;">图表名称：{{ item.name }}</p>
                  <p v-if="!editOrSave" class="echart-desc">{{ item.desc }}</p>
                  <Input v-else type="textarea" style="padding:0px 40px;width:100%;box-sizing:border-box" placeholder="请填写此图表描述" v-model="item.desc"></Input>
              </div>
            </div>
          </div>
      </Col>
    </Row>
     <!-- 新建报告分组 -->
    <Modal v-model="addModal" :title="reportTitle" @on-visible-change="changeModal">
      <Form ref="modalForm" :model="reportItem" label-position="right" :label-width="100" :rules="ruleValidate">
        <FormItem label="报告分组名称" prop="ruleName">
          <Input v-model="reportItem.ruleName"/>
        </FormItem>
        <FormItem label="报告分组描述" prop="ruleDesc">
          <Input v-model="reportItem.ruleDesc"/>
        </FormItem>
      </Form>
      <!-- 自定义页脚 -->
      <div slot="footer" class="foot-btn">
        <Button type="primary" shape="circle" @click="handleSubmit('modalForm')">保存</Button>
      </div>
    </Modal>
    <!-- 导出数据 -->
    <Modal v-model="exportFlag" title="选取导出报告" width="800">
      <Transfer
        :data="allReports"
        :target-keys="exprotReports"
        :list-style ="listStyle"
        :operations="['取消导出','选取导出']"
        filterable
        @on-change="handleChange">
      </Transfer>
      <div slot="footer">
          <Button @click="cacelExport">取消</Button>
          <Button type="primary" @click="sureExport">确定</Button>
      </div> 
    </Modal>
    <!-- 查看源数据 -->
    <Modal v-model="targetStatus" title="图表源数据" fullscreen>
      <Table border :columns="tableHeader" :data="tableBody" max-height='700'></Table>
      <div slot="footer">
          <Button @click="targetStatus = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { DataAnalysisApi } from "@/api/"
import VEchart from "../component/echarts/index.js"
import chartOptions from "../component/echarts/options.js"
import { mapGetters, mapMutations } from 'vuex';
  export default {
    data() {
       // 检测名称是否过长
      const valiRuleName = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("报表名称不能为空！"));
        } else if (value.length > 20) {
          callback(new Error("名称不能超过20个字！"));
        } else {
          callback();
        }
      };
      return {
        showSingleTask: false, // 单任务多任务添加报告分组显示
        reprotList:[],
        addModal:false,// 添加报告分组弹窗
        reportTitle:"添加报告分组",
        handleType:"add",
        reportItem: {// 新增报告分组数据结构
          id: "",
          ruleName: "",
          ruleDesc: "",
          content: "",
          parentId: "",
          template:"",
          createDate:"",
          modifyDate:"",
          createBy:"",
          modifyBy:"",
          status:""
        },
        ruleValidate: {// 验证条件
          ruleName: [{
            required: true,
            validator: valiRuleName,
            trigger: "blur"
          }]
        },
        exportFlag:false,// 导出报告弹窗状态值
        listStyle:{width:'300px',minHeight:'350px'},
        allReports:[],//所有报告
        exprotReports:[],// 需要导出报告
        options:[],// 报告图表配置信息
        editOrSave:false,//编辑或者保存状态值
        checkedReport:"",//当前选中编辑的报告
        openNames : [0],//默认打开的
        idx:0,//menu 默认选中第一个
        activeName:"",
        tableHeader:[],//源数据表头
        tableBody:[],//源数据
        targetStatus:false,//源数据状态值
        menuActive: '0',// 单任务  多任务  样式切换
        // projectFlag: '0', // 单任务多任务
        projectId: '', // 单任务列表ID
        projectName: ''
      }
    },
    computed: {},
    methods: {
      ...mapMutations([
        'setShowProjectFlag'
      ]),
      getAllReport() { // 获取所有报表分组及下属报表  
        let obj = {}
        if (this.showProjectFlag === '0') {
          obj.projectFlag = '0'
          obj.projectId = this.projectId
        } else {
          obj.projectFlag = '1'
        }
        if(this.projectName !== ''){
          obj.projectName =this.projectName
        }
        DataAnalysisApi.getAllReport(obj).then(res => {
          this.allReports = []
          this.reprotList = JSON.parse(JSON.stringify(res.data.data));
          if (this.reprotList.length > 0) { //对无数据情况进行过滤
            if (this.reprotList[this.openNames[0]].reportRuleVoList != null) {
              this.activeName = JSON.stringify(this.reprotList[this.openNames[0]].reportRuleVoList[this.idx])
              this.itemClick(this.activeName)
            }
            res.data.data.forEach(item => { // 取出所有导出报告列表
              if (item.reportRuleVoList) {
                this.allReports.push(...item.reportRuleVoList)
              }
            })
            this.allReports.forEach(item => {
              item.label = item.ruleName
              item.key = item.id
            })
          }
        }).catch(err => {
          this.$Message.error({
            content: "获取列表失败",
            duration: 3
          })
        })
      },
      searchByTerm(){
        this.getAllReport()
      },
      changeModal(flag){ // 弹窗关闭-初始化值·
        if(!flag){
          this.reportItem = {
            id: "",
            ruleName: "",
            ruleDesc: "",
            content: "",
            parentId: "",
            template:"",
            createDate:"",
            modifyDate:"",
            createBy:"",
            modifyBy:"",
            status:""
          }
        }
      },
      //单任务与多任务切换  0单任务  1为多任务
      changeTask(m){
        if(m === this.menuActive){return false}
        this.menuActive = m
        this.projectName = ''
        this.setShowProjectFlag(m)
        m === '0'?this.showSingleTask =false:this.showSingleTask = true
        this.getAllReport()
      },
      addReportTerm(){ // 新建报告分组
        this.reportTitle = "添加报告分组"
        this.handleType = "add";
        this.addModal = true;
      },
      handleSubmit(name){ // 编辑/添加报表分组弹窗
         this.$refs[name].validate(valid => {
          if (valid) {
            // 调用保存
            this.handleReport(this.reportItem);
            this.addModal = false;
          } else {
            this.loading = false;
          }
        });
      },
      handleReport(obj,index,leve = 0) { // 报表分组 - 保存-编辑-删除
        DataAnalysisApi.saveReport(obj).then(res => {
          this.getAllReport();
          this.$Message.success("操作成功");
        }).catch(err => {
          this.$Message.error(err.data);
        });
      },
      deleteReportTerm(item){ // 删除报告分组
        item.children = item.children === null? []:item.children
        if(item.children.length){
          this.$Message.error({
            content:"请先删除分组中报告",
            duration:4
          })
        }else{
          this.handleType = "delete"
          this.$Modal.confirm({
            title:"删除报告分组",
            content:"确定要删除此报告分组吗？",
            onOk:()=>{
              item.status = "-1"
              this.deleteReportGroup(item)
            }
          })
        }
      },
      editReportTerm(list){ // 编辑报告分组
        this.reportTitle = "编辑报告分组"
        this.handleType = "edit"
        this.addModal = true;
        this.reportItem = list
      },
      addReport(item){ // 新建报告
        if(this.showProjectFlag === '0'){
          this.$router.push({
            path: "/edit-report.html",
            query:{
              type: "add",
              parentId: item.id,
              researchProject: item.researchProject,
              projectFlag: this.showProjectFlag
            }
          })
        } else {
          this.$router.push({
            path: "/edit-report.html",
            query:{
              type: "add",
              parentId: item.id,
              projectFlag: this.showProjectFlag
            }
          })
        }
      },
      deleteReport(item){ // 删除报告
        this.handleType = "delete"
        this.$Modal.confirm({
          title:"删除报告分组",
          content:"确定要删除此报告分组吗？",
          onOk:()=>{
            item.status = "-1"
            this.deleteReportGroup(item)
          }
        })
      },
      // 删除接口
      deleteReportGroup(item){
        DataAnalysisApi.deleteReportGroup(item.id).then(res => {
          if(res.data.code === '1'){
            this.getAllReport();
            this.$Message.success("删除报告分组成功");
          } else {
            this.$Message.error("删除报告分组失败");
          }
        })
      },
      editReport(opt, item){ // 编辑报告
        if(this.showProjectFlag === '0'){
          let content = JSON.stringify(opt)
          localStorage.setItem("twoEchartsVsValue", content)
          this.$router.push({
            path:"/edit-report.html",
            query:{
              type:"edit",
              researchProject: item.researchProject,
              projectFlag: this.showProjectFlag
            }
          })
        } else {
          let content = JSON.stringify(opt)
          localStorage.setItem("twoEchartsVsValue", content)
          this.$router.push({
            path:"/edit-report.html",
            query:{
              type:"edit",
              projectFlag: this.showProjectFlag
            }
          })
        }
      },
      itemClick(opt){ // 点击每个报告,获取报告数据,并生成图表数据结构
        this.checkedReport = opt;
        let obj = JSON.parse(JSON.parse(opt).content)
        // 去除占位符
        let postArr = []
        obj.forEach(item=>{
          if(item.name !== "占位符"){
            postArr.push(item)
          }
        })
        DataAnalysisApi.getReportData(postArr).then(res=>{
          //清空图表数据数组
          this.options = [];
          let newRes = JSON.parse(JSON.stringify(res.data.data))
          for (let i = 0; i < newRes.length; i++) {
            if (newRes[i].chart == "line" || newRes[i].chart == "bar") {
              //折线图
              let option = JSON.parse(JSON.stringify(chartOptions.barOptions));
              option.dataTableId = newRes[i].config.dataTableId
              option.xaxis = newRes[i].config.xaxis
              option.index = i
              option.desc = newRes[i].config.desc; //图表描述
              if (newRes[i].reportResult != null) {
                let xData = newRes[i].reportResult.result.map(item => {
                  return item.unit;
                });
                let seriesData = newRes[i].reportResult.result.map(item => {
                  return item.funds;
                });
                option.xAxis.data = xData;
                option.series[0].data = seriesData;
                // 判断显示数据条数
                if (seriesData.length <= 30) {
                  option.dataZoom[0].end = 100
                } else if (200 <= seriesData.length) {
                  option.dataZoom[0].end = 10
                } else {
                  option.dataZoom[0].end = 40
                }
              }
              if(newRes[i].config.tableColumns !== null){
                if (newRes[i].config.tableColumns[0]) {
                  option.xAxis.name = newRes[i].config.tableColumns[0].columnName
                }
                if (newRes[i].config.tableColumns[1]) {
                  option.yAxis.name = newRes[i].config.tableColumns[1].columnName;
                }
              }
              // option.title.text = newRes[i].config.title;
              option.newText = newRes[i].config.title;
              option.series[0].type = newRes[i].chart;
              option.xAxis.axisLabel.formatter = function (value) {
                let result = ""; //最后拼接好的名称
                let maxNum = 8; //每行显示数量
                let valueNum = value.length; //名称的字符串长度
                let rowNum = Math.ceil(valueNum / maxNum); //需要显示的行数，向上取整
                if (rowNum > 1) {
                  for (let i = 0; i < rowNum; i++) {
                    let tempStr = '';
                    let start = i * maxNum;
                    let end = start + maxNum;
                    //最后一行特殊处理
                    if (i == rowNum - 1) {
                      tempStr = value.substring(start, valueNum);
                    } else {
                      tempStr = value.substring(start, end) + '\n';
                    }
                    result += tempStr;
                  }
                  return result;
                } else {
                  return value
                }
              }
              this.options.push(option);
              //相关配置配置完成，图表显示
              this.chartState = true;
            }  else if (newRes[i].chart == "pie") {
              //饼状图
              let option = JSON.parse(JSON.stringify(chartOptions.pieOptions));
              option.dataTableId = newRes[i].config.dataTableId
              option.index = i
              option.desc = newRes[i].config.desc; //图表描述
              option.xaxis = newRes[i].config.xaxis
              if (newRes[i].reportResult) {
                let legendData = newRes[i].reportResult.result.map(item => {
                  return item.unit;
                });
                let seriesData = newRes[i].reportResult.result.map(item => {
                  return {
                    name: item.unit,
                    value: item.funds
                  };
                });
                option.legend.data = legendData;
                option.series[0].data = seriesData;
              }
              if(newRes[i].config.tableColumns !== null){
                if (newRes[i].config.tableColumns[0]) {
                  option.series[0].name = newRes[i].config.tableColumns[0].columnName;
                }
              }
              // option.title.text = newRes[i].config.title;
              option.newText = newRes[i].config.title;
              this.options.push(option);
              //相关配置配置完成，图表显示
              this.chartState = true;
            } else if (newRes[i].chart == "table") {
              //表格
              let option = {
                tableTitles: "",
                tableData: "",
                name: newRes[i].config.title,
                desc:newRes[i].config.desc
              }
              option.tableTitles = newRes[i].config.tableColumns.map((item, index) => {
                return {
                  title: item.columnName,
                  key: index
                };
              });
              if (newRes[i].reportResult) {
                option.tableData = newRes[i].reportResult.result.map(item => {
                  return Object.assign({}, item)
                });
              } else {
                option.tableData = [];
              }
              this.options.push(option)
            }
          }
        }).catch(err=>{
          this.$Message.error({
            content:"请刷新重试",
            duration:4
          })
        })
      },
      async getCustomTmpAllFileldsById(id){ // 获取自定义数据表下属字段
        DataAnalysisApi.getDataTableById(id).then(res=>{
          this.tableHeader = []
          if(res.data.code === '1'){
            JSON.parse(res.data.data.columnsInMongo).forEach(item=>{
              this.tableHeader.push({
                title:item.columnName,
                key:item.id,
                minWidth:100
              })
            })
          } else {
            this.$Message.error({
              content:"获取数据表下属字段失败",
              duration:3
            })
          }
        }).catch(err=>{
          this.$Message.error({
            content:err,
            duration:3
          })
        })
      },
      async getCustomTmpAllDatasById(obj){// 获取自定义数据表数据
        DataAnalysisApi.getTableDatas(obj).then(res=>{
          if(res.data.code === '1'){
            this.tableBody = res.data.data[0].data
          }
        }).catch(err=>{
          console.log(err.response)
        })
      },
      async itemDBclick(options){// 图表双击查看源数据
        let obj = { id: options.dataTableId}
        await this.getCustomTmpAllFileldsById(options.dataTableId)
        await this.getCustomTmpAllDatasById(obj)
        this.targetStatus = true
      },
      exportReport(){//导出报告
        this.exportFlag = true;
      },
      handleChange(targetKeys){//当穿梭框选值发生该表
        this.exprotReports = targetKeys
      },
      cacelExport(){//取消导出报告
        this.exprotReports = []
        this.exportFlag = false
      },
      sureExport(){ // 确定导出报告
        let list =[];
        if(this.exprotReports.length){
           this.exprotReports.forEach(item => {
             this.allReports.forEach(opt => {
               if (item === opt.key) {
                 list.push(opt)
               }
             })
           })
           this.exprotReports = []
           this.exportFlag = false
           this.$router.push({
             name: 'exportReport',
             params: {
               reportList: list
             }
           })
        }else{
          this.$Message.error({
            content:"请选择需要导出的报告",
            duration:3
          })
        }
       
      },
      saveReportDesc(){// 保存报告描述编辑
        let configs = JSON.parse(JSON.parse(this.checkedReport).content), newConfigs=[];
        configs.forEach(item=>{
          if(item.name !== '占位符'){
            newConfigs.push(item)
          }
        })
        this.options.forEach((item,index)=>{
          newConfigs[index].config.desc = item.desc
        })  
        let postObj = JSON.parse(this.checkedReport) 
        postObj.content = JSON.stringify(newConfigs)
        DataAnalysisApi.saveReport(postObj).then(res=>{
          this.editOrSave = false
          this.getAllReport()
        }).catch(err=>{
          console.log(err.response)
        })
      },
      returnDataAnalysis(){ // 返回数据分析
        this.$router.push({
          name: "dataAnalysisSub",
        })
      },
    },
    mounted(){
      if(this.$route.params.projectFlag){
        this.menuActive = '0'
      } else {
        if(this.showProjectFlag === '0'){
          this.menuActive = '0'
        } else {
          this.showSingleTask = true
          this.menuActive = '1'
        }
      }
      this.projectId = this.$route.params.projectId
      this.getAllReport();
    },
    computed: {
      ...mapGetters([
        'showProjectFlag'
      ])
    },
    components:{VEchart}
  }

</script>
<style lang="less">
  .textOver {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .layout-analysis {
    padding: 10px;
    height: 100%;
    background: #fff;
    border-radius: 4px;

    .menu-task-type{
      background: #fff;
      color: #2D8CF0;
      text-align: center;
      height: 36px;
      line-height: 36px;
      font-size: 16px;
      margin-bottom: 20px;
      border: 1px solid #2D8CF0;
      cursor: pointer;
    }
    .active{
      background: #2D8CF0;
      color: #fff;
    }

    .menu-box {
      max-height: 86%;
      overflow: auto;
      .sub-item {
        display: inline-block;
        width: 45%;
        .textOver;
      }
       .icon-box{
          float: right;
          margin-right: 24px;
        }
      .menu-item {
        display: inline-block;
        width: 65%;
        .textOver;
      }
    }
    .top-handele-btns{
      margin-bottom: 10px;
      text-align: right;
    }
    .right-content{
      // min-height:500px;
      height: 90%;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid #cccccc;
      border-radius: 4px;
      .echart-desc{
        margin: 0 40px 20px 40px;
        font-size: 16px;
      }
    }
  }

</style>
