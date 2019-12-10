<style lang="less">
// 编辑器内容样式 用于展示设计后的效果
@import '~@/components/ueditor/form-view/style.less';
</style>
<style lang="less">
// 引入公共变量及方法
// @import '~@/common/less/base-url.less';
@import '/ueditor/vue-form/vue-form.css';

.wrap {
    height: 100%;
    overflow: auto;
  //打印时表格宽度改为100%
    #form_body table {
      width: 100% !important;
    }
}
</style>

<template>
    <div id="wrap" class="wrap">
        <component v-for="item in printFormPages" :key="item.id" :is="getPageName(item.id)"></component>
    </div> <!-- wrap 结束 -->
</template>

<script>
// 获得服务器请求方法
import {TemplatePageApi} from "@/api/"
// 获得所有表单元数据模块类型
import { pluginName, registerFormPage } from '@/components/ueditor/basic.js';
// 获取公共方法
import { menuListToTree } from '@/common/js/Base.js';

function handleFormPages(pages, res) {
    // 输出结果
    res = res || [];
    // 遍历树形数据
    M.each(pages, page => {
        if(page.children.length) {
            // 处理子集表单页
            handleFormPages(page.children, res);
        }
        // 如果该表单页没有子页面 同时存在设计内容
        else if(page.templatePageContent && page.templatePageDataModel && page.config) {
            res.push(page);
        }
    });
    return res;
}


// 组件实例
export default {
    // 数据
    data () {
        return {
            // 表单页及数据集合
            formPages: [],
            // 表单页渲染是否准备就绪
            isReady: false,
            // URL 参数对象
            nowUrl: M.url()
        };
    },
    // 计算属性
    computed: {
        // 表单模板ID
        templateId() {
            return this.nowUrl.templateId;
        },
        // 表单填报数据ID
        masterId() {
            return this.nowUrl.masterId;
        },
        // 生成树形菜单数据
        formPagesTree() {
            return menuListToTree(this.formPages);
        },
        // 筛选出存在表单设计内容的表单 用于打印 如果设计内容不存在 将不进行打印
        printFormPages() {
            return handleFormPages(this.formPagesTree);
        }
    },
    watch: {},
    // 实例创建时
    mounted() {
        this.getTemplatePages();
    },
    // 方法集
    methods: {
        // 获取表单模板设计内容以及填报数据
        getTemplatePages() {
            // 请求参数
            let params = {
                // 表单模板ID
                templateId: this.templateId,
                // 填报数据ID
                masterId: this.masterId
            };

            // 发送请求
            TemplatePageApi.getTemplatePagesAndResults(params).then(res => {
                // 设置表单页数据
                res = M.map(res, function(item) {
                    // 页信息
                    let obj = item.templatePage,
                        // 页数据
                        templateResultObj = item.templateResult || {};
                    // 设置表单页数据
                    obj.templateResult = templateResultObj.templateResult || null;
                    // 表单页数据ID
                    obj.templateResultId = templateResultObj.id || null;
                    // 表单页数据录入者ID
                    obj.templateResultCreateBy = templateResultObj.createBy || null;

                    return obj;
                });
                // 设置到表单页集合变量中
                this.formPages = res;
                // 注册所有表单页组件
                this.registerFormPages();
                // 数据准备就绪
                this.isReady = true;
                // 调用打印函数
                this.$nextTick(function(){
                    window.print();
                });
                // 打印结果
                // console.log(JSON.parse(JSON.stringify(res)));
            })
            .catch(err => {
                console.log(err)
                this.$Message.error("获取表单页数据失败!");
            });

        },
        // 注册表单页组件
        registerFormPages() {
            M.each(this.printFormPages, page => {
                // 注册Vue组件 状态为只读模式
                registerFormPage(page, "readonly");
            });
        },
        // 获取表单页组件名称
        getPageName(pageId) {
            return pluginName + pageId;
        }
    },
};
</script>
