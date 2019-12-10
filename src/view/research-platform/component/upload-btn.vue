<template>
    <Upload name="file" :on-success="fileUploaded" :on-error='failUpload' :headers="header" 
        :with-credentials="true" :max-size='51200' :data="newParamsData" :format="['pdf','jpg','jpeg','png','doc','docx']" 
        :on-format-error="uploadPre" :on-exceeded-size="handleMaxSize" :show-upload-list='false' 
        :action="action" style="width:100px;">
        <Button icon="ios-cloud-upload-outline" size="small">上传承诺书</Button>
    </Upload>
</template>
<script>
import config from '@/config/index.js'
import { getToken } from '@/libs/util'
export default {
    name: "upload-btn",
    data() {
        return {
            header: {
              
            },
            newParamsData: {
                projectCode: 'research',
                folder: 'promiseFileTemplate'
            },
            action: config.uploadAddress
        }
    },
    methods: {
        //文件上传成功
        fileUploaded: function (response, file, fileList) {
            if (this.noticeModalView) {
                this.$Message.success({
                    content: "承诺书上传成功！"
                })
            }
            this.$emit("uploadSuccess", response)
        },
        failUpload(error) {
            console.log(error)
            this.$Message.error({
                content: '上传失败'
            })
        },
        uploadPre() {
            this.$Message.error({
                content: '文件类型错误'
            })
        },
        handleMaxSize() {
            this.$Message.error("上传文件最大为50M！")
        }
    },
    props: {
        noticeModalView: {
            type: Boolean,
            default: () => {
                return false;
            }
        }
    },
    mounted() {
        const token = getToken();
        this.header.authorization = token;
    }
}
</script>
<style scoped>
</style>
