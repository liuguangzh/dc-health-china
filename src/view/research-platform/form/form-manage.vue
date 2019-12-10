<template>
  <div class="layout">
    <!-- 表单页管理 -->
    <div class="header-box">
      <h3 class="pro-name" v-if="!zujian">{{ headTitle }}</h3>
      <Button v-if="!zujian && design" type="primary" size="small" style="float:right;margin-left:10px;" 
        @click="returnBack">返回</Button>
      <Button v-if="isTemplate && !preView " @click="getPageImg" type="primary" style='float:right;' size='small'>以此页设置为模板缩略图</Button>
      <div class="my-top-select" v-if="zujian && design">
        <span style="margin-right:15px;font-size:16px;">请选择:</span>
        <Select v-model="templateId"  @on-change="tmpChange" 
          style="width:200px;display:inline-block;">
          <Option v-for="(item,index) in researchProject.templateMasters" :key="item.id" :value="item.id">{{ item.templateName }}</Option>
        </Select>
      </div>
    </div>
    <div class="body-box">
      <!-- 左侧菜单栏 -->
      <div class="box-left">
        <div class="tree-box" >
        <Button v-if="!preView" long size="small" type="primary" @click="addNewFormPage">新增表单页分组</Button>
          <Menu ref="pageGroupsMenu" :theme='theme' :accordion='true' width="100%" @on-select="itmeClick" mode='vertical' :open-names="openNames" :active-name="activeMenu">
            <Submenu :name="item.id" v-for="(item,index) in (formPageList?formPageList:[])" :key="index" >
              <template slot="title">
                <span :title="item.groupName" class="tree-title">{{ item?item.groupName:"" }}</span>
                <div class="icon-box" v-if="!preView">
                  <Icon type="md-add-circle" size="22" color="#19be6b" title="增加子表" @click.stop="addChildPage(item,index)"/>
                  <Icon type="md-create" size="22" title="编辑" color="#2d8cf0" @click.stop="editFormGroup(item)"/>
                  <Icon type="md-close-circle" size="22" color="#ed4014" title="删除" @click.stop="deleteFormGroup(item,index)"/>
                </div>
              </template>
              <MenuItem
                :name="JSON.stringify(list)"
                v-for="(list,idx) in (item.pages == null?[]:item.pages)" 
                :key="idx">
                <span :title="list.templatePageName" class="tree-title">{{ list?list.templatePageName:"" }}</span>
                <div class="icon-box" v-if="!preView">
                  <Icon type="md-color-wand" size="22" title="设计" color="#19be6b" @click.stop="designFormPage(list,idx)"/>
                  <Icon type="md-create" size="22" title="编辑" color="#2d8cf0" @click.stop="editFormPage(list,idx)"/>
                  <Icon type="md-close-circle" size="22" title="删除" color="#ed4014" @click.stop="deleteFormPage(list,idx,index)"/>
                </div>
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
      </div>
      <!-- 右侧设计内容展示区 -->
      <div class="box-right">
        <div v-html="pageDom" id="form_body" class="form-body"></div>
      </div>
    </div>

    <!-- 新增/编辑 表单页分组 -->
    <Modal v-model="handelFormStatus" :title="handelTitle">
      <Form ref="formGroupVali" :model="newFormGroup" :rules="newFormGroupVal" :label-width="80"
            @on-visible-change="changeState">
        <FormItem label="分组名称" prop="groupName">
          <Input v-model="newFormGroup.groupName" type="text" placeholder="请填写表单分组页名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelHandel">取消</Button>
        <Button type="primary" @click="sureHandel">确定</Button>
      </div>
    </Modal>

    <!-- 新增/编辑 表单页 -->
    <Modal v-model="formPageStatus" :title="formPageTitle">
      <Form ref="formPageVali" :model="newFormPage" :rules="newFormPageVal" :label-width="100"
            @on-visible-change="pageChangeState">
        <FormItem label="表单页名称" prop="templatePageName">
          <Input v-model="newFormPage.templatePageName" type="text" placeholder="请填写表单页名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelHanPage">取消</Button>
        <Button type="primary" @click="sureHanPage">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {ResearchProjectApi,TemplatePageApi, TemplatePageGroupApi} from '@/api/'
  //映入拖拽组件
  import draggable from 'vuedraggable'
  import html2canvas from 'html2canvas'
  export default {
    props:{
      templateMaster:{
        type:Object,
        default:()=>{
          return {}
        }
      },
      design:{
        type:Boolean,
        default:()=>{
          return true
        }
      },
      researchProject:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    data() {
      return {
        isTemplate:false,// 是否为模板 true表示为模板设计  false表示为表单设计
        activeMenu:"0",
        openNames:[],
        menuHeight:200,
        preView:false,
        theme: 'light',
        //表单页设计DOM
        pageDom: "",
        //表单ID
        headTitle:"",
        templateId: "",
        //是否已经设计完成
        ifDisigned: true,
        //操作类型
        handelType: "add",
        //新增/编辑 弹窗状态值
        handelFormStatus: false,
        //表单页列表
        formPageList: [],
        //新增编辑表单分组页
        handelTitle: "新增表单页分组",
        //表单分组页排序 数量
        groupNum: 0,
        //新增/编辑 表单分组页信息
        newFormGroup: {
          // 表单分组页名称
          groupName: "",
          // 表单分组页排列序号
          groupOrder: 0,
          //所属表单信息
          template: ''
        },
        //新增/编辑 验证
        newFormGroupVal: {
          groupName: [{required: true, message: "请填写表单分组名称", trigger: "blur"}]
        },
        //新增/编辑表单页弹窗状态值
        formPageStatus: false,
        //新增/编辑表单页弹窗头部信息
        formPageTitle: "新增表单页",
        //新增表单页信息
        newFormPage: {
          //名称
          templatePageName: "",
          //排列序号
          templatePageOrder: "",
          //内容
          templatePageContent: "",
          //所属表单
          template: "",
          //所属分组
          group: ""
        },
        //信息验证
        newFormPageVal: {
          templatePageName: [
            {required: true, message: "请填写名称", tigger: "blur"}
          ]
        },
        zujian:false,//是否为组件
        routeParams:{} // 路由带过来对象，用于多层返回保存参数
      }
    },
    watch:{
      templateId:function(newValue){
        this.newFormPage.template= newValue;
      },
      pageDom:function(newValue){
        if(!newValue){
          this.pageDom="<h1>页面未设计，请在左侧选择页面</h1>"
        }
      }
    },
    conputed: {},
    methods: {
      //选中子菜单
      itmeClick(data) {
        let parse = JSON.parse(data)
        TemplatePageApi.getitmeClickById(parse.id).then(res=>{
          if(res.data.code === '1'){
            let pageContent = res.data.data.templatePageContent;
            if (pageContent != "") {
              this.pageDom = pageContent;
            } else {
              //未设计，清空DOM并提示
              this.pageDom = "";
              this.$Message.error({
                content: "此表单还未设计，请设计",
                duration: 3
              })
            }
          }
        })
      },
      //新建表单页分组
      addNewFormPage() {
        this.handelType = "add"
        this.handelTitle = "新增表单页分组";
        this.handelFormStatus = true;
      },
      //新增/编辑 弹窗状态值改变
      changeState() {
        this.newFormGroup = {
          // 表单分组页名称
          groupName: "",
          // 表单分组页排列序号
          groupOrder: 0,
          //所属表单信息
          // template: this.routeParams.id
          template: this.templateId
        }
      },
      //确认新增/编辑 表单页分组
      sureHandel() {
        let _this = this;
        this.$refs.formGroupVali.validate((valid) => {
          if (valid) {
            if (this.handelType == "add") {
              //表单页分组排列序号
              this.newFormGroup.groupOrder = this.groupNum;
              this.newFormGroup.template=this.templateId
              console.log(this.newFormGroup)
              ResearchProjectApi.ajaxCom("/dr-api/template/template-page-group", "post", this.newFormGroup)
                .then(res => {
                  if (res.status == 200) {
                    this.$Message.success({
                      content: "新增成功",
                      duration: 2
                    });
                    //新增成功，排列序号加一
                    _this.groupNum++;
                    this.getAllGroups();
                    this.changeState();
                    this.handelFormStatus = false;
                  }
                }).catch(err => {
                this.changeState();
                this.$Message.error({
                  content: "新建失败，请重试",
                  duration: 2
                })
              })
            }

            //编辑表单分组页
            if (this.handelType == "edit") {
              ResearchProjectApi.ajaxCom("/dr-api/template/template-page-group", "post", this.newFormGroup)
                .then(res => {
                  if (res.status == 200) {
                    this.$Message.success({
                      content: "编辑成功",
                      duration: 2
                    });
                    this.changeState();
                    this.handelFormStatus = false;
                  }
                }).catch(err => {
                this.$Message.error({
                  content: "编辑失败，请重试",
                  duration: 2
                })
              })
            }
          } else {
            this.$Message.error({
              content: "请填写必填项",
              duration: 2
            })
          }
        })
      },
      //取消新增/编辑操作
      cancelHandel() {
        this.handelFormStatus = false;
        this.changeState();
      },
      //新增/编辑表单页弹窗状态值改变
      pageChangeState() {
        this.newFormPage = {
          //名称
          templatePageName: "",
          //排列序号
          templatePageOrder: "",
          //内容
          templatePageContent: "",
          //所属表单
          template: this.templateId,
          //所属分组
          group: ""
        }
      },
      //分组下新增子表单页
      addChildPage(item, index) {
        //填写表单ID 与 表单页分组ID
        this.newFormPage.template = this.templateId;
        this.newFormPage.group = item.id;
        //设置弹窗显示信息
        this.handelType = "add"
        this.formPageTitle = "新增表单页";
        this.formPageStatus = true;
      },
      //编辑表单分组信息
      editFormGroup(item) {
        this.handelType = "edit";
        this.handelTitle = "编辑表单页分组";
        this.handelFormStatus = true;
        this.newFormGroup = item;
      },
      //取消新增/编辑  表单页
      cancelHanPage() {
        this.pageChangeState();
        this.formPageStatus = false;
      },
      //确认新增/编辑  表单页
      sureHanPage() {
        let _this = this;
        this.$refs.formPageVali.validate((valid) => {
          if (valid) {
            if (this.handelType == "add") {
              ResearchProjectApi.ajaxCom("/dr-api/template/template-page", "post", this.newFormPage).then(res => {
                if (res.status == 200) {
                  this.$Message.success({
                    content: "新增成功",
                    duration: 2
                  })
                }
                this.getAllGroups();
                //初始化默认值
                this.pageChangeState();
                this.formPageStatus = false;
              }).catch(err => {
                this.pageChangeState();
                this.$Message.error({
                  content: "新增失败，请重试",
                  duration: 2
                })
              })
            }

            if (this.handelType == "edit") {
              ResearchProjectApi.ajaxCom("/dr-api/template/template-page", "post", this.newFormPage).then(res => {
                if (res.status == 200) {
                  this.$Message.success({
                    content: "编辑成功",
                    duration: 2
                  })
                }
                //初始化默认值
                this.pageChangeState();
                this.formPageStatus = false;
              }).catch(err => {
                this.$Message.error({
                  content: "编辑失败，请重试",
                  duration: 2
                })
              })
            }
          }
        })
      },
      //删除表单页分组
      deleteFormGroup(item, index) {
        if(item.pages){
          if(item.pages.length){
            this.$Message.error('先删除子表单页才能删除表单页分组')
            return
          }
        }
        let _this = this;
        this.$Modal.confirm({
          title: "删除表单页分组",
          content: "确定要删除此表单页分组吗？",
          onOk: function () {
            TemplatePageGroupApi.deletePageGroup(item.id)
              .then(res => {
                if (res.data.code == '1') {
                  this.$Message.success({
                    content: "表单页分组删除成功",
                    duration: 2
                  })
                  //前台删除
                  _this.formPageList.splice(index, 1);
                }
              }).catch(err => {
                this.$Message.error({
                  content: "删除失败，请重试",
                  duration: 2
                })
            })
          }
        })
      },
      //设计表单页
      designFormPage(list) {
        if(this.zujian === true){
          this.$router.push({path:'/form-page-design.html',query:{
            pageId: list.id,
            templateId:list.template,
            groupId:list.group,
            pageName:list.templatePageName,
            type:true
          }})
          // 用于从设计页返回去参数所用
          window.sessionStorage.setItem('ResearchProject',JSON.stringify(this.researchProject))
          window.sessionStorage.setItem('CurrentTmplate',JSON.stringify(this.templateMaster))
        }else{
          this.$router.push({path:'/form-page-design.html',query:{
            pageId: list.id,
            templateId:list.template,
            groupId:list.group,
            pageName:list.templatePageName,
            type:false
          }})
        }
      },
      //编辑表单页
      editFormPage(list) {
        this.newFormPage = list;
        this.handelType = 'edit';
        this.formPageTitle = "编辑表单页";
        this.formPageStatus = true;
      },
      //删除表单页
      deleteFormPage(list, idx, index) {
        let _this = this;
        this.$Modal.confirm({
          title: "删除表单页",
          content: "确定要删除此表单页吗？",
          onOk: function () {
            TemplatePageApi.deletePageById(list.id).then(res => {
              if (res.data.code == '1') {
                this.$Message.success({
                  content: "删除成功",
                  duration: 2
                });
                //前台做本地删除
                _this.formPageList[index].pages.splice(idx, 1);
              }
            }).catch(err => {
              this.$Message.error({
                content: "删除失败，如果被删除的为页面分组，须将其子页面全部删除后，方可删除页面分组！",
                duration: 5
              })
            })
          }
        })
      },
      //选取表单
      tmpChange(id){
        let obj = this.researchProject.templateMasters;
        for(let i = 0;i<obj.length;i++){
          if(obj[i].id == id){
            this.headTitle = obj[i].templateName;
            break
          }
        }
        this.templateId = id
        this.getAllGroups();
      },
      // 截图上传表单缩略图
      getPageImg(){
        html2canvas(document.querySelector('#form_body'), {
          allowTaint: true
        }).then((canvas) => {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let obj = {
            id: '',
            projectCode: 'research',
            folder: 'Img',
            file: {
              name: this.headTitle?this.headTitle+ '.jpeg':'未命名' + '.jpeg',
              base64Img:pageData
            }
          }
          TemplatePageApi.uploadTemplateImg(obj).then(res=>{
            // console.log(res)
            this.$Message.success('设置成功')
          }).catch(err=>{
            console.log(err)
          })
        })
      },
      //获取所有分组列表
      getAllGroups() {
        ResearchProjectApi.getAllGroupsList(this.templateId).then(res => {
          if(res.data.code === '1'){
            this.formPageList = res.data.data;
            if(this.formPageList.length>0){
              this.openNames = [this.formPageList[0].id]
              let templatePageList = this.formPageList[0].pages
              if(templatePageList){
                if(templatePageList.length>0){
                  this.activeMenu = JSON.stringify(templatePageList[0])
                  this.itmeClick(this.activeMenu)
                }
              }
              this.$nextTick(()=>{
                this.$refs.pageGroupsMenu.updateOpened()
                this.$refs.pageGroupsMenu.updateActiveName()
              })
            }
            //根据返回表单页分组数组长度，得到序号
            if (res.data.length == 0) {
              this.groupNum = res.data.length
            } else {
              this.groupNum = res.data.length - 1;
            }
          } else {
            this.$Message.error({
              content: "获取分组列表失败，请重试",
              duration: 2
            })
          }
        })
      },
      // 返回上一页
      returnBack(){
        let flag = this.$route.params.hasOwnProperty('isShow')?this.$route.params.isShow:false
        if(this.isTemplate){
          localStorage.setItem('alreadyFlag',flag)
          this.$router.back()
        }else{
          this.$router.push('/set-research-project.html?currentPage=' + this.routeParams.currentPage)
        }
      }
    },
    created(){
        // 如果从（模板或者表单）设计或者预览入口进入，$route.params 不为空
      // 将路由参数保存到sessionStorage中
      if(Object.keys(this.$route.params).length > 0){
        window.sessionStorage.setItem('RouterParams',JSON.stringify(this.$route.params))
        this.routeParams = this.$route.params
      }else{
        // 如果从表单设计页面返回，则去sessionStorage中值使用
        this.routeParams =JSON.parse(window.sessionStorage.getItem("RouterParams"))
      }
    },
    mounted() {
      if(this.preView){
        this.menuHeight = window.innerHeight ;
      }else{
        this.menuHeight = window.innerHeight - 100;
      }
   
      //作为组件的时候优先根据传递过的对象使用
      if(this.templateMaster&&this.templateMaster.id){
        this.templateId = this.templateMaster.id ;
        this.headTitle = this.templateMaster.templateName
        this.zujian =true //作为组件使用显示表单选择下拉框
      }
      if(!this.design){
        //在非设计模式下为预览模式
        this.ifDisigned = this.design
        this.preView = true
      }
      if (!this.zujian) { //非组件使用情况
        // 是否已经设计完成
        if (!this.routeParams.displayConfig) {
          this.ifDisigned = false;
        } else {
          this.ifDisigned = true;
        };
        // 是否为模板设计
        this.isTemplate = this.routeParams.isTemplate
        //不做组件使用
        if (this.routeParams.id) {
          this.templateId = this.routeParams.id;
          this.headTitle = this.routeParams.templateName;
          this.zujian = false
        }
        if (this.routeParams.preView) {
          this.preView = this.routeParams.preView;
        }
      }
      
      this.getAllGroups();
    },
    components: {
      draggable
    },
  
  }
</script>
<style lang="less">
@import '~@/components/ueditor/form-view/style.less';
.my-top-select{
  vertical-align:middle;
  height:40px;
  .ivu-select .ivu-select-dropdown{
    z-index: 999;
  }
}
  
</style>

<style lang="less" scoped>
  // 编辑器内容样式 用于展示设计后的效果
  @import '~@/components/ueditor/form-view/style.less';
  @import '/ueditor/vue-form/vue-form.css';

  .layout {
    background: #FFF;
    padding: 10px;
    min-height: 100%;

    .header-box {
      overflow: hidden;
      margin-bottom: 10px;

      .pro-name {
        float: left;
      }
    }

    .body-box {
      height: 100%;
      overflow: auto;
      .box-left {
        height: 100%;
        width: 20%;
        float: left;
        .tree-box {
          height: 100%;
          overflow: auto;
          .icon-box{
            float: right;
            margin-right: 21px;
          }
          .group-list {
            transition: all 1s;
          }

          .group-list-enter,
          .group-list-leave-active {
            opacity: 0;
          }
          .tree-title {
            display: inline-block;
            width: 40%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .box-right {
        height: 100%;
        width: 80%;
        float: left;
        padding-left: 20px;
        padding-top: 5px;
        border: 1px solid lavender;
        overflow-y: auto;
      }
    }
  }
</style>
