<template>
  <div class="layout">
    <!-- <login-form></login-form> -->
    <img class="logo" :src="topImg" alt="">
    <search-set :go-another="true" style="width:600px;"></search-set>
    <statistical-tool></statistical-tool>
  </div>
</template>

<script>
  import topImg from '@/assets/images/logo_2.jpg';
  import statisticalTool from './statistical-tool/index.js'
  import LoginForm from './login-form/index.js'
  import searchSet from './components/search-set/index.js'
  export default {
    name: 'chinaHealth',
    data() {
      return {
        topImg,
      }
    },
    methods: {
      //跳转到searchReasult
    },
    components: {
      statisticalTool,
      LoginForm,
      searchSet
    }
  }
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
