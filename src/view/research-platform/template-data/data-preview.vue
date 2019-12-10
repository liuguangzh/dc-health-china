<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
.configfield .ivu-modal-body{
  max-height: 400px;
  overflow-y: auto;
}
</style>
<template>
  <div style="height:100%;position:relative;">
    <Row :gutter="10" style="height:100%;">
      <Col span="6" style="height:100%;">
        <Row>
            <Col :span="12">
              <div class="menu-task-type" 
                :class="menuActive === '1' ? 'active' : ''" 
                @click="changTab('1')"
              >系统数据</div>
            </Col>
            <Col :span="12">
              <div class="menu-task-type"
                :class="menuActive === '2' ? 'active' : ''"
                @click="changTab('2')"
              >自定义数据</div>
            </Col>
        </Row>
        <Input style="width:80%" placeholder="请输入任务名称" v-model="projectName" search @on-search="searchByTerm" @on-enter="searchByTerm"></Input>
        <Button type="primary" v-if="menuActive === '2'" @click="addExcelTerm" size='small' style="margin-left:9px;">新建</Button>
        <!-- 左侧列表 -->
        <div class="menu-box" v-if="menuActive === '1'">
          <Menu :accordion="true" style="width:100%;" @on-select="changeTemplate">
            <Submenu :name="item.id" v-for="(item,index) in projectList" :key="item.id">
              <template slot="title">
                <P class="sub-item" :title="item.researchProjectName">{{item.researchProjectName}}</P>
              </template>
              <MenuItem :name="JSON.stringify(opt)" v-for="(opt,index) in item.templateMasters" :key="opt.id">{{opt.templateName}}
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
        <div class="menu-box" v-else>
          <Menu :accordion="true" style="width:100%;" ref="side_menu" 
            @on-select="changeTemplate" @on-open-change='openchange' :active-name='activeName'>
            <Submenu :name="item.id" v-for="(item,index) in projectList" :key="item.id">
              <template slot="title">
                <span class="sub-item" :title="item.researchProjectName">{{item.researchProjectName}}</span>
                <div class="icon-box">
                  <Icon type="md-add" size="20" color="rgb(25, 190, 107)" @click.stop="addExcel(item)" title="新建数据表"/>
                  <Icon type="md-create" size="20" color="rgb(45, 140, 240)" @click.stop="editExcelTerm(item)" title="编辑数据分组"/>
                  <Icon type="md-trash" size="20" color="rgb(237, 64, 20)" @click.stop="deleteExcelTerm(item,index)" title="删除数据分组"/>
                </div>
              </template>
              <MenuItem :name="JSON.stringify(opt)" v-for="(opt,idx) in item.templateMasters" :key="opt.id">
                <span class="menu-item" :title="opt.templateName">{{opt.templateName}}</span>
                <div class="icon-box">
                  <Icon type="md-create" size="20" color="rgb(45, 140, 240)" title="编辑" @click.stop="editExcel(opt, item)"/>
                  <Icon type="md-trash" size="20" color="rgb(237, 64, 20)" title="删除" @click.stop="deleteExcel(opt,idx)"/>
                </div>
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
      </Col>
      <Col span="18" id='fullSreen' style="height: 100%; background:#FFF">
        <div style="margin-bottom:15px;text-align:right">
          <Button type="success"  @click="dataAnalysis" style="float:left">数据分析</Button>
          <Button type="primary" style="margin-left: 10px;" @click="vimAllDate">全部数据</Button>
          <Button type="primary" style="margin-left: 10px;" @click="highSearch">高级检索</Button>
          <Button type="primary" style="margin-left: 10px;" @click="configField">显示字段</Button>
          <Button type="primary" style="margin-left: 10px;" @click="exportData">导出</Button>
          <Button style="margin-left: 10px;" @click="$router.go(-1)">返回上一步</Button>
          <!-- <full-screen style="margin-left: 10px;" v-model="isFullScreen" dom='fullSreen'></full-screen> -->
        </div>
        <div style="height: 87%; overflow: auto;">
          <Table ref="dataPreview" :columns="tableHeader" :data="tabData" border id="rebateSetTable"></Table>
          <div style="text-align:center;margin-top:15px;">
              <Page :current='pageable.page' :page-size='pageable.size' :total='totalNum' 
              show-total show-elevator show-sizer
              @on-change='changePage'
              @on-page-size-change='changePageSize'
              ></Page>
          </div>
        </div>
      </Col>
    </Row>
    <!-- 配置字段 -->
    <Modal class="configfield" v-model="configFlag" :closable='false' title="配置字段" width="800" max-height="400"> 
      <Tree show-checkbox ref="configTree" :data="treeData"></Tree>
      <div slot="footer">
        <Button @click="sureConfig" type="primary">确定</Button>
        <Button @click="closeConfig">取消</Button>
      </div>
    </Modal>
    <!-- 高级检索 -->
    <Modal v-model="highFlag" :closable="false" title="高级检索" width="800">
        <Row :gutter="10" type="flex" align="middle" v-for="(item,index) in queryWheres" :key="item.order" style="margin-bottom:10px;">
            <Col span="6">
                <Button @click="chooseSearchNode(index)" long>{{item.dataElement == null ?"请选择字段":item.dataElement.dataElementName}}</Button>
            </Col>
            <Col span="4">
                <Select v-model="item.queryOperation">
                    <Option v-for="item in operationEnum" :key="item.value" :value="item.value" :label="item.label"></Option>
                </Select>
            </Col>
             <Col span="5">
                <Input placeholder="请输入比较值" clearable v-model="item.value"></Input>
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
        <div slot="footer">
          <Button @click="sureSearch" type="success">确定</Button>
          <Button type="primary" @click="resetqueryWheres()">清空</Button>
          <Button @click="cancelSearch">取消</Button>
      </div>
    </Modal>
		<!-- 多行数据查看-高级自增表格 -->
		<Modal v-model="moreFlag" :title="moreTitle" fullscreen>
				<Table :columns="moreTableHead" :data="moreTableBody" border></Table>
				<div slot="footer">
						<Button type="primary" @click="moreFlag = false">关闭</Button>
				</div>
		</Modal>
    <!-- 高级检索选择字段 -->
    <Modal v-model="chooseNodeFlag" title="选取字段" @on-ok='sureChooseSearch' closeable>
      <Tree style="max-height:500px;overflow:auto;" ref ="cNodeTree" :data ="cNodes" @on-select-change='sureChooseSearch'></Tree>
      <div slot="footer"></div>
    </Modal>
    <!-- 自定义数据-新建数据表分组 -->
    <Modal v-model="excelTermFlag" :title="excelTermTitle">
      <Form :label-width='80'>
        <FormItem label='分组名称' :required='true'>
            <Input v-model="exceltermName" placeholder="请填写数据表分组名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="excelTermFlag = false">取消</Button>
        <Button type="primary" @click="sureHandleExcelTerm" :loading='loading'>确定</Button>
      </div>
    </Modal> 
    <!-- 新建报表分组 -->
    <Modal v-model="excelFlag" :title="excelTitle">
      <Form :label-width='80'>
        <FormItem label='数据表名称'>
          <Input v-if="excelFlag" v-model="excelName" autofocus @on-blur='surehandleExcel' placeholder="如果不填写,则使用上传数据表名称"></Input>
        </FormItem>
        <FormItem label='数据表上传'>
          <excel-upload v-if="excelFlag" @uploadSuccess='uploadSuccess' btnText='数据表上传'
            action='/dr-api/analysis-file/upload/excel'
            :data='excelData'
            @click.native="surehandleExcel"
            ></excel-upload>
        </FormItem>
      </Form>
      <p style="font-size:16px;color:red;margin-left:16px;">数据表上传成功即自动创建数据表</p>
      <div slot="footer">
        <Button @click="excelFlag=false">取消</Button>
        <Button @click="sureEditExcel" type="primary" v-if="excelType === 'edit'">确定</Button>
        <Button @click="sureAdddExcel" type="primary" v-if="excelType === 'add'" >确定</Button>
      </div>
    </Modal> 
  </div>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import {ResearchProjectApi,TemplateApi,DataAnalysisApi} from "@/api/"
  import FullScreen from '@/view/research-platform/component/fullScreen/index.js'
  import ExcelUpload from '@/view/research-platform/component/upload/excel-upload.vue'
  export default {
    name: "dataPreview",
    data() {
      return {
        isFullScreen:false, // 是否全屏
        tableHeader: [],
        tabData: [],
        projectName: "", //查询条件-任务名称
        projectList: [],
        currentTemplate: "",
        currentTemplateId:'',
        configFlag: false,
        treeData: [], //选中表单字段
        checkedTree:[],//树行结构中选中字段
        highFlag:false,//高级检索状态
        queryWheres:[{
            order:0,
            dataElement:null,
            queryOperation:"EQUAL",
            value:null,
            nextOperation:"AND" 
        }],
        operationEnum: [{ //比较条件
              value: "EQUAL",
              label: "等于"
            },
             {
              value: "NOT_EQUAL",
              label: "不等于"
            },
            {
              value: "GREAT_THAN",
              label: "大于"
            },
            {
              value: "LESS_THAN",
              label: "小于"
            },
            {
              value: "GREAT_EQUAL_THAN",
              label: "大于等于"
            },
            {
              value: "LESS_EQUAL_THAN",
              label: "小于等于"
            },
            {
              value: "NOT_LIKE",
              label: "不相似"
            },
            {
              value: "LIKE",
              label: "相似"
            } ,{
              value: "IS_NULL",
              label: "值为空"
            },
            {
              value: "IS_NOT_NULL",
              label: "值不为空"
						}],
				moreTableHead:[],//查看下级表格表头
				moreTableBody:[],//查看下级表格数据
				moreTitle:"数据查看",//查看下级数据弹窗title
        moreFlag:false,//查看下级表格数据
        chooseNodeFlag:false,//高级检索选取字段
        cNodes:[],//高级检索选取字段树数据
        cIndex:0,//高级检索筛选条件索引
        pageable:{
          page:1,
          size:10
        },
        totalNum:0,
        highSearchQuery:null, //高级检索条件
        menuActive: '1' ,// 自定义与系统数据切换标志
        currentExcelTermId:'',//当前选中编辑数据表分组
        excelTermFlag:false,// 新建/编辑数据表弹窗状态
        exceltermName:"", // 新建/编辑数据表分组名称
        excelTermTitle:'新建数据表分组',// 新建/编辑数据表分组title
        exceltermType:'add', // 新建/编辑数据表分组type
        loading:false, //确定按钮状态值
        currentExcelId:'',// 当前操作的数据表id
        excelFlag:false,// 新建/编辑数据表
        excelTitle:'新建数据表',// 新建/编辑数据表
        excelName:'',//新建/编辑数据表名称
        excelType:'add', //新建/编辑数据表type
        excelData:{}, // 上传承诺书附带参数
        activeName:''
			}
    },
    methods: {
      vimAllDate(){//查看全部数据
        this.resetqueryWheres();
				this.getAllFields();
				this.getCommitData();
      },
      resetqueryWheres(){// 清空高级检索条件
         this.queryWheres=[{
            order:0,
            dataElement:null,
            queryOperation:"EQUAL",
            value:null,
            nextOperation:"AND" 
        }]
        this.highSearchQuery=null
      },
      getAllProjects() { //获取科研任务列表
        let obj = {
          pageNo: 0, //当前页
          pageSize: 99999, //每页显示条数
          type: this.menuActive //任务种类   1 系统任务 2上传Excel创建表单
        }
        if (this.projectName) {
          obj.projectName = this.projectName
        }
        ResearchProjectApi.getAllProjectsByType(obj).then(res => {
          if(res.data.code === '1'){
            this.projectList = res.data.data;
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
      },
      searchByTerm() { //根据条件查询科研任务列表
        this.getAllProjects()
      },
      changeTemplate(name) { //选中表单
        this.currentTemplate = JSON.parse(name) // 用于导出数据表
        this.currentTemplateId = this.currentTemplate.id;
        this.resetqueryWheres();
				this.getAllFields();
				this.getCommitData();
      },
      getAllFields() { //获取选中表单字段
        TemplateApi.getAllFields({templateId: this.currentTemplateId}).then(res => {
          if(res.data.code === '1'){
            //配置字段树数据
            if(res.data.data){
              let oldData = JSON.parse(JSON.stringify(res.data.data))
              this.arrayToTree(oldData)
              this.treeData = oldData
              //刚开始未进行配置字段  高级检索字段位全部
              this.checkedTree = JSON.parse(JSON.stringify(oldData))
              //table 表头数据
              let tableData = JSON.parse(JSON.stringify(res.data.data));
              this.arrayToTable(tableData);
              this.tableHeader = tableData;
              this.tableHeader.unshift({
                title:'序号',
                type:'index',
                width:60
              })
            } else {
              this.tableHeader = []
            }
          } else {
            this.$Message.error({
              content: "未成功获取表单字段",
              duration: 3
            })
          }
        }).catch(err => {
          this.$Message.error({
            content: "未成功获取表单字段",
            duration: 3
          })
        })
      },
      configField() { //配置字段
        if (this.currentTemplateId == "") {
          this.$Message.info({
            content: "请先选择表单",
            duration: 2
          })
          return
        }
        this.configFlag = true;
      },
      arrayToTree(arr,id = "self"){//生成树结构数据
          if(arr.length>0){
            arr.forEach(element => {
                element.title=element.dataElementName;
                if(!element.hasOwnProperty("checked")){
								  element.checked = true;
                }
                element.expand = true;
                element.parent =id
                if(element.children.length>0){
                  this.arrayToTree(element.children,element.dataElementCode)
                }
            });
          }
      },
      arrayToTable(arr){//生成多字段表头
        if(arr.length>0){
						let _this=this;
            arr.forEach(element => {
              element.key=element.dataElementCode;
              element.title=element.dataElementName;
              element.minWidth = 100;
              if (["checkbox", "radio", "select"].includes(element.dataElementType)) {
                element.render = function (h, params) {
                  let data = [], id = params.column.dataElementCode;
                  let rowData = params.row[id].split(',') //多选结果为 1,2 类型，分割成数组
                    params.column.values.forEach(item=>{
                      for(let i=0;i< rowData.length;i++){
                        if(rowData[i] == item.dataValue){
                          data.push(item.dataValueName)
                        }
                      }
                    })
                  return h("div", data.join(","))
                }
              }
              //文件上传类型处理
              if(element.dataElementType === 'file_upload'){
                element.render = function(h,params){
                  return h('Button',{
                    props:{
                      type:'primary',
                      size:'small',
                      ghost:true
                    },
                    style:{
                      cursor:'pointer'
                    },
                    on:{
                      click:()=>{
                        _this.downUpLoadFile(params)
                      }
                    }
                  },'文件下载')
                }
              }
              if(element.hasOwnProperty("children") && element.children.length>0){ // 顶级
                element.childrens=element.children
                delete element.children
                element.render=function(h,params){
                  let id = element.dataElementCode;
                  return h('Button',{
                    props:{
                      type: 'primary',
                      size: 'small',
                      ghost:true
                    },
                    style:{
                      cursor:"pointer"
                    },
                    on:{
                      click:()=>{_this.showMoreTable(id,params)}
                    }
                  }, '查看')
                }
                this.arrayToTable(element.childrens)
              }else if(element.hasOwnProperty("childrens")){//子级
                element.render=function(h,params){
                  let id = element.dataElementCode;
                  return h('Button',{
                    props:{
                      type: 'primary',
                      size: 'small',
                      ghost:true
                    },
                    style:{
                      cursor:"pointer"
                    },
                    on:{
                      click:()=>{_this.showMoreTable(id,params)}
                    }
                  }, '查看')
                }
              } else{
                delete element.children
              }
            });
          }
			},
      showMoreTable(id,params){ // 查看下级数据
        let newParams = JSON.parse(JSON.stringify(params))
				let data = newParams.row[id],
             head = newParams.column.childrens,
             onlyCheckedHead = [];
            if(head[0].hasOwnProperty("checked")){
             head.forEach(item=>{//去除未选中显示的节点
                let flag = false;
                if(item.hasOwnProperty("childrens")){//有子节点但未全选中的
                  flag = item.childrens.some(item=>{
                    return item.checked == true
                  })
                }
                //无子节点被选中
               if(item.checked || flag){
                 onlyCheckedHead.push(item)
               }
             })}else{
               onlyCheckedHead = head
             }
        this.arrayToTable(onlyCheckedHead)
        this.moreTableHead = onlyCheckedHead;
        this.moreTableBody = Array.isArray(data)?data:[data];
				this.moreTitle = newParams.column.dataElementName;
				this.moreFlag  = true;
			},
      changePage(index){ // 分页切换
        this.pageable.page = index
        this.getCommitData()
      },
      changePageSize(size){
        this.pageable.size = size
        this.getCommitData()
      },
      getCommitData() {
        let page = JSON.parse(JSON.stringify(this.pageable))
        DataAnalysisApi.getCommitData(this.currentTemplateId,this.highSearchQuery,page).then(res => {
          if(res.data.code === '1'){
            let data1 = JSON.parse(JSON.stringify(res.data.data.data)),
              data2 = [];
            data1.forEach(item=>{
                data2.push(item.data)
            })
            this.replaceSymbol(data2)
            this.tabData = data2;
            this.totalNum = res.data.data.totalRows
          } else {
            this.$Message.error('获取已选字段的提交的数据失败')
          }
        }).catch(err => {
          this.$Message.error(err)
        })
      },
      replaceSymbol(arr) { //将KEY中特殊字符'-'替换为'$'
        for (let i = 0; i < arr.length; i++) {
          for (var key in arr[i]) {
            if (key.indexOf('-') !== -1) {
              let newKey = key.replace(/-/g, '$')
              arr[i][newKey] = arr[i][key]
              if (Array.isArray(arr[i][newKey])) {
                this.replaceSymbol(arr[i][newKey])
              }
            } else {
              if(Object.prototype.toString.call(arr[i][key]) === '[object Object]'){
                  for(var key1 in arr[i][key]){
                    let newKey = key1.replace(/-/g, '$')
                   arr[i][key][newKey] = arr[i][key][key1]
                  }
              }
              // 值为数组 并且 数组的值为对象集合
              if (Array.isArray(arr[i][key]) &&  Object.prototype.toString.call(arr[i][key][0]) === '[object Object]') {
                this.replaceSymbol(arr[i][key])
              }
            }
          }
        }
        return arr
      },
      treeToTable(arr){ //树状结构数据转成表格数据结构
        let noParentArr = [], hasParentArr = [];
        if(arr.length>0){
          // 将半选与全选分开
          arr.forEach(item=>{
            if(item.parent == "self"){
              noParentArr.push(item)
            }else{
              hasParentArr.push(item)
            }
          })
          //为次级父节点寻找选中子节点
          hasParentArr.forEach(item => {
            if (item.hasOwnProperty("children") && item.children.length) {
              hasParentArr.forEach(item1 => {
                if (item.dataElementCode == item1.parent) {
                  item.children.forEach(item3=>{
                    if(item3.dataElementCode == item1.parent){
                      item3.checked = item1.checked
                    }
                  })
                }
              })
            }
          })
          // 为顶级父节点寻找选中子节点
          noParentArr.forEach(item => {
            if (item.hasOwnProperty("children") && item.children.length) {
              hasParentArr.forEach(item1 => {
                if (item.dataElementCode == item1.parent) {
                    item.children.forEach(item3=>{
                    if(item3.dataElementCode == item1.parent){
                      item3.checked = item1.checked
                    }
                  })
                }
              })
            }
          })
          return noParentArr
        }
      },
      sureConfig() { // 确定配置字段
        this.checkedTree = this.$refs.configTree.getCheckedAndIndeterminateNodes();
        this.checkedTree = this.treeToTable(this.checkedTree)
        let headData = JSON.parse(JSON.stringify(this.checkedTree));
        this.arrayToTable(headData);
        this.tableHeader = headData;
        this.tableHeader.unshift({
            title:'序号',
            type:'index',
            width:60
          })
        //重新获取数据
        this.getCommitData()
        this.configFlag = false;
        this.resetqueryWheres();
      },
      closeConfig() { // 取消配合字段
        this.configFlag = false;
      },
      getcNodes(arr){ // 获取高级检索树状结构 父级结构不能选
        if(arr.length>0){
          arr.forEach(element => {
            if(!element.checked || element.children.length>0){
              element.disabled = true;
            }
            if(element.children.length>0){
              this.getcNodes(element.children)
            }
          });
        }
      },
      dataAnalysis(){ // 数据分析
        if (this.currentTemplateId == "") {
          this.$Message.error({
            content: "请先选择表单",
            duration: 2
          })
          return
        }
        let researchProjectId = ''
        this.projectList.forEach(item => {
          item.templateMasters.forEach(keys => {
            if(this.currentTemplateId === keys.id){
              researchProjectId = item.id
            }
          })
        })
        this.$router.push({
          name: "dataAnalysisSub",
          params: {
            researchProjectId: researchProjectId
          }
        })
      },
      highSearch(){ // 高级检索
        this.resetqueryWheres()
        this.highFlag = true;

        let cNodes = JSON.parse(JSON.stringify(this.checkedTree))
        this.getcNodes(cNodes)
        this.cNodes = cNodes
      },
      addQuery(){ // 增加筛选条件
        if(this.queryWheres.length >= 2){
          this.$Message.error('最多为两个筛选条件')
        }else{
           this.queryWheres.push({
            order:this.queryWheres.length,
            dataElement:null,
            queryOperation:"EQUAL",
            value:null,
            nextOperation:"AND"
          })
        }
      },
      deleteQuery(index){ // 删除筛选条件
          if(this.queryWheres.length <= 1){
              this.$Message.error({
                  content:"至少一个筛选条件",
                  duration:2
              })
          }else{
            this.queryWheres.splice(index,1)
          }
      },
      chooseSearchNode(index){ // 高级检索选择筛选字段
        this.cIndex = index ;
        this.chooseNodeFlag = true
      },
      sureChooseSearch(){ // 高级检索选择筛选字段-确定选择
        let node = this.$refs.cNodeTree.getSelectedNodes();
        this.queryWheres[this.cIndex].dataElement = JSON.parse(JSON.stringify(node))[0];
        this.chooseNodeFlag = false
      },
      cancelSearch(){ // 取消筛选
        this.highFlag = false;
      },
      sureSearch(){ // 确定筛选
        let querylist = JSON.parse(JSON.stringify(this.queryWheres));
        for(let i =0;i<querylist.length;i++){ // 验证填写完整性
          let flag =Object.values(querylist[i]).some(item=>{
            return item == null
          })
          if(flag){
            if(querylist[i].queryOperation === 'IS_NULL'){
              this.conditionalJudgment(querylist)
              break
            } else if(querylist[i].queryOperation === 'IS_NOT_NULL'){
              this.conditionalJudgment(querylist)
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
                    (/^[0-9]+$/.test(parseInt(querylist[i].value)) === false)){ // 判断 大于，小于，大于等于，小于等于是数字
          this.$Message.error({
            content: "对应值应为数字",
            duration: 4
          })
        } else {
            this.conditionalJudgment(querylist)
            break
          }
        }
      },
      conditionalJudgment(params){
        let elements = [];
        params.forEach(item=>{ // 类型为预设值-如radio,checkbox,select 需要转换值
          if(item.dataElement){
            let list = item.dataElement.values
            if(list.length > 0){
              list.forEach(opt=>{
                if(opt.dataValueName == item.value){
                  item.value = opt.dataValue
                }
              })
            }
          }
        })
        let obj={
          elements: [],
          queryWheres: params
        }
        this.highSearchQuery = obj
        //根据筛选条件查询数据
        this.getCommitData()
        this.highFlag = false;
      },
      exportData(){//导出数据
        // this.$refs.dataPreview.exportCsv({
        //   filename:this.currentTemplate?this.currentTemplate.templateName:'数据表'
        // })
        let name = this.currentTemplate?this.currentTemplate.templateName:'数据表'
        this.exportDataMore(name);
      },
      //多级表头-excel导出
      exportDataMore(name){
           /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
        /* get binary string as output */
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name +'.xlsx');
        } catch (e)
        {
          if (typeof console !== 'undefined')
          console.log(e, wbout)
        }
        return wbout
      },
      // 上传excel
      uploadSuccess(res){
        this.excelFlag = false
        this.getAllProjects()
        if(this.currentTemplateId){
          this.resetqueryWheres();
				  this.getAllFields();
				  this.getCommitData();
        }
      },
      //切换菜单
      changTab(m){
        if(this.menuActive !== m){
          this.menuActive = m
          this.projectList = []
          this.getAllProjects()
        }
      },
      //左侧菜单展开-获取ID
      openchange(name){
        if(name.length){
          this.currentExcelTermId = name[0]
        }
      },
      //自定义数据-新建数据表分组
      addExcelTerm(){
        this.excelTermTitle = '新建数据表分组'
        this.exceltermName = ''
        this.excelTermFlag = true
        this.exceltermType = 'add'
      },
      //编辑数据表分组
      editExcelTerm(item){
        this.currentExcelTermId = item.id
        this.excelTermTitle = '编辑数据表分组'
        this.exceltermName = item.researchProjectName
        this.excelTermFlag = true
        this.exceltermType = 'edit'
      },
      //确定新建/编辑数据表分组
      sureHandleExcelTerm(){
        if(this.exceltermName === '') {
          this.$Message.error('请填写名称')
          return
        }
        this.loading = true
        let obj= {researchProjectName:this.exceltermName}
        if(this.exceltermType === 'edit'){
          obj.id = this.currentExcelTermId
          ResearchProjectApi.modifyProjectWithExcel(obj).then(res=>{
            if(res.data.code === '1'){
              this.$Message.success('保存成功')
              this.excelTermFlag = false
              this.loading = false
              this.getAllProjects()
            } else {
              this.$Message.error('保存失败')
              this.loading = false
            }
          }).catch(err=>{
            this.$Message.error('保存失败')
            this.loading = false
          })
        } else if (this.exceltermType === 'add') {
          ResearchProjectApi.ceateProjectWithExcel(obj).then(res=>{
            if(res.data.code === '1'){
              this.$Message.success('保存成功')
              this.excelTermFlag = false
              this.loading = false
              this.getAllProjects()
            } else {
              this.$Message.error('保存失败')
              this.loading = false
            }
          }).catch(err=>{
            this.$Message.error('保存失败')
            this.loading = false
          })
        }
      },
      //删除数据表分组
      deleteExcelTerm(item,index){
        if(item.templateMasters){
          if(item.templateMasters.length){
            this.$Message.error('请先删除下属数据表')
            return
          }
        }
        this.$Modal.confirm({
          title:'删除数据表分组',
          content:'您确定要删除此数据表分组吗?',
          onOk:()=>{
            ResearchProjectApi.deleteProjectById(item.id).then(res=>{
              if(res.data.code === '1'){
                this.$Message.success('删除成功')
                this.projectList.splice(index,1)
              } else {
                this.$Message.error('删除失败')
              }
            }).catch(err=>{
              this.$Message.error('删除失败')
            })
          }
        })
      },
      //新建数据表
      addExcel(item){
        this.currentExcelTermId = item.id
        this.excelTitle = '新建数据表'
        this.excelName = ''
        this.excelType = 'add'
        this.excelFlag = true
      },
      //编辑数据表
      editExcel(opt,item){
        this.currentExcelId = opt.id
        this.excelTitle = '编辑数据表'
        this.excelName = opt.templateName
        this.excelType = 'edit'
        this.excelFlag = true
      },
      // 获取excel 多增加的参数
      surehandleExcel(){
        let obj = { projectId:this.currentExcelTermId }
        if(this.excelType === 'edit'){
          obj.masterId = this.currentExcelId
        }
        if(this.excelName !== ''){
          obj.masterName = this.excelName
        }
        this.excelData = obj
      },
      //删除数据表
      deleteExcel(opt){
        this.$Modal.confirm({
          title:'删除数据表',
          content:'您确定要删除此数据表吗？',
          onOk:()=>{
            TemplateApi.deleteTemplateById(opt.id).then(res=>{
              this.$Message.success('删除成功')
              //如果当前选中ID与要删除的ID相同，则将选中ID置位空
              if(this.currentTemplateId === opt.id){
                this.currentTemplateId = ''
                //清空删除表单展示的数据
                this.tableHeader = []
                this.tabData = []
                this.totalNum = 0
              }
              this.getAllProjects()
            }).catch(err=>{
              this.$Message.error(err)
            })
          }
        })
      },
      // 编辑数据表-不重新上传excel
      sureEditExcel(){
        let obj = {
          id: this.currentExcelId,
          templateName:this.excelName
        }
        TemplateApi.mergeWitchExcel(this.currentExcelTermId,obj).then(res=>{
          this.$Message.success('保存成功')
          this.excelFlag =false
          this.getAllProjects()
        }).catch(err=>{
          this.$Message.error('保存失败')
          this.excelFlag =false
        })
      },
      // 确认添加数据表
      sureAdddExcel(){
        this.$Message.error('请上传数据表')
      },
      //为文件上传类型组件-文件下载
      async downUpLoadFile(params){
        let id = params.row[params.column.dataElementCode][0].response.id
        let filename = params.row[params.column.dataElementCode][0].response.originName
        let fileData = await TemplateApi.downLoadTemplateFile(id)
        const type = "text/plain; charset=UTF-8";
        let blob = new Blob([fileData.data], { type: type })
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
              window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);
          var a = document.createElement("a");
          if (typeof a.download === 'undefined') {
            window.location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a)
          }
        }
      }
    },
    mounted() {
      this.getAllProjects();
    },
    components: { FullScreen ,ExcelUpload}
  }
</script>
<style lang="less" scoped>
  .textOver {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .menu-box {
      max-height: 93%;
      overflow: auto;
      .sub-item {
        display: inline-block;
        width: 45%;
        .textOver;
      }
       .icon-box{
          float: right;
          margin-right: 24px;
        }
      .menu-item {
        display: inline-block;
        width: 65%;
        .textOver;
      }
    }
  .menu-task-type {
    background: #fff;
    color: #2D8CF0;
    text-align: center;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    margin-bottom: 15px;
    border: 1px solid #2D8CF0;
    cursor: pointer;
  }

  .active {
    background: #2D8CF0;
    color: #fff;
  }

</style>