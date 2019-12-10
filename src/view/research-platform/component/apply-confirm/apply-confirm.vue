<template>
  <div class="mask">
    <p class="mask-title">申请确认</p>
    <Row type="flex" align="bottom" style="margin-bottom:20px;" :gutter="15">
      <Col span="5">
        <span>审核时间：</span>
        <DatePicker type="date" :editable="false" placeholder="选择审核开始时间" @on-change="getStartDate"></DatePicker>
      </Col>
      <Col span="5" style="margin-left:-15px;">
        <span style>至：</span>
        <DatePicker type="date" :editable="false" placeholder="选择审核结束时间" @on-change="getEndDate"></DatePicker>
      </Col>
      <Col span="5">
        <span>申请人：</span>
        <Input v-model="applyUser" style="width:70%;"></Input>
      </Col>
      <Col span="5" v-if="currentName !== 'wait'">
        <span>审核状态：</span>
        <Select clearable v-model="applyStatus" style="width:70%;">
          <!-- <Option value="1">待审核</Option> -->
          <Option :value="1">已通过</Option>
          <Option :value="-1">未通过</Option>
        </Select>
      </Col>
      <Col span="3">
        <Button type="primary" @click="findByTerm">查询</Button>
      </Col>
    </Row>
    <Tabs type="card" @on-click="changeTab">
      <TabPane label="待审核" name="wait">
        <Table :columns="columnsMy" :data="waitApplyData" border></Table>
        <div style="text-align:center;margin-top:10px;">
          <Page :current="wCurrentPage" :total="wTotal" show-total @on-change="wChange"></Page>
        </div>
      </TabPane>
      <TabPane label="已审核" name="already">
        <Table :columns="columnsOther" :data="alreadyApplyData" border></Table>
        <div style="text-align:center;margin-top:10px;">
          <Page :current="aCurrentPage" :total="aTotal" show-total @on-change="aChange"></Page>
        </div>
      </TabPane>
    </Tabs>
    <Button class="close-btn" type="primary" @click="closeModal">返回</Button>
    <Modal title="确定审核" v-model="modalStatus" @on-close="closeHandleModal">
      <p style="font-size:16px;line-height:40px">{{applySureText}}</p>
      <Input
        v-if="applyType === 0"
        v-model="applyReason"
        type="textarea"
        :rows="4"
        placeholder="请填写审核意见..."
      ></Input>
      <div slot="footer">
        <Button @click="closeHandleModal">取消</Button>
        <Button type="primary" @click="handelTheApply">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { AuditApplyApi } from "@/api/index.js";
export default {
  data() {
    return {
      modalStatus: false,
      startDate: "",
      endDate: "",
      applyUser: "",
      applyStatus: "",
      columnsMy: [
        {
          title: "序号",
          key: "projectNum",
          width: 60
        },
        {
          title: "申请时间",
          key: "applyTime",
          width: 100
        },
        {
          title: "申请人",
          key: "applyPersonName",
          width: 100
        },
        {
          title: "申请人电话",
          key: "applyPhone",
          width: 100
        },
        {
          title: "申请人单位",
          key: "unitName"
        },
        {
          title: "申请描述",
          key: "applyDesc"
        },
        {
          title: "审核状态",
          key: "applyText",
          width: 100
        },
        {
          title: "审核",
          key: "toAudit",
          width: 190,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    ghost: true
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.auditApply(params, 1);
                    }
                  }
                },
                "同意"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    ghost: true
                  },
                  on: {
                    click: () => {
                      this.auditApply(params, 0);
                    }
                  }
                },
                "不同意"
              )
            ]);
          }
        }
      ],
      columnsOther: [
        {
          title: "序号",
          key: "projectNum",
          width: 60
        },
        {
          title: "申请时间",
          key: "applyTime"
        },
        {
          title: "申请人",
          key: "applyPersonName"
        },
        {
          title: "申请人单位",
          key: "unitName"
        },
        {
          title: "申请人电话",
          key: "applyPhone"
        },
        {
          title: "审核状态",
          key: "applyText"
        },
        {
          title: "审核描述",
          key: "applyDesc"
        }
      ],
      waitApplyData: [],
      alreadyApplyData: [],
      applyReason: "",
      applySureText: "您确定同意此填报申请吗？",
      applyType: 0, // 待审核 0 已审核 2 不通过 -1 通过 1
      wCurrentPage: 1,
      aCurrentPage: 1,
      wTotal: 0,
      aTotal: 0,
      currentName: "wait"
    };
  },
  props: {
    applyTemplateId: {
      type: String,
      default: ""
    }
  },
  methods: {
    wChange(i) {
      this.wCurrentPage = i;
      this.getApplyList();
    },
    aChange(i) {
      this.aCurrentPage = i;
      this.getApplyList();
    },
    getStartDate(v) {
      this.startDate = v;
    },
    getEndDate(v) {
      this.endDate = v;
    },
    changeTab(name) {
      this.currentName = name;
      if (name === "wait") {
        this.applyStatus = 0;
        this.getApplyList();
      } else {
        this.applyStatus = 2;
        this.getApplyList();
      }
    },
    //通过条件查询
    findByTerm() {
      if (this.currentName === "wait") {
        this.wCurrentPage = 1;
      } else {
        this.aCurrentPage = 1;
      }
      this.getApplyList();
    },
    //审核   1同意  0不同意
    handelTheApply() {
      let applyStatus;
      if (this.applyType === 1) {
        applyStatus = 10;
      } else if (this.applyType === 0) {
        applyStatus = -1;
        if (this.applyReason === "") {
          this.$Message.error({
            content: "请填写审核意见"
          });
          return;
        }
      }
      let obj = {
        applyId: this.checkedId,
        applyStatus: applyStatus,
        confirmOpinion: this.applyReason
      };
      AuditApplyApi.toApply(obj)
        .then(res => {
          if (res.data.code === '1') {
            this.$Message.success({
              content: "审核成功",
              duration: 2
            });
            this.getApplyList();
          } else {
            this.$Message.error({
              content: "审核失败",
              duration: 2
            });
          }
        }).catch(err => {
          this.$Message.error({
            content: err,
            duration: 2
          });
        });
    },
    //关闭-审核确认
    closeHandleModal() {
      this.applyReason = "";
      this.modalStatus = false;
    },
    //关闭-申请确认
    closeModal() {
      this.$emit("now-close");
    },
    //审核
    auditApply(v, t) {
      this.checkedId = v.row.id;
      this.applyType = t;
      if (t === 0) {
        this.applySureText = "您确定拒绝此申请填报吗？如果拒绝，请填写审核意见";
      } else {
        this.applySureText = "您确定同意此填报申请吗？";
      }
      this.modalStatus = true;
    },
    //获取申请列表
    getApplyList() {
      //清空数据
      this.alreadyApplyData = [];
      this.waitApplyData = [];
      
      let obj = {
        templateId: this.applyTemplateId,
        pageSize: 10,
        pageNo:
          this.currentName === "wait"
            ? this.wCurrentPage - 1
            : this.aCurrentPage - 1
      };
      if (this.applyUser) {
        obj.userName = this.applyUser;
      }
      if (this.startDate) {
        obj.startDate = this.startDate;
      }
      if (this.endDate) {
        obj.endDate = this.endDate;
      }
      obj.applyStatus = this.applyStatus;
      AuditApplyApi.applyReport(obj).then(res => {
        if (res.data.data.data) {
          if (this.currentName === "wait") {
            this.wTotal = res.data.data.totalRows;
            this.waitApplyData = res.data.data.data.map((item, index) => {
              return {
                id: item.id,
                projectNum: index + 1,
                applyTime: item.createDate.slice(0, 10),
                applyUser: item.applyPersonName,
                applyStatus: item.applyStatus,
                applyText: "待审核",
                applyPersonName: item.applyPersonName,
                unitName: item.unitName,
                applyDesc: item.applyDesc,
                applyPhone: item.applyPhone
              };
            });
          }
          if (this.currentName === "already") {
            this.aTotal = res.data.data.totalRows;
            this.alreadyApplyData = res.data.data.data.map((item, index) => {
              let applyText;
              if (item.applyStatus == 10 || item.applyStatus == 11) {
                applyText = "已通过";
              } else if (item.applyStatus == -1) {
                applyText = "未通过";
              }
              return {
                id: item.id,
                projectNum: index + 1,
                applyTime: item.createDate.slice(0, 10),
                applyUser: item.applyPersonName,
                applyStatus: item.applyStatus,
                applyText: applyText,
                applyPersonName: item.applyPersonName,
                unitName: item.unitName,
                applyDesc: item.applyDesc,
                applyPhone: item.applyPhone
              };
            });
          }
        } else {
          this.alreadyApplyData = [];
          this.waitApplyData = [];
        }
        this.modalStatus = false;
      }).catch(err => {
      });
    }
  },
  mounted() {
    this.applyStatus = 0;
    this.getApplyList();
  }
};
</script>
<style lang="less" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #fff;
  padding: 15px;
  overflow: auto;
  .mask-title {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
  }
  .close-btn {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
}
</style>


