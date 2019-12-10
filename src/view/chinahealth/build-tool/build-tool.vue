<style lang="less" scoped>
    @import url('./index.less');
</style>
<template>
    <div class="layout2">
        <div class="tools-box">
            <div class="tool-item">
                <img class="tool-icon" :src="pythonIcon" alt="">
                <p class="tool-title">爬虫工具</p>
            </div>
            <div class="tool-item">
                <img class="tool-icon" :src="knowwhatIcon" alt="">
                <p class="tool-title">Onto自动识别工具</p>
            </div>
            <div class="tool-item">
                <img class="tool-icon" :src="developingIcon" alt="">
                <p class="tool-title" style="color:#626262;">待开放...</p>
            </div>
        </div>
    </div>
</template>
<script>
import pythonIcon from '@/assets/images/china-health/python.png'
import knowwhatIcon from '@/assets/images/china-health/knowwhat.png'
import developingIcon from '@/assets/images/china-health/developing.png'
export default {
    data(){
        return{
            pythonIcon,
            knowwhatIcon,
            developingIcon
        }
    }
}
</script>

