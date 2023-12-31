d3.csv('resultDataFrame2d.csv', d3.autoType)
.then(function(data) {
    console.log("data", data)
    // map the data

    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    var x = d3.scaleLinear()
        .range([0, width]);
    var y = d3.scaleLinear()
        .range([height, 0]);
    var color = d3.scaleOrdinal()
        .domain(data.map(d => d['labels']))
        .range(d3.schemeCategory10)
    
    x.domain(d3.extent(data, function(d) { return d['x']; })).nice();
    y.domain(d3.extent(data, function(d) { return d['y']; })).nice();

    var colorBox  = {
        0: "#800080",
        1: "#ffff00"
      };
    
    // prepare for drawing
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xAxis = d3.axisBottom()
        .scale(x)
    var yAxis = d3.axisLeft()
        .scale(y)

    // draw the axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .style("fill", "black")
            .text("Dimension1");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "black")
            .text("Dimension2")
    

    
    // draw the dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d['x']); })
        .attr("cy", function(d) { return y(d['y']); })
        .style("fill", function(d) { 
            console.log(typeof  color(d['labels']));
            console.log( color(d['labels']));
            return colorBox[d['labels']]; });
    
})

  
