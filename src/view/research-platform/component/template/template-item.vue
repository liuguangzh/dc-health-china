<!--模板封装-->
<template>
<div class='item-layout'> 
  <div class="tmp-item" :style="backgroundDiv">
    <div class="handel-mask">
      <div class="handel-btn">
        <div>
          <Button type="primary" size='small'style='width:80px'  @click="previewTemplate">预览</Button>
        </div>
        <div>
          <Button type="success" size='small' style="margin-top:10px;width:80px" @click="selectChose">使用</Button>
        </div>
      </div>
    </div>
    <Modal v-model="preViewModal" :closable="false" :mask-closable="false" fullscreen>
      <p slot="header" style="text-align: center;color: red;font-weight: bolder;font-size: 18px;">{{templateMaster.templateName}}--预览</p>
      <form-manage v-if="preViewModal" :template-master="templateMaster" :design="false"></form-manage>
      <div slot="footer"><Button type="error" @click="preViewModal = false">关闭</Button></div>
    </Modal>
  </div>
  <div class="tmp-header">
    <p class="tmp-name">{{templateMaster.templateName}}</p>
  </div>
</div>
</template>
<script>
  import FormManage from '../../form/form-manage'
  export default {
    name: "template-item",
    components: { FormManage },
    props: {
      templateMaster: {
        type: Object,
        default: () => {
          return {
            templateName: "",
            templateDesc: "",
            templateLabels: "",
            id: "",
            creator: ""
          }
        }
      }
    },
    data() {
      return {
        preViewModal:false,
        userId: '',
        chooseStatus: false,
        //添加表单弹窗状态值
        handleFormState: false,
        imgPath:'',
        backgroundDiv: {
            backgroundImage: 'url(' + this.imgPath + ')'
        }
      }
    },
    mounted() {
      this.userId = this.$store.state.user.userId;
      this.imgPath =this.templateMaster.imgPath
      if(this.imgPath){ // 如果有背景图则使用自己的背景图
        this.backgroundDiv.backgroundImage = 'url(' + this.imgPath + ')'
      }else{ // 没有背景图，使用默认背景图
        this.backgroundDiv.backgroundImage = 'url(' + require('@/assets/images/template-bg.jpg') + ')'
      } 
    },
    methods: {
      //预览模板
      previewTemplate() {
        this.preViewModal=true ;
      },
      selectChose() {
        this.chooseStatus = true
        this.$emit("selectTemplate", this.templateMaster)
      },
      //取消已选择的模板
      cancelChoose() {
        this.chooseStatus = false
        this.$emit("unSelectTemplate", this.templateMaster)
      }
    }
  }
</script>

<style lang="less" scoped>
.item-layout{
  float:left;
  width:18%;
  margin-right: 2%;
  margin-bottom: 10px;
  overflow:hidden;
  .tmp-item {
    position: relative;
    height: 200px;
    width: 100%;
    border-radius: 6px;
    background: #FFFFFF;
    border: 1px solid #2F8BEE;
    overflow: hidden;
    clear:both;
    background: url('~@/assets/images/template-bg.jpg') no-repeat center;
    background-size:cover; 
    .top-btn {
      position: absolute;
      top: 20px;
      left: 0px;
      width: 100%;
      text-align: center;
      z-index: 100;
    }
    &:hover .handel-mask{
      display: block;
    }
    .handel-mask {
      display:none;
      box-sizing: border-box;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .2);
      transition: all .5s;
      .handel-btn {
        height: 50px;
        text-align: center;
        padding-top:60px;
      }

      .sing-item{
        width: 40%;
        position: absolute;
        right: 0;
        bottom: 0;
        border: 1px solid #EEEEEE;
        border-radius: 4px;
        .tmp-kind {
          margin-left: 10%;
          width: 90%;
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          background: #FFF;
          text-align: center;
          color: #00B191;
          border-radius: 4px;
        }
        .kind-sys {
          color: #4A90FF;
        }
      }
    }
  }
  .tmp-header {
    height: 30px;
    line-height: 30px;

    .tmp-name {
      width: 100%;
      line-height: 45px;
      text-align: center;
      color: #000;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
