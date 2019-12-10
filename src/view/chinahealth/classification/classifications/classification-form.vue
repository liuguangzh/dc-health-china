<template>
    <Form :model="classification" ref="classificationForm" :label-width="80" :rules="formRules">
      <FormItem prop="classificationTypeName" label="所属分类">
        <Input disabled v-model="classification.classificationType.classificationTypeName"></Input>
      </FormItem>
      <FormItem prop="parentClassificationName" label="父级分类">
        <!--<Input disabled></Input>-->
        <label>{{classification.parent?classification.parent.classificationName:'无父级'}}</label>
      </FormItem>
      <FormItem prop="classificationName" label="分类名称">
        <Input v-model="classification.classificationName" type="text" placeholder="请输入分类名称" required></Input>
      </FormItem>
    </Form>
</template>

<script>
  import ClassificationApi from "@/api/chinahealth/classification"
  export default {
    props:{
      classification:{
        type:Object,
        default:()=>{
          return {
            classificationName:'',
            parent:{
              id:"",
              classificationName:""
            },
            classificationType:{
              id:"",
              classificationTypeName:""
            }
          }
        }
      }
    },
    name: 'classification-form',
    data(){
      return {
        formRules:{
          classificationName:[{
            validator:(rule,data,callbacks)=>{
              if(data){
                callbacks();
              }else{
                callbacks(new Error("错误的数据格式"))
              }
            },
            trigger:'blur',
            required:true
          }]
        }
      }
    },
    methods:{
      saveClassification:function(){
        let validate = this.$refs.classificationForm.validate(valid=>{
          if(valid){
            ClassificationApi.saveClassification(this.classification).then((res,reslove)=>{
              this.$emit("saveSuccess",res.data)
            }) ;
          }
        })
        return validate;
      }
    }
  }
</script>

<style scoped>

</style>
