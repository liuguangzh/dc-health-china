<template>

  <Form ref="typeForm" :model="classificationType" :rules="rules" :label-width="100">
    <FormItem prop="classificationTypeName" label="分类方法名称">
      <Input placeholder="请输入分类方法名称" v-model="classificationType.classificationTypeName"></Input>
    </FormItem>
  </Form>
</template>

<script>
  import ClassificationApi from '@/api/chinahealth/classification'
  export default {
    name: 'classification-type-form',
    props:{
      classificationType:{
        type:Object,
        required:true,
        default:()=>{
          return {
            classificationTypeName:""
          }
        }
      }
    },
    data(){
      return {
        rules:{
          classificationTypeName:[{
            validator:(rule,data,callbacks)=>{
              if(data){
                callbacks();
              }else{
                callbacks(new Error("分类方法名称不能为空，请输入分类方法名称！"))
              }
            },
            trigger:'blur',
            required:true
          }]
        }
      }
    },
    methods:{
      /**
       * 保存当前对象
       */
      saveClassificationType:function(){
        this.$refs.typeForm.validate(valid=>{
          if(valid){
            ClassificationApi.saveClassificationType(this.classificationType).then(res=>{
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
