<template>
    <div>
        <div class="checked-item">
            <CheckboxGroup v-model="checkedBox" @on-change="checkedChange">
                <Checkbox label="01">资料室</Checkbox>
            </CheckboxGroup>
        </div>
        <cascarde-plane :kinds="kinds[cIndex].children"></cascarde-plane>
    </div>
</template>
<script>
export default {
    name:"cascarde-plane",
    data(){
        return{
           checkedBox:[] 
        }
    },
    props:['kinds'],
    methods:{
        checkedChange(v){
            console.log(v)
        }
    }
}
</script>

<style lang="less" scoped>
.checked-item{
    float: left;
    max-height: 200px;
    overflow: auto;
    background: #FFFFFF;
}
</style>
