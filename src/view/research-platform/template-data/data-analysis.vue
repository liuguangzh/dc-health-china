<template>
  <div class="layout-analysis">
    <!-- 顶部 tab  -->
    <!-- <Tabs type="card" @on-click="changeComponent">
      <TabPane label="录入的数据" name="1"></TabPane>
      <TabPane label="已填报数据" name="2"></TabPane>
      <TabPane label="数据预览" name="3"></TabPane>
    </Tabs> -->
    <component :is="currentComponent"></component>   
  </div>
</template>
<script>
import DataPreview from './data-preview'//数据预览
export default {
  data(){
    return{
      currentIndex:3
    }
  },
  computed:{
    currentComponent(){
      if(this.currentIndex == 3){
        return "DataPreview"
      }else{
        return "DataPreview"
      }
    }
  },
  methods:{
    //切换显示模块
    changeComponent(name){
      this.currentIndex = name;
    }
  },
  components:{
    DataPreview
  }
}
</script>
<style lang="less" scoped>
  @import './index.less';
</style>