<style lang="less" scoped>
  @import './index.less';
</style>
<template>
  <div style="position:relative;">
    <!-- <div style="position:absolute;left:0;top:0;z-index:999;">
      <Button @click="modalFlag = true"  type="primary" size="small">设置主题</Button>
    </div> -->
    <div ref="echartBox" class="echartBoxs" :style="{height:height}"></div>
    <!-- <Modal v-model="modalFlag" title="主题设置">
        <div class="theme-list">
          <div class="list-item" v-for="(item,index) in themes" :key="index"  @click="changeTheme(item.name)">
              <div class="color-box" v-for="(item1,index) in item.colorBox.color" :style="{background:item1}"></div>
          </div>
        </div>
        <div slot="footer">
            <Button type="error" @click="modalFlag = false">关闭</Button>
        </div>
    </Modal> -->
  </div>
</template>
<script>
  import echarts from 'echarts';
  import tdTheme from './theme.json';
  import essos from './essos.json';
  import shine from './shine.json';
  import vintage from './vintage.json';
  import walden from './walden.json';
  import westeros from './westeros.json';

  import {on,off} from '@/libs/tools';
  echarts.registerTheme('essos', essos);
  echarts.registerTheme('shine', shine);
  echarts.registerTheme('vintage', vintage);
  echarts.registerTheme('walden', walden);
  echarts.registerTheme('tdTheme', tdTheme);
  echarts.registerTheme('westeros', westeros);

  export default {
    name: 'ChartBar',
    props: {
      options: {
        type: Object
      },
      theme: {
        type: String,
        default: () => {
          return 'tdTheme'
        }
      },
      height:{
        type:String,
        default:()=>{
          return '350px';
        }
      }
    },
    data() {
      return {
        dom: null,
        modalFlag: false,
        themes: [
          {colorBox:tdTheme,name:tdTheme},
          {colorBox:essos,name:essos},
          {colorBox:shine,name:shine},
          {colorBox:vintage,name:vintage},
          {colorBox:walden,name:walden},
          {colorBox:westeros,name:westeros}
        ]
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },
      //重新初始化
      changeTheme(v) {
        this.dom.dispose()
        let option = this.options
        this.dom = echarts.init(this.$refs.echartBox, v)
        this.dom.setOption(option)
      }
    },
    watch: {
      options: {
        handler: function (val, oldval) {
          this.dom.setOption(val, true)
        },
        deep: true
      }
    },
    mounted() {
      this.$nextTick(() => {
        let option = this.options
        this.dom = echarts.init(this.$refs.echartBox, this.theme)
        this.dom.on('dblclick',(item)=>{
          this.$emit("on-dblclick",this.options)
        })
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>