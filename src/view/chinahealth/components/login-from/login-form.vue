<style lang="less" scoped>
  @import './index.less';

</style>
<template>
  <div class="login-form">
    <div class="login-info">
      <p class="info-name" v-has-login="true">{{ username }}</p>
      <Button type="text" ghost @click="loginFormFlag = !loginFormFlag" v-has-login="false">登录</Button>
      <Button type="text" ghost @click="loginOut" v-has-login="true">退出</Button>
    </div>
    <login-form @on-success-valid="handleSubmit" @on-cancel-login="loginFormFlag = false;" v-if="loginFormFlag"></login-form>
  </div>
</template>
<script>
  import LoginForm from '_c/login-form'
  import {
    mapActions
  } from 'vuex'

  export default {
    name:'login-from-out',
    inject: ['reload'],
    data() {
      return {
        username: 'lili',
        loginFlag: false,
        loginFormFlag: false,
      }
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit({
        username,
        password
      }) {
        let that = this;
        this.handleLogin({
          username,
          password
        }).then(res => {
          this.getUserInfo().then(res => {
            that.$router.push("/")
            // that.reload()
          })
        })
      },
      //登出
      loginOut() {
        this.loginFlag = false;
      },
    },
    components:{
      LoginForm
    }
  }

</script>
