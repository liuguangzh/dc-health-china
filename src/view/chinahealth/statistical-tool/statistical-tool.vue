<style lang="less" scoped>
  @import './index.less';
</style>
<template>
  <div class="layout1">
    <div class="tools-box">
      <div class="tool-item">
        <img class="tool-icon" :src="timeIcon" alt="">
        <p class="tool-title">实体数量</p>
        <p class="tool-num">123,321,123</p>
        <div class="tool-content">
            <p>2019.12.15<p/>
        </div>
      </div>
       <div class="tool-item">
        <img class="tool-icon" :src="childIcon" alt="">
        <p class="tool-title">本体数量</p>
        <p class="tool-num">444,333,222</p>
        <div class="tool-content">
            <p>2019.12.15<p/>
        </div>
      </div>
      <div class="tool-item">
        <img class="tool-icon" :src="numberIcon" alt="">
        <p class="tool-title">构建关系数量</p>
        <p class="tool-num">666,777,888</p>
        <div class="tool-content">
            <p>2019.12.15<p/>
        </div>
      </div>
       <div class="tool-item">
        <img class="tool-icon" :src="numberIcon" alt="">
        <p class="tool-title">RDF三元组数量</p>
        <p class="tool-num">999,999</p>
        <div class="tool-content">
            <p>2019.12.15<p/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import timeIcon from '@/assets/images/china-health/time.png'
  import childIcon from '@/assets/images/china-health/child.png'
  import numberIcon from '@/assets/images/china-health/number.png'
  export default {
    data() {
        return{
            timeIcon,
            childIcon,
            numberIcon
        }
    }
  }

</script>
