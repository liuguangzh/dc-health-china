<style lang="less">
.create-radio-l .ivu-radio-group-button.ivu-radio-group-large .ivu-radio-wrapper{
  padding: 10px;
  // min-height: 36px;
  height: 0px;
  white-space: normal;
  height: 100%;
  line-height: 20px;
}
</style>

<template>
<div>
  <Row type="flex" align="top" justify="space-around" :gutter="20">
    <Col span="8" v-if="selectStatus">
        <top-title title="新建/设置表单"></top-title>
        <div class="create-radio-l" style="padding:20px 30px;">
          <RadioGroup v-model="checkTmp" type="button" size="large" style="width:100%;">
            <Radio label="" style="width:90%;margin-bottom:15px;background:#306CB6;color:#fff;text-align:center;">新建表单</Radio>
            <Radio v-for="(item,index) in researchProject.templateMasters" 
            :key="item.id" 
            :label="item.id"
            style="width:90%;margin-bottom:15px;"
            >{{ item.templateName }}</Radio>
            </RadioGroup>
        </div>
    </Col>
    <i-col span="13" pull='1'>
      <template-master-form :setTmp="setTmp" :researchProject="researchProject" @onCreateTemplateMasterSuccess="onCreateTemplateMasterSuccess" @on-next='goNext'></template-master-form>
    </i-col>
  </Row>
</div>
</template>

<script>
  import TemplateMasterForm from "../../research-platform/component/template-master-form";
  import TopTitle from '@/view/research-platform/component/top-title/index.js'
  export default {
    name: "create-template-guide",
    data(){
      return{
        // 选中模板的ID
        checkTmp:""
      }
    },
    props:{
      researchProject:{
        type:Object,
        default:()=>{
          return {}
        }
      },
    },
    computed:{
      selectStatus(){
        if(this.researchProject.templateMasters){
          return true
        }else{
          return false
        }
      },
      setTmp(){ // 选中编辑的表单
        if(this.researchProject.templateMasters){
          let obj = this.researchProject.templateMasters;
          let cObj = {};
          for(let i = 0;i<obj.length;i++){
            if(obj[i].id == this.checkTmp){
              cObj = obj[i]
              break
            }
          }
          return cObj;
        }
      }
    },
    mounted() {
      if(this.researchProject.templateMasters.length > 0){
        this.checkTmp = this.researchProject.templateMasters[0].id
      }
    },
    methods:{
      onCreateTemplateMasterSuccess(templateMaster){
        this.checkTmp = templateMaster.id
        this.$emit('onCreateTemplateMasterSuccess',templateMaster)
      },
      // 检查所有必填项是否完成填写
      checkInfo(){
        if(this.researchProject.templateMasters){
          // templateName complete needPromiseFile templateFileStore endDate startDate 
          let obj = this.researchProject.templateMasters
          let flag = false
          for(let i = 0 ;i<obj.length;i++){
            if(obj[i].templateName && obj[i].complete && obj[i].endDate && obj[i].startDate){
              // 验证通过
              if(obj[i].needPromiseFile === 1){
                if(obj[i].templateFileStore){
                  flag = true
                }else{
                  flag = false
                  break
                }
              }else{
                flag = true
              }
            }else{
              flag = false
              break 
            }
          }
          return flag
        }
      },
      goNext(){
        this.$emit('on-next')
      },
    },
    components: {TemplateMasterForm,TopTitle}
  }
</script>
<style scoped>
</style>
