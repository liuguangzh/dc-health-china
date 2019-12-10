<template>
  <Row>
    <Col span="7">
      <user-select-component @on-select-user="selectUsers"></user-select-component>
    </Col>
    <Col span="1">
      <p style="padding-top: 230px;border: black;font-weight: bold;font-size: xx-large">>></p>
    </Col>
    <Col span="7">
      <users-component :users="usersInfos"></users-component>
    </Col>
    <Col span="1">
      <p style="padding-top: 230px;border: black;font-weight: bold;font-size: xx-large"><<</p>
    </Col>
    <Col span="8">
      <new-user-component @on-create-user="selectUsers"></new-user-component>
    </Col>
  </Row>
</template>

<script>
  import UserSelectComponent from "./user-select-component";
  import UsersComponent from "./users-component";
  import NewUserComponent from "./new-user-component";

  export default {
    components: {
      NewUserComponent,
      UsersComponent,
      UserSelectComponent},
    name: "user-add-component",
    data(){
      return {}
    },
    props:{
      usersInfos:{
        type:Array,
        default:()=>{
          return []
        },
        required:true
      }
    },
    methods:{
      selectUsers:function(users){
        // this.usersInfos.push(users);
        let that = this ;
        users.forEach(item=>{
          let flag=false ;
          this.usersInfos.forEach(u=>{
            if(u.id==item.id){
              flag = true ;
            }
          })
          if(!flag){
            that.usersInfos.push(item)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
