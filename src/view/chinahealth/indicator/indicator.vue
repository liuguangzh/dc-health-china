<template>
  <div>
    <Row>
      <Col span="24">
        <indicator-tree @indicatorSelectChange="indicatorChange"></indicator-tree>
      </Col>

    </Row>
    <Row>
      <Col span="24">
        <indicator-value-list :indicator="indicator"></indicator-value-list>
      </Col>
    </Row>
  </div>
</template>

<script>
  import IndicatorTree from './indiator/indicator-tree'
  import IndicatorValueList from './indicator-value/indicator-value-list'
  export default {
    name: 'indicator',
    components: { IndicatorValueList, IndicatorTree },
    data(){
      return {
        indicator:{}
      }
    },
    methods:{
      indicatorChange:function(data){
        this.indicator = data ;
      }
    }
  }
</script>

<style scoped>

</style>
