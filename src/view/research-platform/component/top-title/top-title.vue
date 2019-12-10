<template>
    <p :style="{margin:margin}" class="my-top-title">{{ title }}</p>
</template>
<script>
export default {
    name:"top-title",
    props:{
        title:{
            type:String,
            default:""
        },
        margin:{
            type:String,
            default:"0px"
        }
    }
}
</script>
<style lang="less" scoped>
    .my-top-title{
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #E3E3E3;
        font-size: 20px;
        color: #666;
    }
</style>


