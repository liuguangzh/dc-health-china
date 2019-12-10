<template>
    <Upload
        :action='action'
        :data='data'
        :headers='header'
        :with-credentials='true'
        :format="['xlsx','xls','csv']"
        accept='.xlsx,.xls,.csv'
        :max-size='51200'
        :on-success='uploadSuccess'
        :on-error='uploadError'
        :on-format-error='errorFormat'
        :on-exceeded-size='errorSize'
        :show-upload-list='ifUploadlist'
        style="display:inline-block;">
        <Button type="primary">{{ btnText }}</Button>
    </Upload>
</template>
<script>
import {getToken} from '@/libs/util'
export default {
    data(){
        return{
            header:{ }
        }
    },
    props:{
        btnText:{
            type:String,
            default:()=>{
                return '文件上传'
            }
        },
        action:{
            type:String,
            default:()=>{
                return ''
            }
        },
        data:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        ifNotice:{
            type:Boolean,
            default:()=>{
                return true
            }
        },
        ifUploadlist:{
            type:Boolean,
            default:()=>{
                return false
            }
        }
    },
    methods:{
        uploadSuccess(response){
            if(this.ifNotice){
                this.$Message.success('上传成功')
            }
            this.$emit('uploadSuccess',response)
        },
        uploadError(error){
            this.$Message.error('上传失败')
        },
        errorFormat(){
            this.$Message.error({
                content:'只允许上传xlsx,xls,csv格式文件',
                duration:6
            })
        },
        errorSize(){
            this.$Message.error({
                content:'最大为50M'
            })
        }
    },
    mounted(){
        let token =getToken()
        this.header.authorization = token;
    }
}
</script>

