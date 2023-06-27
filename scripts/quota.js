
$(function(){


  init();

})
function init(){



  var myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6','#FFC300','#5E5E5E' ,'#FF85A1','#63C6AE'];

  //节点属性统计
  var histogramChart1 = echarts.init(document.getElementById('histogramChart1'));
  histogramChart1.setOption({

     grid: {
         top: '20%',
         left: '32%'
     },
     xAxis: {
         show: false
     },
     yAxis: [{
         show: true,
         data:  ['company','organization', 'unknown', 'person', 'location', 'political_organization'
            ,'vessel',   'movement:',  'event'],
         inverse: true,
         axisLine: {
             show: false
         },
         splitLine: {
             show: false
         },
         axisTick: {
             show: false
         },
         axisLabel: {
             color: '#fff',
             formatter: (value, index) => {
                 return [

                     `{lg|${index+1}}  ` + '{title|' + value + '} '
                 ].join('\n')
             },
             rich: {
                 lg: {
                     backgroundColor: '#339911',
                     color: '#fff',
                     borderRadius: 15,
                     // padding: 5,
                     align: 'center',
                     width: 15,
                     height: 15
                 },
             }
         },
     }, {
         show: true,
         inverse: true,
         data: [90,987,605,1022,393,121,115,21,74],
         axisLabel: {
             textStyle: {
                 fontSize: 10,
                 color: '#fff',
             },
         },
         axisLine: {
             show: false
         },
         splitLine: {
             show: false
         },
         axisTick: {
             show: false
         },

     }],
     series: [{
         name: '条',
         type: 'bar',
         yAxisIndex: 0,
         data: [2.63, 28.79, 17.65, 29.81,11.46,3.53,3.35,0.61,2.16],
         barWidth: 10,
         itemStyle: {
             normal: {
                 barBorderRadius: 20,
                 color: function(params) {
                     var num = myColor.length;
                     return myColor[params.dataIndex % num]
                 },
             }
         },
         label: {
             normal: {
                 show: true,
                 position: 'inside',
                 formatter: '{c}%'
             }
         },
     }, {
         name: '框',
         type: 'bar',
         yAxisIndex: 1,
         barGap: '-100%',
         data: [100, 100, 100, 100,100, 100, 100, 100,100],
         barWidth: 15,
         itemStyle: {
             normal: {
                 color: 'none',
                 borderColor: '#00c1de',
                 borderWidth: 3,
                 barBorderRadius: 15,
             }
         }
     }, ]
  })

  //边属性统计
  var histogramChart2 = echarts.init(document.getElementById('histogramChart2'));
  histogramChart2.setOption({

     grid: {
         top: '20%',
         left: '32%'
     },
     xAxis: {
         show: false
     },
     yAxis: [{
         show: true,
         data:  ['ownership',' partnership',' family_relationship','membership'],
         inverse: true,
         axisLine: {
             show: false
         },
         splitLine: {
             show: false
         },
         axisTick: {
             show: false
         },
         axisLabel: {
             color: '#fff',
             formatter: (value, index) => {
                 return [

                     `{lg|${index+1}}  ` + '{title|' + value + '} '
                 ].join('\n')
             },
             rich: {
                 lg: {
                     backgroundColor: '#339911',
                     color: '#fff',
                     borderRadius: 15,
                     // padding: 5,
                     align: 'center',
                     width: 15,
                     height: 15
                 },
             }
         },


     }, {
         show: true,
         inverse: true,
         data: [1980, 2917, 2395, 3777],
         axisLabel: {
             textStyle: {
                 fontSize: 10,
                 color: '#fff',
             },
         },
         axisLine: {
             show: false
         },
         splitLine: {
             show: false
         },
         axisTick: {
             show: false
         },

     }],
     series: [{
         name: '条',
         type: 'bar',
         yAxisIndex: 0,
         data:  [22, 24, 26, 28],
         barWidth: 10,
         itemStyle: {
             normal: {
                 barBorderRadius: 20,
                 color: function(params) {
                     var num = myColor.length;
                     return myColor[params.dataIndex % num]
                 },
             }
         },
         label: {
             normal: {
                 show: true,
                 position: 'inside',
                 formatter: '{c}%'
             }
         },
     }, {
         name: '框',
         type: 'bar',
         yAxisIndex: 1,
         barGap: '-100%',
         data: [100, 100, 100, 100],
         barWidth: 15,
         itemStyle: {
             normal: {
                 color: 'none',
                 borderColor: '#00c1de',
                 borderWidth: 3,
                 barBorderRadius: 15,
             }
         }
     }, ]
  })
    //person-country
    // 加载echarts库
    var pieChart1 = echarts.init(document.getElementById('pieChart1'));
    // 读取CSV文件并处理数据
    d3.csv("country_stats.csv").then(function(data) {
    // 筛选出Type为"person"的数据
    var filteredData = data.filter(function(d) {
      return d.Type === "person";
    });
  
    // 对不同实体进行分组并计算数量
    var groupData = Array.from(d3.group(filteredData, d => d.Country), ([key, value]) => ({ name: key, value: d3.sum(value, d => +d.Count) }));
  
    // 将处理后的数据转换为echarts所需的格式
    var chartData = groupData.map(function(d) {
      return { value: d.value, name: d.name };
    });
  
    // 生成饼图
    pieChart1.setOption({
      color:["#87cefa","#ff7f50","#32cd32","#da70d6"],
      tooltip : {
        trigger: 'item',
        formatter: "{a}<br/>{b}<br/>{c}"
      },
      calculable : true,
      series : [
        {
          name:'counts',
          type:'pie',
          radius : [30, 110],
          center : ['0%', '50%'],
          roseType : 'area',
          x: '50%',
          max: 40,
          sort : 'ascending',
          data: chartData
        }
      ]
    });
    });
  

    //person-links
    var histogramChart5 = echarts.init(document.getElementById('histogramChart5'));
    histogramChart5.setOption( {

      color:['#87cefa'],
      grid:{
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
      },
      tooltip : {
         trigger: 'item',
         formatter: "{a}<br/>{b}<br/>"
     },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              data : ['ownership',' partnership',' family_relationship','membership'],
              axisLine:{
                   lineStyle:{
                       color: '#87cefa'
                   },
               },
               axisLabel : {
                 interval:0,
                 rotate:40,

                   textStyle: {
                       color: '#fff',
                       fontSize:13
                   }
               }
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLine:{
                  lineStyle:{
                      color: '#87cefa'
                  },
              },
              splitLine: {
                  "show": false
              },
              axisLabel: {
                  textStyle: {
                      color: '#fff'
                  },
                  formatter: function (value) {
                      return value 
                  },
              },
          }
      ],
      series : [
          {
              name:'links',
              type:'bar',
              barWidth:30,
              data:[1378,1850,1030,2253],
          },
      ]
    });

    //company-links
    var histogramChart6 = echarts.init(document.getElementById('histogramChart6'));
    histogramChart6.setOption( {
      color:['#87cefa'],
      grid:{
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
      },
      tooltip : {
         trigger: 'item',
         formatter: "{a}<br/>{b}<br/>"
     },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              data : ['ownership',' partnership',' family_relationship','membership'],
              axisLine:{
                   lineStyle:{
                       color: '#87cefa'
                   },
               },
               axisLabel : {
                 interval:0,
                 rotate:40,

                   textStyle: {
                       color: '#fff',
                       fontSize:13
                   }
               }
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLine:{
                  lineStyle:{
                      color: '#87cefa'
                  },
              },
              splitLine: {
                  "show": false
              },
              axisLabel: {
                  textStyle: {
                      color: '#fff'
                  },
                  formatter: function (value) {
                    return value 
                  },
              },
          }
      ],
      series : [
          {
              name:'links',
              type:'bar',
              barWidth:30,
              data:[109,123,69,177],
          },
      ]
    });


    //company-country
    var pieChart2 = echarts.init(document.getElementById('pieChart2'));
    // 读取CSV文件并处理数据
d3.csv("country_stats.csv").then(function(data) {
    // 筛选出Type为"company"的数据
    var filteredData = data.filter(function(d) {
      return d.Type === "company";
    });
  
    // 对不同实体进行分组并计算数量
    var groupData = filteredData.reduce(function(acc, curr) {
      if (acc[curr.Country]) {
        acc[curr.Country] += +curr.Count;
      } else {
        acc[curr.Country] = +curr.Count;
      }
      return acc;
    }, {});
  
    // 将处理后的数据转换为echarts所需的格式
    var chartData = Object.keys(groupData).map(function(key) {
      return { value: groupData[key], name: key };
    });
  
    // 生成饼图
    pieChart2.setOption({
      color:["#87cefa","#ff7f50","#32cd32","#da70d6"],
      tooltip : {
        trigger: 'item',
        formatter: "{a}<br/>{b}<br/>{c}"
      },
      calculable : true,
      series : [
        {
          name:'count',
          type:'pie',
          radius : [30, 110],
          center : ['0%', '50%'],
          roseType : 'area',
          x: '50%',
          max: 40,
          sort : 'ascending',
          data: chartData
        }
      ]
    });
  });
  

    //person-links
    var histogramChart3 = echarts.init(document.getElementById('histogramChart3'));
    histogramChart3.setOption( {

      color:['#87cefa'],
      grid:{
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
      },
      tooltip : {
         trigger: 'item',
         formatter: "{a}<br/>{b}<br/>"
     },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              data : ['ownership',' partnership',' family_relationship','membership'],
              axisLine:{
                   lineStyle:{
                       color: '#87cefa'
                   },
               },
               axisLabel : {
                 interval:0,
                 rotate:40,

                   textStyle: {
                       color: '#fff',
                       fontSize:13
                   }
               }
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLine:{
                  lineStyle:{
                      color: '#87cefa'
                  },
              },
              splitLine: {
                  "show": false
              },
              axisLabel: {
                  textStyle: {
                      color: '#fff'
                  },
                  formatter: function (value) {
                      return value 
                  },
              },
          }
      ],
      series : [
          {
              name:'links',
              type:'bar',
              barWidth:30,
              data:[660,784,2213,1243],
          },
      ]
    });

    //company-links
    var histogramChart4 = echarts.init(document.getElementById('histogramChart4'));
    histogramChart4.setOption( {
      color:['#87cefa'],
      grid:{
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
      },
      tooltip : {
         trigger: 'item',
         formatter: "{a}<br/>{b}<br/>"
     },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              data : ['ownership',' partnership',' family_relationship','membership'],
              axisLine:{
                   lineStyle:{
                       color: '#87cefa'
                   },
               },
               axisLabel : {
                 interval:0,
                 rotate:40,

                   textStyle: {
                       color: '#fff',
                       fontSize:13
                   }
               }
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLine:{
                  lineStyle:{
                      color: '#87cefa'
                  },
              },
              splitLine: {
                  "show": false
              },
              axisLabel: {
                  textStyle: {
                      color: '#fff'
                  },
                  formatter: function (value) {
                    return value 
                  },
              },
          }
      ],
      series : [
          {
              name:'links',
              type:'bar',
              barWidth:30,
              data:[343,351,310,646],
          },
      ]
    });

}
