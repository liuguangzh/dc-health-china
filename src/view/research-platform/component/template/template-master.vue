<style lang="less">
.my-template-card-master .ivu-card-body{
  padding: 0px;
}
.my-template-card-master .ivu-card-bordered{
  border: 1px solid #2F8BEE;
}
</style>

<template>
  <div class="my-template-card-master">
    <Card :dis-hover="true" style="margin: 10px;height: 260px;line-height: 260px;">
      <!-- <div class="content">
        <p style="text-align: center;height: 100px">{{templateMaster.templateDesc}}</p>
      </div> -->
      <div class="sys-card" :style="backgroundDiv">
        <div class="sys-temp-master" style="text-align: center;">
          <ButtonGroup>
            <Button :ghost="false" size='small' type="info" @click="preViewTemplate">预览</Button>
            <Button :ghost="false" size='small' type="primary" @click="editTemplate" v-if="templateMaster.creator==this.$store.state.user.userId&&templateMaster.templateStatus==0">编辑</Button>
            <Button :ghost="false" size='small' type="primary" @click="deleteTemplate" v-if="templateMaster.creator==this.$store.state.user.userId&&templateMaster.templateStatus==0">删除</Button>
            <Button :ghost="false" size='small' type="success" v-if="templateMaster.creator==this.$store.state.user.userId&&templateMaster.templateStatus==0" @click="designTemplate">设计</Button>
            <Button :ghost="false" size='small' type="warning" v-if="templateMaster.creator==this.$store.state.user.userId&&templateMaster.templateStatus==0" @click="publishTemplate">发布</Button>
            <Button :ghost="false" size='small' type="warning" v-if="templateMaster.creator==this.$store.state.user.userId&&templateMaster.templateStatus==1" @click="UnPublishTemplate">取消发布</Button>
          </ButtonGroup>
        </div>
      </div>
    </Card>
    <div slot="title" style="text-align: center;font-weight: bolder">{{templateMaster.templateName}}</div>
  </div>
</template>
<script>
export default {
  name: "template-master",
  props: {
    templateMaster: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    }
  },
  data(){
    return {
      imgPath: '',
      backgroundDiv: {
        backgroundImage: 'url(' + this.imgPath + ')'
      }
    }
  },
  methods:{
    editTemplate:function(){
      this.$emit('onEdit',this.templateMaster)
    },
    designTemplate:function(){
      this.$router.push({
          name: "templateManage",
          params: {
            ...this.templateMaster,
            preView: false,
            isTemplate:true
          }
      })
    },
    preViewTemplate:function () {
      this.$router.push({
        name: "templateManage",
        params: {
          ...this.templateMaster,
          preView: true,
          isTemplate:true
        }
      })
    },
    publishTemplate:function(){
      this.$emit('publishTemplate',this.templateMaster)
    },
    UnPublishTemplate:function(){
      this.$emit('unPublishTemplate',this.templateMaster)
    },
    // 删除模板
    deleteTemplate(){
      this.$emit('on-delete')
    }
  },
  mounted() {
    this.imgPath = this.templateMaster.imgPath
    if(this.imgPath){// 如果有背景图则使用自己的背景图
      this.backgroundDiv.backgroundImage = 'url(' + this.imgPath + ')'
    }else{//没有背景图，使用默认背景图
      this.backgroundDiv.backgroundImage = 'url(' + require('@/assets/images/template-bg.jpg') + ')'
    }
  }
}
</script>
<style lang="less" scoped>
.my-template-card-master{
  .sys-card{
    position: relative;
    height: 250px;
    width: 100%;
    border-radius: 6px;
    background: #FFFFFF;
    overflow: hidden;
    clear:both;
    background: url('~@/assets/images/template-bg.jpg') no-repeat center;
    background-size:cover;
    &:hover .sys-temp-master{
      display: block;
    }
    .sys-temp-master{
      display:none;
      box-sizing: border-box;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .2);
      transition: all .5s;
    }
  }
  
  
}
</style>
