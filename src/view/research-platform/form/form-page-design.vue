<template>
    <div id="wrap" class="wrap">
        <!-- 数据类型 -->
        <div class="type-wrap">
            <div class="data-base-tit">
                <h3>基础类型</h3>
            </div>
            <Row class="type-wrap-cont" :gutter="8">
                <Col v-for="(item, i) in formModules" :key="i" span="8">
                <div class="basic-item" @click="basicBtnClick(item)">
                    <Icon class="basic-item-icon" v-if="item.icon" :type="item.icon"></Icon>
                    <div class="basic-item-text">
                        {{item.title}}
                    </div>
                </div>
                </Col>
            </Row>
            <!-- <div v-if="showComponentFormDesign" class="data-base-tit-component">
                <h3>组件类型</h3>
            </div>
            <Row  v-if="showComponentFormDesign" class="type-wrap-cont" :gutter="8" style="padding-top: 65px;">
                <Col v-for="(item, i) in formModules" :key="i" span="8">
                <div class="basic-item" @click="basicBtnClick(item)">
                    <Icon class="basic-item-icon" v-if="item.icon" :type="item.icon"></Icon>
                    <div class="basic-item-text">
                        {{item.title}}
                    </div>
                </div>
                </Col>
            </Row> -->
            <!-- type-wrap-cont 结束 -->
        </div>
        <!-- type-wrap 结束 -->
        <!-- 编辑器区域 -->
        <div class="content-wrap">
            <div class="editor-wrap">
                <ueditor ref="ueditor" :content="content" :form-model="formModel" @open-config="openConfig" @close-config="closeConfig" form-design
                    no-border auto-height></ueditor>
            </div>
            <!-- editor-wrap 结束 -->
        </div>

        <!-- 表单数据项编辑区域 -->
        <div class="config-wrap">
            <div class="data-base-tit">
                <h3>控件设置</h3>
            </div>
            <!-- config-wrap-head 结束 -->
            <div class="config-wrap-cont">
                <!-- 配置页 -->
                <component ref="dataConfigForm" v-if="nowConfigPage" :is="nowConfigPage" @dom-change="domChange"></component>
                <!-- 未选择配置页 -->
                <div v-else class="no-data-info">
                    <Icon class="no-data-icon" type="compose"></Icon>
                    <p>请先添加一个数据项或者选中已有的数据项</p>
                </div>
            </div>
            <!-- config-wrap-cont 结束 -->
            <div class="config-wrap-foot">
                <Button class="btn" type="primary" @click="saveFormPage">保存</Button>
                <Button class="btn" @click="backToPre" type="primary">返回</Button>
            </div>
            <!-- config-wrap-foot 结束 -->
        </div>
        <!-- config-wrap 结束 -->
    </div>
</template>

<script>

    // 引入编辑器组件
    import ueditor from '_c/ueditor/ueditor.vue';
    // 折叠面板
    import dchPanel from '_c/panel/panel.vue';
    import { getFormartDate } from '@/libs/tools.js'
    // 获得所有表单元数据模块类型
    import {pluginName,formModules,formModulePrefix,setDataElementsAndModel} from '_c/ueditor/basic.js';
    // 获得服务器请求方法
    import { ResearchProjectApi } from '@/api/'

    // 表单控件组件路径
    let formPluginPaths = {};

    // 处理表单设计控件
    function handleFormPlugins() {
        // 遍历数组
        M.each(formModules, function (item) {
            // 获得控件名称
            let name = item.name;
            // 放入路径
            if (name) {
                // 设置组件加载路径
                formPluginPaths[formModulePrefix + name] = resolve => require(['_c/ueditor/modules/' +
                    name + '/' + name
                ], resolve);
            }
        })
    }
    // 调用函数
    handleFormPlugins();

    // 处理高级自增表格的子集配置项
    function handleDataSubConfig(configs, $item) {
        // 元数据ID
        let pId = $item.attr("id"),
            // 找到他的高级自增子元素
            $subDiyPlusTables = $item.find('.form-module[level="level-2"]'),
            // 所有子元素
            $subItems = $item.find(".diy-plus-body .form-module"),
            // 所有子元素配置项
            subConfigs = {};

        // 遍历所有子集
        $subItems.each((j, elem) => {
            let $elem = $(elem),
                // 获得code
                id = $(elem).attr("id"),
                // 是否为二级高级自增元素
                isPlusTable = $elem.attr("level") === "level-2",
                // 父级表格 是否为二级自增
                isParentPlusTable = $elem.parents('[level="level-2"]').length > 0;

            // 如果自己不是二级自增 也不是二级自增的子元素
            if (!isPlusTable && !isParentPlusTable) {
                // 设置该元数据所属父级别
                configs[id].parentId = pId;
                // 设置
                subConfigs[id] = configs[id];
            }
            // 如果是二级高级自增
            if (isPlusTable) {
                // 获得二级自增下所有元数据
                let $levelTwoSubItems = $elem.find('.diy-plus-body .form-module'),
                    // 二级自增的子级配置项
                    levelTwoSubConfigs = {};
                // 遍历所有子级
                $levelTwoSubItems.each((k, list) => {
                    let listId = $(list).attr("id");
                    // 设置该元数据所属父级别
                    configs[listId].parentId = id;
                    // 设置
                    levelTwoSubConfigs[listId] = configs[listId];
                })
                // 设置该元数据所属父级别
                configs[id].parentId = pId;
                // 设置
                subConfigs[id] = configs[id];
                subConfigs[id].subConfigs = levelTwoSubConfigs;
            }

        });

        // 重新设置父级
        configs[pId].subConfigs = subConfigs;
    }

    // 组件实例
    export default {
        // 数据
        data() {
            return {
                // 表单数据项tab切换项目
                dataTabArr: ["添加数据", "编辑数据", "公共数据"],
                // 默认内容
                content: '',
                // 表单页数据模型
                formModel: null,
                // 基础数据类型
                formModules,
                // 当前类型配置页面
                nowConfigPage: '',
                // 编辑器是否可以渲染
                ueditorReady: false,
                // 编辑器高度 默认为400
                height: 400,
                // 当前页ID
                pageId: M.url().pageId,
                //整个表单ID
                templateId:M.url().templateId,
                //表单页分组ID
                groupId:M.url().groupId,
                //表单页名称
                pageName:M.url().pageName,
                // 显示或者隐藏组件类型控件
                showComponentFormDesign: true,
                currentPage: '1'
            };
        },
        // 计算属性
        computed: {},
        watch: {},
        // 实例创建时
        mounted() {
            // 如果表单页ID存在 获取之前保存的信息
            if (this.pageId) {
                // 初始化编辑器
                this.initUeditor();
                // 获取表单页设计内容及配置
                this.getTemplatePageConfigVoById();
            }
        },
        // 方法集
        methods: {
            // 初始化百度编辑器
            initUeditor() {
                // 初始化百度编辑器公共变量数据
                UE.plugins[pluginName].initData();
                // this.$refs.ueditor.setHieght(height);
            },
            // 基础类型点击事件
            basicBtnClick(item) {
                // 设置当前编辑数据项DOM为空  配置页检测到为空 会自动创建一个新的数据项DOM
                UE.plugins[pluginName].editdom = null;
                // 打开对应的配置页
                this.openConfig(item.name);
            },
            // 数据项DOM改变事件 用于创建或修改编辑器中的DOM
            domChange(dom) {
                // 设置DOM 到编辑器中
                this.$refs.ueditor.setDataDom(dom);
            },
            // 打开对应类型的配置页
            openConfig(type) {
                // 如果类型为空
                if (M.isNull(type)) return;
                // 设置当前配置数据页
                this.nowConfigPage = formModulePrefix + type;
                // 如果组件已经存在 第一次加载会找不到组件的方法
                if (this.$refs.dataConfigForm) {
                    // 手动进行初始化 会进行创建新数据项DOM和配置等操作
                    this.$refs.dataConfigForm.init();
                }
            },
            // 关闭当前配置项
            closeConfig() {
                // 切换至添加数据
                this.dataTabActive = 0;
                // 设置编辑页组件为空
                this.nowConfigPage = '';
            },
            // 获得编辑器内容
            getContent() {
                return this.$refs.ueditor.getContent();
            },
            // 表单页保存事件
            saveFormPage() {
                // 设计器当前内容
                let document = this.getContent(),
                    // 表单页保存对象
                    postObj = {
                        templatePage: {
                          // 表单页ID
                          id: this.pageId,
                          //表单页名称
                          templatePageName:this.pageName,
                          // 设计器当前内容
                          templatePageContent: document,
                          template: this.templateId,
                          group: this.groupId
                        },
                    },
                    // 表单页所有元数据的配置项
                    config = UE.plugins[pluginName].dataConfigs,
                    // 对元数据配置项进行过滤 防止误删
                    configNew = this.handleDataConfig(config),
                    // 所有的元数据
                    ret = setDataElementsAndModel(configNew);
                    
                // 设置配置项
                postObj.templatePage.config = JSON.stringify(configNew); // JSON.stringify(configNew)
                // // 元数据列表
                postObj.elements = ret.elements;
                // 表单页数据模型 用于数据双向绑定
                postObj.templatePage.templatePageDataModel = JSON.stringify(ret.formModel);
                // 如果ID存在
                if (this.pageId) {
                    // 保存数据
                    this.mergeTemplatePageConfig(postObj);
                } else {
                    this.$Message.error("获取表单页ID失败！");
                }
            },
            getUrlCongif(){ // 获取url中的templateId
                let log = window.location.search
                let par = log.split('&')
                let intl = ''
                par.forEach(item => {
                    if(!item.indexOf('templateId')){
                        intl = item.split('=')[1]
                    }
                })
                return intl
            },
            // 向服务器保存表单页数据
            mergeTemplatePageConfig(data) {
                //发送请求
                ResearchProjectApi.ajaxCom("/dr-api/template/template-page/merge","post",data)
                    .then(res=>{
                        if(res.status == 200){
                            this.$Message.success({
                                content:"保存成功",
                                duration:2
                            })
                        }
                    }).catch(err=>{
                        this.$Message.error({
                            content:"保存失败",
                            duration:2
                        })
                    })
            },

            // 获取表单页数据
            getTemplatePageConfigVoById() {
                ResearchProjectApi.ajaxCom("/dr-api/template/template-page?pageId="+this.pageId,"get")
                    .then(res=>{
                        //设置之前的DOM
                        if (res.data.data.templatePageContent) this.content = res.data.data.templatePageContent;
                        // 设置所有元数据的配置项到编辑器缓存变量上
                        if (!M.isNull(res.data.data.config)) {
                            UE.plugins[pluginName].dataConfigs = JSON.parse(res.data.data.config);
                        }
                    }).catch(err=>{
                        this.$Message.error("获取设计数据失败，请刷新页面重试！");
                    })
            },
            // 对设计元数据配置项进行再次处理 比如：设计到高级自增表格子元数据配置挂载问题
            handleDataConfig(config) {
                // 返回结果
                let ret = {},
                    // 获取所有一级高级自增表格
                    $tables = this.find('[level="level-1"]');

                // 先进行过滤处理
                ret = this.filterDataConfig(config);

                // 处理所有的高级自增表格
                $tables.each((i, item) => {
                    // 当前高级自增表格
                    let $item = $(item);
                    // 处理他们的配置项
                    handleDataSubConfig(ret, $item);
                });

                return ret;
            },
            // 过滤元数据配置项 删除那些被误删的元数据
            filterDataConfig(config) {
                // 返回结果
                let ret = {};
                // 遍历所有的配置 如果存在DOM 则设置到结果中
                M.each(config, (item, code) => {
                    // 查询编辑器内部是否存在该元数据
                    let el = this.find("#" + code);
                    // 如果存在
                    if (el.length) ret[code] = item;
                });
                return ret;
            },
            // 获得编辑器组件内部获取DOM元素的方法
            find(selector) {
                return this.$refs.ueditor.get(selector);
            },
            //返回上一层
            backToPre(){
                if(this.$route.query.type){
                    this.$router.push('/home.html?pageNum=2')
                }else{
                    this.$router.back()
                }
                
            }
        },
        components: {
            // 百度编辑器
            ueditor,
            // 折叠面板
            dchPanel,
            // 表单设计控件
            ...formPluginPaths
        }
    };
</script>
<style lang="less" scoped>
    // 引入公共变量及方法
    @import '~common/less/base-style.less';

    .wrap {
        position: relative;
        width: 100%;
        height: 100%;
        padding-left: 260px;
        padding-right: 260px;
        background: #f7f7f7;
    }

    .content-wrap,
    .editor-wrap,
    .type-wrap,
    .config-wrap {
        height: 100%;
    }

    .type-wrap{
        overflow-y: auto;
        overflow-x: hidden;
    }

    // 编辑器区域
    .content-wrap {
        padding: 10px 20px;
    }

    .editor-wrap {
        width: 100%;
        border-right: 0;
        overflow: hidden;
        box-shadow: 0 2px 16px rgba(0, 0, 0, .16);
        background: #fff;
    }

    
    // 元数据主容器
    .type-wrap{
        position: absolute;
        top: 0;
        width: 260px;
        padding-top: 50px;
        background: #fff;
    }
    .config-wrap {
        position: absolute;
        top: 0;
        width: 260px;
        padding-top: 50px;
        padding-bottom: 60px;
        background: #fff;
    }

    .data-base-tit {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        padding: 0 10px;
        line-height: 50px;
        border-bottom: 1px solid #EEE;
        h3 {
            font-size: 16px;
            font-weight: 400;
        }
    }

    .data-base-tit-component{
        position: absolute;
        // top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        padding: 0 10px;
        line-height: 50px;
        border-bottom: 1px solid #EEE;
        h3 {
            font-size: 16px;
            font-weight: 400;
        }
    }

    .type-wrap-cont {
        padding: 20px 10px;
    }


    // 基础类型
    .type-wrap {
        left: 0;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, .16);
    }

    // 元数据类型项目
    .basic-item {
        margin-bottom: 10px;
        padding: 5px;
        text-align: center;
        cursor: pointer;

        .basic-item-icon {
            font-size: 26px;
            color: #666;
        }
        .basic-item-text {
            font-size: 12px;
        }

        &:hover {
            .basic-item-icon,
            .basic-item-text {
                color: #3871FF;
            }
        }
    }

    // 右侧配置主容器
    .config-wrap {
        right: 0;
        box-shadow: 0 0 16px rgba(0, 0, 0, .16)
    }

    .config-wrap-cont {
        height: 100%;
        padding-top: 10px;
        overflow: auto;
    }

    .config-wrap-foot {
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0;
        height: 60px;
        padding-top: 10px;
        text-align: center;
        border-top: 1px solid #eee;

        .btn {
            margin: 0 5px;
            padding: 6px 30px;
        }
    }

    // 配置页没有加载组件时提醒
    .no-data-info {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 140px;
        margin-top: -70px;
        padding: 20px;
        text-align: center;
        color: #999;

        .no-data-icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
    }
</style>
