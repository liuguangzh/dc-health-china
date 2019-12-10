<style lang="less" scoped>
  @import './index.less';

</style>
<template>

<div class="layout">
  <div class="loading" v-if="loadState" >
      <div class="load_box">
        <Icon type="ios-loading" size=50 class="demo-spin-icon-load"></Icon>
        <p class="load_text">加载中......</p>
      </div>
  </div>
  <div ref="canvasBox" id="initId" style="height:100%;">

  </div>
</div>

</template>
<script>
  import go from 'gojs'
  //请求接口
  import {
    getNode,
    getChildNode
  } from '@/api/index.js'
  import ContinuousForceDirectedLayout from './kmap1.js'
  export default {
    data() {
      return {
        diagram: null, //展示模型
        inModelData: null, //实体数据（用于渲染）
        closePart: "", //由于合并不能返回实体信息，因此用单击事件返回信息，储存于此
      }
    },
    props: {
      modelData: {
        type: Object,
      },
      setWidth: {
        type: Number
      },
      loadState:{
        type:Boolean,
        default:false 
      }
    },
    watch: {
      modelData: {
        handler: function (val, oldval) {
          this.updateModel(val)
        },
        deep: true
      },
      //传过来值大于零执行放大操作，小于零执行缩小操作
      setWidth(val) {
        if (val > 0) {
          this.diagram.scale += .1;
        } else if (val < 0) {
          this.diagram.scale -= .1
        }
      }
    },
    computed:{
      // inModelData(){
        
      // }
    },
    methods: {
      // and adds a link to that new node
      addNodeAndLink(val) {
        this.$emit('on-click', val)
      },
      init(id) {
        let self = this;
        // if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make; // for conciseness in defining templates
        //初始化gojs
        let myDiagram =
          $(go.Diagram, id, // must name or refer to the DIV HTML element
            {
              //initialAutoScale: go.Diagram.Uniform, // 根据数量自动适应窗口大小，改变节点大小
              contentAlignment: go.Spot.Center, // 模型在窗口中自动居中
              "draggingTool.dragsTree": true, //拖动和复制
              layout: $(ContinuousForceDirectedLayout, // automatically spread nodes apart while dragging
                {
                  defaultSpringLength: 80,
                  defaultElectricalCharge: 50
                }),
              // do an extra layout at the end of a move
              "SelectionMoved": function (e) {
                e.diagram.layout.invalidateLayout();
              }
            });

        // dragging a node invalidates the Diagram.layout, causing a layout during the drag
        myDiagram.toolManager.draggingTool.doMouseMove = function () {
          go.DraggingTool.prototype.doMouseMove.call(this);
          if (this.isActive) {
            this.diagram.layout.invalidateLayout();
          }
        }

        // define each Node's appearance
        //节点模板
        myDiagram.nodeTemplate =
          $(go.Node, "Auto", // the whole node panel
            {
              //鼠标悬浮显示详细信息
              toolTip: $(go.Adornment, "Auto",
                $(go.Shape, {
                  fill: "#fff"
                }),
                $(go.TextBlock, {
                    margin: 4
                  },
                  new go.Binding("text", "name"))),
              
              // mouseEnter: function (e, obj) {},
              // avoidable:false
            },
            // define the node's outer shape, which will surround the TextBlock
            //节点类型
            $(go.Shape, "Circle", {
              //显示内容区域大小
              width: "7",
              height: "7",
              stroke: "white",
              // fill:$(go.Brush,'Radial',{0:"blue",1:"#fff"})//立体效果，径向渐变
            }, new go.Binding("fill", "color")), //展开-合并
            $("TreeExpanderButton", {
              alignment: go.Spot.Bottom,
              alignmentFocus: go.Spot.Top,
            }, {
              visible: true
            }, {
              width: 10,
              height: 10
            }),

            //节点显示内容
            $(go.TextBlock, {
                font: "normal normal normal 12px 'Microsoft YaHei'",
                textAlign: "center",
                stroke: "white",
                //字体最多显示区域
                maxSize: new go.Size(50, NaN),
                minSize: new go.Size(10, NaN),
                //最多显示行数
                maxLines: 2,
                isMultiline: true,
                overflow: go.TextBlock.OverflowEllipsis
              },
              new go.Binding("text", "name"))
          );
        //选中节点模板
        myDiagram.nodeTemplate.selectionAdornmentTemplate =
          $(go.Adornment, "Auto",
            $(go.Panel, "Auto",
              $(go.Shape, "Circle", {
                fill: null,
                stroke: "rgba(255, 255, 255, 0.8)",
                strokeWidth: 5,
                margin: 14
              }),
              $(go.Placeholder) // a Placeholder sizes itself to the selected Node
            )
          ); // end Adornment

        // replace the default Link template in the linkTemplateMap
        //关系线模板
        myDiagram.linkTemplate =
          $(go.Link, // the whole link panel
            {
              selectable: false,

              curve: go.Link.Bezier,
              adjusting: go.Link.Stretch,
              reshapable: true,
              relinkableFrom: true,
              relinkableTo: true,
              toShortLength: 5,

              //鼠标悬浮显示详细信息
              toolTip: $(go.Adornment, "Auto",
                $(go.Shape, {
                  fill: "#fff"
                }),
                $(go.TextBlock, {
                    margin: 4
                },
                new go.Binding("text", "attName"))),

            },
            $(go.Shape, // the link shape
              {
                stroke: "white",
                strokeWidth: 2,
              }, new go.Binding('stroke', 'color')),
            $(go.Shape, // the arrowhead
              {
                toArrow: "SidewaysV",
                stroke: 'white',
                fill: null,
              }, new go.Binding('stroke', 'color')),
            $(go.Panel, "Auto",
              $(go.Shape, // the label background, which becomes transparent around the edges
                {
                  fill: 'transparent',
                  stroke: null
                }),
              // $(go.TextBlock, // the label text
              //   {
              //     textAlign: "center",
              //     font: "8pt helvetica, arial, sans-serif",
              //     stroke: "#FFF",
              //     maxSize: new go.Size(50, NaN),
              //     minSize: new go.Size(10, NaN),
              //     maxLines: 1,
              //     isMultiline: true,
              //     overflow: go.TextBlock.OverflowEllipsis
              //   },
              //   new go.Binding("text", "attName"))
            )
          );

        myDiagram.addDiagramListener("TreeCollapsed", function (e) {});
        myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
          self.closePart = e.subject.part.data
          self.$emit('on-choose',e.subject.part.data)
        });
        //添加新节点按钮
        myDiagram.addDiagramListener("ObjectDoubleClicked", function (e) {
          // console.log(e.subject.part.data)
          self.addNodeAndLink(e.subject.part.data)
        });

        // myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        //将初始化GO模型赋给VUE中diagram
        this.diagram = myDiagram;
        //将数据填装到模型中
        this.updateModel(this.modelData)
      },
      //获取生成model
      model: function () {
        return this.diagram.model;
      },
      //更新数据
      updateModel: function (val) {
        if (val instanceof go.Model) {
          this.diagram.model = val;
        } else {
          var m = new go.GraphLinksModel()
          if (val) {
            for (var p in val) {
              m[p] = val[p];
            }
          }
          this.diagram.model = m;
        }
      },
      updateDiagramFromData: function () {
        this.diagram.startTransaction();

        this.diagram.updateAllRelationshipsFromData();
        this.diagram.updateAllTargetBindings();
        this.diagram.commitTransaction("updated");
        // console.log('updata')
      }
    },
    mounted() {
      this.init('initId')
    }
  }

</script>
