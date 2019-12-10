<template>
    <div>
        <div class="choose-box">
            <Tag closable @on-close="handleClose">11111</Tag>
        </div>
        <div class="select-dropdown">
            
        </div>
    </div>
</template>
<script>
import cascardePlane from './cascarde-plane'
export default {
    data(){
        return{

        }
    },
    methods:{
        //删除已选
       handleClose(){

       } 
    },
    components:{
        cascardePlane
    }
}
</script>
<style lang="less" scoped>

</style>


