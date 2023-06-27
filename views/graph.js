var symptomName = last_year_month();
$(function(){


    init();
  
  })
function init()
{
    var width = window.innerWidth,
    height = window.innerHeight;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var nodeColor = {
    'person': '#1f77b4',
    'organization': '#aec7e8',
    'company': '#ff7f0e',
    'political_organization': '#ffbb78',
    'location': '#2ca02c',
    'vessel': '#98df8a',
    'event': '#d62728',
    'movement': '#ff9896',
    'exception': 'none'
};


var linkColor = {
    'membership': '#9467bd',
    'partnership': '#c5b0d5',
    'ownership': '#8c564b',
    'family_relationship': '#c49c94'
};

// add a group to hold all elements to be zoomed
var g = svg.append("g");

var graphData;

d3.json("MC1.json").then(function (graph) {
    graphData = graph;

    var simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id((d) => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", (d) => Math.sqrt(d.weight))
        .attr("stroke", (d) => linkColor[d.type]);

    var node = g.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1)
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("style", (d) => {
          if (d.type && nodeColor[d.type]) {
              return `--node-color: ${nodeColor[d.type]}`;
          } else {
              return `--node-color: #fa664c`;
          }
      })
      
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("click", highlightNode);

    node.append("title")
        .text((d) => d.id);

    simulation.on("tick", function () {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function highlightNode(event, clickedNode) {
        // 重置所有节点和边的样式
        node.attr("opacity", 1)
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1)
            .attr("stroke-width", 0)
            .selectAll("text")
            .remove();

        link.attr("opacity", 1)
            .attr("stroke-width", (d) => Math.sqrt(d.weight));

        // 获取选择的节点跳数
        var numHops = parseInt(document.getElementById("numHops").value);

        // 获取异常节点 ID 数组
        var exceptionNodeIds = [
            "1972868",
            "PC",
            "watercraft",
            "da75877e-ec57-42cc-82b9-de68c8d333e7",
            "coastguard",
            "Lisa Rocha",
            "Luis Jones",
            "Erica Hamilton",
            "Derek Burke",
            "Alan Wells",
            "Amanda Mckenzie",
            "Christopher Cunningham",
            "ninety",
            "days",
            "months",
            "c01c6a10-60c9-4f11-9409-aa04c3963826",
            "f2aee915-d483-4823-a030-9aac5e44c1fe",
            "b8567859-bf54-49fd-8332-5775e19c65af",
            "âŠ",
            "April",
            "week",
            "âHe",
            "90",
            "âThese",
            "Benton Ltd. Liability Co",
            "Spanish Shrimp Carriers",
            "Playa del Cielo Marine",
            "Faroe Islands Shrimp Shark",
            "png xi Line",
            "Mar del Oeste Pic",
            "160",
            "903311212",
            "341411",
            "979893388"
        ];

        // 存储相连的异常节点 ID
        var connectedExceptionNodeIds = [];

        // 辅助函数，递归获取第 N 跳内的节点 ID
        function getNeighborNodeIds(nodeId, hops) {
            if (hops === 0) return;
            hops--;
            graphData.links.forEach(function (link) {
                if (link.source.id == nodeId && !neighborNodeIds.includes(link.target.id)) {
                    neighborNodeIds.push(link.target.id);

                    // 判断是否与异常节点相连
                    if (exceptionNodeIds.includes(link.target.id)) {
                        connectedExceptionNodeIds.push(link.target.id);
                    }

                    getNeighborNodeIds(link.target.id, hops);
                }
            });
        }

        var neighborNodeIds = [clickedNode.id.toString()]; // 包含选中节点自身

        getNeighborNodeIds(clickedNode.id.toString(), numHops);

        // 更新选中节点和第 N 跳内的节点的样式
        node.attr("opacity", function (d) {
            if (neighborNodeIds.includes(d.id.toString())) {
                return 1;
            } else {
                return 0.2;
            }
        }).attr("stroke-width", function (d) {
            if (neighborNodeIds.includes(d.id.toString())) {
                if (exceptionNodeIds.includes(d.id.toString())) {
                    return 4; // 加粗显示选中节点和第 N 跳内的节点
                } else {
                    return 2;
                }
            } else {
                return 0;
            }
        }).attr("fill", function (d) {
            if (exceptionNodeIds.includes(d.id.toString())) {
                return "red"; // 异常节点使用红色填充
            } else {
                return nodeColor[d.type]; // 其他节点使用预定义的颜色
            }
        }).attr("r", function (d) {
            if (d.id === clickedNode.id) {
                return 20; // 增大搜索到的节点的半径
            } else {
                return 5;
            }
        });


        // 在搜索到的节点上显示其对应的 ID
        node.append("text")
            .attr("class", "node-label")
            .attr("x", 0)
            .attr("y", 4)
            .text(function (d) {
                if (d.id === clickedNode.id) {
                    return d.id; // 显示 ID
                } else {
                    return "";
                }
            });

        link.attr("opacity", function (d) {
            if (neighborNodeIds.includes(d.source.id.toString())) {
                return 1;
            } else {
                return 0.2;
            }
        }).attr("stroke-width", function (d) {
            if (neighborNodeIds.includes(d.source.id.toString()) && neighborNodeIds.includes(d.target.id.toString())) {
                return Math.sqrt(d.weight) * 2; // 加粗显示选中节点和第 N 跳内的节点之间的边
            } else {
                return Math.sqrt(d.weight);
            }
        });

        // 加粗标红显示异常节点
        node.attr("stroke", function (d) {
            if (exceptionNodeIds.includes(d.id.toString())) {
                return "red";
            } else {
                return "none";
            }
        });

        // 统计连接到异常节点的个数
        var connectedExceptionNodeCount = connectedExceptionNodeIds.length;
        document.getElementById("connectedExceptionNodeCount").textContent = "Connected Exception Nodes: " + connectedExceptionNodeCount;
    
        var exceptionNodeList = document.getElementById("exceptionNodeList");
        exceptionNodeList.innerHTML = "";
        connectedExceptionNodeIds.forEach(function (nodeId) {
            var li = document.createElement("li");
            li.textContent = nodeId;
            exceptionNodeList.appendChild(li);
        }); 

        if (numHops === 1) {
            var connectedExceptionCounts = graphData.nodes.map(function (node) {
                var count = 0;
                graphData.links.forEach(function (link) {
                    if (link.source.id === node.id && exceptionNodeIds.includes(link.target.id)) {
                        count++;
                    }
                });
                return count;
            });
        
            var average = d3.mean(connectedExceptionCounts);
            var variance = d3.variance(connectedExceptionCounts);
            var deviation = d3.deviation(connectedExceptionCounts);
        
            console.log("Average: " + average);
            console.log("Variance: " + variance);
            console.log("Standard Deviation: " + deviation);
            if (connectedExceptionNodeCount > average + 3 * deviation || connectedExceptionNodeCount < average - 3 * deviation) {
                var abnormalMessage = document.createElement("p");
                abnormalMessage.textContent = "This is likely an abnormal node!";
                abnormalMessage.style.color = "red";
                document.getElementById("connectedExceptionNodeCount").appendChild(abnormalMessage);
            }
        }else {
            var connectedExceptionCounts = graphData.nodes.map(function (node) {
                var visitedNodes = []; // 用于存储已访问的节点
                var count = 0;
        
                function getNeighborNodeIds(nodeId, hops) {
                    if (hops === 0) return;
                    hops--;
                    graphData.links.forEach(function (link) {
                        if (link.source.id === nodeId && !visitedNodes.includes(link.target.id)) {
                            visitedNodes.push(link.target.id);
        
                            if (exceptionNodeIds.includes(link.target.id)) {
                                count++;
                            }
        
                            getNeighborNodeIds(link.target.id, hops);
                        }
                    });
                }
        
                getNeighborNodeIds(node.id, numHops - 1);
        
                return count;
            });
        
            var average = d3.mean(connectedExceptionCounts);
            var variance = d3.variance(connectedExceptionCounts);
            var deviation = d3.deviation(connectedExceptionCounts);
        
            console.log("Average: " + average);
            console.log("Variance: " + variance);
            console.log("Standard Deviation: " + deviation);

            if (connectedExceptionNodeCount > average + 3 * deviation || connectedExceptionNodeCount < average - 3 * deviation) {
                var abnormalMessage = document.createElement("p");
                abnormalMessage.textContent = "This is likely an abnormal node!";
                abnormalMessage.style.color = "red";
                document.getElementById("connectedExceptionNodeCount").appendChild(abnormalMessage);
            }
        }
        
    }

    window.searchNodes = function () {
        var searchNodeId = document.getElementById("searchNodeId").value;
        var numHops = parseInt(document.getElementById("numHops").value);
        node.selectAll(".node-label").remove(); // 清除之前显示的节点标签

        // 查找输入节点
        var searchedNode = graphData.nodes.find(function (node) {
            return String(node.id) === searchNodeId;
        });

        if (searchedNode) {
            highlightNode(null, searchedNode);
        } else {
            console.log("Node not found");
        }
        // 在搜索到的节点上显示其对应的 ID
        node.append("text")
            .attr("class", "node-label")
            .attr("x", 0)
            .attr("y", 4)
            .text(function (d) {
                if (d.id === searchedNode.id) {
                    return d.id; // 显示 ID
                } else {
                    return "";
                }
            });
    };

    window.resetGraph = function () {
      node.attr("opacity", 1)
        .attr("stroke-width", 0)
        .attr("r", 5)
        .selectAll(".node-label")
        .remove();
    
      link.attr("opacity", 1)
        .attr("stroke-width", (d) => Math.sqrt(d.weight));
    
      node.attr("stroke", "#fff")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1);
    
      document.getElementById("connectedExceptionNodeCount").textContent = "Connected Exception Nodes:";
    
      var exceptionNodeList = document.getElementById("exceptionNodeList");
      exceptionNodeList.innerHTML = ""; // 清空异常节点列表
    
    };
    
    // zoom behavior
    var zoom = d3.zoom().on("zoom", function (event) {
        g.attr("transform", event.transform);
    });

    svg.call(zoom);
});

}
