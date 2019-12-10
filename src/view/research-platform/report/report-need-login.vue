<template>
  <div class="layout">
    <Layout>
      <report-header :currentTemplateResultMaster="currentTemplateResultMaster"></report-header>
      <fill-report :templateId="templateId" :resultMasterId="templateResultMasterId"
                   :resultMaster="currentTemplateResultMaster" :returnKind='false'></fill-report>
    </Layout>

    <Modal v-model="loginModal" :closable="false" :mask-closable="false" :footer-hide="true" width="350">
      <p slot="header" style="color: red;font-size: 20px;text-align: center">
        系统登录
      </p>
      <login-form @on-success-valid="handleSubmit"></login-form>
    </Modal>
  </div>
</template>

<script>
  import FillReport from '../component/fill-report/fill-report.vue'
  import LoginForm from '_c/login-form'
  import {mapActions} from 'vuex'

  import {logout} from '@/api/user'
  import {getToken, setToken} from "../../../libs/util";

  import {TemplateResultApi} from '@/api/'
  import ReportHeader from "./report-header";

  export default {
    components: {
      ReportHeader,
      LoginForm,
      FillReport
    },
    data() {
      return {
        fillReportStatus: false,
        loginModal: true,
        templateId: "",
        templateResultMasterId: "",
        currentTemplateResultMaster: {
          templateName: ""
        },
      }
    },
    beforeMount(){
      this.templateResultMasterId= this.$route.params.resultId
    },
    mounted() {
      this.templateResultMasterId = this.$route.params.resultId
      this.getUserInfo().then(res => {
        if (!this.$store.state.user.hasGetInfo) {
          this.loginModal = true;
        } else {
          this.getTemplateResultMaster();
          this.loginModal = false;
        }
      })
    },
    name: "report-need-login",
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit({username, password}) {
        this.handleLogin({username, password}).then(res => {
          this.getMenuList().then(res => {
            console.log(res)
          })
          this.getUserInfo().then(res => {
            this.loginModal = false;
            this.getTemplateResultMaster();
          })
        })
      },
      getTemplateResultMaster: function () {
        TemplateResultApi.getTemplateResultMaster(this.templateResultMasterId).then(res => {
          this.templateId = res.data.template.id;
          this.currentTemplateResultMaster = res.data;
          if (this.currentTemplateResultMaster.sysUser.username !== this.$store.state.user.username) {
            logout(getToken()).then(res => {
              setToken("")
              let that = this ;
              this.$Modal.confirm({
                title: '系统提示',
                content: '当前登录用户不能够填写改项目，请使用' + this.currentTemplateResultMaster.sysUser.username + "进行登录,是否重新登录？",
                onOk:function(){
                  that.loginModal = true ;
                },
                onCancel:function(){
                  that.$router.push("/login.html")
                }
              })
            })


          }
        })
      }
    }
  }
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
