<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <div class="edit-report">
    <div class="header" v-show="isEdit">
      <h4>自定义报表设计器</h4>
      <div class="btn-group">
        <Button size="small" type="info" @click="toPreview">预览</Button>
        <Button size="small" type="success" @click="saveReport">保存</Button>
        <Button size="small" @click="returnEditReport" type="primary">返回</Button>
      </div>
    </div>
    <Row class="main-wrap" type="flex" align="top" justify="space-between" v-show="isEdit">
      <Col span="5" style="height:100%;">
      <div class="left">
        <Tabs value="name2">
          <TabPane label="控件列表" name="name2">
            <Row class="list" :gutter="18">
              <draggable element="div" v-model="echartList"  :options="dragOptions" @start="startFn" @end="endFn" :clone="cloneFn">
                <transition-group type="transition" :name="'flip-list'">
                  <Col v-for="item in echartList" :xs="24" :sm="24" :md="24" :lg="24" :key="item.name">
                  <div class="list-item clear">
                    <span class="title">{{item.name}}</span>
                    <span class="icon">
                      <Icon :type="item.icon" size="18"></Icon>
                    </span>
                  </div>
                  </Col>
                </transition-group>
              </draggable>
            </Row>
          </TabPane>
        </Tabs>
      </div>
      </Col>
      <Col span="12" style="background-color: #d7e8ed;height:100%;">
      <Row class="form-content">
        <p v-if="tableList.length<=1" style="text-align:center">说明：请从左侧拖动到中间来创建一个视图组件</p>
        <draggable element="div" v-model="tableList" :options="dragOptions" :clone="cloneFn" @end="endFn">
          <transition-group type="transition" :name="'flip-list'">
            <div @click="clickItem(item,index)" v-for="(item,index) in tableList" :key="item.name + index"
              class="table-item-con" :class="item.active&&item.name != '占位符' ? 'active':''" v-if="item.name">
              <span class="del-icon" @click="toDelTab(index)" v-show="item.active && item.name!='占位符'">
                <Icon type="md-close" color="#e00" size="30"></Icon>
              </span>
              <div class="table-list-item clear" v-if="item.name=='占位符' " style="height:1px!important">
              </div>
              <div class="table-list-item clear" v-if="item.name=='柱状图'">
                <img :src="barIcon" width="90%" alt="">
              </div>
              <div class="table-list-item clear" v-if="item.name=='折线图'">
                <img :src="lineIcon" width="90%" alt="">
              </div>
              <div class="table-list-item clear" v-if="item.name=='饼状图'">
                <img :src="pieIcon" width="90%" alt="">
              </div>
              <div class="table-list-item clear" v-if="item.name=='表格'">
                <img :src="tableIcon" width="90%" alt="">
              </div>
            </div>
          </transition-group>
        </draggable>
      </Row>
      </Col>
      <Col span="7" style="padding: 5px 10px 5px 10px;overflow:auto;height:100%;">
      <Tabs value="name1">
        <TabPane label="报告设置" name="name1" style="padding-bottom:100px;">
          <div class="no-data-info" v-show="!tempTab">
            请点击中间选择控件,然后可以进行控件设置！
          </div>
          <Form ref="formValidate" :model="reportItem" :rules="ruleValidate" label-position="top">
            <FormItem label="报告标题" prop="ruleName">
              <Input v-model="reportItem.ruleName"></Input>
            </FormItem>
            <FormItem label="报告描述" prop="ruleDesc">
              <Input v-model="reportItem.ruleDesc" type="textarea"></Input>
            </FormItem>
          </Form>
          <Form ref="tableConfigVail" v-if="tableList[checkTabIndex] && tempTab" :model="tableList[checkTabIndex]"
            label-position="top">
            <FormItem label="图表标题" prop="config.title" :rules="{required: true, message:'请填写图表标题', trigger: 'blur'}">
              <Input v-model="tableList[checkTabIndex].config.title"></Input>
            </FormItem>
            <FormItem label="图表描述" prop="config.desc">
              <Input v-model="tableList[checkTabIndex].config.desc"></Input>
            </FormItem>
            <FormItem label="选择数据报表" prop="config.dataTableId" :rules="{required: true, message:'请选择数据报表', trigger: 'change'}">
              <Select filterable v-model="tableList[checkTabIndex].config.dataTableId" @on-change="selectitem">
                <Option v-for="item in chartForm" :value="item.id" :key="item.id">{{ item.dataTableName }}</Option>
              </Select>
            </FormItem>
            <div v-if="tableList[checkTabIndex].chart == 'table'">
              <div v-for="(list,index) in tableList[checkTabIndex].config.tableColumns" class="tableCheck">
                <Row type="flex" :align="'middle'">
                  <Col :span="16">
                    <FormItem label="表头字段选择" :prop="'config.tableColumns.'+index+'.columnId'"
                      :rules="{required: true, message:'请选择表头字段',trigger: 'change'}">
                      <Select v-model="list.columnId">
                        <Option value="$$" key="$$">空字段</Option>
                        <Option v-for="item in tableTitles" :value="item.id" :key="item.id">{{ item.columnName }}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col :span="4">
                    <RadioGroup v-model="list.computedOrNot">
                      <Radio label="0">普通列</Radio>
                      <Radio label="1">计算列</Radio>
                    </RadioGroup>
                  </Col>
                  <Col :span="4">
                    <Button  shape="circle" icon="md-remove" @click="minusTabletitle(index)"></Button>
                    <Button  shape="circle" icon="md-add" @click="plusTabletitle"></Button>
                  </Col>
                </Row>
                <FormItem label="自定义名称">
                  <Input v-model="list.columnName" placeholder="请输入表头字段名称"></Input>
                </FormItem>
              </div>
            </div>
            <FormItem :label="xlabel" v-if="tableList[checkTabIndex].chart != 'table'" prop="config.xaxis"
              :rules="{required: true, message:'请选择字段', trigger: 'change'}">
              <Select v-model="tableList[checkTabIndex].config.xaxis">
                <Option v-for="item in tableTitles" :value="item.id" :key="item.id">{{ item.columnName }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="ylabel" v-if="tableList[checkTabIndex].chart != 'table'">
              <Select v-model="tableList[checkTabIndex].config.yaxis" @on-change="valYdata">
                <Option value="">不选择</Option>
                <Option v-for="item in tableTitles" :value="item.id" :key="item.id">{{ item.columnName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="统计方式" v-if="dragEnd" prop="config.ifDuplicate"
              :rules="{required: true, message:'请选择统计方式', trigger: 'change'}">
              <Select style="width:200px" v-model="tableList[checkTabIndex].config.ifDuplicate">
                <Option value="2">不统计</Option>
                <Option value="1">计数（去重）</Option>
                <Option value="0">计数（不去重）</Option>
              </Select>
            </FormItem>
            <FormItem label="计算方式" v-if="dragEnd">
              <Select style="width:200px" v-model="tableList[checkTabIndex].config.type">
                <Option value="-1">不计算</Option>
                <Option value="1">求和</Option>
                <Option value="2">平均</Option>
              </Select>
            </FormItem>
            <FormItem label="排序" v-if="dragEnd">
              <Select style="width:200px" v-model="tableList[checkTabIndex].config.sortType">
                <Option value="-1">不排序</Option>
                <Option value="1">X轴 大 -> 小</Option>
                <Option value="0">X轴 小 -> 大</Option>
              </Select>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
      </Col>
    </Row>
    <!-- 提示删除  开始-->
    <Modal v-model="delModal" title="您确定删除吗" @on-ok="delTab">
      您确定要删除吗？
    </Modal>
    <!-- 提示删除  结束-->
    <yu-lan :options="options" v-if="targetStatus" @now-close="targetStatus = false"></yu-lan>
  </div>
</template>
<script>
  //引入示例图表
  import lineIcon from "@/assets/images/report/line.png"
  import barIcon  from "@/assets/images/report/bar.png"
  import pieIcon  from "@/assets/images/report/pie.png"
  import tableIcon from "@/assets/images/report/table.png"
  

  import draggable from "vuedraggable";
  import YuLan from '../component/yulan.vue'
  import chartOptions from "../component/echarts/options.js"
  import {DataAnalysisApi} from "@/api/index.js";
  const ECHART_LIST = [{
      name: "柱状图",
      icon: "md-podium",
      active: null,
      chart: "bar",
      config: {
        dataTableId: "", //选中数据表名称
        title: "", //图表名称
        xaxis: "", //x轴数据
        yaxis: "", //y轴数据
        type: "", //统计类型
        ifDuplicate: "", //是否去重
        sortType: "", //排序
        tableColumns: [{ //表格字段容器
          columnId: "",
          columnName: "",
        }]
      }
    },
    {
      name: "折线图",
      icon: "md-trending-up",
      active: null,
      chart: "line",
      config: {
        dataTableId: "", //选中数据表名称
        title: "", //图表名称
        xaxis: "", //x轴数据
        yaxis: "", //y轴数据
        type: "", //统计类型
        ifDuplicate: "", //是否去重
        sortType: "", //排序
        tableColumns: [{ //表格字段容器
          columnId: "",
          columnName: "",
        }]
      }
    },
    {
      name: "饼状图",
      icon: "md-pie",
      active: null,
      chart: "pie",
      config: {
        dataTableId: "", //选中数据表名称
        title: "", //图表名称
        xaxis: "", //x轴数据
        yaxis: "", //y轴数据
        type: "", //统计类型
        ifDuplicate: "", //是否去重
        sortType: "", //排序
        tableColumns: [{ //表格字段容器
          columnId: "",
          columnName: "",
        }]
      }
    },
    {
      name: "表格",
      icon: "ios-paper",
      active: null,
      chart: "table",
      config: {
        dataTableId:"", //选中数据表名称
        title: "", //图表名称
        xaxis: "", //x轴数据
        yaxis: "", //y轴数据
        type: "", //统计类型
        ifDuplicate: "", //是否去重
        sortType: "", //排序
        tableColumns: [{ //表格字段容器
          columnId: "",
          columnName: "",
          computedOrNot:'0'
        }]
      }
    }
  ];
  // 生成tree数组，data:数组，pid：根节点
  function fn(data, pid) {
    var result = [],
      temp;
    for (var i in data) {
      if (data[i].parentId == pid) {
        result.push(data[i]);
        temp = fn(data, data[i].id);
        if (temp && temp.length > 0) {
          data[i].children = temp;
        }
      }
    }
    return result;
  }
  export default {
    name: "editReport",
    data() {
      return {
        //中间列表图表
        lineIcon,
        barIcon,
        pieIcon,
        tableIcon,

        theme2: "light",
        chartForm: [], //数据报表列表
        echartList: ECHART_LIST,
        delModal: false, //删除tabl的模态框的显示
        tableList: [{
          name: "占位符",
          icon: "social-markdown"
        }],
        reportItem: {
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
            status:"1"
        }, //获取的当前的这个reportItem
        ruleValidate: {
          ruleName: [{
            required: true,
            message: '请填写报告标题',
            trigger: 'blur'
          }],
        },
        tableTitles: [], //x轴数据
        tableId: null,
        dragEnd: true,
        isEdit: true, //是否是预览
        xlabel:"X轴",
        ylabel:"Y轴",
        tempTab: null, //当前刚刚创建的tab
        checkTabIndex: null, //当前选中的表格
        dragOptions: {
          animation: 0,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        },
        options:[],//预览
        targetStatus:false,
        projectId: '',
        projectFlag: '',
        researchProject: {}
      };
    },
    methods: {
      //减少表头字段选择
      minusTabletitle(index) {
        if (this.tableList[this.checkTabIndex].config.tableColumns.length <= 1) {
          this.$Message.error("最少为一个");
          return;
        }
        this.tableList[this.checkTabIndex].config.tableColumns.splice(index, 1);
      },
      //增加表头字段选择
      plusTabletitle() {
        let obj = {
          columnId: "",
          columnName: "",
          computedOrNot:"0"
        }
        this.tableList[this.checkTabIndex].config.tableColumns.push(obj);
      },
      //获取数据报表
      getAllTables() {
        let obj = {
          projectFlag: this.projectFlag
        }
        if(this.projectId){
          obj.projectId = this.projectId
        }
        DataAnalysisApi.getAllTables(obj).then(res => {
          if (res.data.code !== '1') {
            this.$Message.error("请先添加数据分析表");
          } else {
            let data = JSON.parse(JSON.stringify(res.data.data))
            let newData = []
            data.forEach(item=>{
              if(item.dataTables.length){
                newData.push(...item.dataTables)
              }
            })
            this.chartForm = newData;
          }
        });
      },
      //获取选中报表下属字段
      getTableData(id) {
        if(id){
          for(let i = 0;i < this.chartForm.length ; i++){
            if(this.chartForm[i].id === id){
              this.tableTitles = JSON.parse(this.chartForm[i].columnsInMongo)
            }
          }
        }
      },
      //报表选择-改变
      selectitem(value) {
        this.tableId = value;
        this.getTableData(value)
      },
      //验证Y轴字段为数字
      valYdata() {
        let obj = M.clone(this.tableList[this.checkTabIndex].config);
        if(obj.hasOwnProperty('yaxis') && obj.yaxis){
          DataAnalysisApi.validateY(obj).then(res => {
            if (res.data == "所选y轴字段非数字类型，无法进行统计") {
              this.$Message.error({
                content: "所选y轴字段非数字类型，无法进行统计",
                duration: 10,
                closable: true
              });
              this.tableList[this.checkTabIndex].config.yaxis = "";
            }
          })
        }
      },
      //保存二级列表
      saveReport() {
        let obj =JSON.parse(JSON.stringify(this.reportItem))
        let configs = JSON.parse(JSON.stringify(this.tableList))
        //将配置信息放入content中
        obj.content = JSON.stringify(configs)  

        if(this.$route.query.type == "add"){
          obj.parentId = this.$route.query.parentId
        }
        // 单任务/多任务 
        if(this.projectFlag){
          obj.projectFlag = this.projectFlag
        }
        if(this.researchProject){
          obj.researchProject = this.researchProject.id
        }
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            //当前表单验证
            if(this.$refs.tableConfigVail){
              this.$refs.tableConfigVail.validate((valid) => {
                if(valid) {
                  //删除占位符
                  // this.tableList.pop();
                  //多表单验证
                  for(let i=0;i<configs.length-1;i++){
                    let opt = configs[i];
                    //不是表格情况
                    if(opt.chart != "table"){
                      if(opt.config.title == "" || opt.config.dataTableId =="" || opt.config.xaxis == "" || opt.config.ifDuplicate ==""){
                        this.$Message.error('请完整填写必填项3');
                        return;
                        break;
                      }
                    }else{//为表格的情况
                      if(opt.config.title == "" || opt.config.dataTableId ==""){
                          this.$Message.error('请完整填写必填项4');
                          return;
                          break;
                      };
                      for(let j=0;j<opt.config.tableColumns.length;j++){
                        let opt1=opt.config.tableColumns[j]
                        if(opt1.title == "" ){
                            this.$Message.error('请完整填写必填项5');
                            return;
                            break;
                        }
                      }
                    }
                  }
                  DataAnalysisApi.saveReport(obj).then(res => {
                    this.reportItem.id = res.data.data.id
                    this.$Message.success("保存成功！");
                  }).catch(err => {
                    this.$Message.error({
                      content: '保存失败',
                      duration: 10,
                      closable: true
                    });
                  });
                } else {
                  this.$Message.error('请完整填写必填项2');
                }
              })
            } else {
              this.$Message.error('请选择展示图!');
            }
          } else {
            this.$Message.error('请完整填写必填项!1');
          }
        })
      },
      returnEditReport(){
        this.$router.back()
      },
      // 准备删除一个表格
      toDelTab(index) {
        this.checkTabIndex = index;
        this.delModal = true;
      },
      // 删除一个表格
      delTab() {
        this.tempTab = null;
        this.tableList.splice(this.checkTabIndex, 1);
      },
      // 点击选中一个表格
      clickItem(item, index) {
        //获取下来数据表
        if(item.config.dataTableId){
          this.tableId = item.config.dataTableId;
        }
        this.getTableData(this.tableId);
        //判断XY轴显示名称
        if(item.chart == "pie"){
          this.xlabel = "分组域";
          this.ylabel = "计算域";
        }else{
          this.xlabel="X轴";
          this.ylabel="Y轴";
        }
        this.checkTabIndex = index;
        this.tempTab = item;
        this.tableList = this.tableList.map(tab => {
          tab.active = false;
          return tab;
        });
        item.active = true;
      },
      cloneFn(a) {
        let obj = M.clone(a);
        this.tempTab = obj;
        return obj;
      },
      startFn(event) {
        this.dragEnd = false;
      },
      endFn(a, b) {
        this.dragEnd = true;
        if (this.checkTabIndex == null) {
          this.checkTabIndex = 0;
        }
        this.echartList = ECHART_LIST;
      },
      // 设置完预览
      toPreview(){
        let postObj = JSON.parse(JSON.stringify(this.tableList))
        let postArr = []
        postObj.forEach(item=>{
          if(item.name !== "占位符"){
            postArr.push(item)
          }
        })
        DataAnalysisApi.getReportData(postArr).then(res=>{
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
          this.targetStatus = true
        }).catch(err=>{
        })
      }
    },
    mounted() {
      // 获取‘选择数据报表’选项-所有自定义数据表
      if(this.$route.query.researchProject){
        this.projectId = this.$route.query.researchProject.id
        this.researchProject = this.$route.query.researchProject
      }
      this.projectFlag = this.$route.query.projectFlag
      this.getAllTables();
      
      if (this.$route.query.type === "edit") {
        let twoEchartsVsValue = JSON.parse(localStorage.getItem("twoEchartsVsValue"));
        this.checkTabIndex = 0;
        this.tableList = JSON.parse(twoEchartsVsValue.content);
        this.reportItem.ruleName = twoEchartsVsValue.ruleName;
        this.reportItem.ruleDesc = twoEchartsVsValue.ruleDesc;
        this.reportItem.id = twoEchartsVsValue.id;
        this.reportItem.parentId = twoEchartsVsValue.parentId;
        this.tableId = this.tableList[this.checkTabIndex].config.dataTableId;
        this.getTableData(this.tableId)
      }
    },
    components: {draggable,YuLan},
    directives: {
      getPosi: {
        // 指令的定义
        inserted: function (el) {
          let pageHeight = 1138;
          let height = el.offsetHeight;
          let top = el.offsetTop;
          let trueHeight = top % pageHeight;
          if (height > pageHeight - trueHeight) {
            el.style.marginTop = pageHeight - trueHeight + 16 + "px";
          }
        }
      }
    }
  };

</script>
<style lang="less" scoped>
  .edit-report {
    height: 100%;

    //表格相关选项
    .tableCheck {
      border: 1px solid #DDD;
      padding: 5px 0px;
    }

    .ivu-tabs-tabpane {
      min-height: 600px;
    }

    .header {
      height: 46px;
      background-color: #2aaedd;
      width: 100%;
      min-width: 600px;
      position: relative;

      h4 {
        position: absolute;
        left: 40px;
        top: 9px;
        font-family: inherit;
        color: #fff;
        font-weight: 700;
        font-size: 20px;
      }

      .btn-group {
        position: absolute;
        top: 9px;
        right: 10px;
      }
    }

    .header-middle {
      line-height: 46px;
      height: 46px;

      h4 {
        font-family: inherit;
        color: #fff;

        font-weight: 700;
        font-size: 20px;
      }
    }

    .main-wrap {
      height: 100%;

      .left {
        height: 100%;
        overflow: hidden;

        .list {
          padding-left: 10px;
          padding-right: 10px;

          .list-item {
            line-height: 30px;
            text-align: center;

            border: 1px dashed #999;
            margin-bottom: 8px;
            padding: 5px 15px;
            cursor: move;
            border-radius: 2px;
            background-color: #f5f5f5;
            transition: background ease-in-out 0.15s;

            .title {
              line-height: 30px;
              height: 30px;
            }

            .icon {
              float: right;
            }

            &:hover {
              background-color: #d0e2f3;
              border-color: #57a5ca;
              border-style: solid;
            }
          }
        }
      }

      .no-data-info {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 140px;
        margin-top: -70px;
        padding: 20px;
        text-align: center;
        color: #999;
      }

      .form-content {
        padding-top: 15px;
        margin: 10px auto;
        height: 95%;
        background: #fff;
        width: 96%;
        overflow-y: auto;

        .table-item-con {
          margin-bottom: 10px;

          .del-icon {
            float: right;
            margin-top: -2px;
          }

          &.active {
            border: 1px dashed red;
          }
        }

        &:hover {
          box-shadow: 0 0 0 0;
          border: 1px solid rgba(255, 0, 0, 0.3);
        }

        .ghost {
          border: 2px dashed red;
          width: 100% !important;
          height: 70px;
        }

        .table-list-item {
          padding: 5px;
          min-height: 70px;
          text-align: center;
        }

        .dashed-box {
          border: 2px dashed red;
          width: 99%;
          margin: 5px auto;
          height: 160px;
        }
      }
    }
  }

</style>
