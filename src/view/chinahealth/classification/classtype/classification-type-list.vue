<template>
<div>
  <Card :dis-hover="true" :bordered="true">
    <p slot="title">指标分类管理</p>
    <p slot="extra">
      <Input placeholder="请输入关键字查询" v-model="classificationTypeName" style="width: 100px;" @on-enter="searchClassificationType"></Input>

      <Button size="small" @click="addNewClassificationType">
        <Icon type="ios-add" />
      </Button>
      <Button size="small" @click="modifyClassificationType">
        <Icon type="ios-color-wand-outline" />
      </Button>
      <Button size="small" @click="removeClassificationType">
        <Icon type="ios-close" />
      </Button>
    </p>
    <Table :columns="columnDefs"
           :data="classificationTypes"
           @on-current-change="selectChange"

           highlight-row :height="tableHeight"></Table>
  </Card>
  <Modal v-model="typeModal" :closable="false" :mask-closable="false">
    <p slot="header">分类方法维护</p>
    <classification-type-form
      ref="typeForm"
      @saveSuccess="classificationSaveSuccess"
      :classification-type="currentClassificationType"></classification-type-form>
    <p slot="footer">
      <Button type="primary" @click="saveClassificationType">保存</Button>
      <Button type="default" @click="closeClassificationType">取消</Button>
    </p>
  </Modal>
</div>

</template>

<script>
  import ClassificationApi from '@/api/chinahealth/classification'
  import ClassificationTypeForm from './classification-type-form'
  export default {
    name: 'classificationTypeList',
    components: { ClassificationTypeForm },
    data(){
      return {
        classificationTypes:[],
        columnDefs:[{
          title:"分类名称",
          key:"classificationTypeName"
        }],
        tableHeight:"300",
        classificationTypeName:'',
        typeModal:false,
        currentClassificationType:{
          classificationTypeName:""
        }
      }
    },
    mounted () {
      this.searchClassificationType();
      // alert(window.innerHeight)
      this.tableHeight = window.innerHeight - 100 ;
    },
    methods:{
      selectChange:function(currentRow){
        this.currentClassificationType = currentRow ;
        this.$emit("on-current-change",currentRow) ;
      },
      searchClassificationType:function(){
        ClassificationApi.getTypes(this.classificationTypeName).then(res=>{
          console.log(res.data)
          this.classificationTypes = res.data ;
        }) ;
      },
      /**
       * 添加新的分类方法
       */
      addNewClassificationType:function(){
        this.typeModal = true ;
        delete this.currentClassificationType.id;
        this.currentClassificationType.classificationTypeName ="";
      },
      modifyClassificationType:function () {
        if(!this.currentClassificationType.id){
          this.$Message.error({content:"请选择要修改的分类方法！"})
          return
        }
        this.typeModal = true ;
      },
      saveClassificationType:function(){
        this.$refs.typeForm.saveClassificationType();
      },
      removeClassificationType:function () {
        if(!this.currentClassificationType.id){
          this.$Message.error({content:"请选择要删除的分类方法！"})
          return
        }

        this.$Modal.confirm({
          title:"系统提示",
          content:"确认要删除此分类方法？",
          onOk:()=>{
            ClassificationApi.deleteClassificationType(this.currentClassificationType.id).then(res=>{
              this.searchClassificationType();
            })
          }
        })



      },
      closeClassificationType:function () {
        this.typeModal = false ;
      },
      classificationSaveSuccess:function(data){
        this.closeClassificationType();
        this.searchClassificationType();
      }
    }
  }
</script>

<style scoped>

</style>
