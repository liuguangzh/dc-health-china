<template>
  <div class="layout">
    <layout>
      <Sider style="background:#FFF;min-height:450px;">
        <div style="text-align:center;padding-top:10px;">
          <Button type="primary" size="small" style="margin-right:10px;" @click="addTask">增加</Button>
          <Button type="error" size="small" style="margin-right:10px;" @click="deleteTask">删除</Button>
          <Button type="error" size="small" @click="editTask">编辑</Button>
        </div>
        <Menu v-if="menuStatus" width="auto" ref='fristKind' @on-select="chooseIndex" :active-name="cIndex">
          <MenuGroup title="分类类别">
            <MenuItem v-for="(item,index) in kindType" :key="item.id" :name="index">{{item.typeName}}</MenuItem>
          </MenuGroup>
        </Menu>
      </Sider>
      <Content :style="{marginLeft: '10px', background: '#fff', minHeight: '450px'}">
        <task-tree v-if="menuStatus" :kinds="kindType[cIndex].children"
          :parentId='kindType[cIndex].id' type="type" @on-change="getClassAugin"></task-tree>
      </Content>
    </layout>
    <!-- 新增类别 -->
    <Modal :title="modalTitle" v-model="classStatus" @on-ok="surehandel" @on-visible-change="restArgument">
      <Form ref="handelTask" v-model="typeInfo" :labelWidth="80">
        <FormItem label="类别名称" prop="typeName">
          <Input placeholder="请填写类别名称" v-model="typeInfo.typeName"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import taskTree from '@/view/research-platform/component/task-tree/index.js';
  import {
    TemplateApi,
    ResearchKindApi
  } from "@/api/index.js"
import { constants } from 'crypto';
  export default {
    name: "task-kind",
    data() {
      return {
        kindType: [],
        cIndex: 0,
        modalTitle: "创建类别",
        classStatus: false,
        typeInfo: {
          typeName: "",
          typeCode: ""
        },
        handleType: "add"
      }
    },
    components: {
      taskTree
    },
    computed:{
      menuStatus(){
        if(this.kindType.length>0){
          return true;
        }else{
          return false;
        }
      }
    },
    mounted() {
      this.getClassType();
    },
    methods: {
      //初始化参数
      restArgument(flag) {
        if (flag == false) {
          this.typeInfo = {
            typeName: "",
            typeCode: ""
          };
        }
      },
      //确定类别操作
      surehandel() {
        if (this.handleType == "add") {
          let obj = JSON.parse(JSON.stringify(this.typeInfo));
          if(this.menuStatus){
            obj.typeCode = this.kindType[this.kindType.length - 1].typeCode;
          }else{
            obj.typeCode = "01";
          }
          ResearchKindApi.addTask(obj).then(res => {
            if(res.data.code === '1') {
              this.$Message.success({
                content: "保存成功",
                duration: 2
              })
              this.getClassType();
            } else {
              this.$Message.success({
                content: "保存失败",
                duration: 2
              })
            }
          }).catch(err => {
            this.$Message.error({
              content: "保存失败",
              duration: 2
            })
          })
        } else {
          let obj = JSON.parse(JSON.stringify(this.typeInfo));
          obj.id = this.kindType[this.cIndex].id;
          ResearchKindApi.editTask(obj).then(res => {
            if (res.status == 200) {
              this.$Message.success({
                content: "保存成功",
                duration: 2
              })
              this.getClassType();
            } else {
              this.$Message.success({
                content: "保存失败",
                duration: 2
              })
            }
          }).catch(err => {
            this.$Message.error({
              content: "保存失败",
              duration: 2
            })
          })
        }
      },
      //再次获取所有分类
      getClassAugin() {
        this.getClassType();
      },
      //获取所有分类
      getClassType() {
        TemplateApi.getClassType().then(res => {
          if(res.data.code === '1'){
            this.kindType = res.data.data;
            if(res.data.data.length>0){
              this.$nextTick(() => {
                this.$refs.fristKind.updateOpened();
                this.$refs.fristKind.updateActiveName();
              })
            }
          } else {
            this.$Message.success({
              content: "获取分类数据失败",
              duration: 2
            })
          }
        }).catch(err => {
          this.$Message.success({
            content: "获取分类数据失败",
            duration: 2
          })
        })
      },
      //选中一级分类
      chooseIndex(i) {
        this.cIndex = i;
      },
      //增加分类项
      addTask() {
        this.modalTitle = "创建类别";
        this.classStatus = true;
        this.handleType = "add";
      },
      //删除分类项
      deleteTask() {
        let obj = {
          typeId: this.kindType[this.cIndex].id
        }
        let _this = this
        this.$Modal.confirm({
          title: "删除分类项",
          content: "您确定要删除此分类吗？",
          onOk: () => {
            ResearchKindApi.deleteTask(obj).then(res => {
              if(res.data.code === '1'){
                this.$Message.success({
                  content: "删除成功",
                  duration: 2
                })
                _this.kindType.splice(_this.cIndex,1);
                _this.cIndex=0;
              } else {
                this.$Message.error({
                  content: res.data.data,
                  duration: 2
                })
              }
            }).catch(err => {
              this.$Message.error({
                content: "该类别下存在其他分类，不允许删除！",
                duration: 2
              })
            })
          }
        })
      },
      //编辑分类
      editTask() {
        this.modalTitle = "编辑类别";
        this.classStatus = true;
        this.handleType = "edit";
        this.typeInfo.typeName = this.kindType[this.cIndex].label;
        this.typeInfo.typeCode = this.kindType[this.cIndex].value;
      }
    }

  }
</script>
<style lang="less" scoped>

</style>