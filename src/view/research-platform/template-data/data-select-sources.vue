<style lang="less">
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
  <div class="sub-sources">
    <div class="sub-button">
      <Row :gutter="10">
        <Col span="12">
          <div style="width: 100%; height: 20px;font-size: 14px;">
            {{ analysisMainName }} > {{ analysisSubName }}
          </div>
        </Col>
        <Col span="3">
          <Button type="primary" long @click="addNewData">新增数据源</Button>
        </Col>
        <Col span="3">
          <Button type="primary" long @click="macthSyllable">字段匹配</Button>
        </Col>
        <Col span="3">
          <Button type="primary" long @click="dataGeneration">数据生成</Button>
        </Col>
        <Col span="3">
          <Button long @click="backFirstLevel">返回上一级</Button>
        </Col>
      </Row>
    </div>
    <div class="sub-container">
      <Row :gutter="10">
        <Col span="8" v-for="(item,index) in dataSource" :key="index">
          <div class="sub-box">
            <Cascader v-model="item.projectListId" :data="projectList" :clearable="false" @on-change="selectTemplate($event,index)"></Cascader>
            <div class="checkBox">
              <div style="margin-left: 20px; float: left; color: #2920FF; cursor: pointer;" 
                @click="selectedSyllable(item, index)"
              >选择字段</div>
              <div
                v-if="index !== 0"
                style="float: right;margin-right: 20px; color: #FF2222; cursor: pointer;"
                @click="deleteDataSource(index)"
              >删除</div>
            </div>
            <div class="checkBox-group">
              <CheckboxGroup v-model="item.checkMenuList">
                <Checkbox
                  v-if="!(optTwo.children.length !== 0 && optTwo.parent === 'self')"
                  v-for='(optTwo,indexTwo) in item.checkedArr'
                  :key="indexTwo"
                  :label="optTwo.dataElementName"
                >{{optTwo.dataElementName}}</Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="sub-button">
      <Row :gutter="10" type='flex' justify='end'>
        <Col span="3">
          <Button span='3' type="primary" long @click="removeDuplicateData">数据去重</Button>
        </Col>
        <Col span="3">
          <Button type="primary" style="width: 100%" @click="dataReplaceMent">数据替换</Button>
        </Col>
        <Col span="3">
          <Button type="primary" style="width: 100%" @click="dataDelete">数据删除</Button>
        </Col>
        <Col span="3">
          <Button type="primary" style="width: 100%" @click="operationHistory">操作历史</Button>
        </Col>
        <!-- <Col span="3">
          <Button style="width: 100%" @click="denerateReports">生成报表</Button>
        </Col> -->
      </Row>
    </div>
    <div class="sub-table">
      <analysis-data-list ref="dataPreview" :dataTableId="dataTableId" :columnData="columnData"></analysis-data-list>
    </div>
    <!-- 选取字段 -->
    <Modal v-model="configFlag" :closable='false' title="选择字段" width="800"> 
      <Tree show-checkbox ref="configTree" :data="treeData" style="max-height:500px;overflow:auto;"></Tree>
      <div slot="footer">
        <Button @click="sureConfig" type="primary">确定</Button>
        <Button @click="emptyConfig">清空</Button>
        <Button @click="closeConfig">返回</Button>
      </div>
    </Modal>
    <!-- 字段匹配弹窗 -->
    <Modal v-model="matchField" :closeable="false" title="字段匹配" width="800">
      <div class="main-filed">
        <div class="macth-filed">
          <ul>
            <li v-for="(item,index) in initMatchData" :key="index">
              <div v-if='item.matchName'>
                {{ item.matchName }}表中相同的已选字段
              </div>
              <div class="check-filed">
                <RadioGroup v-model="item.buttonMatch"  @on-change="selectedChange($event,item,index)">
                  <Radio
                    disabled
                    v-if="optTwo.disabled === true"
                    v-for='(optTwo,indexTwo) in item.selectFiled'
                    :key="indexTwo"
                    :label="JSON.stringify(optTwo)"
                  >{{optTwo.dataElementName}}</Radio>
                  <Radio
                    v-if="optTwo.disabled === false"
                    v-for='(optTwo,indexTwo) in item.selectFiled'
                    :key="indexTwo"
                    :label="JSON.stringify(optTwo)"
                  >{{optTwo.dataElementName}}</Radio>
                </RadioGroup>
              </div>
            </li>
          </ul>
        </div>
        <div class="main-footer">
          <Button @click="addMatchData">添加</Button>
          <Button @click="clearMatchData" style="margin-left: 20px;">清空</Button>
        </div>
        <div class="add-footer">已添加关联信息</div>
      </div>
      <div slot="footer" class="footer-ending">
        <div class="footer-header">
          <Table border :columns="addProjectCol" :data="addProjectName"></Table>
        </div>
        <Button @click="checkMatchField">确定</Button>
        <Button @click="matchField=false" style="margin-left: 20px;">返回</Button>
      </div>
    </Modal>
    <!-- 数据替换弹窗 -->
    <Modal v-model="showReplace" :closeable="false" title="数据替换" width="800">
      <div class="main-replace">
        <div class="main-condition">
          <p @click="directReplace" :class="active === '1' ? 'aclass' : ''">直接替换</p>
          <p style="margin-left: 10px;" @click="conditionReplace" :class="active === '2' ? 'aclass' : ''">按条件替换</p>
        </div>
        <div style="clear: both"></div>
        <div class="main-select-field" v-show="!replaceWheres">
          <div>
            <div style="width: 60px; font-size: 15px; float: left;">选择字段</div>
            <Select style="width: 200px; margin-left: 10px;"
              v-model="mainSelectField"
              :label-in-value='true'
              @on-change="mainChangeList"
            >
              <Option v-for="item in selectFieldList" :value="item.key" :key="item.title">{{item.title}}</Option>
            </Select>
          </div>
          <div style="margin: 10px 0px; padding: 10px 0px; background: #F2F2F2;">
            <div v-show="noDataList" style="margin-left: 20px; padding: 20px 0px; font-size: 13px;">暂无数据</div>
            <CheckboxGroup v-show="!noDataList" v-model="disabledGroup" @on-change='directStead' style="margin: 20px 0px;">
              <Checkbox v-for="(item,index) in fieldDataList" :key="index" :label="item.name">{{item.name}}</Checkbox>
              <Checkbox label="空值"></Checkbox>
            </CheckboxGroup>
          </div>
          <div>
            <div style="width: 60px; font-size: 15px;  float: left;">修改为</div>
            <Input style="width: 200px; margin-left: 10px;" v-model="changeModelData"></Input>
          </div>
        </div>
        <Row v-show="replaceWheres" :gutter="10" align="middle" style="margin-bottom:10px;" v-for="(item,index) in queryWheresReplace" :key="item.order">
          <Col span="6">
            <Select v-model="item.dataElement" @on-change="mainChangeList" :label-in-value='true'>
              <Option v-for="item in selectFieldList" :key="item.title" :value="item.key">{{item.title}}</Option>
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
        <Row v-show="replaceWheres" :gutter="10" align="middle" style="margin-top: 20px;margin-bottom:10px;">
          <Col span="6">
            <Select v-model="dataOperateReplace" :label-in-value='true'>
              <Option v-for="item in selectFieldList" :key="item.title" :value="item.key">{{item.title}}</Option>
            </Select>
          </Col>
          <Col span="4">
            <div class="replace-change">修改为</div>
          </Col>
          <Col span="5">
            <Input placeholder="请输入替换值" v-model="inputChangeValue"></Input>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="sureSearch">确定</Button>
         <Button @click="cancelSearch">清空</Button>
        <Button @click="showReplace=false">返回</Button>
      </div>
    </Modal>
    <!-- 数据删除弹窗 -->
    <Modal v-model="showDelete" :closeable="false" title="数据删除" width="800">
      <div class="main-replace">
        <div class="main-condition">
          <p @click="directDelete" :class="delClass === '1' ? 'aclass' : ''">直接删除</p>
          <p style="margin-left: 10px;" @click="conditionDelete" :class="delClass === '2' ? 'aclass' : ''">按条件删除</p>
        </div>
        <div style="clear: both"></div>
        <div class="main-select-field" v-show="!deleteWheres">
          <div>
            <div style="width: 60px; font-size: 15px; float: left;">选择字段</div>
            <Select style="width: 200px; margin-left: 10px;"
              v-model="selectDataDelete"
              :label-in-value='true'
              @on-change="mainChangeList"
            >
              <Option v-for="item in selectFieldList" :value="item.key" :key="item.title">{{item.title}}</Option>
            </Select>
          </div>
          <div style="margin: 10px 0px; padding: 10px 0px; background: #F2F2F2;">
            <div v-show="noDataList" style="margin-left: 20px; padding: 20px 0px; font-size: 13px;">暂无数据</div>
            <CheckboxGroup v-show="!noDataList" v-model="disabledGroup" @on-change='directStead' style="margin: 20px 0px;">
              <Checkbox v-for="(item,index) in fieldDataList" :key="index" :label="item.name">{{item.name}}</Checkbox>
              <Checkbox label="空值"></Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <Row v-show="deleteWheres" :gutter="10" align="middle" v-for="(item,index) in queryWheres" :key="item.order" style="margin-bottom:10px;">
          <Col span="6">
            <Select v-model="item.dataElement" @on-change="mainChangeList" :label-in-value='true'>
              <Option v-for="item in selectFieldList" :key="item.title" :value="item.key">{{item.title}}</Option>
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
              <Button icon="md-add" title="增加检索条件" size="small" style="margin-right:10px" @click="addDelete"></Button>
              <Button icon="md-remove" title="删除检索条件" size="small" @click="deleteCheck(index)"></Button>
            </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="checkDelete">确定删除</Button>
         <Button @click="cancelDelete">清空</Button>
        <Button @click="showDelete=false">返回</Button>
      </div>
    </Modal>
    <!-- 操作历史 -->
    <Modal v-model="showHistory" :closeable="false" title="操作历史" width="800">
      <div>
        <Table border :columns="operatorHisCol" :data="operatorHisData"></Table>
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
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
import { DataAnalysisApi,ResearchProjectApi,TemplateApi  } from "@/api/"
import AnalysisDataList from './component/Analysis-data-list'
import * as Decide from '@/libs/tools.js'
export default {
  props: {
    dataTableId: {
      type: String,
      default:()=>{
        return {}
      }
    },
    projectTaskId: {
      type: String,
      default:()=>{
        return {}
      }
    },
    analysisMainName: { // 数据分析表
      type: String,
      default:()=>{
        return {}
      }
    },
    analysisSubName: { // 数据分析子表
      type: String,
      default:()=>{
        return {}
      }
    }
  },
  data(){
    let that = this
    return {
      operationEnum: [
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
      checkedTree: [], // 树行结构中选中字段
      projectList: [],//科研任务列表
      projectListName: '', //
      dataSource:[{
        dataArr: [],
        checkedArr: [],
        checkMenuList: [],
        projectListId: []
      }],
      initMatchData: [{
        id: '',
        buttonMatch: '',
        matchName: '',
        selectFiled: []
      }],
      addOptions: [],
      bigOptionsAll: [],
      singleBig: [],
      isActive: false,
      currentTemplate:"", // 选中表单
      configFlag: false, // 选取数据弹窗
      matchField: false, // 字段匹配弹窗
      showReplace: false, // 数据替换弹窗
      showDelete: false, // 数据删除弹窗
      showHistory: false, // 操作历史弹窗
      treeData: [],
      checkAllGroup: [],
      dataTableBuildElementVos: [{
        templateId: '',
        dataElements: [],
        templateName: ''
      }],
      dataTableVos: [],
      queryWheresReplace:[{ // 数据替换筛选
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
      }],
      queryWheres:[{ // 数据删除筛选
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
        nextOperation:"AND" 
      }],
      replaceWheres: false, // 替换 直接和条件的转换
      deleteWheres: false, // 删除 直接和条件的转换
      active: '1',
      delClass: '1',
      oneElements: {},
      mainSelectField: '', // 直接替换 选择字段
      selectDataDelete: '', //直接删除 选择字段
      selectFieldList: [], // 直接替换 选择字段列表
      selectRadioList: [],
      dataOperateReplace: '', // 条件替换 选择值
      inputChangeValue: '', // 条件替换 替换值
      disabledGroup: [], //
      changeModelData: '', // 修改为
      fieldDataList: [],
      oldReplaceVal: [], // 直接替换旧值
      noDataList: true, // 暂无数据
      operatorHisCol: [ // 操作历史列
        {title: '时间', key: 'createDate'},
        {title: '操作功能', key: 'action'},
        {title: '字段', key: 'column'},
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
          title: '值',
          key: 'value',
          render: (h, params) => {
            const row = params.row
            if(row.action === '数据删除'){
              return h('div', [
                h('span', row.value)
              ])
            } else if(row.action === '数据替换'){
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
        {title: '替换为', key: 'newValue'},
      ],
      operatorHisData: [], // 操作历史数据
      totalSize: 1, // 总页数
      currentPage: 1, //当前页
      pageSize: 5, // 每页条数
      columnData: [],
      valReplace: {}, // 替换值
      addProjectCol: [
        {
          title: '字段名称',
          key: 'newElementName',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  size: 'small',
                  value: that.addProjectName[params.index].newElementName
                },
                on: {
                  'on-change': (e, val) => {
                    that.changeFieldCol(e.target.value, params.row)
                    that.addProjectName[params.index].newElementName = JSON.stringify(val)
                  },
                },
              })
            ])
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
                },
                on: {
                  click: () => {
                    this.cancleFieldCol(params)
                  }
                }
              }, '取消')
            ])
          }
        }
      ],
      addProjectName: [],
      tableTemplate: {},
      validField: '', // 选择字段校验
      addField: [],
      serial: '', // 序号
      dataId:'',
      dataElementConfig: []
    }
  },
  methods: {
    getAllProjects() { // 获取科研任务列表
      this.$refs.dataPreview.loadTable()
      let obj = {
        pageNo: 0, //当前页
        pageSize: 99999 //每页显示条数
      }
      if (this.projectName) {
        obj.projectName = this.projectName
      }
      if(this.projectTaskId){
        obj.projectId = this.projectTaskId
      }
      ResearchProjectApi.getAllProjects(obj).then(res => {
        if (res.data.code === '1') {
          this.projectList = res.data.data.data;
          this.arrayToCasvard(this.projectList);
          this.getInitLoadTable()
        } else {
          this.$Message.error({
            content: "未获取任务列表,请刷新重试",
            duration: 3
          })
        }
      })
    },
    arrayToCasvard(arr){ //生成级联结构数据
      if(arr.length>0){
        arr.forEach(element => {
          element.value=element.id;
          element.label=element.researchProjectName;
          element.children = element.templateMasters;
          element.children.forEach(item=>{
            item.value=item.id;
            item.label=item.templateName;
          })
        });
      }
    },
    getInitLoadTable(){ // 初始化数据
      DataAnalysisApi.getDataTableById(this.dataTableId).then(res => {
        if(res.data.columnDefs && res.data.dataElementConfig){
          this.initVos = JSON.parse(res.data.columnDefs).dataTableBuildElementVos
          this.dataElementConfig = JSON.parse(res.data.dataElementConfig)
          this.dataId = res.data.dataId
          this.initMatchData = []
          this.dataTableBuildElementVos = this.initVos
          this.initSelectFiled(this.initVos) // 初始化选择字段、字段匹配
          this.initMatchTableData() // 初始化字段匹配表格字段
        }
      })
    },
    initSelectFiled(params){ 
      this.dataSource = []
      this.initMatchData = []
      for(let i = 0; i < params.length; i++){
        let id = ''
        this.dataSource.push({
          dataArr: [],
          checkedArr: [],
          checkMenuList: [],
          projectListId: []
        })
        this.initMatchData.push({
          id: '',
          buttonMatch: '',
          matchName: '',
          selectFiled: []
        })
        this.addProjectCol.splice(-2, 0, {
          title: '',
          key: '',
          // render:(h,param)=>{
          //   return h('div',[ h('span',param.row[param.column.key].dataElementName)])
          // }
        })
        params[i].dataElements.forEach(item => {
          item.dataElement.checked = true
          item.dataElement.disabled = false
          this.dataSource[i].dataArr.push(item.dataElement)
          this.dataSource[i].checkedArr.push(item.dataElement)
          this.dataSource[i].checkMenuList.push(item.dataElement.dataElementName)
          this.initMatchData[i].selectFiled.push(item.dataElement)
        })
        
        this.projectList.forEach(item => {
          item.templateMasters.forEach(param => {
            if(params[i].templateId === param.id){
              id = item.id
            }
          })
        })
        
        this.dataSource[i].projectListId.push(id)
        this.dataSource[i].projectListId.push(params[i].templateId)
        
        this.initMatchData[i].id = params[i].templateId
        this.initMatchData[i].matchName = params[i].templateName

        this.addProjectCol[i].title = params[i].templateName
        this.addProjectCol[i].key = params[i].templateId
        // this.addProjectCol[i].render=function(h,param){
        //   return h('div',[h('span',param.row[param.column.key].dataElementName)])
        // }

        this.addField[i] = params[i].templateId
      }
    },
    initMatchTableData(){ 
      let arr = []
      this.dataElementConfig.forEach(item => {
        let obj = {}
        for(let i in item){
          this.dataTableBuildElementVos.forEach(val => {
            if(i === val.templateId){
              for(let j in item){
                val.dataElements.forEach(param => {
                  if(param.dataElement.id === j){
                    obj[val.templateId] = param.dataElement.dataElementName
                    obj[param.dataElement.id] = param.dataElement.dataElementName
                    if(item.newElementName){
                      obj.newElementName = item.newElementName
                    } else {
                      obj.newElementName = param.dataElement.dataElementName
                    }
                  }
                })
              }
            }
          })
        }
        arr.push(obj)
      })
      this.addProjectName = arr
      this.isNull()
    },
    addNewData(){ // 新增数据源
      if(this.dataSource[this.dataSource.length -1].checkMenuList.length === 0){
        this.$Message.error({
          content: "请先选择字段",
          duration: 3
        })
      } else {
        this.treeData = []
        this.dataSource.push({
          dataArr: [],
          checkedArr: [],
          checkMenuList: [],
          projectListId: []
        })
        
        this.initMatchData.push({
          id: '',
          buttonMatch: '',
          matchName: '',
          selectFiled: []
        })

        this.dataTableBuildElementVos.push({
          templateId: '',
          dataElements: [],
          templateName: ''
        })

        this.addProjectCol.splice(-2, 0, {
          title: '',
          key: '',
          // render:(h,param)=>{
          //   return h('div',[ h('span',param.row[param.column.key].dataElementName)])
          // }
        })
      }
    },
    selectTemplate(event,index){ // 多级菜单选择
      this.currentTemplate = event[event.length-1]
      this.addField[index] = this.currentTemplate
      this.getAllFields(index)
      this.getMacthName(index, this.currentTemplate)
      this.dataTableBuildElementVos[index].templateId = this.currentTemplate
    },
    getAllFields(index) { // 获取选中表单字段
      TemplateApi.getAllFields({templateId: this.currentTemplate}).then(res => {
        // 配置字段树数据
        let data =JSON.parse(JSON.stringify(res.data.data));
        if(data){
          this.arrayToTree(data)
          this.treeData = data
        }
      })
    },
    arrayToTree(arr,id = "self"){ // 生成树结构数据
      if(arr){
        if(arr.length>0){
          arr.forEach(element => {
            element.title=element.dataElementName;
            if(!element.hasOwnProperty("checked")){
              element.checked = false;
            }
            element.expand = true;
            element.parent =id
            if(element.children.length>0){
              this.arrayToTree(element.children,element.dataElementCode)
            }
          });
        }
      }
    },
    getMacthName(index, id){ // 添加字段匹配数据
      if(this.addProjectCol.length === 2){
        this.addProjectCol.unshift({
          title: '',
          key: '',
          // render:(h,param)=>{
          //   return h('div',[ h('span',param.row[param.column.key].dataElementName)])
          // }
        })
      }
      this.projectList.forEach(item => {
        item.children.forEach(keys => {
          if(id === keys.id){
            this.initMatchData[index].id = keys.id
            this.initMatchData[index].matchName = keys.templateName
            this.addProjectCol[index].title = keys.templateName
            this.addProjectCol[index].key = keys.id
            this.dataTableBuildElementVos[index].templateName = keys.templateName
            // this.addProjectCol[index].render = function(h,param){
            //   return h('div',[ h('span',param.row[param.column.key].dataElementName)])
            // }
          }
        })
      })
    },
    selectedSyllable(item, index){ // 选择字段
      this.serial = index
      let id = ''
      if(this.initVos){
        id = item.projectListId[item.projectListId.length - 1]
        if(id){
          this.getInitTreeData(id, item)
        }
        this.isDuplicated(index)
      } else {
        id = this.addField[index]
        if(id){
          this.getInitTreeData(id, item)
        }
        this.isDuplicated(index)
      }
    },
    isDuplicated(index){
      if(this.addField){
        if(Decide.isRepeat(this.addField)){ // 判断选择表单是否重复
          this.$Message.error({
            content: "不能选择两个相同的表单进行字段匹配",
            duration: 3
          })
        } else {
          if(!this.addField[index]){
            this.$Message.error({
              content: "请先选择报表分组",
              duration: 3
            })
          } else {
            this.configFlag = true
          }
        }
      }
    },
    getInitTreeData(id, item){
      TemplateApi.getAllFields({templateId: id}).then(res => {
        // 配置字段树数据
        let data =JSON.parse(JSON.stringify(res.data.data));
        if(data){
          this.arrayToTree(data)
          this.treeData = data
          this.treeData.forEach(val => {
            if(val.children.length === 0){
              item.checkedArr.forEach(keys => {
                if(val.id === keys.id){
                  val.checked = true;
                }
              })
            } else {
              val.children.forEach(n => {
                item.checkedArr.forEach(keys => {
                  if(n.id === keys.id){
                    n.checked = true;
                  }
                })
              })
            }
          })
        }
      })
    },
    deleteDataSource(index){ // 删除数据源
      if(this.dataSource.length <= 1){
        this.$Message.error({
          content:"最少选择一个数据源",
          duration:3
        })
        this.dataSource = [{
          dataArr: [],
          checkedArr:[],
          checkMenuList:[]
        }]
        this.initMatchData = [{
          id: '',
          buttonMatch: '',
          matchName: '',
          selectFiled: []
        }]
        this.dataTableBuildElementVos = [{
          templateId: '',
          dataElements: [],
          templateName: ''
        }]
        this.addField = []
        this.addProjectCol = [{
          title: '',
          key: ''
        }]
      }else{
        this.addField.splice(index,1)
        this.dataSource.splice(index,1)
        this.initMatchData.splice(index,1)
        this.addProjectCol.splice(index,1)
        this.dataTableBuildElementVos.splice(index, 1)
      }
    },
    sureConfig(){ // 选择字段 确定
      let initTreeData = this.$refs.configTree.getCheckedNodes()
      let indelete = []
      for(let i=0;i<initTreeData.length;i++){
        if(initTreeData[i].parent !== 'self'){
          indelete.push(initTreeData[i].parent)
        }
      }
      indelete = Decide.unique(indelete)
      if(indelete.length >= 2){
        this.$Message.error({
          content: "带有子字段的父字段只能选一个",
          duration: 3
        })
      } else {
        this.initMatchData[this.serial].selectFiled = []
        this.dataTableBuildElementVos[this.serial].dataElements = []
        this.dataSource[this.serial].checkedArr = initTreeData
        this.dataSource[this.serial].checkMenuList = []
        this.dataSource[this.serial].checkedArr.forEach(item => {
          this.dataSource[this.serial].checkMenuList.push(item.dataElementName)
          if(item.children.length === 0){
            let objs = {
              dataElement: item,
              firstElement: {},
            }
            item.disabled = false
            this.initMatchData[this.serial].selectFiled.push(item)
            this.dataTableBuildElementVos[this.serial].dataElements.push(objs) // 组织dataElements数据
          }
        })
        this.configFlag = false
      }
    },
    emptyConfig(){ // 选择字段 清空树状结构
      this.dataSource[this.serial].checkedArr = []
      this.clearTree(this.treeData)
    },
    clearTree(trees){ // 选择字段 递归清空树状结构
      trees.forEach(item => {
        if(item.children.length !== 0){
          this.clearTree(item.children)
          item.checked = false
        } else {
          item.checked = false
        }
      })
    },
    closeConfig(){ // 选择字段 返回
      this.configFlag = false
    },
    macthSyllable(){ // 字段匹配
      for(let i = 0; i < this.dataTableBuildElementVos.length; i++){
        if(this.dataTableBuildElementVos[i].dataElements.length === 0){
          this.$Message.error({
            content: "请先选择数据源",
            duration: 3
          })
        } else {
          this.matchField = true
        }
        break
      }
    },
    selectedChange(params,item,index){ // 字段匹配 选择对应字段
      let par = JSON.parse(params)
      if(!this.addOptions.length){
        this.addOptions.push(par)
      } else {
        let flag = true
        this.addOptions.forEach((item,index) => {
          if(item.template === par.template){
            flag =false
            if(item.id === par.id){
              this.addOptions.splice(index, 1)
            } else {
              this.addOptions.splice(index, 1, par)
            }
          }
        })
        if(flag){
          this.addOptions.push(par)
        }
      }

      this.initMatchData[index].buttonMatch = params
      this.initMatchData.forEach(item => { // 已添加的字段置为空
        if(item.buttonMatch){
          let id = JSON.parse(item.buttonMatch).id
          this.addProjectName.forEach(n => { 
            if(n){
              for(let i in n){
                if(id === i){
                  item.buttonMatch = ''
                }
              }
            }
          })
        }
      })
    },
    isNull(){ // 已添加的字段置为不可选
      this.initMatchData.forEach(item => {
        item.selectFiled.forEach(key => {
          if(this.addProjectName){
            this.addProjectName.forEach(param => {
              for(let i in param){
                if(i === key.id){
                  key.disabled = true
                }
              }
            })
          }
        })
      })
    },
    addMatchData(){ // 字段匹配 添加
      if(this.addOptions.length < 2) {
        this.$Message.error({
          content: "请选择两个匹配字段",
          duration: 3
        })
      } else {
        this.singleBig = []
        let addOptions =JSON.parse(JSON.stringify(this.addOptions))
        this.bigOptionsAll.push(addOptions)
        this.singleBig.push(addOptions)
        this.addOptions = []
        this.singleBig.forEach(item=>{
          let obj = {}
          item.forEach(item1=>{
            obj[item1.template] = item1.dataElementName
            obj[item1.id] = item1.dataElementName
          })
          obj.newElementName = this.singleBig[0][0].dataElementName
          this.addProjectName.push(obj)
        })
        this.isNull()
      }
    },
    clearMatchData(){ // 字段匹配 清空
      this.initMatchData.forEach(item => {
        item.buttonMatch = ''
        item.selectFiled.forEach(n => {
          n.disabled = false
        })
      })
      this.addProjectName = []
      this.dataTableBuildElementVos.forEach(item => {
        item.dataElements.forEach(val => {
          val.firstElement = {}
        })
      })
    },
    changeFieldCol(val, row){ // 字段匹配添加新名称
      for(let i in row){
        this.dataTableBuildElementVos.forEach(item => {
          item.dataElements.forEach(to => {
            if(to.dataElement.id === i){
              to.newElementName = val
            }
          })
        })
      }
    },
    cancleFieldCol(rowId){ //取消功能
      for(let i in rowId.row){
        this.initMatchData.forEach(item => {
          item.selectFiled.forEach(m => {
            if(m.id === i){
              m.disabled = false
            }
          })
        })
      }
      this.bigOptionsAll.splice(rowId.index,1)
      this.addProjectName.splice(rowId.index, 1)
    },
    checkMatchField(){ // 字段匹配 确定
      if(this.addProjectName.length === 0){
        this.$Message.error({
          content: "请先添加字段",
          duration: 3
        })
      } else {
        let bigAll = JSON.parse(JSON.stringify(this.bigOptionsAll))
        for(let i =0;i<bigAll.length;i++){
          let firstElement = null
          bigAll[i].forEach((item,index) => {
            this.dataTableBuildElementVos.forEach(param => {
              if(param.templateId === item.template){
                if(firstElement === null){
                  firstElement = item
                }
                param.dataElements.forEach(val => {
                  if(val.dataElement.id === item.id){
                    if(index >0){
                      val.firstElement = firstElement
                      val.newElementName = item.dataElementName
                    }
                  }
                })
              }
            })
          })
        }
        this.matchField = false
        this.$Message.success({
          content: "字段匹配成功，请进行数据生成",
          duration: 3
        })
      }
    },
    dataGeneration(){ // 数据生成
      if(this.dataTableBuildElementVos[0].dataElements.length === 0){
        this.$Message.error({
          content: "请先选择数据源",
          duration: 3
        })
      } else {
        let params = {
          dataTableBuildElementVos: this.dataTableBuildElementVos
        }
        let _this = this
        this.$Modal.confirm({
          title:'数据生成',
          content:'您确定要进行数据生成吗？',
          onOk:()=>{
            console.log(JSON.stringify(params))
            ResearchProjectApi.getMatchFieldData(this.dataTableId, params).then(res=>{
              if(res.status === 200){
                _this.$Message.success('数据生成成功')
                _this.$refs.dataPreview.loadTable()
              }else(
                _this.$Message.error('数据生成失败')
              )
            }).catch(err=>{
              _this.$Message.error('数据生成失败')
            })
          }
        })
      }
    },
    backFirstLevel(){ // 返回上一级
      this.$emit('changeDataSources', '1')
    },
    dataReplaceMent(){ // 数据替换
      this.showReplace = true
      this.replaceWheres = false
      this.selectFieldList = this.$refs.dataPreview.columnDefs
      this.selectRadioList = this.$refs.dataPreview.tableData
      this.disabledGroup = []
      this.changeModelData = ''
      this.mainSelectField = ''
      this.queryWheresReplace = [{ // 数据替换筛选
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
      }]
      this.fieldDataList = []
      this.active = '1'
    },
    directReplace(){ // 直接替换
      this.active = '1'
      this.replaceWheres = false
      this.mainSelectField = []
      this.disabledGroup = []
      this.changeModelData = ''
    },
    conditionReplace(){ // 按条件替换
      this.active = '2'
      this.replaceWheres = true
      this.queryWheresReplace = [{
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
      }]
    },
    mainChangeList(params){ // 直接替换 选择字段改变
      this.fieldDataList = []
      this.valReplace = params
      if(params){
        this.selectRadioList.forEach(item => {
          Object.keys(item).forEach(keyId => {
            let num = item[keyId]
            let par = params.value
            if(par === keyId && item[keyId] !== ''){
              this.fieldDataList.push({par: keyId, name: num})
            }
          })
        })
      }
      let result = []
      let obj = {}
      for(let i = 0; i < this.fieldDataList.length; i++){ // 数组去重
        if(!obj[this.fieldDataList[i].name]){
          result.push(this.fieldDataList[i])
          obj[this.fieldDataList[i].name] = true
        }
      }
      this.fieldDataList = result
      if(this.fieldDataList.length === 0){
        this.noDataList = true
      } else {
        this.noDataList = false
      }
    },
    directStead(params){ // 数据替换或删除  单选框改变
      params.forEach(item => {
        this.requireData(item)
      })
      this.oldReplaceVal = params
    },
    requireData(params){ // 接口参数对照
      let str = ''
      let vos = JSON.parse(this.$refs.dataPreview.tableTemplate).dataTableBuildElementVos
      let arr = []
      let par = params.split(',')
      vos.forEach(item => {
        item.dataElements.forEach(keys => {
          if(["checkbox", "radio", "select"].includes(keys.dataElement.dataElementType)){
            if(keys.dataElement.id === this.valReplace.value){
              keys.dataElement.dataValues.forEach(num => {
                par.forEach(val => {
                  if(val === num.dataValueName){
                    arr.push(num.dataValue)
                  }
                })
              })
            }
            if(arr.length !== 0){
              str = arr.join(',')
            }
          } else {
            if(params){
              str = params
            }
          }
        })
      })
      return str
    },
    addQuery(){ // 增加筛选条件
      this.queryWheresReplace.push({
        order:this.queryWheresReplace.length,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
      })
    },
    deleteQuery(index){ // 删除筛选条件
      if(this.queryWheresReplace.length <= 1){
        this.$Message.error({
          content:"至少一个筛选条件",
          duration:2
        })
      }else{
        this.queryWheresReplace.splice(index,1)
      }
    },
    sureSearch(){ // 确定替换
      if(!this.replaceWheres){ // 直接替换
        let operationList = []
        let dataCleaningOperations = []
        this.oldReplaceVal.forEach(item => {
          if(item === '空值'){
            operationList.push({
              value: '',
              queryOperation: 'EQUAL',
              oldValue: '', // 替换旧值
              newValue: this.changeModelData, // 替换新值
            })
          } else {
            operationList.push({
              value: item,
              queryOperation: 'EQUAL',
              oldValue: item, // 替换旧值
              newValue: this.changeModelData, // 替换新值
            })
          }
        })

        dataCleaningOperations.push({
          column: this.getColumnData(this.mainSelectField),
          operationList: operationList,
          columnId: this.mainSelectField
        })

        let obj = {
          action: 'MODIFY',
          dataTable:{
            id: this.dataTableId
          },
          dataCleaningOperations: dataCleaningOperations,
          dataOperateVo: {
            columnId: this.mainSelectField,
            columnName: this.getColumnData(this.mainSelectField),
            newValue:this.changeModelData
          }
        }
        ResearchProjectApi.getDirectReplace(obj).then(res => {
          if(res.status === 200){
            this.$Message.success({
              content:"数据替换成功",
              duration:4
            })
            this.$refs.dataPreview.loadTable()
          } else {
            this.$Message.error({
              content:"数据替换失败，请重新替换！",
              duration:4
            })
          }
        })
        this.showReplace = false
      } else { // 按条件替换
        let querylist = JSON.parse(JSON.stringify(this.queryWheresReplace));
        for(let i =0;i<querylist.length;i++){//验证填写完整性
          let flag =Object.values(querylist[i]).some(item=>{
            return item == null
          })
          if(flag){
            if(querylist[i].queryOperation === 'IS_NULL'){
              this.getInitReplaceOperateTable(querylist)
              break
            } else if(querylist[i].queryOperation === 'IS_NOT_NULL'){
              this.getInitReplaceOperateTable(querylist)
              break
            } else {
              this.$Message.error({
                content: "请将筛选条件填写完整",
                duration: 4
              })
            }
            break
            return
          } else if ((querylist[i].queryOperation === 'GREAT_THAN' ||
                      querylist[i].queryOperation === 'LESS_THAN' ||
                      querylist[i].queryOperation === 'GREAT_EQUAL_THAN' ||
                      querylist[i].queryOperation === 'LESS_EQUAL_THAN') &&
                     ((/^[0-9]+$/.test(parseInt(querylist[i].value)) === false))){ // 判断 大于，小于，大于等于，小于等于是数字
            this.$Message.error({
              content: "对应值和替换值应为数字",
              duration: 4
            })
          } else {
            this.getInitReplaceOperateTable(querylist)
            break
          }
        }
      }
    },
    getInitReplaceOperateTable(params){ // 替换操作接口
      let dataCleaningOperation = []
      params.forEach(item => {
        let ov = ''
        if(item.value){
          ov = this.requireData(item.value)
        } else {
          ov = item.value
        }

        let obj = {
          column: this.getColumnData(item.dataElement),
          operationList: [],
          columnId: item.dataElement
        }
        obj.operationList.push({
          value: ov,
          queryOperation: item.queryOperation,
          oldValue: ov,
          nextOperation: item.nextOperation
        })
        dataCleaningOperation.push(obj)
      })
      let obj1 = {
        action: 'MODIFY',
        dataTable: {
          id: this.dataTableId
        },
        dataCleaningOperations: dataCleaningOperation,
        dataOperateVo: {
          columnName: this.getColumnData(this.dataOperateReplace),
          columnId: this.dataOperateReplace,
          newValue: this.inputChangeValue,
        }
      }
      ResearchProjectApi.getDirectReplace(obj1).then(res => {
        if(res.status === 200){
          this.$Message.success({
            content:"数据替换成功",
            duration:4
          })
          this.$refs.dataPreview.loadTable()
        } else {
          this.$Message.error({
            content:"数据替换失败，请重新替换！",
            duration:4
          })
        }
      })
      this.showReplace = false
    },
    getColumnData(item){ // 获取列表
      let col = ''
      this.selectFieldList.forEach(iEcm => {
        if(iEcm.key === item){
          col = iEcm.title
        }
      })
      return col
    },
    cancelSearch(){// 清空替换数据
      if(!this.replaceWheres){
        this.noDataList = true
        this.mainSelectField = ''
        this.changeModelData = ''
      } else{
        this.queryWheresReplace = [{ // 数据删除筛选
          order:0,
          dataElement:null,
          queryOperation:"EQUAL",
          value:null,
          replaceValue: null
        }]
      }
    },
    dataDelete(){ // 数据删除
      this.showDelete = true
      this.deleteWheres = false
      this.selectFieldList = this.$refs.dataPreview.columnDefs
      this.selectRadioList = this.$refs.dataPreview.tableData
      this.selectDataDelete = ''
      this.disabledGroup = []
      this.queryWheres = [{ // 数据删除筛选
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
        nextOperation:"AND" 
      }]
      this.fieldDataList = []
      this.delClass = '1'
    },
    directDelete(){ // 直接删除 跳转
      this.delClass = '1'
      this.deleteWheres = false
      this.selectDataDelete = []
      this.disabledGroup = []
    },
    conditionDelete(){ // 按条件删除 跳转
      this.delClass = '2'
      this.deleteWheres = true
      this.queryWheres = [{
        order:0,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
        nextOperation:"AND" 
      }]
    },
    addDelete(){ // 增加删除条件
      this.queryWheres.push({
        order:this.queryWheres.length,
        dataElement:null,
        queryOperation:"EQUAL",
        value:null,
        nextOperation:"AND" 
      })
    },
    deleteCheck(index){ // 减少删除条件
      if(this.queryWheres.length <= 1){
        this.$Message.error({
          content:"至少一个筛选条件",
          duration:2
        })
      }else{
        this.queryWheres.splice(index,1)
      }
    },
    checkDelete(){ // 确定删除
      if(!this.deleteWheres){ // 直接删除
        if(this.selectDataDelete !== '' && this.disabledGroup.length !== 0){
          let operationList = []
          let dataCleaningOperations = []
          this.oldReplaceVal.forEach(item => {
            if(item === '空值'){
              operationList.push({
                queryOperation: 'EQUAL',
                oldValue: '',
                newValue: '',
                value: '',
              })
            } else {
              operationList.push({
                queryOperation: 'EQUAL',
                oldValue: item,
                newValue: '',
                value: item,
              })
            }
          })

          dataCleaningOperations.push({
            column: this.getColumnData(this.selectDataDelete),
            operationList: operationList,
            columnId: this.selectDataDelete
          })

          let obj = {
            action: 'DELETE',
            dataTable:{
              id: this.dataTableId
            },
            dataCleaningOperations: dataCleaningOperations
          }
          ResearchProjectApi.getDirectReplace(obj).then(res => {
            if(res.status === 200){
              this.$Message.success({
                content:"数据删除成功",
                duration:4
              })
              this.$refs.dataPreview.loadTable()
            } else {
              this.$Message.error({
                content:"数据删除失败，请重新替换！",
                duration:4
              })
            }
          })
          this.showDelete = false
        } else {
          this.$Message.error({
            content: "请先选择字段",
            duration: 4
          })
        }
      } else { // 按条件删除
        let querylist = JSON.parse(JSON.stringify(this.queryWheres));
        for(let i =0;i<querylist.length;i++){ // 验证填写完整性
          let flag =Object.values(querylist[i]).some(item=>{
            return item == null
          })
          if(flag){
            if(querylist[i].queryOperation === "IS_NULL"){
              this.getInitOperateData(querylist)
              break
            } else if (querylist[i].queryOperation === "IS_NOT_NULL"){
              this.getInitOperateData(querylist)
              break
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
                     (/^[0-9]+$/.test(parseInt(querylist[i].value)) === false )){ // 判断 大于，小于，大于等于，小于等于是数字
            this.$Message.error({
              content: "对应值和替换值应为数字",
              duration: 4
            })
          } else {
            this.getInitOperateData(querylist)
            break
          }
        }
      }
    },
    getInitOperateData(params){ // 删除操作接口
      let dataCleaningOperation = []
      params.forEach(item => {
        let ov = ''
        let obj = {
          column: this.getColumnData(item.dataElement),
          operationList: [],
          columnId: item.dataElement
        }
        if(item.value){
          ov = this.requireData(item.value)
        } else {
          ov = item.value
        }

        obj.operationList.push({
          queryOperation: item.queryOperation,
          value: ov,
          newValue: '',
          oldValue: ov,
          nextOperation: item.nextOperation
        })
        dataCleaningOperation.push(obj)
      })

      let obj1 = {
        action: 'DELETE',
        dataTable: {
          id: this.dataTableId
        },
        dataCleaningOperations: dataCleaningOperation
      }
      ResearchProjectApi.getDirectReplace(obj1).then(res => {
        if(res.status === 200){
          this.$Message.success({
            content:"数据删除成功",
            duration:4
          })
          this.$refs.dataPreview.loadTable()
        } else {
          this.$Message.error({
            content:"数据删除失败，请重新删除！",
            duration:4
          })
        }
      })
      this.showDelete = false
    },
    cancelDelete(){ // 清空删除数据
      if(!this.deleteWheres){
        this.selectDataDelete = ''
        this.disabledGroup = []
      } else{
        this.queryWheres = [{ // 数据删除筛选
          order:0,
          dataElement:null,
          queryOperation:"EQUAL",
          value:null,
          nextOperation:"AND" 
        }]
      }
    },
    operationHistory(){ // 操作历史
      this.showHistory = true
      this.getInitOperationHistory()
    },
    getInitOperationHistory(){ // 获取操作历史记录
      let obj = {
        pageNo: this.currentPage-1,
        pageSize: this.pageSize
      }
      let dataTable = {
        id: this.dataTableId
      }
      ResearchProjectApi.getOperatorHistory(obj, dataTable).then(res => {
        if(res.status === 200){
          this.totalSize = res.data.counts
          this.operatorHisData = res.data.data
          this.operatorHisData.forEach(item => {
            item.createDate = item.createDate.substring(0, 10) + ' ' + item.createDate.substring(11, 19)
          })
        } else {
          this.$Message.error({
            content:"数据替换失败，请重新替换！",
            duration:4
          })
        }
      })
    },
    changePage(index){ // 操作历史分页
      this.currentPage = index;
      this.getInitOperationHistory()
    },
    denerateReports(){ // 生成报表
      this.$refs.dataPreview.loadTable()
    },
    // 数据去重
    removeDuplicateData(){
      let obj = {
        id:this.dataTableId,
        dataId:this.dataId
      }
      let _this = this
      this.$Modal.confirm({
        title:'数据去重',
        content:'您确定要去除重复数据吗？',
        onOk:()=>{
           DataAnalysisApi.removeDuplicateData(obj).then(res=>{
            if(res.status === 200){
              _this.$Message.success('去重成功')
              _this.$refs.dataPreview.loadTable()
            }else(
              _this.$Message.error('去重失败')
            )
          }).catch(err=>{
            _this.$Message.error('去重失败')
          })
        }
      })
    }
  },
  mounted(){
    this.getAllProjects();
  },
  components: {
    AnalysisDataList
  }
}
</script>
<style lang="less" scoped>
.sub-sources{
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.sub-container{
  margin: 10px 0px;
  ul{
    list-style: none;
    li{
      margin: 10px;
      width: 31%;
      float: left;
    }
  }
}
.sub-box{
  position: relative;
  min-height:200px;
  max-height: 400px;
  border: 1px solid #B5B5B5;
  border-radius:6px;
  margin-bottom: 35px;
  .checkBox{
    padding-top: 6px;
    height: 30px;
    box-sizing: border-box;
    overflow: auto; 
    border-bottom: 1px solid #b5b5b5;
    &:last-of-type{
      border-bottom: none;
    }
  }
  .checkBox-group{
    padding: 8px;
    height: 120px;
    // line-height: 80px;
    box-sizing: border-box;
    overflow: auto; 
    // min-height: 80px;
    border-bottom: 1px solid #b5b5b5;
    &:last-of-type{
      border-bottom: none;
    }
  }
  .btn-box{
    margin-right: 20px;
    float: right;
    font-size: 17px;
    text-align: center;
  }
}
.sub-table{
  margin: 10px 0px;
  height: 310px;
  overflow-y: auto;
  border-bottom: 1px solid #ccc;
}
.macth-filed{
  ul{
    list-style: none;
    li{
      margin: 10px 0px;
      font-size: 15px;
      .check-filed{
        margin: 20px;
      }
    }
  }
}
.main-footer{
  text-align: center
}
.add-footer{
  font-size: 15px;
  margin-top: 20px;
}
.footer-ending{
  text-align: center;
}
.footer-header{
  text-align: left;
  margin: 20px 0px;
  .footer-table{
    width: 100%;
    border-spacing: 0px;
    tr{
      height: 40px;
      td{
        border: 1px solid #DCDEE2;
      }
    }
  }
}
.main-replace{
  .main-condition{
    p{
      cursor: pointer;
      margin-bottom: 10px;
      border-radius: 5px;
      border: 1px solid #797979;
      float: left;
      width: 100px;
      height: 30px;
      text-align: center;
      line-height: 30px;
    }
    .aclass{
      border-radius: 5px;
      background: #2D8CF0;
      color: #fff;
      border: 1px solid #2D8CF0;
    }
  }
  .main-select-field{
    margin: 10px;
  }
  .replace-change{
    border: 1px solid #DCDEE2;
    padding-top: 5px;
    padding-left: 10px;
    font-size: 12px;
    height: 32px;

  }
}
</style>
