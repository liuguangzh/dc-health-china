<style lang="less" scoped>
  @import './index.less';
</style>
<template>
  <div class="export-box">
    <p class="export-title">相关知识</p>
    <div class="echart-box" id="echart-box">
      <div class="item">
        <chart-bar style="height:100%" :value='testData' text='新生婴儿'></chart-bar>
      </div>
      <div class="item">
        <chart-bar style="height:100%" :value='testData' text='新生婴儿'></chart-bar>
      </div>
    </div>
    <div class="btn-box">
      <Button @click.stop="cancelExport" type="info" size="small" style="width:130px;float:right;">取消</Button>
      <Button @click="exportToPdf" type="info" size="small" style="width:130px;float:right;margin-right:20px;">导出</Button>
    </div>
  </div>
</template>
<script>
  import {
    ChartBar
  } from '_c/charts/index.js'
  import html2canvas from 'html2canvas'
  import jspdf from 'jspdf'
  export default {
    name: 'export-echart',
    data() {
      return {
        title: '相关知识',
        testData: {
          // data1:{data:[100,200]},
          // data2:{data:[200,300]},
          // data3:{data:[300,400]},
          // data4:{data:[400,500]},
          data1: 200,
          data2: 300,
          data3: 400,
          data4: 500,
        }
      }
    },
    methods: {
      //导出DPF
      exportToPdf() {
        html2canvas(document.querySelector('#echart-box'), {
          allowTaint: true
        }).then((canvas) => {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new jspdf('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save(this.title + '.pdf');
          this.$emit('on-close')
        })
      },
      cancelExport(){
          this.$emit('on-close')
      }
    },
    components: {
      ChartBar
    }
  }

</script>
