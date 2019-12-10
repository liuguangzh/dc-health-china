<template>
  <div>
    <Card :dis-hover="true" :padding="5" :bordered="false" style="margin: 5px;">
      <Row>
        <Col span="6">
          当前指标：<strong>{{indicator.indicatorName}}</strong>
        </Col>
        <Col span="5">
          分类方法：
          <Select style="width: 150px;" size="small" v-model="typeId" filterable clearable>
            <Option v-for="classificationType in classificationTypes" :key="classificationType.id" :value="classificationType.id">
              {{classificationType.classificationTypeName}}
            </Option>
          </Select>
        </Col>
        <Col span="5">
          所属地域：
          <Input v-model="area" style="width: 150px;" size="small" placeholder="请输入地区"></Input>
        </Col>
        <Col span="4">
          所属年份：<Input v-model="date" style="width: 100px;" size="small" placeholder="请输入年份"></Input>
        </Col>
        <Col span="4">
          <span class="file-uploads file-uploads-html5">
            <Button type="default" size="small" @click="searchValues">查询</Button>
          </span>

          <file-upload ref="upload"
                       v-model="files"
                       @input-file="inputFile"
                       @input-filter="inputFilter"
                       :data="uploadData"
                       :extensions="['xlsx', 'xls']"
                       :active="true"
                       post-action="/api/health-china/import-value-with-list"
                       name="file">
            <Button size="small" type="primary" icon="ios-cloud-upload-outline">导入值</Button>
          </file-upload>
          <span class="file-uploads file-uploads-html5">
            <Button type="info" size="small" @click="downIndicatorValueTemplate">下载模板</Button>
          </span>
        </Col>
      </Row>
    </Card>
    <Card :dis-hover="true" :padding="5" :bordered="false">
      <Table :height="tableHeight" :data="indicatorValues" :border="true" :columns="columnDefs"></Table>
      <Page :total="totalPages" show-total @on-change="pageChange"/>
    </Card>
  </div>
</template>

<script>
  import ClassificationApi from '@/api/chinahealth/classification'
  import IndicatorApi from '@/api/chinahealth/Indicator'
  import FileUpload from 'vue-upload-component'

  export default {
    name: 'indicator-value-list',
    components: { FileUpload },
    props: {
      indicator: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        indicatorValues: [],
        files: [],
        uploadData: {
          indicatorId: this.indicator.id
        },
        columnDefs: [
          {
            title: '分类方法',
            key: 'classificationTypeName'
          }, {
            title: '分类名称',
            key: 'classificationName'
          }, {
            title: '指标值',
            key: 'indicatorValue'
          }, {
            title: '地域',
            key: 'area'
          }, {
            title: '时间',
            key: 'date'
          }, {
            title: '单位',
            key: 'unit'
          }, {
            title: '数据来源',
            key: 'comeFrom'
          }
        ],
        classificationTypes: [],
        typeId: '',
        area: '',
        date: '',
        tableHeight: '200',
        totalPages: 0
      }
    },
    mounted () {
      ClassificationApi.getTypes('').then(res => {
        this.classificationTypes = res.data
      })
      this.tableHeight = window.innerHeight / 2 - 100
    },
    methods: {
      searchValues: function (pageNum) {
        if (!this.indicator || !this.indicator.id) {
          this.$Message.error({content: '请选择指标' })
          return
        }
        if (!pageNum) {
          pageNum = 0
        }
        IndicatorApi.getValueVos(this.indicator.id, this.typeId, this.area, this.date, pageNum).then(res => {
          this.totalPages = res.data.totalElements
          this.indicatorValues = res.data.content
        })
      },
      pageChange: function (pageNum) {
        if (pageNum > 0) {
          pageNum = pageNum - 1
        }

        this.searchValues(pageNum)
      },
      downIndicatorValueTemplate: function () {
        IndicatorApi.getIndicatorValueTemplate().then(res => {
          console.log(res)
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'indicator_value_template.xlsx')

          document.body.appendChild(link)
          link.click()
        })
      },
      inputFile: function (newFile, oldFile) {
        // 自动上传
        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
          this.uploadData.indicatorId = this.indicator.id ;
          if (this.uploadData.indicatorId) {
            if (!this.$refs.upload.active) {
              this.$refs.upload.active = true
            }
          } else {
            this.$Message.error({ content: '请选择指标！' })
          }

        }

        if (newFile && oldFile) {
          if (newFile.success !== oldFile.success) {
            const response = newFile.response
            if (response.length <= 0) {
              this.$Message.success({ content: '创建成功' })
            } else {
              let content = ''
              for (let i = 0; i < response.length; i++) {
                content += '<p>第' + response[i].rowNum + '行，有错误消息：' + response[i].errorMessage + '</p>'
              }
              this.$Modal.info({ title: '系统提示', content: content })
            }
          }
        }
      },
      inputFilter (newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          // 添加文件
          // 过滤非图片文件
          // 不会添加到 files 去
          if (!/\.(xls|xlsx)$/i.test(newFile.name)) {
            this.$Message.info({content: '只能上传Excel格式的文件' })
            return prevent()
          }

        }

        if (newFile && oldFile) {
          // 更新文件

          // 增加版本号
          if (!newFile.version) {
            newFile.version = 0
          }
          newFile.version++
        }

        if (!newFile && oldFile) {
          // 移除文件

          // 拒绝删除文件
          // return prevent()
        }
      }
    }
  }
</script>

<style scoped>

</style>
