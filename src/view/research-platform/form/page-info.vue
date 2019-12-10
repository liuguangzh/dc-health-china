<style lang="less">
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <div class="layout">
    <!-- 表单详细信息管理 -->
    <Row type='flex' align="middle" :gutter=10 class-name="info-item">
      <Col span="3">
      <p class="info-name">表单名称：</p>
      </Col>
      <Col span="15">
      <p style="display:inline-block;margin-right:20px;">{{pageInfo.templateName}}</p>
      </Col>
      <Col span="5">
      <Button v-if="publishType === 1" type="primary" size='small' style="margin-right:10px;" @click="copyUrl">复制网址</Button>
      <Button type="primary" size="small" @click="$router.push('/set-research-project.html?currentPage='+ $route.query.currentPage)">返回</Button>
      </Col>
    </Row>
    <Row type='flex' align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
      <p class="info-name">开始时间：</p>
      </Col>
      <Col>
      <p>{{pageInfo.startDate}}</p>
      </Col>
    </Row>
    <Row type='flex' align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
      <p class="info-name">结束时间：</p>
      </Col>
      <Col>
      <p>{{pageInfo.endDate}}</p>
      </Col>
    </Row>
    <Row type='flex' align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
      <p class="info-name">表单描述：</p>
      </Col>
      <Col>
      <p>{{pageInfo.templateDesc}}</p>
      </Col>
    </Row>
    <Row type='flex' align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
      <p class="info-name">表单填报地址：</p>
      </Col>
      <Col span="20">
        <p style="word-wrap: break-word;word-break: normal;"  ref="urlBox">{{ pageInfo.reportPath }}</p>
      </Col>
    </Row>
    <Row v-if="publishType === 0" type='flex' align="top" :gutter="10">
      <Col span="3">
      <p class="info-name">表单填报人员：</p>
      </Col>
      <Col span="20">
      <Table :columns="tableHead" :data="fillerList" border></Table>
      </Col>
    </Row>
  </div>
</template>
<script>
import {ResearchProjectApi,TemplateApi} from "@/api/"
export default {
  data() {
    return {
      publishType:'0', // 填报人员列表显示标志
      reportUser: undefined,
      pageInfo: "",
      tableHead: [{
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: "真实姓名",
        key: "name"
      }, {
        title: "登录名",
        key: "username"
      }, {
        title: "手机号码",
        key: "phone"
      }, {
        title: "邮箱",
        key: "email"
      }
      // , {
      //   title: "填报地址",
      //   key: 'reportPath'
      // }
      ],
      fillerList: [{reportPath:''}]
    }
  },
  mounted() {
    if (!this.$route.query.templateId) {
      this.$Message.error({
        content: "获取信息失败，请'返回'重新查看",
        duration: 2
      })
    } else {
      this.templateId = this.$route.query.templateId;
      this.getPageInfo();
      this.getTemplateReportUser();
      this.publishType = this.$route.query.publishType
    }
  },
  methods: {
    getPageInfo() {
      TemplateApi.checkTemplateById(this.templateId).then(res => {
        if(res.data.code === '1'){
          res.data.data.startDate = res.data.data.startDate? res.data.data.startDate.slice(0, 10) :''
          res.data.data.endDate = res.data.data.endDate? res.data.data.endDate.slice(0, 10) :''
          this.pageInfo = res.data.data;
        } else {
          this.$Message.error('表单信息获取失败')
        }
      })
    },
    //复制网址
    copyUrl() {
      let _this = this
      let urlText = this.$refs.urlBox.innerHTML
      this.$copyText(urlText).then(res=> {
        _this.$Message.success({
          content: "复制成功",
          duration: 2
        })
      }).catch(err=>{
        _this.$Message.error({
          content: "复制失败，请手动复制",
          duration: 2
        })
      })
    },
    getTemplateReportUser: function () {
      TemplateApi.findReportUserByTemplateId(this.templateId).then(res => {
        if(res.data.code === '1'){
          if(res.data.data){
            this.reportUser = res.data.data;
            this.fillerList = [];
            if (this.reportUser) {
              this.reportUser.forEach(item => {
                let obj = {
                  ...item,
                  reportPath: item.reportPath?item.reportPath:''
                };
                this.fillerList.push(obj)
              })
            }
          }
        } else {
          this.$Message.error('填报人员信息获取失败')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.layout {
  padding: 10px 10px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  .info-name {
    text-align: right;
  }
  .info-item {
    margin-bottom: 10px
  }
}
</style>
