<template>
    <div class="mask">
        <p class="mask-title">表单列表</p>
        <Row type='flex'align="bottom" style="margin-bottom:20px;" :gutter='15'>
            <Col span="8">
                <span>任务名称：</span>
                <Input style="width:300px;" v-model="projectName" clearable placeholder="表单所属任务名称"></Input>
            </Col>
            <Col span="3"> 
                <Button type="primary" size='small' @click="findByTerm">查询</Button>
                <Button class="close-btn" size='small' type="primary" @click="closeModal">返回</Button>
            </Col>
        </Row> 
        <Table :columns="columnsMy" :data="tableData" border max-height='500'></Table>
        <div style="text-align:center;margin-top:10px;">   
         <Page :current='currentPage' :total='totalSize' show-total @on-change='change'></Page>
        </div>
    </div>
</template>
<script>
import { ResearchProjectApi } from '@/api/index.js'
export default {
    data(){
        return {
            projectName: '',//任务名称
            currentPage:1,
            totalSize:0,
            columnsMy: [{
              title: '序号',
              type:'index',
              width: 60
            }, {
              title: '表单名称',
              key: 'templateName',
              minWidth: 100
            }, {
              title: '所属任务',
              key: 'researchProjectName',
              minWidth: 100
            }, {
              title: '操作',
              key: 'toAudit',
              width: 190,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: "success",
                      size: "small",
                      ghost: true,
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "templateManage",
                          params: {
                            ...params.row,
                            preView: true,
                            isTemplate:true,
                            isShow:true //用于预览返回，是否打开表单列表
                          }
                        })
                      }
                    }
                  }, '预览'),
                  h('Button', {
                    props: {
                      type: "error",
                      size: "small",
                      ghost: true
                    },
                    on: {
                      click: () => {
                        this.addToTemplate(params.row)
                      }
                    }
                  }, '添加为模板')
                ])
              }
            }],
            tableData:[]
        }
    },
    props:{
      
    },
    methods:{
        // 根据条件查询任务
        findByTerm(){
            this.getProjectList()
        },
        //改变分页
        change(index){
            this.currentPage = index
            this.getProjectList()
        },
        // 添加为模板
        addToTemplate(params){
            this.$emit('on-add',params)
        },
         // 关闭-
        closeModal(){
            this.$emit("now-close")
        },
        // 获取我创建的任务
        getProjectList() {
            let obj = {
            //当前页
            page: this.currentPage - 1,
            //每页显示条数
            size: 10
            }
            //根据是否有值
            if (this.projectName) {
              obj.projectName = this.projectName
            }
            ResearchProjectApi.getAllProjects (obj).then(res => {
            let obj = JSON.parse(JSON.stringify(res.data))
            this.totalSize = obj.totalElements;
            let temps = obj.content.map(item=>{
                    if(item.templateMasters.length > 0){
                        item.templateMasters.forEach(element => {
                            element.researchProjectName = item.researchProjectName
                        });
                        return item.templateMasters
                    }
                });
                this.tableData = []
                temps.forEach(item=>{
                    this.tableData.push(...item)
                })
            })
        }
    },
    mounted(){
        this.getProjectList();
    }
}
</script>
<style lang="less" scoped>
.mask{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #FFF;
    padding: 15px;
    overflow: auto;
    .mask-title{
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        margin-bottom: 20px;
        border-bottom:2px solid #eee
    }
    .close-btn{
        margin-left: 15px;
    }
}
</style>


