<style lang="less" scoped>
</style>

<template>
    <div>
        <Upload
            ref="upload"
            :action="action"
            :data="newParamsData"
            :max-size="maxSize"
            :headers="header"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :before-upload="handleBeforeUpload"
            :on-exceeded-size="handleMaxSize"
            :default-file-list="fileList" >
            <Button size="small" type="primary" title="点击文件列表，可进行下载！">点击上传</Button>
            <div v-if="placeholder" slot="tip" class="file-upload-info">{{placeholder}}</div>
        </Upload>
    </div>
</template>

<script>
import config from '@/config/index.js'
import {getToken} from '@/libs/util'
export default {
    props: {
        // 提示信息
        placeholder: String,
        // 默认文件列表
        value: {
            type: Array,
            default: function() {
                return []
            }
        },
        // 文件上传数限制
        max: Number,
        // 文件大小限制  不得大于100MB
        maxSize: {
            type: Number,
            default: 104857600
        }
    },
    data () {
        return {
            // 已上传文件
            fileList: this.value,
            header:{},
            newParamsData: {
                projectCode: 'research',
                folder: 'promiseFileTemplate'
            },
            action: config.uploadAddress
        }
    },
    complete: {
    },
    methods: {
        handleRemove(file, fileList) {
            this.$emit("file-change", file, "remove", this.value);
            // console.log(this.value)
            // console.log(JSON.parse(JSON.stringify(fileList)))
            // console.log(JSON.parse(JSON.stringify(file)));
            // console.log(JSON.parse(JSON.stringify(fileList)));
        },
        handleSuccess(res, file, fileList) {
            // console.log(this.value)
            this.$emit("file-change", file, "add", this.value);
            // console.log(res);
            // console.log(JSON.parse(JSON.stringify(file)));
            // console.log(JSON.parse(JSON.stringify(fileList)));
        },
        handlePreview(file) {
            this.$emit("file-change", file, "download");
        },
        handleBeforeUpload(file) {
            let fileList = this.$refs.upload.fileList;
            // 判断当前文件数是否已经达到上限
            if(fileList.length >= this.max) {
                this.$Message.error("上传错误，最多可上传" + this.max + "个文件！");
                return false;
            }
        },
        // 处理文件过大错误
        handleMaxSize() {
            this.$Message.error("上传错误，文件过大！");
        }
    },
    mounted(){
        const token = getToken();
        this.header.authorization = token;
    }
};

</script>