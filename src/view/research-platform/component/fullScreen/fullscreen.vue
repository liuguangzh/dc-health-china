<template>
  <div v-if="showFullScreenBtn" class="full-screen-btn-con">
    <Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
      <!-- <Icon @click.native="handleChange" :type="value ? 'md-contract' : 'md-expand'" :size="23"></Icon> -->
      <Button type="primary" @click.native="handleChange">{{ value ?'退出全屏':'全屏'}}</Button>
    </Tooltip>
  </div>
</template>

<script>
export default {
  name: 'Fullscreen',
  computed: {
    showFullScreenBtn () {
      return window.navigator.userAgent.indexOf('MSIE') < 0
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    dom:{ //需要全屏元素的ID 
      type:String,
      default:()=>{
        return ''
      }
    }
  },
  methods: {
    handleFullscreen () {
      let dom = document.querySelector('#'+this.dom)
      if (this.value) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (dom.requestFullscreen) {
          dom.requestFullscreen()
        } else if (dom.mozRequestFullScreen) {
          dom.mozRequestFullScreen()
        } else if (dom.webkitRequestFullScreen) {
          dom.webkitRequestFullScreen()
        } else if (dom.msRequestFullscreen) {
          dom.msRequestFullscreen()
        }
      }
    },
    handleChange () {
      this.handleFullscreen()
    }
  },
  mounted () {
    let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
    isFullscreen = !!isFullscreen
    document.addEventListener('fullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('mozfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('webkitfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('msfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    this.$emit('input', isFullscreen)
  }
}
</script>



<style lang="less" <style lang="less" scoped>
  .full-screen-btn-con {
    display: inline-block;
    .ivu-tooltip-rel{
      height: 64px;
      line-height: 56px;
      i{
        cursor: pointer;
      }
    }
  }
  
</style>
