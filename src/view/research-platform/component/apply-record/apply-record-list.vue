<template>
  <Table :data="records" :columns="colDefs" border></Table>
</template>
<script>
export default {
  name: "apply-record-list",
  props:{
    applyRecords:{
      type:Array,
      default:()=>{
        return [] ;
      }
    },
  },
  computed:{
    records:function(){
      return this.applyRecords;
    }
  },
  data(){
    return {
      colDefs:[{
        title:"表单名称",
        render:(h,params)=>{
          return h("span",{},params.row.templateName)
        }
      },{
        title:"申请时间",
        width:100,
        key:"createDate",
        render:(h,params)=>{
          return h('span',{},this.dateFilter(params.row.createDate))
        }
      },{
        title:"申请状态",
        width:100,
        key:"applyStatus",
        render:(h,params)=>{
          const applyStatus = params.row.applyStatus;
          let obj ;
          if(applyStatus==0){
            obj = h('p',{
              style:{
                color:'#333'
              }
            },'审核中')
          }
          if(applyStatus==10 || applyStatus==11 ||applyStatus==2){
            obj = h('p',{
              style:{
                color:"green"
              }
            },'审核通过')
          }
          if(applyStatus==-1){
            obj = h('p',{
              style:{
                color:'red'
              }
            },'审核未通过')
          }
          return obj ;
        }
      },{
        title:'审核意见',
        key:'confirmOpinion',
        render:(h,params)=>{
          let confOpt = params.row.confirmOpinion?JSON.parse(params.row.confirmOpinion).confirmOpinion:''
          return h('div',confOpt)
        }
      }]
    }
  },
  methods:{
    dateFilter:function(date){
      if(typeof date==String){
        date = new Date(date);
      }
      const dateTime = new Date(date);
      const fullYear = dateTime.getFullYear();
      const month = dateTime.getMonth()+1;
      const day = dateTime.getDate();
      return fullYear+"-"+month+"-"+day;
    }
  },
}
</script>
<style scoped>
</style>
