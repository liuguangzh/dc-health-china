<template>
  <div class="registerBody">
    <!-- <img  src="../../assets/images/login/logo-china.png"  width='30' style="margin-top: 50px;">-->
    <Card class="registerCard" :bordered="false" :dis-hover="true" style="background-color: transparent;left:30%;width:40%;">
      <p style="font-size: 30px; letter-spacing: 5px;height:80px;line-height:80px;text-align:center;padding-left:80px;">易研∙科研管理与综合分析</p> 
      <Form ref="registerForm" :model="form" :rules="ruleCustom" :label-width="80">
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
        <FormItem prop="tel" label='联系电话'>
          <Input v-model="form.tel" placeholder="联系电话">
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
        <FormItem>
          <Button type="success" long @click="registerNewUser">注册新用户</Button>
        </FormItem>
      </Form>
      <p class="login">已经有用户？<a @click="login">点击登录 </a></p>
    </Card>
  </div>
</template>

<script>
  import {findUserByLoginName,register} from '@/api/user'

  export default {
    name: "register",
    data() {

      /***
       * 登录名验证
       * @param rule
       * @param value
       * @param callback
       */
      const validateUserName =  (rule, value, callback) => {
        let regExp = /^[\w]+$/
        if (!value) {
          callback(new Error("登录名不能为空"))
        } else {
          if(regExp.test(value)){
            findUserByLoginName(value).then(res => {
              if(res.data){
                callback(new Error("登录名已经存在，请使用其他的登录名"))
              }else{
                callback()
              }
            })
          }else{
            callback(new Error('登录名只能为数字与字母组合'))
          }
        
        }
      };

      /**
       * 校验手机号码
       * @param rule
       * @param value
       * @param callback
       */
      const validateTel = (rule,value,callback)=>{
        if(value===''){
          callback();
        }else{
          let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
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
          tel: "",
          email: "",
          userFlag:'2'
        },
        ruleCustom: {
          username: [
            {
              required:true,
              validator: validateUserName,
              trigger: "blur"
            }
          ],
          name:[{required:true,message:'姓名不能为空',trigger:'blur'}],
          tel:[{validator: validateTel,trigger:'blur'}],
          email:[{validator: validateEmail,trigger:'blur'}],
          password:[{required:true,message:"密码不能为空",trigger:"blur"}],
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
              if(res.data){
                this.$Modal.confirm({title:"系统提示",content:"用户注册成功，是否进行登录？",onOk:function(){that.$router.push('login.html')}})
              }
            })
          }
        })
      },
      /**
       * 跳转登录页面
       */
      login:function(){
        this.$router.push("login.html")
      }
    }
  }
</script>

<style scoped>
  .registerBody {
    background-color: #adcef5;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/regist-banner.png");
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;
  }

  .registerCard {
    position: absolute;
    left: 35%;
    width: 30%;
    top: 50%;
    transform: translateY(-60%);
  }

  .login{
    font-size: 10px;
    text-align: center;
    color: #c3c3c3;
    background-color: transparent;
  }
</style>
