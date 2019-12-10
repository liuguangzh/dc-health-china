<template>
  <div>
    <div class="task-item">
      <p class="item-title" v-if="showStatus"><span style="color:red;">已选分类-</span>{{kinds[cIndex].className}}</p>
      <div class="parent">
        <div style="display:inline-block;"  v-for="(item,index) in kinds" :key="index">
          <Tag type="dot" checkable closable color="primary" @click.native="chooseTag(item.id, index)" :name="item.id"
            @on-close="deleteTask">{{item.className}}</Tag>
        </div>
        <Button icon="ios-add" type="dashed" size="small" @click="addTask">添加分类</Button>
        <Button style="margin-left:10px;" type="primary" size="small" @click="editTask">编辑分类</Button>
        <Button v-if="showStatus" style="margin-left:10px;"
          type="primary" size="small" @click="addChildTask">增加子分类</Button>
      </div>
      <task-tree v-if='showStatus && kinds[cIndex].children && kinds[cIndex].children.length > 0' :kinds="kinds[cIndex].children"
        :parentId='cId' type="parent" @on-change="anohterGetKind"></task-tree>
    </div>
    <!-- 新增分类 -->
    <Modal :title="modalTitle" v-model="classStatus" @on-ok="surehandel" @on-visible-change="restArgument">
      <Form ref="handelTask" v-model="templateClass" :labelWidth="80">
        <FormItem label="分类名称" prop="className">
          <Input placeholder="请填写分类名称" v-model="templateClass.className"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 新增子分类 -->
    <Modal title="创建子分类" v-model="childStatus" @on-ok="sureAdd">
      <Form ref="handelTask" v-model="childClass" :labelWidth="80">
        <FormItem label="分类名称" prop="className">
          <Input placeholder="请填写分类名称" v-model="childClass.className"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import {
    ResearchKindApi
  } from "@/api/index.js"
  export default {
    name: "taskTree",
    data() {
      return {
        cIndex: 0,
        modalTitle: "创建分类",
        handelType: "add",
        classStatus: false,
        templateClass: {
          className: "",
          classCode: ""
        },
        childStatus: false,
        childClass: {
          className: "",
          classCode: ""
        },
        parentClassId: ''
      }
    },
    props: ['kinds', 'parentId', "type"],
    computed: {
      cId() {
        return this.kinds[this.cIndex].id
      },
      showStatus(){
        if(this.kinds){
          if(this.kinds.length>0){
            return true;
          }else{
            return false;
          }
        } else {
          return false
        }
      }
    },
    methods: {
      //初始化参数
      restArgument(flag) {
        if (flag == false) {
          this.templateClass = {
            className: "",
            classCode: ""
          };
          this.childClass = {
            className: "",
            classCode: ""
          }
        }
      },
      //确定创建/编辑
      surehandel() {
        let obj;
        if (this.handelType == "add") {
          let templateClass = JSON.parse(JSON.stringify(this.templateClass))
          if(this.kinds){
            if(this.kinds.length>0){
              templateClass.classCode = this.kinds[this.kinds.length - 1].classCode - 0 + 1;
            }else{
              templateClass.classCode = '01'
            }
          } else{
            templateClass.classCode = '01'
          }
          obj = {
            classCode: templateClass.classCode,
            className: templateClass.className
          }
          if (this.type == "type") {
            obj.classType = this.parentId;
          } else {
            obj.parentClass = this.parentId;
          }
        } else {
          obj = JSON.parse(JSON.stringify(this.templateClass));
          obj.id = this.kinds[this.cIndex].id;
        }
        ResearchKindApi.mergeTemplateClass(obj).then(res => {
          if (res.status == 200) {
            this.$Message.success({
              content: "保存成功",
              duration: 2
            });
            this.restArgument();
            this.anohterGetKind();
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
      },
      //编辑分类信息
      editTask() {
        this.modalTitle = "编辑分类";
        this.classStatus = true;
        this.handelType = "edit";
        this.templateClass.className = this.kinds[this.cIndex].className;
        this.templateClass.classCode = this.kinds[this.cIndex].classCode;
      },
      //增加分类项
      addTask() {
        this.modalTitle = "创建分类";
        this.classStatus = true;
        this.handelType = "add"
      },
      //增加子分类
      addChildTask() {
        this.childStatus = true;
      },
      //确认增加子分类
      sureAdd() {
        let childClass = JSON.parse(JSON.stringify(this.childClass))
        childClass.classCode = this.kinds[this.cIndex].classCode?this.kinds[this.cIndex].classCode + "01":'01';
        let obj = {
          classCode: childClass.classCode,
          className: childClass.className
        }
        obj.classType = this.kinds[this.cIndex].classType;
        if(this.parentClassId){
          obj.parentClass = this.parentClassId
        } else {
          obj.parentClass = this.kinds[this.cIndex].id
        }
        ResearchKindApi.mergeTemplateClass(obj).then(res => {
          if (res.status == 200) {
            this.$Message.success({
              content: "保存成功",
              duration: 2
            });
            this.restArgument();
            this.anohterGetKind();
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
      },
      //删除分类项
      deleteTask(event, cId) {
        let obj = {
          classId: cId
        }
        this.$Modal.confirm({
          title: "删除分类项",
          content: "您确定要删除此分类吗？",
          onOk: () => {
            ResearchKindApi.deleteTemplateClass(obj).then(res => {
              if (res.status == 200) {
                this.$Message.success({
                  content: "删除成功",
                  duration: 2
                })
                this.anohterGetKind();
              } else {
                this.$Message.success({
                  content: "删除失败",
                  duration: 2
                })
              }
            }).catch(err => {
              this.$Message.error({
                content: "该分类下存在其他子分类，不允许删除!",
                duration: 2
              })
            })
          }
        })
      },
      //选中
      chooseTag(id, i) {
        this.parentClassId = id
        this.cIndex = i;
      },
      //编辑/删除/新建后调用
      anohterGetKind() {
        this.$emit("on-change")
      }
    }
  }
</script>
<style lang="less" scoped>
  .task-item {
    margin: 10px 10px 0px 10px;
    border: 1px solid #2DB7F5;
    border-radius: 4px;
    padding: 5px;

    .item-title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
  }
</style>