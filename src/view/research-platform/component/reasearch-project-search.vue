<template>
    <!-- 查询条件 -->
    <Row type="flex" align="middle" justify="start" :gutter="10">
      <Col span="5">
      <span>表单名称：</span>
        <Input style="width:70%;" type="text" v-model="masterQueryVo.templateMasterName" clearable placeholder="请输入查询任务名称"></Input>
      </Col>
      <Col span="5">
        <span>开始时间：</span>
        <DatePicker style="width:60%;" format="yyyy-MM-dd HH:mm:ss" @on-change="date1" clearable placeholder="选择开始日期"></DatePicker>
      </Col>
      <Col span="5">
        <span>结束时间：</span>
        <DatePicker style="width:60%;" format="yyyy-MM-dd HH:mm:ss" @on-change="date2"  clearable placeholder="选择结束日期"></DatePicker>
      </Col>
      <Col span="5">
        <span>填报状态：</span>
        <Select style="width:70%;"  v-model="masterQueryVo.fillStatus" clearable>
          <Option :value="0">未开始</Option>
          <Option :value="1">已结束</Option>
          <Option :value="2">暂停</Option>
          <Option :value="3">填报中</Option>
        </Select>
      </Col>
      <Col span="2">
        <Button type="primary" size="small" @click="searchByTerm">查询</Button>
      </Col>
    </Row>
</template>
<script>
import {getRelativeTime} from '@/libs/tools.js'
export default {
  name:'ResearchProjectSearch',
  data(){
    return{
      masterQueryVo: {
        templateMasterName:'',// 表单名称
        startTime:'' ,//开始时间
        endTime:'',//结束时间
        fillStatus:'',// 0: 未开始 1: 已结束 2: 暂停 3: 填报中
        operation:'',//大于 等于 小于
        percent:'',//百分比
        done:'',//是否提交 0： 未提交 1: 已提交
      }
    }
  },
  methods:{
    searchByTerm(){
      this.$emit('on-search',this.masterQueryVo)
    },
    date1(e){
      this.masterQueryVo.startTime = e
    },
    date2(e){
      this.masterQueryVo.endTime = e
    }
  }
}
</script>
<style lang="less" scoped>
</style>
