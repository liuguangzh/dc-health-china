<template>
  <div>
    <Card :bordered="true" :dis-hover="true"  >
      <p slot="title">分类维护</p>
      <p slot="extra">
        <Button type="primary" @click="addFirst">添加分类</Button>
      </p>
      <Tree :style="treeStyle" :data="treeDatas" :load-data="loadData" :render="renderContent" :height="tableHeight"></Tree>
    </Card>
    <Modal :closable="false" :mask-closable="false" v-model="classificationModal">
      <p slot="header">编辑分类信息</p>
      <classification-form
        @saveSuccess="classificationSaveSuccess"
        ref="classificationForm"
        :classification="currentClassification"></classification-form>

      <p slot="footer">
        <Button type="primary" @click="confirmClassificationForm">保存</Button>
        <Button type="default" @click="closeClassificationForm">取消</Button>
      </p>
    </Modal>
  </div>
</template>

<script>
  import ClassificationApi from '@/api/chinahealth/classification'
  import ClassificationForm from './classification-form'

  export default {
    name: 'classifications-list',
    components: { ClassificationForm },
    props: {
      classificationType: {
        type: Object,
        required: true,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        treeDatas: [],
        classificationModal: false,
        buttonProps: {
          type: 'default',
          size: 'small'
        },
        currentClassification: {
          classificationName: '',
          classificationType: this.classificationType,
          parent: {}
        },
        tableHeight:"300",
        treeStyle:{
          'max-height': '500px',
          'overflow-y': 'scroll',
          'padding-left':'10px',
          'padding-right':'20px'
        }
      }
    },
    mounted(){
      this.tableHeight = window.innerHeight - 100
      this.treeStyle['max-height']=this.tableHeight+'px'
    },
    methods: {
      getClassifications: function (typeId, parent) {
        let that = this
        that.treeDatas = []
        ClassificationApi.getClassifications(typeId, parent).then(res => {
          res.data.forEach(item => {
            let obj = {}
            obj.title = item.classificationName
            obj.loading = false
            obj.children = []
            obj.id = item.id
            obj.parent = item.parent
            that.treeDatas.push(obj)
          })
        })
      },
      loadData: function (item, callback) {
        console.log(item)
        ClassificationApi.getClassifications(this.classificationType.id, item.id).then(res => {
          let data = []
          res.data.forEach(item => {
            let obj = {}
            obj.title = item.classificationName
            obj.loading = false
            obj.children = []
            obj.id = item.id
            obj.parent = item.parent
            data.push(obj)
          })
          callback(data)
        })
      },
      renderContent: function (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add',
                type: 'primary'
              }),
              style: {
                marginRight: '8px'
              },

              on: {
                click: () => {this.addSameLevel(root, node, data)}
              }
            }, '添加同级'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add',
                type: 'success'
              }),
              on: {
                click: () => {
                  this.addNextLevel(root, node, data)
                }
              }
            }, '添加下级'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add',
                type: 'info'
              }),
              on: {
                click: () => { this.modify(root, node, data) }
              }
            }, '修改'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove',
                type: 'error'
              }),
              on: {
                click: () => { this.remove(root, node, data) }
              }
            }, '删除')
          ])
        ])
      },
      addFirst:function(){
        delete this.currentClassification.id ;
        delete this.currentClassification.parent ;
        this.currentClassification.classificationName = ''
        this.currentClassification.classificationType = this.classificationType
        this.classificationModal = true
      },
      addSameLevel: function (root, node, data) {
        delete this.currentClassification.id
        this.currentClassification.classificationName = ''
        this.currentClassification.parent = data.parent
        this.currentClassification.classificationType = this.classificationType
        this.classificationModal = true
      },
      addNextLevel: function (root, node, data) {
        delete this.currentClassification.id
        this.currentClassification.classificationName = ''
        this.currentClassification.parent = { id: data.id, classificationName: data.title }
        this.currentClassification.classificationType = this.classificationType
        this.classificationModal = true
      },
      modify: function (root, node, data) {
        this.currentClassification.id = data.id
        this.currentClassification.classificationName = data.title
        this.currentClassification.parent = data.parent
        this.currentClassification.classificationType = this.classificationType
        this.classificationModal = true
      },
      remove: function (root, node, data) {
        let that = this ;
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要删除【'+data.title+'】',
          onOk:function(){
            ClassificationApi.deleteClassification(data.id).then(res=>{
              that.getClassifications(that.classificationType.id)
            })
          }
        })
      },
      confirmClassificationForm: function () {
        this.$refs.classificationForm.saveClassification().then(res => {
        })
      },
      classificationSaveSuccess: function (data) {
        // this.classificationModal = false;
        this.getClassifications(this.classificationType.id)
        this.closeClassificationForm()
        this.currentClassification = data
      },
      closeClassificationForm: function () {
        this.classificationModal = false
        this.currentClassification = {
          classificationName: '',
          classificationType: this.classificationType,
          parent: {}
        }
      }
    },

    watch: {
      'classificationType.id': function (newValue) {
        this.getClassifications(newValue, null)
      }
    }
  }
</script>

<style scoped>

</style>
