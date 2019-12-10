<style lang="less" scoped>
    @import './index.less';
</style>
<template>
    <div class="relation-choose" :class="{'ab-right':active}">
        <div class="left-icon" @click="changflag">
            <img :src="relationIcon" width="25" height="25" alt='实体筛选'>
        </div> 
        <div class="relation-box">
            <p class="box-title">实体筛选</p>
            <Input search entter-button v-model="relation" @on-search="toAdd" @on-enter='toAdd'></Input>
            <ul class="box-list">
                <li @click="getRelation('222')">婴儿</li>
                <li>提高50%</li>
                <li>东部地区</li>
                <li>西北部地区</li>
                <li>健康水平——死亡率</li>
            </ul>
        </div>
    </div>
</template>
<script>
import relationIcon from '_a/images/china-health/relation-choose.png'
export default {
    data(){
        return{
            relationIcon,
            relation:'',
            active:false
        }
    },
    methods:{
        //选中实体，进行赋值
        getRelation(v){
            this.relation = v
        },
        toAdd(){
            this.$emit('on-choose',this.relation)
        },
        changflag(){
            this.active=!this.active;
        }

    }
}
</script>
