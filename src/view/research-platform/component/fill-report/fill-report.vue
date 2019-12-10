<template>
  <div class="form-wrap clear">
    <div class="form-page-left">
      <!-- 表单页树形菜单 -->
      <div class="form-page-nav" v-if="menuKind == 'menu'">
        <Menu ref="side_menu"  width="auto" :open-names="openFirstItems" :active-name="nowPage.id" @on-select="pageItemClick">
          <Submenu v-for="(item,index) in formPageList" :name="item.id" :key="item.id">
            <template slot="title">
              {{item.groupName}}
            </template>
            <MenuItem v-for="(list,idx) in item.pages" :name="list.id" :key="list.id">
              {{list.templatePageName}}
            </MenuItem>
          </Submenu>
        </Menu>
      </div> <!-- form-page-nav 结束 -->
      <Steps :current="currentIndex" direction="vertical" v-if="menuKind == 'steps'" style="margin-left:10px;margin-top:10px;">
        <Step v-for="(item,index) in formPages" :key="index" :title="item.templatePageName" @click.native="pageItemClick(item.id,index)" style="cursor:pointer;"></Step>
      </Steps>
    </div> <!-- form-page-left 结束 -->
    <!-- 表单内容展示区域 -->
    <div ref="formPageCont" class="form-page-cont"  v-bind:style="minHeightObj">
      <div class="form-page-body">
        <template v-if="nowPage.templatePageContent&&registFinish">
          <component ref="formContent" :is="nowPageName"></component>
        </template>
        <template v-else>
          请先设计当前表单页内容!
        </template>
      </div> <!-- form-page-body 结束 -->
      <div class="form-page-foot">
        <div style="display: inline-block;">
          <!-- <div>{{templateId}}--{{resultMasterId}}</div> -->
          <!-- <Button v-show="editOrSee && saveBtnVisible" :loading="loadStatus" 
            class="foot-btn" type="primary" @click="submitTemplateResult">提交
          </Button> -->
          <Button v-show="editOrSee && saveBtnVisible" :loading="loadStatus" 
            class="foot-btn" type="primary" @click="saveTemplateResult">保存
          </Button>
          <Button v-if="returnKind" type="primary" class="foot-btn" @click="$router.go(-1)">返回</Button>
          <!-- <Button v-show="setViewStatus" class="foot-btn" type="success" @click="clearView">
            预览
          </Button>
          <Button v-show="!setViewStatus" class="foot-btn" type="primary" @click="allView">
            编辑
          </Button> -->

          <Button v-show="isReadonly" class="foot-btn" type="primary" @click="printTemplateResult">打印
          </Button>
        </div>
      </div> <!-- form-page-foot 结束 -->
    </div> <!-- form-page-cont 结束 -->
  </div> <!-- form-wrap 结束 -->
</template>

<script>
  //获得服务器请求方法
  import {ResearchProjectApi,TemplatePageGroupApi,TemplateResultApi} from '@/api/index.js'
  // 获得所有表单元数据模块类型
  import {
    pluginName,
    registerFormPage
  } from '@/components/ueditor/basic.js';
  // 获取公共方法
  import {
    menuListToTree
  } from '@/common/js/Base.js';
  // 状态
  import {
    mapState,
    mapMutations
  } from 'vuex';
  // 组件实例
  export default {
    // 数据
    name: "fillReport",
    data() {
      return {
        currentIndex:0,

        minHeightObj:{
          'min-height':'500px'
        },
        registFinish: false,
        //表单结构列表
        formPageList: "",
        // 当前表单信息
        nowFormInfo: {},
        // 表单页
        formPages: [],
        // 表单数据
        formObj: {},
        // 当前显示页
        nowPage: {},
        // 是否要展开所有一级菜单
        isOpenAllFirstItem: true,
        // 展开的一级菜单
        openFirstItems: [],
        // 左侧菜单是否准备好
        isReady: false,
        // 文档ID
        masterId: null,
        // 是否允许保存
        isSave: true,
        // 表单状态：编辑(edit)、只读(readonly)
        formStatus: 'edit',
        //
        isReadonly: false,
        //当前需要保存的元面值
        templateResultObj: undefined,
        //转换显示状态
        setViewStatus:true,
        loadStatus:false,//保存按钮保存状态值
        resultId: ''
      };
    },
    props: {
      templateId:String, 
      resultMasterId:String, 
      resultMaster:Object,
      menuKind:{
        type:String,
        default:'menu'//menu表单    steps '步骤'
      },
      type:{
        type:String,
        default:()=>{
          return 'edit'
        }
      },
      returnKind:{
        type:Boolean,
        default:()=>{
          return true
        }
      }
    },
    // 计算属性
    computed: {
      editOrSee(){
        if(this.type === 'edit'){
          return true
        }else{
          return false
        }
      },
      // 当前显示表单页组件名称
      nowPageName() {
        if(this.setViewStatus){
          return pluginName + this.nowPage.id
        }else{
          return pluginName + this.nowPage.id+this.formStatus;
        }
      },
      // 生成树形菜单数据
      formPagesTree() {
        // return menuListToTree(this.formPages);
        return this.formPageList
      },
      // 表单页查询地图
      formPagesMap() {
        let arr = [];
        this.formPageList.forEach((item, index) => {
          arr.push(...item.pages)
        })
        return M.indexBy(arr, "id");
      },
      // 保存按钮显示状态
      saveBtnVisible() {
        return this.nowPage.id && this.nowPage.templatePageContent && this.isSave && !this.isReadonly;
      },
      // 获取状态
      ...mapState({
        // 当前登录的用户
        currentUserId: (state) => {
          return state.user.userId
        },
      })
    },
    // 实例创建时
    created() {
      this.minHeightObj["min-height"] = document.documentElement.clientHeight -100 +"px"
    },
    mounted() {
      if (this.resultMasterId) {
        this.masterId = this.resultMasterId;
      }
      if(this.templateId){
        this.getTemplatePages();
      }
    },
    // 方法集
    methods: {
      //编辑显示
      allView(){
        this.setViewStatus = true;
        this.setShowState("edit");
        this.registerFormPage()
      },
      //整洁显示
      clearView(){
        this.setViewStatus = false;
        this.setShowState("readonly");
        this.registerFormPage('claearView')
      },
      //修改注册组件是用的状态  readonly 或 edit   
      setShowState(state){
        this.formStatus = state
      },
      createTepmpateResultObj: function () {
        let obj = {};
        obj.templateResultMaster = this.resultMaster.id;
        obj.template = this.resultMaster.template;
        obj.templatePage = this.nowPage.id;
        obj.templateResult = ""
        return obj
      },
      // 获取表单模板下的表单页信息
      getTemplatePages() {
        // 请求参数
        let params = {
          // 表单模板ID
          templateId: this.templateId
        };
        // 发送请求
        TemplatePageGroupApi.getTemplatePages(params).then(res => {
          if(res.data.code === '1'){
            this.formPageList = res.data.data
            let arr = [];
            this.formPageList.forEach(item => {
              arr.push(...item.pages)
            })
            this.formPages = arr;
            if(this.isOpenAllFirstItem){
              this.openAllFirstItem();
            }
            // 如果存在数据
            if (arr.length) {
              // 设置第一个表单页为打开状态
              this.setFirstPageOpen();
              // 判断当前表单数据是否为自己录入的数据 设置保存按钮显示状态 管理员可以看到项目成员录入的数据 但不能修改
              this.setSaveState();
            }
            // 数据准备完毕 渲染表单页
            this.isReady = true;
          } else {
            this.$Message.error("获取表单页数据失败!");
          }
        }).catch(err => {
          this.$Message.error("获取表单页数据失败!");
        });
      },
      //获取表单页结果
      getPageResult(id) {
        let obj = {
          pageId: id,
        }

        if (this.masterId) {
          obj.resultMasterId = this.masterId
        }
        //改变为false   防止组件未渲染成功，表单单已被加载导致报错
        this.registFinish = false;
        TemplateResultApi.getPageResult(obj).then(res => {
          if(res.data.code === '1'){
            if (res.data.data.length === 0) {
              this.templateResultObj = this.createTepmpateResultObj();
              this.resultId = ''
            } else {
              this.resultId = res.data.data[0].id
              this.nowPage.templateResult = res.data.data[0].templateResult;
              this.templateResultObj = res.data.data[0];
            }
            // 注册当前表单页组件
            this.registerFormPage();
          } else {
            this.$Message.error({
              content: '获取填报信息失败，请刷新重试',
              duration: 2
            })
          }
        }).catch(err => {
          this.$Message.error({
            content: '获取填报信息失败，请刷新重试',
            duration: 2
          })
        })
      },
      // 表单页点击事件
      pageItemClick(id,t) {
        if(t != undefined){
          this.currentIndex = t
        }
        // 获得当前打开的表单页ID
        let nowPageId = this.nowPage.id;
        // 如果点击的不等于当前打开的
        if (nowPageId !== id) {
          // 设置点击的表单页未打开页
          this.nowPage = this.formPagesMap[id];
          this.getPageResult(id);
        }
      },
      // 展开所有的一级菜单
      openAllFirstItem() {
        // 存放展开一级菜单ID的数组
        let names = [];
        // 遍历所有一级菜单
        M.each(this.formPageList, item => {
          names.push(item.id)
        });
        // 设置展开项
        this.openFirstItems = names.slice(0,1);
      },
      // 设置第一个表单页打开
      setFirstPageOpen() {
        // 获得树形菜单数据
        let treeList = this.formPageList,
          // 获得第一个表单页
          firstPage = treeList[0] || {},
          // 表单页ID
          pageId = null;

        // 如果存在子菜单
        if (firstPage.pages.length) {
          pageId = firstPage.pages[0].id;
        } else {
          pageId = firstPage.id;
        }
        // 设置当前打开页对象
        this.nowPage = this.formPagesMap[pageId];
        this.getPageResult(this.nowPage.id)
        // this.$nextTick(() => {
        //   this.$refs.side_menu.updateOpened();
        //   this.$refs.side_menu.updateActiveName();
        // })

      },
      // 注册所有的表单页 用于设计数据渲染
      registerFormPage(type) {
        // 获得当前页
        let page = this.nowPage;
        // 如果设计DOM 数据模型 配置项都存在
        if (page.templatePageContent && page.templatePageDataModel && page.config) {
          // 注册Vue组件
          registerFormPage(page, this.formStatus,type);
          this.registFinish = true;
          // 打印当前表单页
        }
      },
      // 获得表单填写数据
      getFormObj() {
        // 返回结果
        let res = null,
          // 当前表单页内容组件
          formContent = this.$refs.formContent;
        // 如果组件存在
        if (formContent) {
          res = formContent.getFormObj();
          res = JSON.stringify(res);
        }
        return res;
      },
      // 校验表单数据
      fromVerify() {
        // 返回结果
        let res = true,
          // 当前表单页内容组件
          formContent = this.$refs.formContent;
        // 如果组件存在
        if (formContent) {
          res = formContent.verifyFormObj();
        }
        return res;
      },
      // 提交表单录入数据
      submitTemplateResult() {
        TemplateResultApi.commitResultMaster(this.masterId).then(res => {
          if (res.data.code === '1') {
            // 先修改对应本地数据值
            this.$Message.success({
              content: '提交成功',
              duration: 2
            })
          } else {
            this.$Message.error({
              content: "提交失败，请重试",
              duration: 2
            })
          }
        }).catch(err => {
          this.$Message.error({
            content: "提交失败，请重试",
            duration: 2
          })
        })
      },
      // 保存表单录入数据
      saveTemplateResult() {
        this.loadStatus = true;
        // 获取填写
        let templateResult = this.getFormObj(),
          // 当前页
          nowPage = this.nowPage;
        // 如果获取成功
        if (templateResult) {
          let fromVerify = this.fromVerify();
          // 校验通过
          if (fromVerify) {
            // 请求参数
            // 发送请求
            this.templateResultObj.templateResult = templateResult
            this.templateResultObj.id = this.resultId
            TemplateResultApi.saveTemplateResult(this.templateResultObj).then(res => {
              if(res.data.code === '1'){
                // //当前文档id
                // this.masterId = res.data.data.templateResultMaster;
                // // 设置当前表单页数据的ID
                // this.nowPage.templateResultId = res.data.data.id;
                // // 设置表单页数据
                // this.nowPage.templateResult = templateResult;
                // 提示成功
                this.$Message.success("保存成功!");
                this.loadStatus = false
              } else {
                this.$Message.success("保存失败!");
                this.loadStatus = false
              }
            }).catch(err => {
              this.loadStatus = false
              this.$Message.error({
                content: "登录信息失效，请重新登录！",
                duration: 3,
                // onClose: () => {
                //   this.$router.push('/login');
                // }
              });
            });
          } else {
            this.loadStatus = false
            this.$Message.error("保存失败，请检查填写数据是否正确!");
          }
        } else {
          this.loadStatus = false
          this.$Message.error("获取表单填写数据失败!");
        }
      },
      // 打印当前的表单
      printTemplateResult() {
        // 表单模板ID
        let templateId = this.templateId,
          // 表单数据存放结果ID
          masterId = this.masterId;

        // 如果ID存在
        if (templateId && masterId) {
          window.open('/#/form-print?templateId=' + templateId + '&masterId=' + masterId);
        } else {
          this.$Message.error("获取表单信息失败！");
        }
      },
      // 设置保存按钮显示状态
      setSaveState() {
        // 如果保存数据的ID不存在
        if (!this.masterId) return;
        // 获得第一页数据
        let page = this.formPages[0] || {},
          // 创建者
          createBy = page.templateResultCreateBy;

        // 如果不是当前用户填写的数据 不可有保存
        if (createBy && this.currentUserId && this.currentUserId !== createBy) {
          this.isSave = false;
        }
      }
    },
    watch:{
      templateId(newvalue){
        this.getTemplatePages();
      },
      resultMasterId(newvalue){
        this.masterId = newvalue;
      }
    },
  };

</script>
<style lang="less">
  // 编辑器内容样式 用于展示设计后的效果
  @import '~@/components/ueditor/form-view/style.less';

</style>
<style lang="less" scoped>
  // 引入公共变量及方法
  @import '~@/common/less/base-style.less';
  @import '/ueditor/vue-form/vue-form.css';

  /* 主容器 */
  .form-wrap {
    position: relative;
    width: 100%;
    min-height: 500px;
    height: 100%;
    padding-left: 250px;
    border: 1px solid #ecf0f1;
    background: #FFF;
  }

  .form-page-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;

    &:after {
      content: '';
      display: block;
      width: 1px;
      height: 100%;
      background: #dddee1;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    }

    .form-title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50px;
      padding: 0 10px;
      line-height: 50px;
      background: #eee;

      h2 {
        font-weight: normal;
        font-size: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .form-page-cont {
    height: 100%;
    padding: 0 15px;
    padding-bottom: 15px;
    background: #fff;
    overflow: auto;

    .full-screen-btn-con .ivu-tooltip-rel {
      height: 64px;
      line-height: 56px;

      i {
        cursor: pointer;
      }
    }

    .form-page-title {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dddee1;

      h3 {
        font-weight: normal;
        font-size: 18px;
      }
    }

    .form-page-body {
      padding-top: 15px;
      padding-bottom: 100px;
      overflow: auto;
    }

    .form-page-foot {
      // width: 30%;
      // position: fixed;
      // bottom: 0;
      // right: 30%;
      padding: 10px 0;
      text-align: center;

      .foot-btn {
        margin: 0 10px;
        padding: 5px 40px;
      }
    }
  }
</style>
