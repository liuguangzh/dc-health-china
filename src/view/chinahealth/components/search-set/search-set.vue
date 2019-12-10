<style lang="less" scoped>
  @import './index.less';
</style>
<template>
  <div class="search-input">
    <Input v-model="searchWhatSon" placeholder="请输入一个关键词，如‘婴儿’" style="width:90%" @on-enter="toSearch">
    <Button slot="append" icon="md-search" @click="toSearch"></Button>
    </Input>
    <Icon @click="openSetBox" type="md-settings" size="30" color="#fff" style="position:absolute;right:0;top:5;bottom:0;cursor:pointer;" />
    <div class="set-term" v-if="setflag">
      <p class="set-title">查找实体</p>
      <div class="term-box">
        <ul>
          <li>指标名</li>
          <li>指标名</li>
        </ul>
      </div>
      <Button type="info" size="small" class="set-btn" @click="sureSet">确定</Button>
    </div>
  </div>
</template>
<script>
import {getNode, getChildNode} from '@/api/index.js'
  export default {
    data() {
      return {
        setflag: false, //设置弹窗
        searchWhatSon:"",
        setWhichSon:"1"
      }
    },
    props: {
      goAnother: {
        type: Boolean,
        required: true
      },
      searchWhat:{
          type:String,
          default:""
      },
      setWhich:{
          type:Number,
          default:1
      }
    },
    watch:{
      searchWhat(newValue,oldValue){
        this.searchWhatSon = newValue;
      },
      setWhich(newV,oldV){
        this.setWhichSon = newV;
      }
    },
    mounted(){
     if(this.$route.params.setWhich && this.$route.params.searchWhat){
        this.searchWhatSon = this.$route.params.searchWhat
        this.setWhichSon = this.$route.params.setWhich
        //如果跳转过来，直接进行搜索操作
        this.$emit('on-search',this.searchWhatSon,this.setWhichSon)
      } 
    },
    methods: {
      //打开搜索设置
      openSetBox() {
        console.log(1);
        this.setflag = !this.setflag
      },
      //确定设置
      sureSet() {
        this.setflag = false
      },
      toSearch() {
        if (this.searchWhatSon == '') {
          this.$Message.error("请输入搜索关键词")
        } else {
          if (this.goAnother) {
              //进行跳转，携带设置的值
            this.$router.push({
              name: "searchResult",
              params: {
                searchWhat: this.searchWhatSon,
                setWhich: this.setWhichSon
              }
            })
          }else{
              //不跳转直接进行操作
              this.$emit('on-search',this.searchWhatSon,this.setWhichSon)
          }
        }
      }

    }
  }

</script>
