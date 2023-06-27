var symptomName = last_month_day();

$(function () {


    init();
    init2();
    $("#el-dialog").addClass("hide");
    $(".close").click(function (event) {
        $("#el-dialog").addClass("hide");
    });

    var date = new Date();
    var numble = date.getDate();
    var today = getFormatMonth(new Date());
    $("#date1").html(today);
    $("#date2").html(today);
    $("#date3").html(today);
    $("#date4").html(today);


    lay('.demo-input').each(function () {
        laydate.render({
            type: 'month',
            elem: this,
            trigger: 'click',
            theme: '#95d7fb',
            calendar: true,
            showBottom: true,
            done: function () {
                console.log($("#startDate").val())

            }
        })
    });

})
function init() {


    var pieChart1 = echarts.init(document.getElementById('pieChart1'));
    pieChart1.setOption({

        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6",],

        legend: {
            y: '260',
            x: 'center',
            textStyle: {
                color: '#ffffff',

            },
            data: ['0', '1-10', '11-20', '>20',],
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c} ({d}%)"
        },
        calculable: false,
        series: [
            {
                name: 'Number of suspicious node edges',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                data: [
                    { value: 0, name: '0' },
                    { value: 2988, name: '1-10' },
                    { value: 268, name: '11-20' },
                    { value: 172, name: '>20' }

                ]
            }
        ]
    });


    var lineChart = echarts.init(document.getElementById('lineChart'));
    lineChart.setOption({

        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6",],
        legend: {
            y: '260',
            x: 'center',
            textStyle: {
                color: '#ffffff',

            },
            data: ['异常节点数', '异常点相互之间边的类型'],
        },
        calculable: false,
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}条"
        },
        yAxis: [
            {
                type: 'value',
                axisLine: { onZero: false },
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },

                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value //+ "k"
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: ['owner', 'member', 'partner', 'family'],
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },
                splitLine: {
                    "show": false
                },
                axisLabel: {
                    interval: 0, // 显示所有标签
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + ""
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                },
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },
        series: [
            {
                name: '异常节点数',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [-0.6448357161173398, 1.6839827388071158, -0.19671458918490667, -0.8424324335048694]
            },
            {
                name: '异常点相互之间边的类型',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [-0.9584232173801047, 1.3619698352243594, 0.5548765995358501, -0.9584232173801047]
            }
        ]
    });
    var normalDistributionChart = echarts.init(document.getElementById('normalDistributionChart'));
    normalDistributionChart.setOption({
      color: ["#87cefa"],
      legend: {
        y: '250',
        x: 'center',
        data: ['num=1', 'num=2', 'num=3', 'num=4', 'num=5'],
        textStyle: {
          color: '#ffffff',
        }
      },
      calculable: false,
      grid: {
        left: '5%',
        right: '5%',
        bottom: '40%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: [
        {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            formatter: function (value) {
              return value.toFixed(2);  // 格式化横坐标的数值
            }
          },
          splitLine: {
            show: false  // 隐藏纵向的分隔线
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f2f2f2',
              width: 1,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
            name: 'num=1',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        shadowColor: 'rgba(0,0,0,0.4)'
                    }
                }
            },
            data: generateNormalDistribution(0.22520420070011668, 1.0505382833923405)
        },
        {
            name: 'num=2',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        shadowColor: 'rgba(0,0,0,0.4)'
                    }
                }
            },
            data: generateNormalDistribution(1.4075262543757292, 2.7906052435832254)
        },
        {
            name: 'num=3',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        shadowColor: 'rgba(0,0,0,0.4)'
                    }
                }
            },
            data: generateNormalDistribution(3.4632438739789966, 5.50873695864323)
        },
        {
            name: 'num=4',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        shadowColor: 'rgba(0,0,0,0.4)'
                    }
                }
            },
            data: generateNormalDistribution(5.179696616102683, 6.977961616232861)
        },
        {
            name: 'num=5',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        shadowColor: 'rgba(0,0,0,0.4)'
                    }
                }
            },
            data: generateNormalDistribution(6.498249708284714, 8.124487180480868)
        }
    ]
    });
    


    function generateNormalDistribution(mean, stdDev) {
        var data = [];
        var numPoints = 100;
        var step = (4 * stdDev) / numPoints;
        var x = mean - 2 * stdDev;

        for (var i = 0; i < numPoints; i++) {
            var y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
            data.push([x, y]);
            x += step;
        }

        return data;
    }


    var lineChart2 = echarts.init(document.getElementById('lineChart2'));
    lineChart2.setOption({

        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6",],
        legend: {
            y: '260',
            x: 'center',
            textStyle: {
                color: '#ffffff',

            },
            data: ['四种类型的weight值', '异常节点间link的weight值'],
        },
        calculable: false,
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}"
        },
        yAxis: [
            {
                type: 'value',
                axisLine: { onZero: false },
                axisLine: {

                    lineStyle: {
                        color: '#034c6a'
                    },
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: ['owner', 'member', 'partner', 'family'],
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },
                splitLine: {
                    "show": false
                },
                axisLabel: {
                    interval: 0, // 显示所有标签
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + ""
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                },
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },
        series: [
            {
                name: '四种类型的weight值',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [-1.2243233739369164, 1.4473918497318203, 0.3250487077811979, -0.5481171835761015].reverse()
            },
            {
                name: '异常节点间link的weight值',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [-0.300214456996919, 1.6565275054184874, -0.32744627276185095, -1.028866775659716].reverse()
            }
        ]
    });



}

function init2() {
    var lineChart3 = echarts.init(document.getElementById('lineChart3'));
    lineChart3.setOption({

        color: ["#87cefa", "#ff7f50",],
        legend: {
            y: 'top',
            x: 'center',
            textStyle: {
                color: '#ffffff',

            },
            data: ['门诊人次', '住院人次'],
        },
        calculable: false,
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 18,
            height: 20,
            backgroundColor: '#f8f8f8',
            dataBackgroundColor: '#e4e4e4',
            fillerColor: '#87cefa',
            handleColor: '#87cefa',
        },
        yAxis: [
            {
                type: 'value',
                axisLine: { onZero: false },
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },

                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + "人"
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: symptomName,
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
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
                        return value + ""
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                },
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },
        series: [
            {
                name: '门诊费用',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [1150, 180, 2100, 2415, 1212.1, 3125, 1510, 810, 2100, 2415, 1122.1, 3215, 1510, 801, 2001, 2245, 1232.1, 3245, 1520, 830, 2200, 2145, 1223.1, 3225, 150, 80, 200, 245, 122.1, 325]
            },
            {
                name: '住院费用',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005,]
            },
        ]
    });


    var lineChart4 = echarts.init(document.getElementById('lineChart4'));
    lineChart4.setOption({

        color: ["#87cefa", "#ff7f50",],
        calculable: false,
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}元"
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 18,
            height: 20,
            backgroundColor: '#f8f8f8',
            dataBackgroundColor: '#e4e4e4',
            fillerColor: '#87cefa',
            handleColor: '#87cefa',
        },
        yAxis: [
            {
                type: 'value',
                axisLine: { onZero: false },
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },

                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + "元"
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: symptomName,
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
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
                        return value + ""
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                },
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },
        series: [
            {
                name: '医疗费用',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [1500, 800, 1200, 2450, 1122.1, 1325, 1150, 180, 1200, 1245, 1122.1, 1325, 150, 180, 1200, 2145, 1212.1, 3215, 1510, 180, 2100, 2415, 122.1, 325, 150, 80, 200, 245, 122.1, 325].reverse()
            },
        ]
    });

    //年龄分布
    var pieChart2 = echarts.init(document.getElementById('pieChart2'));
    pieChart2.setOption({
        color: ["#32cd32", "#ff7f50", "#87cefa", "#FD6C88", "#4b5cc4", "#faff72"],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        calculable: true,
        series: [
            {
                name: '发病人数',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', '50%'],
                roseType: 'area',
                x: '50%',



                sort: 'ascending',
                data: [
                    { value: 10, name: '婴儿(1-3岁)' },
                    { value: 5, name: '少儿(4-10岁)' },
                    { value: 15, name: '少年(10-18岁)' },
                    { value: 25, name: '青年(18-45岁)' },
                    { value: 125, name: '中年(45-60岁)' },
                    { value: 175, name: '老年(60岁以上)' },
                ]
            }
        ]
    })

    //医疗费用组成
    var pieChart3 = echarts.init(document.getElementById('pieChart3'));
    pieChart3.setOption({
        color: ["#32cd32", "#ff7f50", "#87cefa", "#FD6C88", "#4b5cc4", "#faff72"],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}元"
        },
        calculable: true,
        series: [
            {
                name: '发病人数',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', '50%'],
                roseType: 'area',
                x: '50%',



                sort: 'ascending',
                data: [
                    { value: 10, name: '诊察费用' },
                    { value: 500, name: '检查费用' },
                    { value: 150, name: '检验费用' },
                    { value: 250, name: '西药费用' },
                    { value: 125, name: '中药费用' },
                    { value: 1750, name: '手术费用' },
                ]
            }
        ]
    })
}
