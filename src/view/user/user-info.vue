<template>
  <div>
    <Card>
      <div slot="title">
        <span style="margin-right:30px;font-size: 14px;color: #17233d;font-weight: bold;">基本信息</span>
        <!-- <Button type="primary" @click="changePwd">修改密码</Button>     -->
      </div>
      <Row :gutter="20" type="flex">
        <Col span="1"></Col>
        <Col span="4">姓名:{{userInfo.name}}</Col>
        <Col span="4">登录名:{{userInfo.username}}</Col>
        <Col span="4">联系电话:{{userInfo.tel}}</Col>
        <Col span="8">电子邮箱:{{userInfo.email}}</Col>
      </Row>
    </Card>
    <Card title="关联账号">
      <Row :gutter="10" type="flex">
        <Col span="1"></Col>
        <Col span="8">
          登录名:
          <Input v-model="loginName" placeholder="请输入用户名" clearable style="width:300px"></Input>
        </Col>
        <Col span="8">
          密码:
          <Input
            v-model="loginPwd"
            type="password"
            placeholder="请输入密码"
            clearable
            style="width:300px;"
          ></Input>
        </Col>
        <Col span="2">
          <Button type="primary" @click="relateOtherUser">关联账号</Button>
        </Col>
      </Row>
      <p
        style="margin-top:15px;color:#000;font-weight:blod;"
      >系统支持您将其他人创建任务时为您创建的账号关联到自己注册的账号上,请输入要关联账号的用户名密码,关联后请统一使用宁注册的账号登陆,关联账号将不可使用</p>
    </Card>
    <Card title="关联记录">
      <Table border :data="tableDate" :columns="columns"></Table>
      <div style="margin-top:10px;text-align:center;">
        <Page
          :current="currentPage"
          :page-size="pageSize"
          :total="totalNum"
          show-total
          @on-change="changePage"
        ></Page>
      </div>
    </Card>
  </div>
</template>
<script>
import { getUserInfo, relateOtherUser, getRelateUsers } from "@/api/index.js";
import { getFormartDate } from "@/libs/tools.js";
export default {
  data() {
    return {
      userInfo: {},
      loginName: "",
      loginPwd: "",
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      columns: [
        {
          type: "index",
          title: "序号",
          width: 100
        },
        {
          title: "登录名",
          key: "otherName"
        },
        {
          title: "账号创建者",
          key: "createName"
        },
        {
          title: "填报表单名称",
          key: "templateNames"
        },
        {
          title: "关联时间",
          key: "relationTime",
          render: (h, params) => {
            return h("div", getFormartDate(params.row.relationTime));
          }
        }
      ],
      tableDate: []
    };
  },
  methods: {
    // 获取当前登录用户信息
    getUserInfo() {
      getUserInfo()
        .then(res => {
          if(res.data.code === '1'){
            this.userInfo = res.data.data;
          } else {
            this.Message.error("获取用户信息失败");
          }
        })
        .catch(err => {
          this.Message.error("获取用户信息失败");
        });
    },
    changePwd() {},
    // 关联用户
    relateOtherUser() {
      if (!this.loginName) {
        this.$Message.error("请填写关联账号");
        return;
      }
      if (!this.loginPwd) {
        this.$Message.error("请填写关联账号密码");
        return;
      }
      let obj = {
        username: this.loginName,
        password: this.loginPwd
      };
      relateOtherUser(obj).then(res => {
        if (res.data.code === '1') {
          this.$Message.success("关联成功");
          this.getRelateUsers();
        } else {
          this.$Message.error("关联失败");
        }
      }).catch(err => {
        this.$Message.error("关联失败");
      });
    },
    // 获取关联记录
    getRelateUsers() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      getRelateUsers(obj).then(res => {
        this.tableDate = res.data.data.data;
        this.totalNum = res.data.data.totalRows;
      }).catch(err => {});
    },
    // 改变分页
    changePage(index) {
      this.currentPage = index;
      this.getRelateUsers();
    }
  },
  mounted() {
    this.getUserInfo();
    this.getRelateUsers();
  }
};
</script>
<style lang="less">
</style>

