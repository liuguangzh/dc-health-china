<template>
  <div class="error-store">
    <Badge :count="emailCount" class-name="demo-badge-alone">
      <Button type="text" @click="openFillWaitProjectList">
        <!-- <Icon :size="30" type="ios-mail-outline"/> -->
        待填报
      </Button>
    </Badge>
  </div>
</template>
<script>
import { ResearchProjectApi ,TemplateApi} from '@/api/index.js'
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'Email',
  data () {
    return {
      // emailCount: 0,
       pageable:{
          page:1,
          size:2
        },  
    }
  },
  mounted () {
    setInterval(this.getList(), 30)
  },
  methods: {
    ...mapMutations([
      'fillWaitEmail'
    ]),
    // 初始化邮箱数量
    getList(){
      let obj = {
        pageNo: 0,
        pageSize: 9999
      }
      obj.templateName=''
      obj.researchName=''
      TemplateApi.getWaitTemplate(obj).then(res => {
        this.fillWaitEmail(res.data.data.totalRows)
      }).catch(err=>{
        console.log(err)
      })
    },

    openFillWaitProjectList(){
      this.$router.push({
        name: 'waitfillList'
      })
    }
  },
  computed: {
    ...mapGetters([
      'emailCount'
    ]),
  },
}
</script>
<style lang="less">
  .demo-badge-alone{
    top: 15px !important;
    height: 15px !important;
    line-height: 15px !important;
    min-width: 20px !important;
    padding: 0 !important;
  }
</style>
