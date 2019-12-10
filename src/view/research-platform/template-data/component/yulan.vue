<template>
    <div class="mask">
      <div v-for="(item,index) in options" :key="index">
        <div v-if="item.hasOwnProperty('series')">
          <v-echart :options="item" :key="index"></v-echart>
          <P class="echart-desc" style="text-align:center;">图表名称：{{ item.newText }}</P>
          <P class="echart-desc">图表描述：{{item.desc }}</P>
        </div>
        <div v-else>
          <Table border :columns="item.tableTitles" :data="item.tableData" :key="index"></Table>
          <p class="echart-desc" style="text-align:center;">图表名称：{{ item.name }}</p>
          <p class="echart-desc">图表描述：{{ item.desc }}</p>
        </div>
      </div>
        <Button class="close-btn" type="primary" @click="closeModal">返回</Button>
    </div>
</template>
<script>
import VEchart from "./echarts/index.js"
export default {
    name:"yulan",
    data(){
        return{

        }
    },
    props:{
       options:{
           type:Array,
           default:()=>{
               return []
           }
       } 
    },
    methods:{
        closeModal(){
            this.$emit('now-close')
        }
    },
    components:{ VEchart }
}
</script>
<style lang="less" scoped>
.mask{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #FFF;
    padding: 15px;
    overflow: auto;
    .echart-desc{
        margin: 0 40px 20px 40px;
        font-size: 16px;
        text-align: center;
      }
    .mask-title{
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        margin-bottom: 20px;
        border-bottom:2px solid #eee
    }
    .close-btn{
        position: absolute;
        bottom: 15px;
        right: 15px;
        z-index: 9999;
    }
}
</style>


