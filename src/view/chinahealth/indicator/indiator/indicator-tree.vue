<template>
  <div>
    <Card :dis-hover="true" :bordered="true">
      <p slot="title">
      <span>
        指标维护
      </span>
        <!--<Input placeholder="请输入关键字查询指标"></Input>-->
      </p>
      <p slot="extra">
        <Input @on-enter="loadData" placeholder="请输入关键字查询指标" v-model="keyWord" style="width: 300px;"></Input>
      </p>
      <Tree
        :style="treeStyle"
        :data="treeDatas"
        :multiple="false"
        show-checkbox
        :check-strictly="true"
        @on-select-change="treeSelectChange"
        :render="renderContent"></Tree>

    </Card>
    <Modal :closable="false" :mask-closable="false" v-model="indicatorModal">
      <p slot="header">指标维护</p>
      <p slot="footer">
        <Button type="primary" @click="saveHandler">保存</Button>
        <Button type="default" @click="closeModal">取消</Button>
      </p>

      <indicator-form ref="indicatorForm" :indicator="currentIndicator"
                      @saveSuccess="indicatorSaveSuccess"></indicator-form>

    </Modal>
  </div>

</template>

<script>

  import IndicatorApi from '@/api/chinahealth/Indicator'
  import IndicatorForm from './indicator-form'

  export default {
    name: 'indicator-tree',
    components: { IndicatorForm },
    data () {
      return {
        indicatorModal: false,
        treeDatas: [],
        buttonProps: {
          type: 'default',
          size: 'small'
        },
        keyWord: '出生率',
        tableHeight: '300',
        treeStyle: {
          'max-height': '500px',
          'overflow-y': 'scroll',
          'padding-left': '10px',
          'padding-right': '50px'
        },
        currentIndicator: {
          indicatorName: '',
          indicatorComeFrom: '',
          unit: '',
          parentIndicator: {
            id: '',
            indicatorAlisName: ''
          }
        },
        currentNode: {}
      }
    },
    mounted () {
      this.tableHeight = (window.innerHeight) / 2 - 100
      this.treeStyle['max-height'] = this.tableHeight + 'px'
      this.loadData()
    },
    methods: {
      loadData: function () {
        this.treeDatas = []
        IndicatorApi.getIndicator(this.keyWord).then(res => {
          this.treeDatas.push(this.buildTreeData(res.data))
        })

      },
      buildTreeData: function (indicator) {
        let that = this
        let obj = {}
        obj.title = indicator.indicatorName
        let replace = obj.title.replace(this.keyWord, '<span style=\'color: red\'>' + this.keyWord + '</span>')
        obj.title = replace
        obj.id = indicator.id
        obj.indicatorName = indicator.indicatorName ;
        obj.title_name = indicator.indicatorName
        obj.alis_name = indicator.indicatorAlisName
        obj.indicatorComeFrom = indicator.comeFrom ;
        obj.unit = indicator.unit ;
        obj.expand = true
        obj.children = []
        for (let i = 0; i < indicator.children.length; i++) {
          let d = this.buildTreeData(indicator.children[i])
          obj.selected = true
          d.pid = obj.id
          d.p_alisName = obj.alis_name
          obj.children.push(d)
        }
        return obj
      },
      expandAll: function (datas) {
        console.log(datas)
        for (let i = 0; i < datas.length; i++) {
          console.log('我要展开')
          datas[i].expand = true
          if (datas[i].children) {
            this.expandAll(datas[i].children)
          }
        }
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
            h('span', {
              style: {
                cursor: 'pointer'
              },
              'class': {
                treeNodeBackground: (() => {
                  console.log(this.currentNode)
                  if (this.currentNode && this.currentNode.nodeKey == node.nodeKey) {
                    return true
                  }
                  return false
                })()
              },
              domProps: {
                innerHTML: data.title
              },
              on: {
                click: () => {
                  // alert("yes you click me ")
                  // this.$emit("on-select-change",data);
                  this.treeSelectChange(data, node)
                }
              }
            })
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
                // marginRight: '8px'
              },
              on: {
                click: () => {this.addSameLevel(root, node, data)}
              }
            }, '同级'),
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
            }, '下级'),
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
      addSameLevel: function (root, node, data) {
        delete this.currentIndicator.id
        if (data.pid) {
          this.currentIndicator.parentIndicator = {
            id: data.pid,
            indicatorAlisName: data.p_alisName
          }
        }
        this.currentIndicator.indicatorName = ''
        this.currentIndicator.indicatorComeFrom = ''
        this.currentIndicator.unit = ''
        this.indicatorModal = true

      },
      addNextLevel: function (root, node, data) {
        delete this.currentIndicator.id
        this.currentIndicator.parentIndicator = {
          id: data.id,
          indicatorAlisName: data.alis_name
        }
        this.currentIndicator.indicatorName = ''
        this.currentIndicator.indicatorComeFrom = ''
        this.currentIndicator.unit = ''
        this.indicatorModal = true
      },
      modify: function (root, node, data) {
        this.currentIndicator.id = data.id
        if (data.pid) {
          this.currentIndicator.parentIndicator = {
            id: data.pid,
            indicatorAlisName: data.p_alisName
          }
        }
        this.currentIndicator.indicatorName = data.indicatorName;
        this.currentIndicator.indicatorComeFrom = data.indicatorComeFrom;
        this.currentIndicator.unit = data.unit ;
        this.indicatorModal = true ;
      },
      remove: function (root, node, data) {
        this.$Modal.confirm(
          {
            title:"系统提示",
            content:"确认要删除该指标？",
            onOk:()=>{
              IndicatorApi.deleteIndicator(data.id).then(res=>{
                this.loadData();
              })
            }
          }
        )
      },
      treeSelectChange: function (data, node) {
        this.currentNode = node
        this.$emit("indicatorSelectChange",data);
      },
      closeModal: function () {
        this.indicatorModal = false
      },
      indicatorSaveSuccess: function (data) {
        this.$Message.success('保存成功！')
        this.closeModal()
        this.loadData()
      },
      saveHandler: function () {
        this.$refs.indicatorForm.saveIndicator()
      }
    }
  }
</script>

<style>
  .treeNodeBackground {
    background-color: #bff1d9;
  }
</style>
