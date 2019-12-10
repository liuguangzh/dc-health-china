<template>
  <Header>
    <Row>
      <Col span="8">
        <div style="color: white;font-size: 16px">当前填报项目：{{currentTemplateResultMaster.templateName}}</div>
      </Col>
      <Col span="12" style="text-align: right">
        <Button type="success" size="small" style="margin: 5px;" 
          v-if="hasUploadPromiseFile" @click="reUploadPromiseFile">重新上传</Button>
        <Button type="success" size="small" style="margin: 5px;" 
          v-if="hasUploadPromiseFile" @click="downLoadTemplateResultPromiseFile">查看已上传</Button>
        <Button type="info"  size="small" @click="" style="margin: 5px;"
          @click="downLoadPromiseFile" v-if="needPromiseFile&&!hasUploadPromiseFile">下载承诺书模板</Button>
        <upload-btn style="display:inline-block;width:110px;" @uploadSuccess="uploadSuccess" 
          v-if="needPromiseFile&&!hasUploadPromiseFile"></upload-btn>
        <Button type="success" size="small" style="margin: 5px;" @click="toSubmit">提交当前</Button>
      </Col>
    </Row>
  </Header>
</template>
<script>
  import {TemplateApi,TemplateResultApi} from '@/api/'
  import UploadBtn from "../component/upload-btn";
  export default {
    components: {UploadBtn},
    name: "report-header",
    props:{
      currentTemplateResultMaster:{
        type:Object,
        default:function(){
          return {
            templateName:"",
            template:{
              needPromiseFile: 0
            }
          }
        }
      }
    },
    methods:{
      downLoadPromiseFile:function(){
        let that = this ;
        TemplateApi.downLoadTemplateFile(this.currentTemplateResultMaster.masterRe.templateFileStore.id).then(res=>{
          let url = window.URL.createObjectURL(new Blob([res.data.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download',that.currentTemplateResultMaster.masterRe.templateFileStore.originName)
          document.body.appendChild(link)
          link.click()
        })
      },
      downLoadTemplateResultPromiseFile:function(){
        let that = this ;
        TemplateApi.downLoadTemplateFile(this.currentTemplateResultMaster.fileStore.id).then(res=>{
          let url = window.URL.createObjectURL(new Blob([res.data.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download',that.currentTemplateResultMaster.fileStore.originName)
          document.body.appendChild(link)
          link.click()
        })
      },
      /**
       * 上传成功的回调函数
       * @param templateStoreFile
       */
         //上传成功！
      uploadSuccess(fileStore){
        this.currentTemplateResultMaster.fileStore = fileStore ;
        let obj={
          fileStoreId:fileStore.id,
          resultMasterId:this.currentTemplateResultMaster.id,
          fileStorePath: fileStore.url
        }
        TemplateResultApi.mergeTemplateResultMasterPut(obj)
          .then(res=>{
            this.$Message.success({
              content:"承诺书上传成功能！"
            })
            this.$emit('on-newResult')
            this.uploadPromiseFileStatus=false
          })
        },
      reUploadPromiseFile:function(){
        this.currentTemplateResultMaster.fileStore=undefined;
      },
        //提交已填报数据
      toSubmit() {
        if (this.currentTemplateResultMaster.done === 0) {
          //提交
          let _this = this;
          let obj = this.currentTemplateResultMaster;
          obj.done = 1
          this.$Modal.confirm({
            title: "提交已保存数据",
            content: "确定要提交已保存数据吗？",
            onOk: function () {
              TemplateResultApi.commitResultMaster(obj.id).then(res=>{
                if (res.data.code == '1') {
                  _this.$Message.success({
                    content: '提交成功',
                    duration: 2
                  })
                }
              }).catch(err => {
                  obj.templateStatus = '0'
                  _this.$Message.error({
                    content: "提交失败，请重试",
                    duration: 2
                  })
                })
            }
          })
        }else{
          this.$Message.error({
            content:'您已经提交过了'
          })
        }
      },
    },
    computed:{
      needPromiseFile(){
        let needPromiseFile = this.currentTemplateResultMaster&&this.currentTemplateResultMaster.masterRe&&this.currentTemplateResultMaster.masterRe.needPromiseFile== 1 ;
        return needPromiseFile;
      },
      hasUploadPromiseFile(){
        return this.currentTemplateResultMaster.fileStore&&this.currentTemplateResultMaster.fileStore.id
      }
    }
  }
</script>

<style  lang="less"  scoped>
</style>
