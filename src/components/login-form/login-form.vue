<template>
    <div class="login-new-l">
        <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="userName">
                <Input v-model="form.userName" placeholder="请输入用户名">
                <span slot="prepend">
                    <Icon :size="23" type="ios-person-outline"></Icon>
                </span>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                    <Icon :size="23" type="ios-lock-outline"></Icon>
                </span>
                </Input>
            </FormItem>
            <Button @click="handleSubmit" long type="primary">立即登录</Button>
        </Form>
    </div>
</template>
<script>
export default {
    name: 'LoginForm',
    props: {
        userNameRules: {
            type: Array,
            default: () => {
                return [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ]
            }
        },
        passwordRules: {
            type: Array,
            default: () => {
                return [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        },
        onSuccess: {
            type: Function,
            default: () => {
                return () => { }
            }
        }
    },
    data() {
        return {
            form: {
                userName: '',
                password: ''
            }
        }
    },
    computed: {
        rules() {
            return {
                userName: this.userNameRules,
                password: this.passwordRules
            }
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$emit('on-success-valid', {
                        username: this.form.userName,
                        password: this.form.password
                    })
                }
            })
        },
        cancelLogin() {
            this.$emit('on-cancel-login');
            this.form = {
                userName: "",
                password: ""
            }
        }
    }
}
</script>
<style lang="less">
@import "./index.less";
.login-new-l .ivu-form-item {
    margin-bottom: 40px;
}
.login-new-l .ivu-input {
    height: 40px;
    background: #112576;
    border: 1px solid #0764d5;
    color: #0764d5;
    padding: 4px 16px;
}
.login-new-l input::-webkit-input-placeholder {
    color: #0764d5;
    font-size: 12px;
}
.login-new-l .ivu-input-group-prepend {
    border: 1px solid #0764d5;
    background-color: #0764d5;
    color: #35ebfe;
}
.login-new-l .ivu-btn-primary {
    background-color: #0080ff;
}
.login-new-l .ivu-btn > span {
    letter-spacing: 5px;
}
</style>

