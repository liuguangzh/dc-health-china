<template>
  <Table :data="tableData" :columns="columnDefs"></Table>
</template>
<script>
  export default {
    props: {
      dataTableBuildElementVos: {
        type: Array,
        default: () => {
          return ''
        },
        required: true
      }
    },
    name: 'Merge-data-list',
    data () {
      return {
        tableData: [],
        columnDefs: [
          {
            title: '字段名称',
            key: 'newElementName',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                  props: {
                    value: '',
                    size: 'small',
                  },
                  on: {
                    input: (val) => {
                      this.tableData[params.index].newElementName = val
                    },
                    'on-blur': () => {
                      this.updateFoo(params)
                    }
                  },
                })
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.cancleFieldCol((params.index))
                    }
                  }
                }, '取消')
              ])
            }
          }
        ]
      }
    },
    mounted () {
    },
    methods: {
      getLoadTable(){
        this.tableData = []
        let columns = []
        let datas = []
        this.dataTableBuildElementVos.forEach((item,index) => {
          let columnObj = {
            title: item.templateName,
            key: item.templateId+"_"+index,
            render: function (h, params) {
              return h('div', params.row[item.templateId+"_"+index]?params.row[item.templateId+"_"+index].dataElement.dataElementName:"")
            }
          }
          let num = item.templateName
          item.dataElements.forEach(keys => {
            let obj = {}
            obj.templateId = item.templateId+"_"+index
            obj.dataElement = keys
            datas.push(obj)
          })
          columns.push(columnObj)
        })
        this.columnDefs = columns.concat(this.columnDefs)
        datas.forEach(item => {
          this.addRowData(item, columns)
        })
      },
      cancleFieldCol () { // 取消操作
      },
      addRowData(item, columns) {
        let index = this.tableData.findIndex(value => {
          if(!item.dataElement.firstElement||!item.dataElement.firstElement.id){
            return false ;
          }

          for(let x in value){
            if(value[x]&&value[x].dataElement.dataElementCode== item.dataElement.firstElement.dataElementCode){
              return true ;
            }
          }
          return false ;
        })
        let data = {}
        if (index < 0) {
          data = {}
          this.fillData(data, item, columns)
          this.tableData.push(data)
        } else {
          data = this.tableData[index]
          this.fillData(data, item, columns)
        }
      },
      fillData(data, item, columns) {
        columns.forEach(c => {
          if (c.key == item.templateId) {
            data[item.templateId] = item.dataElement
          } else {
            if (!data[c.key]) {
              data[c.key] = undefined
            }
          }
        })
      },
      updateFoo(item){
        console.log(item.row)
        console.log(this.tableData)
        console.log(this.dataTableBuildElementVos)
      },
      clearData(){
        this.tableData = []
        this.columnDefs = [
          {
            title: '字段名称',
            key: 'newElementName',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                  props: {
                    value: '',
                    size: 'small',
                  },
                  on: {
                    input: (val) => {
                      this.tableData[params.index].newElementName = val
                    }
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.cancleFieldCol((params.index))
                    }
                  }
                }, '取消')
              ])
            }
          }
        ]
      },
    },
    // watch: {
    //   dataTableBuildElementVos: function (newValue) {
    //     if (newValue) {
    //       this.getLoadTable()
    //     }
    //   }
    // }
  }
</script>
<style scoped>
</style>
