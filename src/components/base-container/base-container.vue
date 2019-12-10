<style lang="less" scoped>
  .base-container {
    position: relative;
    width: 100%;
    padding: 0 15px;

    .base-container-body {
      width: 100%;
      position: relative;
    }
    // 上下边距
    &.margin-x {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    // 充满父容器
    &.is-full {
      height: 100%;
      .base-container-body {
        height: 100%;
      }
    }
  }
</style>
<template>
  <div :class="wrapClasses">
    <div class="base-container-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'baseContainer',
    props: {
      // 上下边距
      marginX: {
        type: Boolean,
        default: false
      },
      // 充满父容器
      full: {
        type: Boolean,
      default: false
      },
    },
    data () {
      return {}
    },
    computed: {
      wrapClasses () {
        return [
          'base-container',
          {
            'margin-x': this.marginX,
            'is-full': this.full
          }
        ]
      }
    },
    methods: {}
  }
</script>
