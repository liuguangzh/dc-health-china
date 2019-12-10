export default {
  barOptions: {
    title: {
      text: null,
      subtext: null,
      x: 'center'
    },
    toolbox: {
      right: '10%',
      feature: {
        // dataZoom: {yAxisIndex: 'none'},
        restore: {},
        magicType: {
          type: ['line', 'bar']
        },
        saveAsImage: {}
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        show: true
      }
    ],
    grid: {
      bottom: 10,
      show: true,
      containLabel: true
    },
    tooltip: {
      show: true
    },
    legend: {
      data: [],
      type: 'plain',
      // type: "scroll",
      right: '25%'
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0,
        rotate: 60,
        formatter: function (value) {
          let result = '' // 最后拼接好的名称
          let maxNum = 8 // 每行显示数量
          let valueNum = value.length // 名称的字符串长度
          let rowNum = Math.ceil(valueNum / maxNum) // 需要显示的行数，向上取整
          if (rowNum > 1) {
            for (let i = 0; i < rowNum; i++) {
              let tempStr = ''
              let start = i * maxNum
              let end = start + maxNum
              // 最后一行特殊处理
              if (i === rowNum - 1) {
                tempStr = value.substring(start, valueNum)
              } else {
                tempStr = value.substring(start, end) + '\n'
              }
              result += tempStr
            }
            return result
          } else {
            return value
          }
        }
      },
      nameTextStyle: {
        color: '#333'
      },
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      name: '',
      nameTextStyle: {
        color: '#333'
      }
    },
    series: [{
      name: '',
      type: 'bar',
      data: [2.0, 4.9, 7.0, 23.2, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      barMaxWidth: '100',
      markPoint: {
        data: [{
          type: 'max',
          name: '最大值',
          label: {
            formatter: '最大值:{c}'
          }
        },
        {
          type: 'min',
          name: '最小值',
          label: {
            formatter: '最小值:{c}'
          }
        }
        ]
      },
      markLine: {
        data: [{
          type: 'average',
          name: '平均值',
          label: {
            formatter: '平均值:{c}'
          }
        }]
      }
    }]
  },
  pieOptions: {
    title: {
      text: '',
      subtext: null,
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      // formatter: '{a} <br/>{b} : {c} ({d}%)'
      formatter: '{b} : {c} '
    },
    toolbox: {
      right: '10%',
      feature: {
        saveAsImage: {}
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: [
        { value: 335, name: '直达' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1048, name: '百度' },
        { value: 251, name: '谷歌' },
        { value: 147, name: '必应' },
        { value: 102, name: '其他' }
      ],

      selected: []
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: [],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  },
  dbxyOptions: {
    title: {
      text: null,
      subtext: null,
      x: 'center'
    },
    toolbox: {
      right: '10%',
      feature: {
        restore: {},
        magicType: {
          type: ['line', 'bar']
        },
        saveAsImage: {},
        dataView: {
          readOnly: true,
          lang: ['源数据', '关闭']
        }
      }
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      type: 'slider',
      start: 0,
      end: 100
    }],
    tooltip: {
      show: true
    },
    legend: {
      data: [],
      type: 'plain',
      type: 'scroll',
      right: '25%'
    },
    xAxis: [{
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }],
    yAxis: [{
      type: 'value',
      name: ''// y轴名称（单位）
    }, {
      type: 'value',
      name: ''
    }],
    series: [{
      name: '蒸发量',
      type: 'bar',
      data: [2.0, 4.9, 7.0, 23.2, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      barMaxWidth: '100',
      markPoint: {
        data: [{
          type: 'max',
          name: '最大值',
          label: {
            formatter: '最大值:{c}'
          }
        },
        {
          type: 'min',
          name: '最小值',
          label: {
            formatter: '最小值:{c}'
          }
        }
        ]
      },
      markLine: {
        data: [{
          type: 'average',
          name: '平均值'
        }]
      }
    }]
  }
}
