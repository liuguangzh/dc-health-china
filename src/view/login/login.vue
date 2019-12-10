<template>
    <div class="registerBody">
        <img style="margin-top: 20px; height: 150px;margin-left: 50px;" src="../../assets/images/login/logo-china.png" alt="" />
        <div class="login-title">
            <div class="login-name">
                <div style="font-size: 35px; letter-spacing: 10px;">
                    易研∙科研管理与综合分析
                </div>
                <!-- <div style="font-size: 18px; letter-spacing: 0px;">Scientific Research Management and Comprehensive Analysis</div> -->
            </div>
            <div class="login-con">
                <Row style="height: 100%;">
                    <Col style="height: 100%;" :span="10">
                    <div class="login-content"></div>
                    </Col>
                    <Col :span="14">
                    <Card icon="log-in" :bordered="false" :dis-hover="true" style="background-color: transparent;">
                        <div class="form-con">
                            <login-form style="margin: 40px 40px 0px 40px;" @on-success-valid="handleSubmit"></login-form>
                            <p class="login-tip">
                                <span v-if="false"><a href="#" @click="registUser" style="font-size: 10px;color: #fff">点击注册用户 >
                                    </a></span>
                            </p>
                        </div>
                    </Card>
                    </Col>
                </Row>
            </div>
        </div>
        <div class="login-footer"><b>中国医学科学院医学信息研究所 版权所有</b></div>
    </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";

export default {
    components: {
        LoginForm
    },
    methods: {
        ...mapActions(["handleLogin", "getUserInfo", "getMenuList"]),
        handleSubmit({ username, password }) {
            this.handleLogin({ username, password })
                .then(res => {
                    this.getMenuList().then(res => {
                        console.log(res);
                    });
                    this.getUserInfo().then(res => {
                        this.$router.push({
                            name: this.$config.homeName
                        });
                    });
                })
                .catch(err => {
                    this.$Message.error({
                        content: "用户名密码错误",
                        duration: 3
                    });
                });
        },
        registUser: function () {
            // console.log("用户注册")
            this.$router.push("register.html");
        }
    },
    created() {
        this.getUserInfo()
    }
};
</script>
<style lang="less">
@import "./login.less";
.login-name {
    img {
        width: 100%;
        height: 100%;
    }
}
</style>
<style scoped>
.registerBody {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/login/login-1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
}

.login-content {
    height: 100%;
    width: 100%;
    background-image: url("../../assets/images/login/bg.png");
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
}

.ivu-card-head {
    border-bottom: none;
}

.login-name {
    margin-top: 30px;
    margin-bottom: 10px;
    text-align: center;
    width: 100%;
    font-size: 30px;
    color: #fff;
}
.login-footer {
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: 10px;
    color: #0080ff;
    font-size: 16px;
    font-family: sans-serif;
}
</style>
