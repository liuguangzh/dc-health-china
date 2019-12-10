<template>
    <div class="form-wrap clear">
      <div class="form-page-left">
        <!-- 表单页树形菜单 -->
        <div class="form-page-nav">
          <Menu width="auto" :open-names="openFirstItems" :active-name="nowPage.id" @on-select="pageItemClick">
            <Submenu v-for="(item,index) in formPageList" :name="item.id" :key="item.id">
              <template slot="title">
                  {{item.groupName}}
              </template>
              <MenuItem v-for="(list,idx) in item.pages" :name="list.id" :key="list.id">{{list.templatePageName}}</MenuItem>
            </Submenu>
          </Menu>
        </div> <!-- form-page-nav 结束 -->
      </div> <!-- form-page-left 结束 -->
      <!-- 表单内容展示区域 -->
      <div ref="formPageCont" class="form-page-cont">
        <!-- <div class="form-page-title">
                    <h3 class="omiss">{{nowPage.templatePageName}}</h3>
                </div> -->
        <!-- form-page-title 结束 -->
        <div class="full-screen-btn-con">
          <Button @click.native="handleChange">{{!value ? '退出全屏' : '全屏' }}</Button>
        </div>

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
            <Button v-show="saveBtnVisible" class="foot-btn" type="primary" @click="saveTemplateResult">
              保存</Button>
            <Button v-show="isReadonly" class="foot-btn" type="primary" @click="printTemplateResult">打印</Button>
          </div>
        </div> <!-- form-page-foot 结束 -->
      </div> <!-- form-page-cont 结束 -->
    </div> <!-- form-wrap 结束 -->
</template>

<script>
  //获得服务器请求方法
  import {ResearchProjectApi} from '@/api/index.js'
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
    name:"fillReport",
    data() {
      return {
        registFinish:false,
        //表单结构列表
        formPageList:"",
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
        //全屏
        value: true,
        //
        isReadonly:false,
        
      };
    },
    props:[ 'templateId','resultMasterId','resultMaster'],
    // 计算属性
    computed: {
      // 当前显示表单页组件名称
      nowPageName() {
        return pluginName + this.nowPage.id;
      },
      // 生成树形菜单数据
      formPagesTree() {
        // return menuListToTree(this.formPages);
        return  this.formPageList
      },
      // 表单页查询地图
      formPagesMap() {
        let arr = [];
        this.formPageList.forEach((item,index)=>{
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
    mounted(){
      if(this.resultMasterId){
        this.masterId = this.resultMasterId;
      }
      this.getTemplatePages();
    },
    // 方法集
    methods: {
      handleFullscreen() {
        //  let main = document.body.getElementsByClassName("form-page-cont")
        let main = this.$refs.formPageCont;
        if (this.value) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          if (main.requestFullscreen) {
            main.requestFullscreen()
          } else if (main.mozRequestFullScreen) {
            main.mozRequestFullScreen()
          } else if (main.webkitRequestFullScreen) {
            main.webkitRequestFullScreen()
          } else if (main.msRequestFullscreen) {
            main.msRequestFullscreen()
          }
        }
      },
      handleChange() {
        this.value = !this.value;
        this.handleFullscreen()
      },
      // 获取表单模板下的表单页信息
      getTemplatePages() {
        // 请求参数
        let params = {
          // 表单模板ID
          templateId: this.templateId
        };
        // 发送请求
        ResearchProjectApi.ajaxCom("/api/template/template-page-group/get-template-groups",'get',params).then(res => {
          this.formPageList = res.data.data
          let arr=[];
          this.formPageList.forEach(item=>{
            arr.push(...item.pages)
          })
          // 设置表单页数据
          arr = M.map(arr, function (item) {
            // 页信息
            let obj = item.templatePage,
              // 页数据
              templateResultObj = item.templateResult || {};
            // // 设置表单页数据
            // obj.templateResult = templateResultObj.templateResult || null;
            // // 表单页数据ID
            // obj.templateResultId = templateResultObj.id || null;
            // // 表单页数据录入者ID
            // obj.templateResultCreateBy = templateResultObj.createBy || null;

            return obj;
          });
          // 设置表单页数据
          this.formPages = arr;
          // 展开所有一级菜单
          if (this.isOpenAllFirstItem) this.openAllFirstItem();
          // 如果存在数据
          if (arr.length) {
            // 设置第一个表单页为打开状态
            this.setFirstPageOpen();
            // 判断当前表单数据是否为自己录入的数据 设置保存按钮显示状态 管理员可以看到项目成员录入的数据 但不能修改
            this.setSaveState();
          }
          // 数据准备完毕 渲染表单页
          this.isReady = true;
          // 打印数据
        }).catch(err => {
          this.$Message.error("获取表单页数据失败!");
        });
      },
      //获取表单页结果
      getPageResult(id){
        let obj ={
          pageId:id,
        }
        if(this.masterId){
          obj.resultMasterId=this.masterId
        }
        //改变为false   防止组件未渲染成功，单已被加载导致报错
        this.registFinish = false;
         ResearchProjectApi.ajaxCom('/api/template/template-result/get-page-result','get',obj).then(res=>{
          if(res.data){
            this.nowPage.templateResult = res.data.templateResult;
            this.nowPage.templateResultId = res.data.id;
          }
          // 注册当前表单页组件
          this.registerFormPage();
        }).catch(err=>{
          this.$Message.error({
            content:'获取填报信息失败，请刷新重试',
            duration:2
          })
        })
      },
      // 表单页点击事件
      pageItemClick(id) {
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
        M.each(this.formPagesTree, item => {
          if (item.pages.length) names.push(item.id);
        });
        // 设置展开项
        this.openFirstItems = names;
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

      },
      // 注册所有的表单页 用于设计数据渲染
      registerFormPage() {
        // 获得当前页
        let page = this.nowPage;
        // 如果设计DOM 数据模型 配置项都存在
        if (page.templatePageContent && page.templatePageDataModel && page.config) {
          // 注册Vue组件
          // console.log(page,this.formStatus)
          registerFormPage(page, this.formStatus);
          this.registFinish =true;
          // 打印当前表单页
          // console.log(JSON.parse(JSON.stringify(page, null, 4)));
          // console.log(JSON.parse(page.templateResult || '{}'));
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
          // console.log(JSON.parse(JSON.stringify(res, null, 4)))
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
      // 保存表单录入数据
      saveTemplateResult() {
        console.log(this.nowPage.templateResultId)
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
            let postObj = {
                
              // 当前页ID
              templatePage:{
                id:nowPage.id
              },
              resultMaster:{
                  id:""
              },
              // 表单模板ID
              template:{
                id:this.templateId
              },
              templateResult,
            };
            // 如果文档ID存在
            if (this.masterId) {
              postObj.resultMaster.id = this.masterId;
            }
            // 如果表单页数据ID存在
            if (nowPage.templateResultId) {
              postObj.id = nowPage.templateResultId;
            }
            // 发送请求
            ResearchProjectApi.ajaxCom('/api/template/template-result/merge','post',postObj).then(res => {
              console.log(res)
              //当前文档id
              this.masterId = res.data.resultMaster.id;
              // 设置当前表单页数据的ID
              this.nowPage.templateResultId = res.data.id;
              // 设置表单页数据
              this.nowPage.templateResult = templateResult;
              // console.log(JSON.parse(JSON.stringify(this.formPages)));
              // 提示成功
              this.$Message.success("保存成功!");
            }).catch(err => {
              this.$Message.error({
                content: "登录信息失效，请重新登录！",
                duration: 3,
                onClose: () => {
                  this.$router.push('/login');
                }
              });
            });
          } else {
            this.$Message.error("保存失败，请检查填写数据是否正确!");
          }
        } else {
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
    }
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
     min-height: 100%;
    padding-left: 250px;
    border: 1px solid #ecf0f1;
    background:#FFF;
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
        text-overflow:ellipsis;
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
      padding-bottom:100px;
      overflow: auto;
    }

    .form-page-foot {
      width:100%;
      position: fixed;
      bottom:0;
      right:0;
      padding: 10px 0;
      text-align: center;

      .foot-btn {
        margin: 0 10px;
        padding: 5px 40px;
      }
    }
  }
</style>
