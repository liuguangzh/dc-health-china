<style lang="less" scoped>
  @import './index.less';
</style>
<template>
  <div class="relation-choose" :class="{'ab-right':active}">
    <div class="left-icon" @click="changflag">
      <img :src="subIcon" width="30" height="30" alt='关系筛选'>
    </div>
    <div class="relation-box">
      <p class="box-title">关系筛选</p>
      <div class="inner-box">
        <div class="entity-check" v-for="(item,index) in linkData" :key="index">
          <input type="checkbox" :value="item" v-model="entities" @change="toAdd">
          <div style="display:inline-block;width:20%;">{{item}}</div>
          <div style="width:70%;display:inline-block;">
            <Progress :percent="100" :stroke-width="5" hide-info />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import subIcon from '_a/images/china-health/sub-choose.png'
  export default {
    data() {
      return {
        subIcon,
        entities: [],
        active: false,
      }
    },
    props: {
      linkData: {
        type: Array,
      }
    },
    watch: {
      linkData(v,ov) {
        this.entities= v;
        // //由于每次都是全部关系重新过来，所以这里选出为选中的，
        // let linshi = []
        // ov.forEach(item => {
        //   if(this.entities.indexOf(item) == -1){
        //     linshi.push(item)
        //   }
        // });
        // console.log(linshi)
        // //先清空选中关系数组，
        // this.entities = [];
        // //新传过来的关系中去除未选择的，放入动态选择数组中
        // v.forEach(item=>{
        //   console.log(typeof item)
        //   console.log(linshi.indexOf(item))
        //   if(linshi.indexOf(item) == -1){
        //     this.entities.push(item)
        //   }
        // })
        // console.log(this.entities)
      }
    },
    methods: {
      //选中关系，进行赋值
      toAdd() {
        this.$emit('on-choose', this.entities)
      },
      changflag() {
        this.active = !this.active;
      }

    }
  }

</script>
