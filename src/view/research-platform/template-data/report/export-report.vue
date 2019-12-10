<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <Layout style="height:100%;overflow:auto;">
    <Content style="background:#fff;">
        <Button type="primary" @click="downWord">导出报告</Button>
        <Button type="primary" style="margin-left:10px;" @click="$router.go(-1)">返回</Button>
        <div ref="exportBox">   
            <div v-for="(item,index) in options" :key="index">
                <div v-if="item.hasOwnProperty('series')">
                    <v-echart :options="item" :key="Math.random()" height="500px"></v-echart>
                    <P class="echart-desc" style="text-align:center;">图表名称：{{ item.newText }}</P>
                    <p class="echart-desc">{{ item.desc }}</p>
                </div>
                <div v-else>
                    <Table border :columns="item.option.tableTitles" :data="item.option.tableData" :key="Math.random()"></Table>
                    <P class="echart-desc" style="text-align:center;">图表名称：{{ item.option.name }}</P>
                    <p class="echart-desc">{{item.desc}}</p>
                </div>
            </div>
        </div>
    </Content>
  </Layout>
</template>
<script>
  import {DataAnalysisApi} from "@/api/"
  import VEchart from "../component/echarts/index.js"
  import chartOptions from "../component/echarts/options.js"
  import ExportWord from "@/libs/ExportWord.js"
  export default {
    name: "exportReport",
    data() {
      return {
        reportList: [],
        options: []
      }
    },
    methods: {
      async getEchartOptions(obj) {
        let postArr = []
        obj.forEach(item => {
          if (item.name !== "占位符") {
            postArr.push(item)
          }
        })
        let data = await DataAnalysisApi.getReportData(postArr)

        let newRes = JSON.parse(JSON.stringify(data.data))
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
            if (newRes[i].config.tableColumns !== null) {
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
          } else if (newRes[i].chart == "pie") {
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
            if (newRes[i].config.tableColumns !== null) {
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
              name: newRes[i].config.title
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
            newRes[i].option = option;
            newRes[i].index = i
            this.options.push(newRes[i])
          }
        }
      },
      sureExport() {
        //清空图表数据数组
        this.options = [];
        for (let i = 0; i < this.reportList.length; i++) {
          this.getEchartOptions(JSON.parse(this.reportList[i].content))
        }
      },
      downWord(){
          ExportWord.exportWord(undefined,this.$refs.exportBox)
      }
      
    },
    mounted() {
      this.reportList = this.$route.params.reportList;
      this.sureExport()
    },
    components: {
      VEchart
    }
  }
</script>
<style lang="less" scoped>
.echart-desc{
  margin: 0 40px 20px 40px;
  text-align: center;
  font-size: 16px;
}
</style>