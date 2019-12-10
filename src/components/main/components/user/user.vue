<template>
    <div class="user-avator-dropdown">
        <Dropdown @on-click="handleClick">
            <!-- <Avatar :src="userAvator"/> -->
            <span>{{userInfo.name}}</span>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="logout">退出登录</DropdownItem>
                <!-- <DropdownItem name="changePassword">修改密码</DropdownItem>
                <DropdownItem name="changeInfo">修改个人信息</DropdownItem> -->
            </DropdownMenu>
        </Dropdown>
        <!-- 关联账号提示 -->
        <Modal v-model="alertFlag" title="系统提示">
            <p style="line-height:30px;text-indent:2em;font-size:14px;margin-bottom:20px;">此账号为任务创建者为您添加的账号,如果您已有自己注册账号,可以点击<strong>“立即关联”</strong>,将此账号关联到您注册的账号。关联成功后将自动切换到您注册的账号</p>
            <Radio v-model="notAleart" label='不再提示此信息' :true-value='0' :false-value='1'></Radio>
            <div style="text-align:right;" slot="footer">
                <Button type="primary" @click="toRelate">立即关联</Button>
                <Button style="margin-left:10px;" @click="changAlreart">取消 </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { changeUserInfo, getUserInfo, updateIsAleart } from '@/api/index.js'
import config from '@/config/index.js'
export default {
    name: 'User',
    data() {
        return {
            notAleart: 1,// 是否继续提示  是1  否0
            alertFlag: false,//提示关联
            userInfo:{name:''}
        }
    },
    props: {
        userAvator: {
            type: String,
            default: ''
        }
    },
    methods: {
        ...mapActions([
            'handleLogOut'
        ]),
        handleClick(names) {
            switch (names) {
                case 'logout':
                    this.handleLogOut().then(() => {
                        // this.$router.push({
                        //     name: 'login'
                        // })
                        window.location.href = config.login_home
                    })
                    break;
                case 'changePassword':
                    this.changePassword()
                    break;
                case 'changeInfo':
                    this.changeUserInfo()
                    break
            }
        },
       
        // 去关联账号
        toRelate() {
            this.$router.push('/user-info.html')
            this.alertFlag = false
        },
        // 修改提示
        changAlreart() {
            if (this.notAleart === 0) {
                updateIsAleart(this.notAleart).then(res => {
                    this.alertFlag = false
                }).catch(err => {
                    this.alertFlag = false
                })
            } else {
                this.alertFlag = false
            }
        },
        getUserInfo() {
            getUserInfo().then(res => {
                this.userInfo.name = res.data.data.name
                this.userInfo.phone = res.data.data.phone
                this.userInfo.email = res.data.data.email
                if (res.data.alertFlag === '1' && res.data.loginTimes <= 3 && res.data.userFlag === '3') {
                    this.alertFlag = true
                }
            }).catch(err => {
                
            })
        }

    },
    mounted() {
        this.getUserInfo()
    }
}
</script>
