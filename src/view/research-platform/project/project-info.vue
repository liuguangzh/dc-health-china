<style lang="less">
.ivu-table th {
  background: #e6e7e8;
}
</style>
<template>
  <div class="layout">
    <!-- 表单详细信息管理 -->
    <Row type="flex" align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
        <p class="info-name">任务名称：</p>
      </Col>
      <Col span="18">
        <p style="display:inline-block;margin-right:20px;">{{projectInfo.researchProjectName}}</p>
      </Col>
      <Col span="2">
        <Button
          type="primary"
          size="small"
          @click="$router.push('/project.html?currentPage=' +$route.query.currentPage)"
        >返回</Button>
      </Col>
    </Row>
    <Row type="flex" align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
        <p class="info-name">任务负责单位：</p>
      </Col>
      <Col>
        <p>{{projectInfo.department}}</p>
      </Col>
    </Row>
    <Row type="flex" align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
        <p class="info-name">任务负责人：</p>
      </Col>
      <Col>
        <p>{{projectInfo.leader}}</p>
      </Col>
    </Row>
    <Row type="flex" align="middle" :gutter="10" class-name="info-item">
      <Col span="3">
        <p class="info-name">任务描述：</p>
      </Col>
      <Col>
        <p>{{projectInfo.description}}</p>
      </Col>
    </Row>
    <Row type="flex" align="top" :gutter="10">
      <Col span="3">
        <p class="info-name">任务管理员：</p>
      </Col>
      <Col span="20">
        <Table :columns="tableHead" :data="tableDate" border></Table>
      </Col>
    </Row>
  </div>
</template>
<script>
import { ResearchProjectApi, CreateResearchProjectApi } from "@/api/";
export default {
  data() {
    return {
      projectInfo: "",
      projectId: "",
      tableHead: [
        {
          title: "序号",
          key: "tabIdx",
          width: 80
        },
        {
          title: "真实姓名",
          key: "fillerName"
        },
        {
          title: "登录名",
          key: "loginName"
        },
        {
          title: "手机号码",
          key: "phoneNumber"
        },
        {
          title: "邮箱",
          key: "email"
        }
      ],
      //管理人员名单
      tableDate: []
    };
  },
  mounted() {
    if (!this.$route.query.projectId) {
      this.$Message.error({
        content: "获取信息失败，请'返回'重新查看",
        duration: 2
      });
    } else {
      this.projectId = this.$route.query.projectId;
      this.getProjectInfo();
    }
  },
  methods: {
    getProjectInfo() {
      CreateResearchProjectApi.checkResearchProject(this.projectId).then(res => {
        console.log(res)
        if(res.data.code === '1'){
          this.projectInfo = res.data.data;
          if(res.data.data.userVos){
            this.tableDate = JSON.parse(JSON.stringify(res.data.data.userVos));
            this.tableDate = this.tableDate.map((item, index) => {
              return {
                tabIdx: index + 1,
                fillerName: item.name,
                loginName: item.username,
                phoneNumber: item.phone,
                email: item.email
              }
            })
          }
        } else {
          this.$Message.error({
            content: "获取信息失败，请返回重试",
            duration: 2
          })
        }
      }).catch(err => {
        this.$Message.error({
          content: "获取信息失败，请返回重试",
          duration: 2
        })
      })
    }
  }
};
</script>
<style lang="less"scoped>
.layout {
  padding: 10px 10px;
  min-height: 100%;
  background: #fff;
  border-radius: 4px;
  .info-name {
    text-align: right;
  }
  .info-item {
    margin-bottom: 10px;
  }
}
</style>


