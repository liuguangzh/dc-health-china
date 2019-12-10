<template>
  <div class="mask">
    <p class="mask-title">{{title}}</p>
    <Tabs type="card" @on-click="changeTab">
      <TabPane label="已提交" name="sub">
        <Table :columns="columnsMy" :data="subData" border></Table>
      </TabPane>
      <TabPane label="未提交" name="noSub">
        <Table :columns="columnsMy" :data="nosubData" border></Table>
      </TabPane>
    </Tabs>
    <div style="text-align:center;margin-top:15px;">
      <Page :total="totalNum" show-elevator show-total show-sizer @on-change="changePage"
        @on-page-size-change="changePageSize"></Page>
    </div>
    <Button class="close-btn" type="primary" @click="closeModal">返回</Button>
  </div>
</template>
<script>
  import config from '@/config/index.js'
  import {
    TemplateApi,
    TemplateResultApi
  } from '@/api/index.js'
  export default {
    data() {
      return {
        done: 1, //0
        currentName: 'sub',
        currentPage: 1,
        pageSize: 10,
        totalNum: 20,
        columnsMy: [{
          title: '序号',
          key: 'projectNum',
          width: 60
        }, {
          title: '填报时间',
          key: 'fillTime',
        }, {
          title: '填报人',
          key: 'fillUser',
        }, {
          title: '承诺书',
          key: 'downBook',
          render: (h, params) => {
            if (params.row.bookId != "noBook") {
              return h('div', [
                h('Button', {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.downBook(params)
                    }
                  }
                }, '查看承诺书')
              ])
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: "error",
                    size: "small"
                  },
                }, '未上传')
              ])
            }
          }
        }],
        subData: [],
        nosubData: [],
      }
    },
    props: {
      title: {
        type: String,
        default: "填报数量"
      },
      templateId: String
    },
    methods: {
      downBook(params) {
        window.open(config.downLoadAddress + '?url=' + params.row.promiseFilePath)
          //  window.location.href ="/api/file/download?fileId="+params.row.bookId
        //   TemplateApi.downLoadTemplateFile(params.row.bookId).then(
        //       res=>{
        //           console.log(res)
        //       }
        //   ).catch(err=>{
        //       console.log(err.response)
        //   })
      },
      //切换TAB
      changeTab(name) {
        if (this.currentName == name) return;
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalNum = 10;
        if (name == 'sub') {
          this.done = 1;
        } else {
          this.done = 0
        }
        this.currentName = name;
        this.getNumberList();
      },
      //关闭此组件
      closeModal() {
        this.$emit('on-close')
      },
      //改变分页
      changePage(index) {
        this.currentPage = index;
        this.getNumberList()
      },
      changePageSize(size) {
        this.pageSize = size;
        this.getNumberList();
      },
      //获取申请列表
      getNumberList() {
        let obj = {
          templateId:this.templateId,
          //当前页
          page: this.currentPage - 1,
          //每页显示条数
          size: this.pageSize,
          //done 0 未提交 1已提交
          done: this.done
        }
        TemplateResultApi.getFillList(obj).then(res => {
          console.log(res)
          this.totalNum = res.data.totalElements
          if (res.data.content.length > 0) {
            let _this = this;
            let numData = JSON.parse(JSON.stringify(res.data.content)).map((item, index) => {
              return {
                projectNum: (_this.currentPage - 1) * _this.pageSize + index + 1,
                fillTime: item.createTime ? item.createTime.slice(0, 10) : "",
                fillUser: item.sysUser.username,
                bookId: item.template.templateFileStore ? item.template.templateFileStore.id : "noBook"
              }
            })
            if (this.done == 0) {
              this.nosubData = numData;
            }
            if (this.done == 1) {
              this.subData = numData;
            }
            console.log(this.subData)
          }
        }).catch(err => {
          console.log(err.response);
          this.$Message.error({
            content: "无数据",
            duration: 2
          })
        })
      }
    },
    mounted() {
      this.getNumberList();
    }
  }

</script>
<style lang="less" scoped>
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #FFF;
    padding: 15px;
    overflow: auto;

    .mask-title {
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee
    }

    .close-btn {
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
  }

</style>
