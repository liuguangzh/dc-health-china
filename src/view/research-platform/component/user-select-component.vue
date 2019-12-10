<style lang="less">
.tableL .ivu-table-tip{
  overflow-x: hidden !important;
}
.tableL .ivu-table-overflowX{
  overflow-x: hidden !important;
}
.tableL .ivu-modal-footer{
  padding: 0px;
}
.inputLiu{
  margin-bottom: 2px;
}
.inputLiu .ivu-input-group-append{
  background: #2D8CF0;
  border: 1px solid #2D8CF0;
  color: #fff;
}
.ivu-table th{
  background: #E6E7E8;
}
</style>
<template>
  <Card
    :bordered="false"
    :padding="0"
    :dis-hover="true">
    <div slot="title" style="text-align: center;">{{title}}</div>
    <div class="inputLiu">
      <Input placeholder="请输入真实姓名或登录名查找" v-model="queryParam" @on-enter="searchUserAccunt">
        <Button type="primary" slot="append" icon="ios-search" @click="searchUserAccunt">查找</Button>
      </Input>
    </div>
    <div class="tableL">
      <Table style="width: 100%;" :columns="columnDefs" :data="users" height="316" :show-header="true" @on-select="selectUsers" @on-select-all="selectUsers"></Table>
    </div>
    <!-- <Button type="primary" long @click="confirm" v-if="buttonShow">确定选择</Button> -->
  </Card>
</template>
<script>
  import {findUsersByName} from '@/api/user'
  export default {
    name: "user-select-component",
    data() {
      return {
        usersL: [
          {name: '',username: ''}
        ],
        users:[],
        queryParam:"",
        selectedUsers:[],
        columnDefs: [{
          type: 'selection',
          align: 'center',
          width: 50,
        }, {
          title:"真实姓名",
          key:'name'
        },{
          title:"登录名",
          key:"username"
        }]
      }
    },
    watch:{
      // queryParam:function(newValue){
      //   let that = this
      //   this.users=[]
      //   findUsersByName(newValue).then(res=>{
      //     console.log(res.data)
      //     that.users = res.data
      //   })
      // },
    },
    props: {
      title: {
        type: String,
        default: '已有账号人员',
        required: false
      },
      buttonShow:{
        type:Boolean,
        default:()=>{
          return true
        },
        required:false,
      },
      selectUser:{
        type:Array,
        default:()=>{
          return [];
        }
      }
    },
    methods:{
      confirm:function(){
        this.$emit("on-select-user",this.selectedUsers)
      },
      searchUserAccunt(){
        this.users=[]
        findUsersByName(this.queryParam).then(res => {
          if(res.data.code === '1'){
            this.users = res.data.data
          } else {
            this.$Message.error({
              content: "查找用户信息失败",
              duration: 2
            })
          }
        })
      },
      selectUsers:function(selection,row){
        this.selectedUsers = selection
        this.$emit("on-select-user",this.selectedUsers)
      }
    }
  }
</script>
<style scoped>
</style>
