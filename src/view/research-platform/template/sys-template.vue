<template>
  <div>
    <Card :dis-hover="true" :bordered="false" :padding="5" width="100%">
      <p slot="title">系统模板</p>
      <p slot="extra">
        <i-switch size="large" v-model="tableViewFlag">
          <span slot="open">列表</span>
          <span slot="close">卡片</span>
        </i-switch>
        <Input type="text" style="width: 200px;" v-model="queryParam" placeholder="输入模板名称或标签进行查询"></Input>
        <Button type="success" style='margin:0 10px 0 10px;' @click="queryTemplate">查询</Button>
        <Button type="primary" @click="addTemplateModal=true">新增系统模板</Button>
      </p>
      <template-list
        :pageInfo="pageInfo"
        :colNum="4"
        :tableView="tableViewFlag"
        :systemFlag="true"
        @onEdit="onEdit"
        @on-delete='deleteTemplate'
        @updateTemplate="updateTemplate"></template-list>
      <Page
        :total="pageTotal"
        :page-size="10"
        :current='currentPage'
        align="right"
        style="margin-top: 5px;"
        @on-change="pageChange"
      />
    </Card>
    <Modal v-model="addTemplateModal" @on-ok="saveTemplate()" :mask-closable="false" width="70" :closable="false">
      <p slot="header">系统模板增加</p>
      <template-form ref="templateForm" @on-save="saveHandler"></template-form>
      <p slot="footer">
        <Button type="default" @click="cancelSaveTemplate">取消</Button>
        <Button type="primary" @click="saveTemplate">确定</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
  import {TemplateApi} from "@/api"
  import TemplateForm from "../component/template/template-form";
  import TemplateList from "../component/template/template-list";
  import ISwitch from "iview/src/components/switch/switch";
  export default {
    components: {
      ISwitch,
      TemplateList,
      TemplateForm
    },
    name: "sys-template",
    data() {
      return {
        pageNo: 0,
        pageSize: 10,
        pageTotal: 0,
        addTemplateModal: false,
        currentPage:1,
        queryParam: "",
        pageInfo: [],
        tableViewFlag: true,
      }
    },
    mounted() {
      this.queryTemplateMasters("", "", 0, 10)
    },
    methods: {
      saveTemplate () {
        this.$refs.templateForm.saveTemplateMaster(1);
      },
      cancelSaveTemplate () {
        this.$refs.templateForm.resetForm();
        this.addTemplateModal = false;
      },
      queryTemplateMasters (lables, templateName, pageNo, pageSize) {
        TemplateApi.findSysTemplates(templateName, lables, pageNo, pageSize).then(res => {
          if(res.data.code === '1') {
            this.pageInfo = res.data.data.data;
            this.pageTotal = res.data.data.totalRows
          } else {
            this.$Message.error({
              content: '获取系统模板数据失败',
              duration: 3
            })
          }
        })
      },
      /**
       * 表单保存后调用该方法
       * @param templateMaster
       */
      saveHandler (templateMaster) {
        if (templateMaster) {
          this.$Message.success({content: '保存成功',duration:4})
          this.cancelSaveTemplate();
          this.queryTemplateMasters(this.queryParam, this.queryParam, this.currentPage, this.pageSize)
        }
      },
      queryTemplate () {
        this.currentPage = 1
        this.queryTemplateMasters(this.queryParam, this.queryParam, this.currentPage, this.pageSize )
      },
      pageChange (page) {
        this.currentPage = page
        this.queryTemplateMasters(this.queryParam, this.queryParam, this.currentPage, this.pageSize)
      },
      onEdit(template){
        this.$refs.templateForm.fillTemplateMaster(template);
        this.addTemplateModal = true ;
      },
      updateTemplate(templateMaster){
        templateMaster.isSys = 1 //系统模板
        TemplateApi.mergeSysTemplate(templateMaster).then(res=>{
          if(res.data.code === '1'){
            this.$Message.success({
              content:'操作成功',
              duration:4
            })
          } else {
            this.$Message.success({
              content:'操作失败',
              duration:4
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 删除模板
      deleteTemplate(index){
        this.pageInfo.splice(index,1)
      }
    }
  }
</script>
<style scoped>
</style>
