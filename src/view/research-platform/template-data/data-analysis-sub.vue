<template>
  <div class="layout-analysis">
    <!-- 顶部 tab  -->
    <!-- <Tabs type="card" @on-click="changeComponent">
      <TabPane label="数据分析" name="1"></TabPane>
    </Tabs> -->
    <component
      :is="currentComponent"
      :tableHeader='tableHeader'
      :tabData='tabData'
      :dataTableId='dataTableId'
      :projectTaskId='projectTaskId'
      :analysisMainName='analysisMainName'
      :analysisSubName='analysisSubName'
      @changeDataSources='changeComponent'
      @sendAnalysisHeader='sendAnalysisHeader'
      @sendAnalysisTable='sendAnalysisTable'
      @sendAnalysisDataTableId='sendAnalysisDataTableId'
      @analysisMainNameFnc='analysisMainNameFnc'
      @analysisSubNameFnc='analysisSubNameFnc'
    ></component>
  </div>
</template>
<script>
import DataSelectSources from './data-select-sources'
import DataAnalysisDetail from './data-analysis-detail'// 数据分析详情
export default {
  data(){
    return{
      currentIndex: 1,
      tableHeader: [],
      tabData: [],
      dataTableId: '',
      projectTaskId: '',
      tableTemplate: '',
      analysisSubName: '', // 数据分析子表
      analysisMainName: '', // 数据分析表
    }
  },
  computed:{
    currentComponent(){
      if(this.currentIndex == 1){
        return "DataAnalysisDetail"
      } else if(this.currentIndex == 2){
        return "DataSelectSources"
      } else{
        return "DataAnalysisDetail"
      }
    }
  },
  methods:{
    //切换显示模块
    changeComponent(name, id){
      this.currentIndex = name;
      this.projectTaskId = id
    },
    sendAnalysisHeader(item){
      this.tableHeader = item
    },
    sendAnalysisTable(item){
      this.tabData = item
    },
    sendAnalysisDataTableId(item){
      this.dataTableId = item
    },
    analysisSubNameFnc(item){
      this.analysisSubName = item
    },
    analysisMainNameFnc(item){
      this.analysisMainName = item
    },
  },
  components:{
    DataAnalysisDetail,
    DataSelectSources
  }
}
</script>
<style lang="less" scoped>
  @import './index.less';
</style>