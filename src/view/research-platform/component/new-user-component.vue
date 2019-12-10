<style lang="less">
.ivu-card-head{
  border: 0px solid !important;
}
.form-register .ivu-form-item{
  margin-bottom: 15px;
}
</style>

<template>
  <div>
    <div slot="title" style="text-align: center; font-size: 14px;margin-bottom: 10px; margin-top: 10px;">注册人员</div>
    <Card
      :dis-hover="true"
      :bordered="true">
      <Form
        class="form-register"
        ref="registerForm"
        :model="form"
        :rules="ruleCustom"
        :label-width="80"
      >
        <FormItem prop="username" label='登录名'>
          <Input v-model="form.username" placeholder="请输入登录名">
          <span slot="prepend">
              <Icon :size="16" type="ios-person"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="name" label='姓名'>
          <Input v-model="form.name" placeholder="请输入姓名">
          <span slot="prepend">
              <Icon :size="16" type="ios-person"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="phone" label='联系电话'>
          <Input v-model="form.phone" placeholder="联系电话">
          <span slot="prepend">
              <Icon :size="16" type="ios-call"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="email" label='Email'>
          <Input v-model="form.email" placeholder="请输入Email">
          <span slot="prepend">
              <Icon :size="16" type="ios-mail"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="password" label='密码'>
          <Input type="password" v-model="form.password" placeholder="请输入密码">
          <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="confirmPassword" label='确认密码'>
          <Input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码">
          <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
        <div style="text-align: center;">
          <Button type="primary" @click="registerNewUser">注册</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>
<script>
  import {findUserByLoginName,register} from '@/api/user'
  export default {
    name: "new-user-component",
    data() {

      /***
       * 登录名验证
       * @param rule
       * @param value
       * @param callback
       */
      const validateUserName =  (rule, value, callback) => {
        if (!value) {
          callback(new Error("登录名不能为空"))
        } else {
          findUserByLoginName(value).then(res => {
            if(res.data.data){
              callback(new Error("登录名已经存在，请使用其他的登录名"))
            }else{
              callback()
            }
          }).catch(err=>{
             callback(new Error("验证用户名失败，请重试"))
          })
        }
      };

      /**
       * 校验手机号码
       * @param rule
       * @param value
       * @param callback
       */
      const validatePhone = (rule,value,callback)=>{
        if(value===''){
          callback();
        }else{
          let myreg=/^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/;
          if(!myreg.test(value)){
            callback("手机号码不符规则")
          }else{
            callback();
          }
        }
      };

      /**
       * 验证Email
       * @param rule
       * @param value
       * @param callback
       */
      const validateEmail = (rule,value,callback)=>{
        let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

        if(value===''){
          callback();
        }else{
          if(!emailReg.test(value)){
            callback(new Error("Email格式有误，请检查"))
          }else{
            callback();
          }
        }
      } ;
      /**
       * 验证确认密码
       * @param rule
       * @param value
       * @param callback
       */
      const validatorConfirmPassword = (rule,value,callback)=>{
        if(value===''){
          callback(new Error("密码不能为空"))
        }else{
          if(value !=this.form.password){
            callback(new Error("两次输入的密码不一致，请确认！"))
          }else{
            callback();
          }
        }
      };

      return {
        form: {
          username: "",
          password: "",
          name: "",
          confirmPassword: "",
          phone: "",
          email: "",
          userFlag:'3'
        },
        ruleCustom: {
          username: [
            {
              validator: validateUserName,
              trigger: "blur",
              required:true
            }
          ],
          name:[{required:true,message:'姓名不能为空',trigger:'blur'}],
          phone:[{validator: validatePhone,trigger:'blur'}],
          email:[{validator: validateEmail,trigger:'blur'}],
          password:[{required:true,message:"密码不能为空",trigger:"blur",required:true}],
          confirmPassword:[{validator:validatorConfirmPassword,trigger:"blur",required:true}]
        },

      }
    },
    methods:{
      //注册新用户
      registerNewUser(){
        let that = this
        this.$refs.registerForm.validate(validate=>{
          if(validate){
            delete this.form.confirmPassword
            register(this.form).then(res=>{
              console.log(res)
              if(res.data.data){
                let users = [];
                users.push(res.data.data)
                this.$Message.success({content:"注册成功，即将添加到人员列表中",duration:5})
                this.$emit("on-create-user",users)
                this.form = {
                  username: "",
                  password: "",
                  name: "",
                  confirmPassword: "",
                  phone: "",
                  email: "",
                  userFlag:'3'
                }
              }
            }).catch(err=>{
              this.$Message.error('注册失败')
            })
          }
        })
      },
    }
  }
</script>
<style scoped>
.ivu-card-body{
  padding: 0px;
}
</style>
