<template>
  <div class="layout">
    <Row type="flex" align="middle" justify='space-around'>
      <Col span="3">
      <img class="top-logo" :src="toplogo" alt="">
      </Col>
      <Col span="7">
      <!--搜索组件 -->
      <search-set :goAnother="false" @on-search='getNode'></search-set>
      </Col>
      <Col span="8">
      <Row type='flex' align='middle' justify='center'>
        <Col span='4'>
        <div class="top-handle">
          <div class="ctr-box">
            <img class="ctr-icon" :src="historyIcon" alt="历史信息" @click.stop="changehistory">
          </div>
          <p>历史信息</p>
          <div class="history" v-if="historyFlag">
            <p class="out-title">历史信息</p>
            <!-- 播放方式选择 S -->
            <div class="choose-play" v-if="chooseFlag">
              <div class="play-item" @click="playInTrun">依次播放</div>
              <div class="play-item" @click="viewResult">查看结果</div>
            </div>
            <!-- 播放方式选择 E -->
            <div class="inner-box">
              <div class="box-item" v-for="(item,index) in allHistoryData" :key="index">
                <p class="item-text">+{{item.name}}</p>
                <div class="item-ctr">
                  <img :src="signIcon" alt="收藏" title="收藏" @click.stop="toFavorite(item)">
                </div>
                <div class="item-ctr" title='回放' @click.stop="playback(item)">
                  <img :src="playIcon" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
        </Col>
        <Col span='4'>
        <div class="top-handle">
          <div class="ctr-box">
            <img class="ctr-icon" :src="favotiteIcon" alt="收藏" @click.self="editFlag = !editFlag">
          </div>
          <p>收藏</p>
          <div class="history" v-if="editFlag" style="left:-50px">
            <p class="out-title">收藏</p>
            <div class="inner-box">
              <div class="box-item" v-for="(item,index) in linshihistory" :key="index">
                <p v-if="!item.isSet" class="item-text">{{item.name}}</p>
                <Input v-else v-model="item.name" clearable style="width:300px;margin-top:10px;"></Input>
                <div class="item-ctr">
                  <img :src="deleteIcon" alt="删除" title="删除">
                </div>
                <div class="item-ctr" title='回放'>
                  <img :src="playIcon" alt="">
                </div>
                <div class="item-ctr" title='编辑' @click="editOrSave(index)">
                  <img :src="editIcon" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
        </Col>
        <Col span='4'>
        <div class="top-handle">
          <div class="ctr-box">
            <img class="ctr-icon" :src="exportIcon" alt="定位" @click="exportFlag = !exportFlag">
          </div>
          <p>导出</p>
          <!-- 导出echarts图表 -->
          <export-echart v-if="exportFlag" @on-close='exportFlag = false'></export-echart>
        </div>
        </Col>
        <Col span='4'>
        <div class="top-handle">
          <div class="ctr-box">
            <img class="ctr-icon" :src="positionIcon" alt="定位">
          </div>
          <p>定位</p>
        </div>
        </Col>
        <Col span='4'>
        <div class="top-handle">
          <div class="ctr-box">
            <img class="ctr-icon" :src="bigIcon" alt="放大" @click="zoomOut">
          </div>
          <p>放大</p>
        </div>
        </Col>
        <Col span='4'>
        <div class="top-handle">
          <div class="ctr-box">
            <img class="ctr-icon" :src="smallIcon" alt="缩小·" @click="zoomIn">
          </div>
          <p>缩小</p>
        </div>
        </Col>
      </Row>
      </Col>
      <Col span="2">
      <!-- 登录组件 -->
      <!-- <login-form></login-form> -->
      </Col>
    </Row>
    <div class="content">
      <div class="loader" v-if="laodingFlag">
        <div class="load-box">
          <Icon type="ios-loading" size='70' class="loading-icon" />
          <p class="loading-text">读取数据...</p>
        </div>
      </div>
      <!-- 实体筛选 -->
      <relation-choose @on-choose='addRelation'></relation-choose>
      <!-- 关系筛选 -->
      <entity-choose @on-choose='chooseEntity' :linkData='linkData'></entity-choose>
      <!-- 回访步骤展示 S -->
      <div class="steps" v-if="stepsFlag">
        <div style="float:left;cursor: pointer;">
          <Icon type="ios-arrow-back" color="#FFF" size="40" @click="toLeft" />
        </div>
        <div class="outer-box" ref="outerBox">
          <div class="inner-box" ref="innerBox">
            <div class="steps-item" v-for="(item,index) in hsitorySteps" :key="item.key">
              <div class="item-circle"></div>
              <div class="item-line"></div>
              <p class="item-context" @click="getHistoryData(item,index)">{{item.name}}</p>
            </div>
          </div>
        </div>
        <div style="float:right;cursor: pointer;">
          <Icon type="ios-arrow-forward" color="#FFF" size="40" @click="toRight" />
        </div>
      </div>
      <!-- 回访步骤展示 E -->
      <!-- 实体展示 -->
      <knowledge-map ref="diag" :setWidth="setWidth" :modelData='modelData' :loadState="loadStatus" @on-click='modifyStuff'
        @on-choose='chooseNode'></knowledge-map>
    </div>
  </div>
</template>
<script>
  //图片引入
  import toplogo from '_a/images/logo.jpg'
  import playIcon from '_a/images/china-health/play.png'
  import signIcon from '_a/images/china-health/sign.png'
  import editIcon from '_a/images/china-health/edit.png'
  import deleteIcon from '_a/images/china-health/delete.png'
  //头部导航图标引入
  import historyIcon from '_a/images/china-topIcon/history.png'
  import favotiteIcon from '_a/images/china-topIcon/favorite.png'
  import exportIcon from '_a/images/china-topIcon/export.png'
  import positionIcon from '_a/images/china-topIcon/position.png'
  import bigIcon from '_a/images/china-topIcon/big.png'
  import smallIcon from '_a/images/china-topIcon/small.png'
  //组件引入
  import LoginForm from '../login-form/index.js'
  import relationChoose from './relation/index.js'
  import entityChoose from './entity/index.js'
  import exportEchart from './export-echart/index.js'
  import knowledgeMap from './knowledge-map/index.js'
  import searchSet from '../components/search-set/index.js'
  import {
    mapActions
  } from 'vuex'
  //获取节点api引进
  import {
    getNode,
    getChildNode,
    saveOrEditHistory,
    getHistoryList
  } from '@/api/index.js';
  import {
    arraytoObj
  } from '@/libs/tools.js'
  export default {
    name: 'searchResult',
    data() {
      return {
        playIcon, //历史播放标记
        signIcon, //增加到收藏夹标记
        editIcon, //编辑标记
        deleteIcon, //删除标记
        toplogo, //顶部logo
        historyIcon,
        favotiteIcon,
        exportIcon,
        positionIcon,
        bigIcon,
        smallIcon,

        laodingFlag: false, //登录框显示状态
        exportFlag: false, //导出弹窗显示状态
        chooseFlag: false, //选择播放模式弹窗显示状态
        stepsWidth: '', //步数内宽度
        loadStatus: false, //加载动画

        //实体及关系颜色
        modelColor: ['rgb(237,84,71)', 'rgb(37,136,213)', 'rgb(116,0,213)', 'rgb(98,173,317)', 'rgb(240,176,0)',
          'rgb(175,193,102)', 'rgb(108,170,221)', 'rgb(130,110,95)'
        ],
        //所有历史信息总和
        allHistoryData: [],
        //历史信息中选中历史记录信息
        historyData: {},
        hsitorySteps: [],
        //历史信息临时展示
        linshihistory: [{
            name: '搜索“健康中国”点击到“2012”',
            isSet: false
          },
          {
            name: '搜索“健康中国1”点击到“2013”',
            isSet: false
          }
        ],
        editName: "", //编辑收藏记录名称（临时保存信息）
        stepArray: [], //历史信息点击步骤保存（后台传值）
        stepData: {}, //每步得到的数据保存
        widthNum: 0, //步数展示向左向右计数
        setWidth: 0, //点击放大缩小倍数
        stepsFlag: false, //一次播放步骤显示
        historyFlag: false, //历史信息弹窗
        editFlag: false, //收藏编辑显示标志


        //展示数据
        modelData: {
          nodeDataArray: [],
          linkDataArray: []
        },
        //知识图谱节点数据
        //用于关系筛选的数据存储器
        linkData: [],
        //选中节点的ID
        checkedNodeId: "",
        //按照对应id存放数据
        nodeObject: {},
        linkObject: {}
      }
    },
    watch: {


    },
    computed: {


    },
    methods: {

      // get access to the GoJS Model of the GoJS Diagram
      model: function () {
        return this.$refs.diag.model();
      },
      // tell the GoJS Diagram to update based on the arbitrarily modified model data
      updateDiagramFromData: function () {
        this.$refs.diag.updateDiagramFromData();
      },
      //增加节点
      modifyStuff(val) {
        //加载进度条开始
        this.loadStatus = true;
        this.$Loading.start()
        //val 为点击节点信息
        //防止用户对统一节点重复点击，多次添加
        let hasFlag = this.stepArray.some(function (ele) {
          return ele.id == val.id
        })
        if (hasFlag) {
          this.$Message.info("请勿重复点击");
          this.$Loading.finish();
          this.loadStatus = false;
          return
        };
        var data = this.modelData;
        //历史信息步骤填入
        this.stepArray.push(val)
        getChildNode(val.id, val.kgType).then(res => {
          if (res.data.rdfEntityList == null) {
            this.$Message.error("此实体没有关联数据");
            this.$Loading.finish();
            this.loadStatus = false;
            return;
          }
          if (res.data.rdfEntityList.length == 0) {
            this.$Message.error("此实体没有关联数据");
            this.$Loading.finish();
            this.loadStatus = false;
            return;
          } else {
            //根据数据需求，添加key值 颜色
            let nodesArr = res.data.rdfEntityList.map(item => {
              item.key = item.id;
              item.color = this.modelColor[item.kgType % 8]
              return item;
            })
            data.nodeDataArray.push(...nodesArr);
            //将查询父实体相关信息放入比较数组中  因为父子实体之间可能存在多重关系  
            let nodeDataColor = JSON.parse(JSON.stringify(this.modelData.nodeDataArray));
            nodeDataColor.push(val)
            //根据ndoedata 改变连线颜色  
            let linksArr = res.data.rdfRelationList.map(item => {
              for (let i = 0; i < nodeDataColor.length; i++) {
                if (item.from == nodeDataColor[i].id) {
                  item.color = nodeDataColor[i].color;
                }
              }
              return item
            })
            data.linkDataArray.push(...linksArr);
            console.log(this.modelData)
            //历史信息数据添加在保存历史记录中
            let hisObj = {
              linksData: linksArr,
              nodesData: nodesArr
            };
            //根据节点信息，对应保存信息
            this.stepData[val.id] = hisObj;
            //重复添加，去重
            this.updateDiagramFromData();
            //加载进度条结束
            this.$Loading.finish();
            this.loadStatus = false;

            //根据ID进行储存
            arraytoObj(nodesArr, this.nodeObject, val.id);
            arraytoObj(linksArr, this.linkObject, val.id);
          }
        }).catch(err => {
          console.log(err.response);
          //加载进度条结束
          this.$Loading.finish();
          this.loadStatus = false;
        })
      },
      //右侧增加实体筛选结果
      addRelation(v) {
        // console.log(v)
      },
      //获取关系
      getLinks() {
        let obj = []
        this.modelData.linkDataArray.forEach(element => {
          if (element.from == this.checkedNodeId || element.to == this.checkedNodeId) {
            if (obj.indexOf(element.attName) == -1) {
              obj.push(element.attName)
            }
          }
        });
        this.linkData = obj;
      },
      //选中节点
      chooseNode(v) {
        // console.log(v)
        this.checkedNodeId = v.id;
        this.getLinks();
      },
      //选择展现实体关系
      chooseEntity(v) {
        // console.log(v);
        let objlink = [];
        let linkData = JSON.parse(JSON.stringify(this.linkObject))
        for (let j = 0; j < linkData.length; j++) {
          for (let i = 0; i < v.length; i++) {
            if (linkData[j].attName == v[i]) {
              objlink.push(linkData[j])
            }
          }
        };

        let objNode = [];
        let nodeData = JSON.parse(JSON.stringify(this.nodeObject))
        for (let j = 0; j < nodeData.length; j++) {
          for (let i = 0; i < objlink.length; i++) {
            if (nodeData[j].id == objlink[i].from || nodeData[j].id == objlink[i].to) {
              if (objNode.indexOf(nodeData[j]) == -1) {
                objNode.push(nodeData[j]);
              }
            }
          }
        };
        this.modelData.linkDataArray = objlink;
        this.modelData.nodeDataArray = objNode;
      },
      //搜索，获取实体数据
      getNode(swhat, swhich) {
        //加载进度条
        this.loadStatus = true;
        this.$Loading.start()

        //调接口，请求搜索结果
        getNode(swhat).then(res => {
          if (res.data.rdfEntityList.length == 0) {
            this.$Message.error("未查到相关实体")
          } else {
            //保存上一条历史记录
            if (this.stepArray.length > 0) {
              this.saveHistory();
            }
            //重新搜索，清空历史信息步骤保存数组
            this.stepArray = [];
            this.stepData = {};
            //将搜索关键字放入历史信息保存数组中
            this.stepArray.push({
              name: swhat,
              key: "noKey"
            })
            //搜索前清空数据储存器
            this.modelData = {
              nodeDataArray: [],
              linkDataArray: []
            };
            this.nodeDataBox = [];
            this.linkDataBox = [];
            //根据数据需求，添加key值
            let nodesArr = res.data.rdfEntityList.map(item => {
              item.key = item.id;
              item.color = this.modelColor[item.kgType % 8]
              return item;
            })
            let linksArr = res.data.rdfRelationList.map(item => {
              for (let i = 0; i < nodesArr.length; i++) {
                if (item.from == nodesArr[i].id) {
                  item.color = nodesArr[i].color;
                }
              }
              return item
            })
            this.modelData.nodeDataArray = nodesArr;
            this.modelData.linkDataArray = linksArr;

            let hisObj = {
              linksData: JSON.parse(JSON.stringify(linksArr)),
              nodesData: JSON.parse(JSON.stringify(nodesArr))
            };
            this.stepData.noKey = hisObj;
            //加载进度条结束
            this.$Loading.finish();
            this.loadStatus = false;

            //根据ID进行储存
            arraytoObj(nodesArr, this.nodeObject);
            arraytoObj(linksArr, this.linkObject);
          }

        }).catch(err => {
          console.log(err.response);
          //加载进度条结束
          this.$Loading.finish();
          this.loadStatus = false;
        })
      },
      //点击放大
      zoomOut() {
        this.setWidth = Math.random();
      },
      //点击缩小
      zoomIn() {
        this.setWidth = -Math.random();
      },
      //改变历史弹窗状态
      changehistory() {
        this.historyFlag = !this.historyFlag;
        this.chooseFlag = false;
        if (!this.historyFlag) {
          this.stepsFlag = false;
          this.hsitorySteps = [];
          this.historyData = {};
        }
         this.getHistoryList();
      },
      //保存历史记录
      saveHistory() {
        let historyObj = {
          name: "搜索" + this.stepArray[0].name + ",点击到" + this.stepArray[this.stepArray.length - 1].name + ",共" +
            this.stepArray.length + "步",
          createBy: "",
          modifyBy: "",
          createDate: new Date(),
          modifyDate: new Date(),
          content: JSON.stringify(this.stepArray),
          resultData: JSON.stringify(this.stepData),
          type: "0",
          status: "0"
        };
        //请求保存接口
        saveOrEditHistory(historyObj).then(res => {
          console.log(historyObj)
          console.log(res)
        }).catch(err => {
          console.log(err.response)
        })


      },
      //历史回放
      playback(val) {
        this.chooseFlag = !this.chooseFlag;
        this.stepsFlag = false;
        //将选中的历史记录赋值
        this.hsitorySteps = JSON.parse(val.content);
        this.historyData = JSON.parse(val.resultData);
      },
      //依次播放
      playInTrun() {
        this.stepsFlag = true;
        this.chooseFlag = false;
      },
      //通过点击步骤实现历史信息的回放
      getHistoryData(item, index) {
        //获取选中步骤及之前的节点信息
        let beforeSteps = this.hsitorySteps.slice(0, index + 1);
        //清空显示的数据
        this.modelData = {
          nodeDataArray: [],
          linkDataArray: []
        };
        for (let i = 0; i < beforeSteps.length; i++) {
          this.modelData.nodeDataArray.push(...this.historyData[beforeSteps[i].key].nodesData);
          this.modelData.linkDataArray.push(...this.historyData[beforeSteps[i].key].linksData);
        }
        console.log(this.modelData)
      },
      //历史记录收藏到收藏夹
      toFavorite(val) {
        console.log(val)

      },

      //查看结果
      viewResult() {
        this.chooseFlag = false;
      },
      //从左向右
      toRight() {
        let num = this.historyData.length - 2;
        if (this.widthNum < num) {
          this.widthNum = this.widthNum + 1
        }
        this.$refs.innerBox.style.left = (-80 * this.widthNum) + 'px';
      },
      //从右向左
      toLeft() {
        if (this.widthNum > 0) {
          this.widthNum = this.widthNum - 1;
        }
        this.$refs.innerBox.style.left = (-80 * this.widthNum) + 'px';
      },
      //编辑或者保存 收藏记录名称
      editOrSave(index) {
        //编辑状态为false   转换成编辑状态
        // if (!this.linshihistory[index].isSet) {
        //   this.linshihistory[index].isSet = true;
        // } else {
        //   //编辑状态为true  此时执行保存记录名称
        //   this.linshihistory[index].isSet = false;
        // }

      },
      //获取历史信息
      getHistoryList() {
        let obj = {
          userId: "",
          type: "0"
        }
        //获取历史信息列表
        getHistoryList(obj).then(res => {
          this.allHistoryData = res.data;
        }).catch(err => {
          console.log(err.response)
        })
      }
    },
    mounted() {
      this.getHistoryList();
    },
    components: {
      LoginForm,
      relationChoose,
      entityChoose,
      exportEchart,
      knowledgeMap,
      searchSet
    }
  }

</script>
<style lang="less" scoped>
  @import './index.less';

</style>
