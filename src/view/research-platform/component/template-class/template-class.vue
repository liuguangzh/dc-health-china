<template>
  <div class="class-box">
    <Row type="flex" align="middle" justify="space-between">
      <Col span="24">
        <Menu ref="fristKind" @on-select="chooseClass" :active-name="-1" mode="horizontal" class="my-template-class">
          <MenuItem :name="-1" :key="Math.random()">
            全部
          </MenuItem>
          <MenuItem v-for="(item,index) in kindType" :name="index" :key="item.value">
          {{ item.typeName }}
          </MenuItem>
        </Menu>
      </Col>
    </Row>
    <div class="second-kind" v-show="showKind">
      <ul>
        <li v-for="(item,index) in secondKind" :class="{active:item.active}" :key="item.value"
          @click="choseSecondKind(index)">{{ item.className}}</li>
      </ul>
    </div>
    <div class="third-kind" v-if="thirdKind.length > 0">
      <CheckboxGroup v-model="kindGroup" @on-change='selectThird'>
        <Checkbox v-for="(item,index) in thirdKind" :key="item.value" :label="item.value">{{ item.className }}</Checkbox>
      </CheckboxGroup>
    </div>
  </div>
</template>
<script>
  import {
    TemplateApi
  } from "@/api/index.js"
  export default {
    name: "templateClass",
    data() {
      return {
        fIndex: 0,
        //总分类-主分类
        kindType: [],
        //二级分类
        secondKind: [],
        sIndex: '',
        //三级分类
        thirdKind: [],
        //选中分类
        kindGroup: [],
        showKind: false,
      }
    },
    props: ['kinds', "type"],
    methods: {
      //获取所有分类
      getClassType() {
        TemplateApi.getClassType().then(res => {
          this.kindType = res.data.data;
          if (this.kindType.length && this.kindType[0].hasOwnProperty("children") && this.kindType[0].children
            .length) {
            this.kindType[0].children.forEach(item => {
              item.active = false
            })
            this.secondKind = this.kindType[0].children;
          }
          if (res.data.data.length > 0) {
            this.$nextTick(() => {
              this.$refs.fristKind.updateOpened();
              this.$refs.fristKind.updateActiveName();
            })
          }
        }).catch(err => {
          this.$Message.error({
            content: "获取分类失败",
            duration: 2
          })
        })
      },
      //选中主分类
      chooseClass(index) {
        this.thirdKind = [];
        if(index === -1){// 如果选中全部，直接搜索
          this.showKind = false
          this.$emit("on-search", [])
          return
        } else {
          this.showKind = true
        }
        this.fIndex = index;
        //初始化三级选中及二级选中index
        this.sIndex = '';
        this.kindGroup = [];
        let children = this.kindType[this.fIndex].children
        if (children && children.length > 0) {

          children.forEach(item => {
            item.active = false
          })
          this.secondKind = children
        } else {
          this.secondKind = []
        }
        this.searchTemplate();
      },
      //选取二级分类
      choseSecondKind(index) {
        this.kindGroup = []
        this.sIndex = index;
        this.secondKind.forEach((item, index) => {
          if (this.sIndex == index) {
            item.active = true
          } else {
            item.active = false;
          }
        })
        //查看是否有三级分类
        let children = this.kindType[this.fIndex].children[this.sIndex].children
        if (children && children.length > 0) {
          this.thirdKind = children
        } else {
          this.thirdKind = []
        }
        this.searchTemplate();
      },
      selectThird(){
        this.searchTemplate();
      },
      //查询模板
      searchTemplate() {
        let obj = JSON.parse(JSON.stringify(this.kindGroup))
        // 三级选中
        if(obj.length){
           this.$emit("on-search", obj) 
        }else{ // 三级未选中
          if(this.sIndex !== ''){// 如果二级选中
              obj.push(this.secondKind[this.sIndex].id)
          }else{// 如果二级未选中
              obj.push(this.kindType[this.fIndex].id)
          }
          this.$emit("on-search", obj)
        }
      }

    },
    mounted() {
      this.getClassType();
    }
  }
</script>
<style lang="less">
  .class-box {
    // 调整行高
    .ivu-menu-horizontal{
      height: 40px;
      line-height: 40px;
      border: none;
    }
    // 去除下边线
    .ivu-menu-horizontal.ivu-menu-light:after{
        height: 0;
    }
    .second-kind {
      ul {
        overflow: hidden;
        padding: 10px;

        li {
          list-style: none;
          display: inline-block;
          height: 30px;
          line-height: 30px;
          text-align: center;
          padding: 0 5px;
          margin-right: 5px;
          border: 1px solid #2d8cf0;
          color: #2d8cf0;
          border-radius: 2px;
          cursor: pointer;

          &.active {
            background: #2d8cf0;
            color: #ffffff;
            border-color: #ffffff;
          }

          &:hover {
            background: #2d8cf0;
            color: #ffffff;
            border-color: #ffffff;
          }
        }

      }
    }

    .third-kind {
      border: 1px solid #eeeeee;
      margin: 10px;
      padding: 5px;
      color: #2d8cf0;
    }
  }
</style>