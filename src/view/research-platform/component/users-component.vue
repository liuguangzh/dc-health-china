<style lang="less">
.newTable .ivu-table-tip{
  overflow-x: hidden !important;
}
.newTable .ivu-table-overflowX{
  overflow-x: hidden !important;
}
.ivu-table th{
  background: #E6E7E8;
}
</style>

<template>
  <Card
    :dis-hover="true"
    :padding="0"
    :bordered="false">
    <div slot="title" style="text-align: center;">已添加人员</div>
    <div class='newTable'>
      <Table height="350" style="width: 100%;" :columns="columnDefs" :data="users" @on-select="selectUsers" @on-select-all="selectUsers"></Table>
    </div>
    <!-- <Button type="error" long @click="deleteUserFromList">删除</Button> -->
  </Card>
</template>

<script>
  export default {
    name: "users-component",
    data(){
      return {
        columnDefs: [{
          type: 'selection',
          align: 'center',
          width: 50,
        }, 
        {
          title:"姓名",
          key:'name'
        },{
          title:"登录名",
          key:"username"
        },
        {
          title: '操作',
          key: '操作',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                style: {
                  cursor: 'pointer',
                  color: '#ED4014',
                },
                props: {
                  type: "md-close"
                },
                on: {
                  click: () => {
                    this.deleteRowFillers(params)
                  }
                }
              })
            ], '')
          }
        }],
        currentSelectedUser:[]
      }
    },
    props:{
      users:{
        type:Array,
        default:()=>{
          return []
        },
        required:true
      }
    },
    mounted(){
    },
    methods:{
      deleteRowFillers(item){
        for(let i=0;i<this.users.length;i++){
          if(this.users[i].id==item.row.id){
            this.users.splice(i,1);
          }
        }
      },
      selectUsers:function(us){
        this.currentSelectedUser = us ;
      }
    }
  }
</script>

<style scoped>

</style>
