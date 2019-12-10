<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import CreateGuide from "./view/single-page/home/create-guide";

  export default {
    components: {CreateGuide},
    name: 'App',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {

        isRouterAlive: true
      }
    },
    computed: mapState({
      error: state => state.app.errorList,
      errorAlias: 'error'
    }),
    watch: {
      error (newVal) {
        // this.$Message.error(newVal[newVal.length - 1].mes)
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        let that = this
        this.$nextTick(function () {
          that.isRouterAlive = true
        })
      }
    },
    mounted() {
      let _this = this
      let token = _this.$store.state.user.token
          localStorage.setItem('MyToken',token)
      let sBrowser, sUsrAg = navigator.userAgent;
      if (sUsrAg.indexOf("Firefox") > -1) {
        sBrowser = "Mozilla Firefox";
        // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
      } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
        sBrowser = "Opera";
        //"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
      } else if (sUsrAg.indexOf("Trident") > -1) {
        sBrowser = "Microsoft Internet Explorer";
        // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
      } else if (sUsrAg.indexOf("Edge") > -1) {
        sBrowser = "Microsoft Edge";
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
      } else if (sUsrAg.indexOf("Chrome") > -1) {
        sBrowser = "Chrome or Chromium";
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
      } else if (sUsrAg.indexOf("Safari") > -1) {
        sBrowser = "Apple Safari";
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
      } else {
        sBrowser = "unknown";
      }
      if(sBrowser === 'Chrome or Chromium' || sBrowser === 'Mozilla Firefox'){
	      let _beforeUnload_time = 0, _gap_time = 0;
        window.onunload = function (){
          _gap_time = new Date().getTime() - _beforeUnload_time;
          if(_gap_time <= 5){
            _this.$store.commit('setToken','')
          }else{//浏览器刷新
          }
        }
        window.onbeforeunload = function (){ 
          _beforeUnload_time = new Date().getTime();
          if(sBrowser === 'Mozilla Firefox'){//火狐关闭执行
             _this.$store.commit('setToken','')
          } 
        };
      }else{
        //IE 浏览器 刷新先触发onbeforeunload 然后 onunload  
        //关闭时 只触发 onbeforeunload
      //   window.onbeforeunload = function (){
      //     _this.$store.commit('setToken','')
      //   }
      //   window.onload = function() {
      //     let MyToken = localStorage.getItem('MyToken')
      //     _this.$store.commit('setToken',MyToken)
      //   }
      }
    }
  }
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }

  html, body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    .size;
  }
</style>
