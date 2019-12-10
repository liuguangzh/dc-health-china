<template>
  <div>
    <Table :data="tableData" :columns="columnDefs"></Table>
  </div>
</template>
<script>
  import {ResearchProjectApi,TemplateApi,DataAnalysisApi} from "@/api/"
  export default {
    props:{
      dataTableId:{
        type:String,
        default:()=>{
          return ""
        },
        required:true
      },
      columnData: {
        type: Array,
        default:()=>{
          return ""
        }
      },
    },
    name: 'Analysis-data-list',
    data(){
      return {
        tableData: [],
        columnDefs: [],
        tableTemplate: []
      }
    },
    methods:{
      loadTable:function(){
        DataAnalysisApi.getDataTableById(this.dataTableId).then(res=>{
          if(res.data.code === '1'){
            this.tableTemplate = res.data.data.columnDefs
            if(res.data.data.columnsInMongo !== null){
              let columns = JSON.parse(res.data.data.columnsInMongo)
              this.columnDefs=[] ;
              if(columns){
                columns.forEach(item=>{
                  this.columnDefs.push({
                    title:item.columnName,
                    key:item.id,
                    minWidth:110
                  })
                })
              }
              this.loadData(res.data.data.id)
            } else {
              this.tableData = []
              this.columnDefs = []
            }
          }else{
            this.$Message.error({content:"获取数据信息失败"})
          }
        })
      },
      loadData:function(dataTable){
        DataAnalysisApi.getDatasFromTable(dataTable).then(res=>{
          this.tableData = res.data.data[0].data;
          this.arrayToTable(this.tableData)
        })
      },
      arrayToTable(arr){
        let vos = JSON.parse(this.tableTemplate).dataTableBuildElementVos
        arr.forEach(item => {
          for(let n in item){
            let arr1 = []
            vos.forEach(keys => {
              keys.dataElements.forEach(param => {
                if(["checkbox", "radio", "select"].includes(param.dataElement.dataElementType)){
                  if(param.dataElement.id === n && param.dataElement.values.length !== 0){
                    if(item[n]){
                      let arr = []
                      if(Array.isArray(item[n])){
                        arr = item[n]
                      } else {
                        arr = item[n].split(',')
                      }
                      arr.forEach(val => {
                        let len = param.dataElement.values
                        for(let i = 0; i < len.length; i++){
                          if(val === len[i].dataValue){
                            arr1.push(len[i].dataValueName)
                          } else if(JSON.stringify(len).indexOf(val) === -1){
                            arr1.push(val)
                            break
                          }
                        }
                      })
                      item[n] = arr1.join(',')
                    }
                  }
                }
              })
            })
          }
        })
      },
      changeLoadColumn(){
        this.tableData = this.columnData
        let vos = JSON.parse(this.tableTemplate).dataTableBuildElementVos
        this.tableData.forEach(item => {
          for(let n in item){
            let arr1 = []
            vos.forEach(keys => {
              keys.dataElements.forEach(param => {
                if(["checkbox", "radio", "select"].includes(param.dataElement.dataElementType)){
                  if(param.dataElement.id === n && param.dataElement.values.length !== 0){
                    if(item[n]){
                      let arr = []
                      if(Array.isArray(item[n])){
                        arr = item[n]
                      } else {
                        arr = item[n].split(',')
                      }
                      arr.forEach(val => {
                        let len = param.dataElement.values
                        for(let i = 0; i < len.length; i++){
                          if(val === len[i].dataValue){
                            arr1.push(len[i].dataValueName)
                          } else if(JSON.stringify(len).indexOf(val) === -1){
                            arr1.push(val)
                            break
                          }
                        }
                      })
                      item[n] = arr1.join(',')
                    }
                  }
                }
              })
            })
          }
        })
      }
    },
    watch:{
      dataTableId:function(newValue){
        if(newValue){
          this.loadTable()
        }
      },
      columnData: function(newValue){
        if(newValue){
          this.changeLoadColumn()
        }
      }
    }
  }
</script>
<style scoped>
</style>
