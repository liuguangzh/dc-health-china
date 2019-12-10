<template>

  <Form :model="indicator" :rules="indicatorRules" :label-width="80" ref="indicatorForm">
    <FormItem label="父指标路径">
      <Input disabled v-model="indicator.parentIndicator.indicatorAlisName"></Input>
    </FormItem>
    <FormItem prop="indicatorName" label="指标名称">
      <Input placeholder="请输入指标名称" v-model="indicator.indicatorName"></Input>
    </FormItem>
    <FormItem prop="indicatorComeFrom" label="指标出处">
      <Input placeholder="请输入计量单位" v-model="indicator.indicatorComeFrom"></Input>
    </FormItem>
    <FormItem prop="unit" label="计量单位">
      <Input placeholder="请输入计量单位" v-model="indicator.unit"></Input>
    </FormItem>

  </Form>
</template>

<script>
  import IndicatorApi from "@/api/chinahealth/Indicator"
  export default {
    name: 'indicator-form',
    props:{
      indicator:{
        type:Object,
        required:true,
        default:()=>{
          return {
            indicatorAlisName:"",
            indicatorName:"",
            indicatorComeFrom:"",
            unit:"",
            parentIndicator:{
              id:"",
              indicatorAlisName:""
            }
          }
        }
      }
    },
    data(){
      return {
        indicatorRules:{
          indicatorName:[{
            validator:(rule,data,callbacks)=>{
              if(data){
                callbacks();
              }else{
                callbacks(new Error("指标名称不能为空"))
              }
            },
            trigger:'blur',
            required:true
          }]
        }
      }
    },
    methods:{
      saveIndicator:function(){
        this.$refs.indicatorForm.validate(valid=>{
          if(valid){
            IndicatorApi.createOneByObj(this.indicator).then(res=>{
              this.$emit("saveSuccess",res.data)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
