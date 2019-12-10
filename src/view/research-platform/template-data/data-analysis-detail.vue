<style lang="less">
.my-menu-box .ivu-menu-vertical .ivu-menu-submenu-title-icon{
  float: left;
}
.ivu-poptip-popper{
  min-width: 61px;
  top: 0px !important;
  left: 220px !important;
}
.ivu-poptip-body{
  padding: 0px;
}
.ivu-table th{
  background: #E6E7E8;
}
.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal{
    top: 0;
  }
}
</style>

<template>
  <div style="height:100%;position:relative;">
    <Row :gutter="10" style="height:100%;">
      <Col span="6" style="height:100%;">
        <div>
          <Row>
            <Col :span="12">
              <div
                class="menu-task-type" 
                :class="menuActive === '0' ? 'active' : ''" 
                @click="singleTask"
              >单任务</div>
            </Col>
            <Col :span="12">
              <div
                class="menu-task-type"
                :class="menuActive === '1' ? 'active' : ''"
                @click="multiTask"
              >多任务</div>
            </Col>
          </Row>
        </div>
        <Input
          style="width: 80%"
          placeholder="请输入数据分析表名称"
          v-model="projectName"
          search
          @on-search="searchByTerm"
          @on-enter="searchByTerm"
        ></Input>
        <Button 
          v-if="showCreateTask"
          size="small" 
          style="margin-left: 10px;" 
          type="primary" 
          @click="addAnalysisTable"
        >新建</Button>
        <!-- 左侧列表 -->
        <div class="menu-box my-menu-box">
          <Menu ref="menuChild" :accordion="true" style="width:100%;" @on-select="changeTemplate">
            <Submenu :name="item.id" v-for="(item,index) in projectList" :key="item.id">
              <template slot="title">
                <P class="sub-item" :title="item.dataTableName">{{item.dataTableName}}</P>
                <div class="icon-box">
                  <Icon
                    type="md-add"
                    size="20"
                    color="rgb(25, 190, 107)" 
                    @click.stop="createHandler(item)" 
                    title="新建数据分析表"/>
                  <Icon
                    v-if="showCreateTask"
                    type="md-create"
                    size="20"
                    color="rgb(25, 190, 107)"
                    @click.stop="editHandler(item)"
                    title="编辑数据分析表"/>
                  <Icon
                    v-if="showCreateTask"
                    type="md-trash"
                    size="20"
                    color="rgb(237, 64, 20)"
                    @click.stop="deleteHandler(item)"
                    title="删除数据分析表"/>
                </div>
              </template>
              <MenuItem :name="opt.id" v-for="(opt,index) in item.dataTables" :key="opt.id">
                <p class="sub-opt">{{opt.dataTableName}}</p>
                <div class="icon-box">
                  <Icon type="md-create" size="20" color="rgb(25, 190, 107)" 
                    @click.stop="editHandler(opt)" title="编辑数据分析子表"/>
                  <Icon type="md-trash" size="20" color="rgb(237, 64, 20)" 
                    @click.stop="deleteHandler(opt)" title="删除数据分析子表"/>
                </div>
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
      </Col>
      <Col span="18" style="height:100%;">
        <div style="margin-bottom: 20px; text-align:right;  ">
          <Button 
            type="warning" 
            style="float: left; margin-left: 10px;" 
            v-if="!showCreateTask" 
            @click="editReport"
          >报告生成</Button>
          <Button type="primary" @click="configField">选择数据源</Button>
          <Button type="primary" style="margin-left: 10px;" @click="highSearch">高级检索</Button>
          <Button type="primary" style="margin-left: 10px;" @click="exportTableData">导出数据</Button>
          <Button style="margin-left: 10px;" @click="$router.go(-1)">返回上一步</Button>
        </div>
        <div style="max-height: 87%; overflow-y: auto;">
          <analysis-data-list ref="configAnalysis" :dataTableId="currentTemplate" :columnData="columnData"></analysis-data-list>
        </div>
      </Col>
    </Row>
    <!-- 高级检索 -->
    <Modal v-model="highFlag" :closable="true" title="高级检索" width="1000">
      <Row :gutter="10" align="middle" v-for="(item,index) in queryWheres" :key="item.order" style="margin-bottom:10px;">
        <Col span="6">
          <Select v-model="item.dataElement">
            <Option v-for="item in checkedTree" :key="item.id" :value="JSON.stringify(item)" :label="item.dataElementName"></Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="item.queryOperation">
            <Option v-for="item in operationEnum" :key="item.value" :value="item.value" :label="item.label"></Option>
          </Select>
        </Col>
          <Col span="5">
          <Input placeholder="请输入对应值" clearable v-model="item.value"></Input>
        </Col>
          <Col span=4>
          <Select v-model="item.nextOperation">
            <Option value="AND" label="并且"></Option>
            <Option value="OR" label="或者"></Option>
          </Select>
        </Col>
          <Col span="4">
          <div style="text-align:center;">
            <Button icon="md-add" title="增加检索条件" size="small" style="margin-right:10px" @click="addQuery"></Button>
            <Button icon="md-remove" title="删除检索条件" size="small" @click="deleteQuery(index)"></Button>
          </div>
        </Col>
      </Row>
      <div style="text-align: center;">
        <Button @click="sureSearch" type="primary" style="margin-right: 40px;">确定</Button>
        <Button @click="cancelSearch">清空</Button>
      </div>
      <div slot="footer">
        <div>
          <div style="margin: 10px 0px;">
            <span style="float: left; font-size: 15px;">检索记录</span>
            <Button @click="regressionOriginalTable" size="small" type="error">撤销所有条件，回归原始表</Button>
          </div>
          <div>
            <Table :columns="moreSelectTable" :data="moreSelectRecord"></Table>
          </div>
          <div style="text-align:center;margin-top:10px;">
            <Page
              :total="totalSize"
              :current='currentPage'
              :page-size='5'
              @on-change="changePage"
              show-total
              show-elevator
              prev-text="上一页" 
              next-text="下一页"
            />
          </div>
        </div>
      </div>
    </Modal>
    <!-- 新增数据分析表 -->
    <Modal v-model="dataAnalysis" title=" " width="800">
      <Form :model="formItem" :label-width="100">
        <Form-item label="数据分析名称">
          <Input v-model="formItem.analysisName" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="说明">
          <Input v-model="formItem.explain" type="textarea"placeholder="请输入"></Input>
        </Form-item>
      </Form>
      <div slot="footer" style="text-align: center;">
        <Button @click="addAnalysis">确定</Button>
        <Button @click="dataAnalysis = false">返回</Button>
      </div>
    </Modal>
    <!-- 新增数据分析子表 -->
    <Modal v-model="dataSubAnalysis" title=" " width="800">
      <Form :model="subformItem" :label-width="100">
        <Form-item label="数据分析名称">
          <Input v-model="subformItem.subAnalysisName" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="说明">
          <Input v-model="subformItem.subExplain" type="textarea"placeholder="请输入"></Input>
        </Form-item>
      </Form>
      <div slot="footer" style="text-align: center;">
        <Button @click="addSubAnalysis">确定</Button>
        <Button @click="dataSubAnalysis = false">返回</Button>
      </div>
    </Modal>
    <!-- 编辑数据分析表 -->
    <Modal v-model="editDataAnalysis" title=" " width="800">
      <Form :model="editFormItem" :label-width="100">
        <Form-item label="数据分析名称">
          <Input v-model="editFormItem.editAnalysisName" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="说明">
          <Input v-model="editFormItem.editExplain" type="textarea"placeholder="请输入"></Input>
        </Form-item>
      </Form>
      <div slot="footer" style="text-align: center;">
        <Button @click="editAnalysis">确定</Button>
        <Button @click="editDataAnalysis = false">返回</Button>
      </div>
    </Modal>
    <!-- 编辑数据分析子表 -->
    <Modal v-model="editSubDataAnalysis" title=" " width="800">
      <Form :model="editSubFormItem" :label-width="100">
        <Form-item label="数据分析名称">
          <Input v-model="editSubFormItem.editSubAnalysisName" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="说明">
          <Input v-model="editSubFormItem.editSubExplain" type="textarea"placeholder="请输入"></Input>
        </Form-item>
      </Form>
      <div slot="footer" style="text-align: center;">
        <Button @click="editSubAnalysis">确定</Button>
        <Button @click="editSubDataAnalysis = false">返回</Button>
      </div>
    </Modal>
    <!-- 删除数据分析表 确认 -->
    <Modal v-model="showDeleteButton" title="删除数据分析表" width="400">
      <div style="text-align: center; font-size: 18px;">是否删除数据分析表?</div>
      <div slot="footer" style="text-align: center;">
        <Button @click="checkedDeleteAnalysis">确定</Button>
        <Button @click="showDeleteButton = false">返回</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {ResearchProjectApi,TemplateApi,DataAnalysisApi} from "@/api/"
import AnalysisDataList from './component/Analysis-data-list'
import { mapGetters, mapMutations } from 'vuex';
import toExcel from './excelOut/excelOut'
import Vue from 'vue'

Vue.prototype.$toExcel = toExcel;
export default {
  name: "dataPreview1111",
  data() {
    return {
      dataTableId: '',
      projectName: "", //查询条件-任务名称
      projectList: [],
      currentTemplate: "",
      columnData: [],
      checkedTree:[],//树行结构中选中字段
      highFlag:false,//高级检索状态
      queryWheres:[{
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
        nextOperation:"AND" 
      }],
      operationEnum: [ //比较条件
        {value: "EQUAL",label: "等于"},
        {value: "NOT_EQUAL",label: "不等于"},
        {value: "GREAT_THAN",label: "大于"},
        {value: "LESS_THAN",label: "小于"},
        {value: "GREAT_EQUAL_THAN",label: "大于等于"},
        {value: "LESS_EQUAL_THAN",label: "小于等于"},
        {value: "NOT_LIKE",label: "不相似"},
        {value: "LIKE",label: "相似"} ,
        {value: "IS_NULL",label: "值为空"},
        {value: "IS_NOT_NULL",label: "值不为空"}
      ],
      moreSelectTable: [
        {title: '时间', key: 'createDate'},
        {title: '选择字段', key: 'column'},
        {
          title: '条件',
          key: 'queryOperation',
          render: (h, params) => {
            const row = params.row
            if(row.queryOperation === 'EQUAL'){
              return h('div', [
                h('span', '等于')
              ])
            } else if(row.queryOperation === 'NOT_EQUAL'){
              return h('div', [
                h('span', '不等于')
              ])
            } else if(row.queryOperation === 'GREAT_THAN'){
              return h('div', [
                h('span', '大于')
              ])
            } else if(row.queryOperation === 'LESS_THAN'){
              return h('div', [
                h('span', '小于')
              ])
            } else if(row.queryOperation === 'GREAT_EQUAL_THAN'){
              return h('div', [
                h('span', '大于等于')
              ])
            } else if(row.queryOperation === 'LESS_EQUAL_THAN'){
              return h('div', [
                h('span', '小于等于')
              ])
            } else if(row.queryOperation === 'NOT_LIKE'){
              return h('div', [
                h('span', '不相似')
              ])
            } else if(row.queryOperation === 'LIKE'){
              return h('div', [
                h('span', '相似')
              ])
            } else if(row.queryOperation === 'IS_NULL'){
              return h('div', [
                h('span', '值为空')
              ])
            } else if(row.queryOperation === 'IS_NOT_NULL'){
              return h('div', [
                h('span', '值不为空')
              ])
            }
          }
        },
        {
          title: '对应值',
          key: 'oldValue',
          render: (h, params) => {
            const row = params.row
            if(row.column === '性别' && row.oldValue === '1'){
              return h('div', [
                h('span', '女')
              ])
            } else if(row.column === '性别' && row.oldValue === '0'){
              return h('div', [
                h('span', '男')
              ])
            } else{
              return h('div', [
                h('span', row.oldValue)
              ])
            }
          }
        },
        {
          title: '条件关系',
          key: 'nextOperation',
          render: (h, params) => {
            const row = params.row
            if(row.nextOperation === 'AND'){
              return h('div', [
                h('span', '并且')
              ])
            } else if(row.nextOperation === 'OR'){
              return h('div', [
                h('span', '或者')
              ])
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  ghost:true
                },
                on: {
                  click: () => {
                    this.showReuse(params.row)
                  }
                }
              }, '复用')
            ])
          }
        },
      ], // 筛选记录表头
      moreSelectRecord: [], // 筛选记录数据
      dataAnalysis: false, // 新增数据分析
      dataSubAnalysis: false, // 新增数据分析子表
      showDeleteButton: false, // 删除数据分析表 确认
      editDataAnalysis: false, // 编辑数据分析表 弹窗
      editSubDataAnalysis: false, // 编辑数据分析子表 弹窗
      handlerId: '', // 删除数据分析表ID
      formItem: { // 新增数据分析表弹窗
        analysisName: '',
        explain: ''
      },
      subformItem: { // 新增数据分析子表弹窗
        subAnalysisName: '',
        subExplain: ''
      },
      editFormItem: { // 编辑数据分析表弹窗
        editAnalysisName: '',
        editExplain: ''
      },
      editSubFormItem: { // 编辑数据分析子表弹窗
        editSubAnalysisName: '',
        editSubExplain: ''
      },
      folderFlag: '', // 判断新增数据是否为目录
      parentId: '', // 父表ID
      analysisMainName: '', // 数据分析表名称
      analysisSubName: '', // 数据分析子表名称
      totalSize: 1, // 总页数
      currentPage: 1, //当前页
      pageSize: 5, // 每页条数
      showCreateTask: false, // 新建按钮
      menuActive: '0', // 单任务和多任务样式控制
      // projectFlag: '0', // 0是单任务  1是多任务
      projectId: '', // 单任务列表ID
      projectTaskId: '', //
    }
  },
  methods: {
    ...mapMutations([
      'setProjectFlag'
    ]),
    getAllProjects() { // 获取科研任务列表
      if(this.menuActive === '0'){
        let obj = {
          page: 0, //当前页
          size: 99999 //每页显示条数
        }
        if (this.projectName) {
          obj.dataTableName = this.projectName
        }
        obj.projectFlag = '0'
        obj.projectId = this.projectId
        TemplateApi.getDataAnalysis(obj).then(res => {
          if(res.data.code == '1'){
            this.projectList = res.data.data
          } else {
            this.$Message.error({
              content: "未获取任务列表,请刷新重试",
              duration: 3
            })
          }
        }).catch(err => {
          this.$Message.error({
            content: "未获取任务列表,请刷新重试",
            duration: 3
          })
        })
      } else {
        let obj = {
          page: 0, //当前页
          size: 99999 //每页显示条数
        }
        if (this.projectName) {
          obj.dataTableName = this.projectName
        }
        obj.projectFlag = '1'
        TemplateApi.getDataAnalysis(obj).then(res => {
          if(res.data.code == '1'){
            this.projectList = res.data.data
          } else {
            this.$Message.error({
              content: "未获取任务列表,请刷新重试",
              duration: 3
            })
          }
        }).catch(err => {
          this.$Message.error({
            content: "未获取任务列表,请刷新重试",
            duration: 3
          })
        })
      }
    },
    singleTask(){ // 单任务
      this.menuActive = '0'
      this.showCreateTask = false
      this.setProjectFlag('0')
      this.getAllProjects()
    },
    multiTask(){ // 多任务
      this.menuActive = '1'
      this.showCreateTask = true
      this.setProjectFlag('1')
      this.getAllProjects()
    },
    // 新增数据分析表按钮
    addAnalysisTable(){
      this.formItem.analysisName = ''
      this.formItem.explain = ''
      this.dataAnalysis = true
      this.folderFlag = 1
    },
    // 新增数据分析表  确定
    addAnalysis(){
      let params = {
        projectFlag: this.projectFlag,
        folderFlag: 1,
        dataTableName: this.formItem.analysisName,
        description: this.formItem.explain,
        dataTables: []
      }
      ResearchProjectApi.getCreateDataAnalysis(params).then(res => {
        if(res.data.code === '1'){
          this.getAllProjects()
          this.dataAnalysis = false
        } else {
          this.$Message.error({
            content: "新增数据分析表失败",
            duration: 3
          })
        }
      }).catch(err => {
        this.$Message.error({
          content: "未获取任务列表,请刷新重试",
          duration: 3
        })
      })
    },
    searchByTerm() { // 根据条件查询科研任务列表
      this.getAllProjects()
    },
    changeTemplate(name) { //选中表单
      this.dataTableId = name
      this.currentTemplate = name;
      this.restData();
      this.checkedTree = []
      this.projectList.forEach(item => {
        if(item.dataTables){
          item.dataTables.forEach(keys => {
            if(keys.id === name){
              if(item.researchProject){
                this.projectTaskId = item.researchProject.id
              }
              this.analysisMainName = item.dataTableName
              this.analysisSubName = keys.dataTableName
              this.$emit('analysisMainNameFnc', this.analysisMainName)
              this.$emit('analysisSubNameFnc', this.analysisSubName)
            }
          })
        }
      })
    },
    // 数据分析表新增子表
    createHandler(item){
      if(item.folderFlag === 1){
        this.subformItem.subAnalysisName = ''
        this.subformItem.subExplain = ''
        this.parentId = item.id
        this.dataSubAnalysis = true
      } else {
        this.$Message.error({
          content: '此表为数据表，不能添加子表',
          duration: 3
        })
      }
    },
    // 数据分析表新增子表 确定
    addSubAnalysis(){
      let params = {
        folderFlag: 0,
        dataTableName: this.subformItem.subAnalysisName,
        description: this.subformItem.subExplain
      }
      this.dataSubAnalysis = false
      ResearchProjectApi.getCreateSubDataAnalysis(this.parentId, params).then(res => {
        if(res.status === 200){
          this.getAllProjects()
        } else {
          this.$Message.error({
            content: '创建子表失败，请重试',
            duration: 3
          })
        }
      }).catch(err => {
        this.$Message.error({
          content: "创建子表失败，请重试",
          duration: 3
        })
      })
    },
    editHandler(item){ // 编辑数据分析表
      if(item.folderFlag === 0){
        this.handlerId = item.id
        this.editSubDataAnalysis = true
        this.editSubFormItem.editSubAnalysisName = item.dataTableName
        this.editSubFormItem.editSubExplain = item.description
      } else if(item.folderFlag === 1){
        this.handlerId = item.id
        this.editDataAnalysis = true
        this.editFormItem.editAnalysisName = item.dataTableName
        this.editFormItem.editExplain = item.description
      }
    },
    editAnalysis(){ // 编辑数据分析表 确定
      let params = {
        id: this.handlerId,
        folderFlag: 1,
        projectFlag: this.projectFlag,
        dataTableName: this.editFormItem.editAnalysisName,
        description: this.editFormItem.editExplain
      }
      ResearchProjectApi.getCreateDataAnalysis(params).then(res => {
        if(res.status === 200){
          this.getAllProjects()
          this.editDataAnalysis = false
        } else {
          this.$Message.error({
            content: "修改数据分析表失败",
            duration: 3
          })
        }
      }).catch(err => {
        this.$Message.error({
          content: "未获取任务列表,请刷新重试",
          duration: 3
        })
      })
    },
    editSubAnalysis(){ // 编辑数据分析子表 确定
      let params = {
        id: this.handlerId,
        folderFlag: 0,
        projectFlag: this.projectFlag,
        dataTableName: this.editSubFormItem.editSubAnalysisName,
        description: this.editSubFormItem.editSubExplain
      }
      ResearchProjectApi.getEditSubDataAnalysis(params).then(res => {
        if(res.status === 200){
          this.getAllProjects()
          this.editSubDataAnalysis = false
        } else {
          this.$Message.error({
            content: '编辑子表失败，请重试',
            duration: 3
          })
        }
      }).catch(err => {
        this.$Message.error({
          content: "编辑子表失败，请重试",
          duration: 3
        })
      })
    },
    deleteHandler(item){ // 删除数据分析表
      if(item.folderFlag === 0){
        this.handlerId = item.id
        this.$Modal.confirm({
          title:'删除数据表分组',
          content:'您确定要删除此数据表分组吗？',
          onOk:()=>{
            this.checkedDeleteAnalysis()
          }
        })
      } else if(item.folderFlag === 1){
        if(item.dataTables.length === 0){
          this.handlerId = item.id
          this.$Modal.confirm({
          title:'删除数据表',
          content:'您确定要删除此数据表吗？',
          onOk:()=>{
            this.checkedDeleteAnalysis()
          }
        })
        } else {
          this.$Message.error({
            content: '请先删除数据分析子表',
            duration: 4
          })
        }
      }
    },
    checkedDeleteAnalysis(){ // 删除数据分析表 确认
      let params = this.handlerId
      ResearchProjectApi.getDeleteDataAnalysis(params).then(res => {
        if(res.status === 200){
          this.getAllProjects()
          this.showDeleteButton = false
        } else {
          this.$Message.error({
            content: '删除失败',
            duration: 4
          })
        }
      })
    },
    editReport(){ // 报告生成
      if (this.currentTemplate == "") {
        this.$Message.error({
          content: "请先选择表单",
          duration: 4
        })
        return
      } else {
        let id = ''
        this.projectList.forEach(item => {
          item.dataTables.forEach(key => {
            if(key.id === this.currentTemplate){
              id = key.researchProject
            }
          })
        })
        this.$router.push({
          name: "dataReportExhibition",
          params: {
            projectId: id
          }
        })
      }
    },
    configField() { // 选择数据源
      if (this.currentTemplate == "") {
        this.$Message.error({
          content: "请先选择表单",
          duration: 2
        })
        return
      } else {
        this.$emit('changeDataSources', '2', this.projectTaskId)
        this.$emit('sendAnalysisDataTableId', this.dataTableId)
      }
    },
    restData(){//初始化数据
      this.queryWheres = [{
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
        nextOperation:"AND" 
      }]
    },
    highSearch(){ // 高级检索
      if (this.currentTemplate == "") {
        this.$Message.error({
          content: "请先选择表单",
          duration: 2
        })
        return
      } else {
        this.queryWheres = [{
          order:this.queryWheres.length,
          dataElement:null,
          queryOperation:"EQUAL",
          value:null,
          nextOperation:"AND"
        }]
        this.initSelectData()
        this.highFlag = true;
        this.getSelectRecordList() // 高级检索记录
      }
    },
    initSelectData(){ // 初始化筛选条件
      this.checkedTree = []
      let num1 = this.$refs.configAnalysis.columnDefs
      let totalTableDataTree = this.$refs.configAnalysis.tableTemplate
      if(totalTableDataTree){
        totalTableDataTree = JSON.parse(totalTableDataTree)
      }
      num1.forEach(item => {
        totalTableDataTree.dataTableBuildElementVos.forEach(keys => {
          keys.dataElements.forEach(par => {
            if(par.firstElement){
              if(item.key === par.dataElement.id && par.firstElement.id === null){
                if(par.newElementName){
                  par.dataElement.dataElementName = par.newElementName
                }
                this.checkedTree.push(par.dataElement)
              }
            } else {
              if(item.key === par.dataElement.id){
                if(par.newElementName){
                  par.dataElement.dataElementName = par.newElementName
                }
                this.checkedTree.push(par.dataElement)
              }
            }
          })  
        })
      })
    },
    getSelectRecordList(){ // 高级检索记录
      let obj = {
        page: this.currentPage-1,
        size: this.pageSize
      }
      let params = {
        id: this.dataTableId
      }
      ResearchProjectApi.getInitRecordData(obj, params).then(res => {
        if(res.status === 200){
          this.totalSize = res.data.counts
          this.moreSelectRecord = res.data.data
          this.moreSelectRecord.forEach(item => {
            item.createDate = item.createDate.substring(0, 10) + ' ' + item.createDate.substring(11, 19)
          })
        } else {
          this.$Message.error({
            content: "数据请求失败！",
            duration: 2
          })
        }
      })
    },
    changePage(index){ // 高级检索分页
      this.currentPage = index;
      this.getSelectRecordList()
    },
    exportTableData(){ // 导出数据
      if (this.currentTemplate == "") {
        this.$Message.error({
          content: "请先选择表单",
          duration: 2
        })
        return
      } else {
        let th = this.$refs.configAnalysis.columnDefs
        let filterVal = this.$refs.configAnalysis.tableData
        let arr = []
        let col = []
        th.forEach(item => {
          arr.push(item.key)
          for(let i in filterVal[0]){
            if(item.key === i){
              col.push(i)
            }
          }
        })
        const data = filterVal.map(v => 
          col.map(k =>
            v[k]
          )
        );
        const [fileName, fileType, sheetName] = [this.analysisSubName, 'xlsx', this.analysisSubName];
        this.$toExcel({th, data, fileName, fileType, sheetName})
      }
    },
    returnProjectFill(){ // 返回任务填报查询
      this.$router.push({
        name: 'projectFillFind'
      })
    },
    showReuse(params){ // 筛选记录复用
      this.queryWheres = []
      this.checkedTree.forEach(item => {
        if(item.dataElementName === params.column){
          this.queryWheres.push({
            order:this.queryWheres.length,
            dataElement: JSON.stringify(item),
            queryOperation: params.queryOperation,
            value: params.oldValue,
            nextOperation: params.nextOperation
          })
        }
      })
    },
    addQuery(){//增加筛选条件
      if(this.queryWheres.length >= 2){
        this.$Message.error('最多为两个筛选条件')
      } else {
        this.queryWheres.push({
          order:this.queryWheres.length,
          dataElement:null,
          queryOperation:"EQUAL",
          value:null,
          nextOperation:"AND"
        })
      }
    },
    deleteQuery(index){//删除筛选条件
      if(this.queryWheres.length <= 1){
        this.$Message.error({
          content:"至少一个筛选条件",
          duration:2
        })
      }else{
        this.queryWheres.splice(index,1)
      }
    },
    sureSearch(){ // 确定高级检索
      let querylist = JSON.parse(JSON.stringify(this.queryWheres));
      for(let i =0;i<querylist.length;i++){ // 验证填写完整性
        let flag =Object.values(querylist[i]).some(item=>{
          return item == null
        })
        if(flag){
          if(querylist[i].queryOperation === 'IS_NULL'){
            this.searchInterfaceApi(this.queryWheres)
          } else if(querylist[i].queryOperation === 'IS_NOT_NULL'){
            this.searchInterfaceApi(this.queryWheres)
          } else {
            this.$Message.error({
              content:"请将筛选条件填写完整",
              duration:2
            })
          }
          break
          return
        } else if ((querylist[i].queryOperation === 'GREAT_THAN' ||
                    querylist[i].queryOperation === 'LESS_THAN' ||
                    querylist[i].queryOperation === 'GREAT_EQUAL_THAN' ||
                    querylist[i].queryOperation === 'LESS_EQUAL_THAN') &&
                    (/^[0-9]+$/.test(parseInt(querylist[i].value)) === false)){ // 判断 大于，小于，大于等于，小于等于是数字
          this.$Message.error({
            content: "对应值应为数字",
            duration: 4
          })
        } else {
          if(querylist[i].queryOperation === 'IS_NULL' && querylist[i].value !== ''){
            this.$Message.error({
              content:"对应值应为空值",
              duration:2
            })
          } else {
            let params = {
              queryWheres: [],
              elements: []
            }
            this.queryWheres.forEach(item => {
              let value = ''
              let num = item.value.split(',')
              for(let i = 0; i < num.length; i++){
                JSON.parse(item.dataElement).dataValues.forEach(index => {
                  if(num[i] === index.dataValueName){
                    num[i] = index.dataValue
                  }
                })
              }
              value = num.join(',')
              params.queryWheres.push({
                dataElement: JSON.parse(item.dataElement),
                nextOperation: item.nextOperation,
                order: item.order,
                queryOperation: item.queryOperation,
                value: value
              })
              params.elements.push(JSON.parse(item.dataElement))
            })
            ResearchProjectApi.getSelectRecord(this.dataTableId, params).then(res => {
              if(res.status === 200){
                this.columnData = res.data.data
                this.highFlag = false
              } else {
                this.$Message.error({
                  content:"数据筛选失败，请重新筛选！",
                  duration:2
                })
              }
            })
            this.$refs.configAnalysis.changeLoadColumn()
          }
        }
      }
    },
    searchInterfaceApi(val){
      let params = {
        elements: [],
        queryWheres: []
      }
      val.forEach(item => {
        params.queryWheres.push({
          dataElement: JSON.parse(item.dataElement),
          nextOperation: item.nextOperation,
          order: item.order,
          queryOperation: item.queryOperation,
          value: item.value
        })
        params.elements.push(JSON.parse(item.dataElement))
      })
      ResearchProjectApi.getSelectRecord(this.dataTableId, params).then(res => {
        if(res.status === 200){
          this.columnData = res.data.data
          this.highFlag = false
        } else {
          this.$Message.error({
            content:"数据筛选失败，请重新筛选！",
            duration:2
          })
        }
      })
      this.$refs.configAnalysis.changeLoadColumn()
    },
    regressionOriginalTable(){ // 撤销所有条件，回归原始表
      this.$refs.configAnalysis.loadTable()
      this.highFlag = false
    },
    cancelSearch(){ // 清空筛选条件
      this.queryWheres = [{
        order:this.queryWheres.length,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
        nextOperation:"AND"
      }]
    },
  },
  mounted() {
    // 单任务和多任务判断
    if(this.$route.params.projectFlag){
      this.menuActive = '0'
      this.setProjectFlag('0')
    } else {
      if(this.projectFlag === '0'){
        this.menuActive = '0'
      } else {
        this.menuActive = '1'
      }
    }
    
    if(this.menuActive === '0'){
      this.showCreateTask = false
    } else {
      this.showCreateTask = true
    }

    this.projectId = this.$route.params.researchProjectId
    this.getAllProjects();
  },
  computed: {
    ...mapGetters([
      'projectFlag',
    ]),
  },
  components: {
    AnalysisDataList
  }
}
</script>
<style lang="less" scoped>
.menu-task-type{
  background: #fff;
  color: #2D8CF0;
  text-align: center;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  margin-bottom: 20px;
  border: 1px solid #2D8CF0;
  cursor: pointer;
}
.active{
  background: #2D8CF0;
  color: #fff;
}
.menu-box {
  max-height: 86%;
  overflow: auto;
  .sub-item {
    display: inline-block;
    width: 45%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon-box{
    float:right;
    margin-right: 24px;
  }
  .sub-opt{
    display: inline-block;
    width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sub-image{
    height: 15px;
    width: 15px;
    position: absolute;
    right: -25px;
    top: -16px;
  }
  .sub-handler{
    height: 15px;
    width: 15px;
    position: absolute;
    right: -30px;
    top: -18px;
  }
  .sub-dialog{
    z-index: 999;
    position: absolute;
    top: 0px;
    right: 3px;
    color: #000;
    width: 35px;
    font-size: 13px;
    background: #ccc;
    .sub-create{
      cursor: pointer;
      height: 25px;
      line-height: 25px;
      text-align: center;
    }
    .sub-del{
      cursor: pointer;
      height: 25px;
      line-height: 25px;
      text-align: center;
    }
  }
}
</style>
