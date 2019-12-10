<template>
  <div>
    <Card :dis-hover="true" :bordered="false" :padding="5" width="100%">
      <p slot="title">我的模板</p>
      <p slot="extra">
        <i-switch size="large" v-model="tableViewFlag">
          <span slot="open">列表</span>
          <span slot="close">卡片</span>
        </i-switch>
        <!-- <Cascader style="width:200px;display:inline-block;" placeholder="请选择模板分类" trigger="hover"></Cascader> -->
        <Input type="text" style="width: 200px;" v-model="queryParam" placeholder="输入模板名称或标签进行查询"></Input>
        <Button type="success"style='margin:0 10px 0 10px;' @click="queryTemplate">查询</Button>
        <Button type="primary" @click="addTemplateModal = true,addOrEdit = true">新增模板</Button>
        <Button v-if="false" type="primary" style="margin-left:10px;" @click="addAlreadyTemplate">添加已有表单</Button>
      </p>
      <template-list
        @on-delete='deleteTemplate'
        :pageInfo="pageInfo"
        :colNum="4"
        :tableView="tableViewFlag"
        @onEdit="onEdit"
        :systemFlag="false"
        @updateTemplate="updateTemplate"
      ></template-list>
      <div style="text-align:center;">
          <Page
          :total="pageTotal"
          :current='currentPage'
          :page-size="10"
          show-total
          style="margin-top: 5px;"
          @on-change="pageChange"/>
      </div>
    </Card>
    <Modal v-model="addTemplateModal" @on-ok="saveTemplate()" :mask-closable="false" width="70" :closable="false">
      <p slot="header" v-if="addOrEdit">我的模板增加</p>
      <p slot="header" v-if="!addOrEdit">我的模板编辑</p>
      <template-form ref="templateForm" @on-save="saveHandler"></template-form>
      <p slot="footer">
        <Button type="default" @click="cancelSaveTemplate">取消</Button>
        <Button type="primary" @click="saveTemplate">确定</Button>
      </p>
    </Modal>
    <!-- 添加表单为模板 -->
    <already-template-list v-if="addAlreadyFlag" @now-close='addAlreadyFlag = false'
        @on-add='sureAddAlready'
    ></already-template-list>
  </div>
</template>

<script>
  import {TemplateApi} from "@/api"
  import TemplateForm from "../component/template/template-form";
  import TemplateList from "../component/template/template-list";
  import AlreadyTemplateList from './components/already-template-list.vue'
  export default {
    components: {
      TemplateList,
      TemplateForm,
      AlreadyTemplateList
    },
    name: "my-template",
    data() {
      return {
        currentPage:1,
        pageNo: 0,
        pageSize: 10,
        pageTotal: 0,
        addTemplateModal: false,
        queryParam: "",
        pageInfo: [],
        tableViewFlag: true,
        addAlreadyFlag: false, // 添加已有表单为模板
        addOrEdit: true,
      }
    },
    mounted() {
      if(localStorage.getItem('alreadyFlag') === 'true'){
        this.addAlreadyFlag = true
      }
      this.queryTemplateMasters("", "", this.pageNo, this.pageSize)
    },
    methods: {
      saveTemplate() {
        this.$refs.templateForm.saveTemplateMaster(0);
      },
      cancelSaveTemplate() {
        this.$refs.templateForm.resetForm();
        this.addTemplateModal = false;
      },
      queryTemplateMasters(lables, templateName, pageNo, pageSize) {
        TemplateApi.findMyTemplates(lables ,templateName, pageNo, pageSize).then(res => {
          if(res.data.code == '1'){
            this.pageInfo = res.data.data.data;
            this.pageTotal = res.data.data.totalRows
          } else {
            this.$Message.error({
              content:'获取模板信息失败',
              duration:4
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
          this.$Message.success({
            content:'保存成功',
            duration:4
          })
          this.cancelSaveTemplate();
          this.queryTemplateMasters(this.queryParam, this.queryParam, this.currentPage -1, 10)
        }
      },
      queryTemplate () {
        this.currentPage = 1
        this.queryTemplateMasters(this.queryParam, this.queryParam, this.currentPage -1, 10 )
      },
      pageChange (pageNo) {
        this.currentPage = pageNo ;
        pageNo = pageNo - 1
        this.queryTemplateMasters(this.queryParam, this.queryParam, pageNo, 10)
      },
      onEdit(template){
        this.addOrEdit = false
        this.$refs.templateForm.fillTemplateMaster(template);
        this.addTemplateModal = true ;
      },
      updateTemplate(templateMaster){
        TemplateApi.mergeMyTemplate(templateMaster).then(res=>{
          this.$Message.success({
            content:'操作成功',
            duration:4
          })
        }).catch(err=>{
          console.log(err)
        })
      },
      // 删除模板
      deleteTemplate(index){
        this.pageInfo.splice(index,1)
        this.pageTotal = this.pageTotal -1
        if(this.pageInfo.length === 0){//当前页删除完
            if(this.currentPage > 1){//如果当前页不是第一页
              this.currentPage = this.currentPage -1
              this.queryTemplateMasters(this.queryParam, this.queryParam, this.currentPage - 1, 10)
            }else{//如果当前页是第一页
              this.queryTemplateMasters(this.queryParam, this.queryParam, this.currentPage - 1, 10)
            }
        }
      },
      // 添加已有表单为模板
      addAlreadyTemplate(){
        this.addAlreadyFlag = true
      },
      sureAddAlready(params){
        this.addTemplateModal =true
      }
    }
  }
</script>

<style scoped>

</style>
