// Refer to https://observablehq.com/@d3/brushable-scatterplot-matrix
d3.csv('sorted.csv', d3.autoType) // https://github.com/d3/d3-dsv#autoType
  .then(function(data) {
    data = data.slice(0,30)
    console.log('data: ', data)
    console.log('data: ', d3.hierarchy(data))
    //BinTu(data)
    // return
    d3.select("#order-select")
    .on("change", handleOrderChange);
    

    let order = (a, b) => d3.descending(a.outlierTimes, b.outlierTimes)
    function handleOrderChange() {
      const selectedValue = d3.select("#order-select").property("value");
      
      switch (selectedValue) {
        case "index order":
          // ִ����ĸ˳������Ĳ���
          order = (a, b) => d3.ascending(a.index, b.index)
          break;
        case "ascending":
          // ִ������Ƶ������Ĳ���
          order = (a, b) => d3.ascending(a.outlierTimes, b.outlierTimes)
          break;
        case "descending":
          // ִ�н���Ƶ������Ĳ���
          order = (a, b) => d3.descending(a.outlierTimes, b.outlierTimes)
          break;
        default:
          // ����δ֪ѡ������
          // order = (a, b) => d3.descending(a.outlierTimes, b.outlierTimes)
          console.log("default situation")
          break;
      }
      console.log(selectedValue)
      chart.update(d3.sort(data, order))
    }

    chart = BarChart(data, {
      x: d => d.id,
      y: d => d.outlierTimes,
      yLabel: "Frequency",
      // width,
      height: 500,
      color: "steelblue",
      duration: 550 // slow transition for demonstration
    })
    // update = chart.update(d3.sort(data, order))
    
    const input = d3.select("#order-select").node();
    const trigger = {
      start: () => {
        const interval = setInterval(() => {
          input.selectedIndex = (input.selectedIndex + 1) % input.length;
          input.dispatchEvent(new Event("auto-change", { bubbles: true }));
        }, 3000);
        
        const clear = () => clearInterval(interval);
        
        d3.select("#order-select").on("auto-change", handleOrderChange);//, { once: true });
        d3.select("#order-select").on("change", () => {
          handleOrderChange();
          clear(); // ���� clear() ����ֹͣ��ʱ��
        });
        const observer = new MutationObserver(() => {
          if (!document.body.contains(input)) {
            clear();
            observer.disconnect();
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };

    trigger.start();
    
})

function BarChart(data, {
  x = (d, i) => i, // given d in data, returns the (ordinal) x-value
  y = d => d, // given d in data, returns the (quantitative) y-value
  marginTop = 20, // the top margin, in pixels
  marginRight = 0, // the right margin, in pixels
  marginBottom = 30, // the bottom margin, in pixels
  marginLeft = 40, // the left margin, in pixels
  width = 1600, // the outer width of the chart, in pixels
  height = 600, // the outer height of the chart, in pixels
  xDomain, // an array of (ordinal) x-values
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  xPadding = 0.1, // amount of x-range to reserve to separate bars
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor", // bar fill color
  duration: initialDuration = 250, // transition duration, in milliseconds
  delay: initialDelay = (_, i) => i * 20 // per-element transition delay, in milliseconds
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  console.log('data: ', data)
  console.log('X: ', X)
  console.log('Y: ', Y)
  // Compute default domains, and unique the x-domain.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  xDomain = new d3.InternSet(xDomain);

  // Omit any data not present in the x-domain.
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  const format = yScale.tickFormat(100, yFormat);

  const svg = d3.select("svg")
      // .attr("viewBox", [-padding, 0, width, width+20])
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const yGroup = svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick").call(grid))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  let rect = svg.append("g")
      .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
      .property("key", i => X[i]) // for future transitions
      .call(position, i => xScale(X[i]), i => yScale(Y[i]))
      .style("mix-blend-mode", "multiply")
      .call(rect => rect.append("title")
          .text(i => [X[i], format(Y[i])].join("\n")));

  const xGroup = svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  // A helper method for updating the position of bars.
  function position(rect, x, y) {
    return rect
        .attr("x", x)
        .attr("y", y)
        .attr("height", typeof y === "function" ? i => yScale(0) - y(i) : i => yScale(0) - y)
        .attr("width", xScale.bandwidth());
  }

  // A helper method for generating grid lines on the y-axis.
  function grid(tick) {
    return tick.append("line")
        .attr("class", "grid")
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1);
  }

  // Call chart.update(data, options) to transition to new data.
  return Object.assign(svg.node(), {
    update(data, {
      xDomain, // an array of (ordinal) x-values
      yDomain, // [ymin, ymax]
      duration = initialDuration, // transition duration, in milliseconds
      delay = initialDelay // per-element transition delay, in milliseconds
    } = {}) {
      // Compute values.
      const X = d3.map(data, x);
      const Y = d3.map(data, y);

      // Compute default domains, and unique the x-domain.
      if (xDomain === undefined) xDomain = X;
      if (yDomain === undefined) yDomain = [0, d3.max(Y)];
      xDomain = new d3.InternSet(xDomain);

      // Omit any data not present in the x-domain.
      const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

      // Update scale domains.
      xScale.domain(xDomain);
      yScale.domain(yDomain);

      // Start a transition.
      const t = svg.transition().duration(duration);

      // Join the data, applying enter and exit.
      rect = rect
          .data(I, function(i) { return this.tagName === "rect" ? this.key : X[i]; })
          .join(
            enter => enter.append("rect")
                .property("key", i => X[i]) // for future transitions
                .call(position, i => xScale(X[i]), yScale(0))
                .style("mix-blend-mode", "multiply")
                .call(enter => enter.append("title")),
            update => update,
            exit => exit.transition(t)
                .delay(delay)
                .attr("y", yScale(0))
                .attr("height", 0)
                .remove()
          );

      // Update the title text on all entering and updating bars.
      rect.select("title")
          .text(i => [X[i], format(Y[i])].join("\n"));

      // Transition entering and updating bars to their new position. Note
      // that this assumes that the input data and the x-domain are in the
      // same order, or else the ticks and bars may have different delays.
      rect.transition(t)
          .delay(delay)
          .call(position, i => xScale(X[i]), i => yScale(Y[i]));

      // Transition the x-axis (using a possibly staggered delay per tick).
      xGroup.transition(t)
          .call(xAxis)
          .call(g => g.selectAll(".tick").delay(delay));

      // Transition the y-axis, then post process for grid lines etc.
      yGroup.transition(t)
          .call(yAxis)
        .selection()
          .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick").selectAll(".grid").data([,]).join(grid));
    }
  });
}

// function BinTu(data) {
//   var countsExtent = d3.extent(data, function(d) { return +d.outlierTimes; }); // ��ȡcounts�е���С�����ֵ
//   var binSize = 1000; // ����Ĵ�С
//   var bins = d3.range(countsExtent[0], countsExtent[1], binSize); // ���������С����һϵ������
//   console.log('countsExtent', countsExtent)
//   var histogram = d3.histogram()
//     .domain(countsExtent)
//     .thresholds(bins);

//   var countByBin = histogram(data.map(function(d) { return +d.outlierTimes; })); // �����������ÿ���������������

//   // 3. ���Ʊ�ͼ
//   var pie = d3.pie()
//     .value(function(d) { return d.length; }); // ʹ��ÿ�����������������Ϊ��ͼ��ֵ

//   var arcs = pie(countByBin);

//   var width = 400; // ��ͼ�����Ŀ���
//   var height = 400; // ��ͼ�����ĸ߶�
//   var radius = Math.min(width, height) / 2; // ��ͼ�İ뾶

//   var color = d3.scaleOrdinal(d3.schemeCategory10); // ��ͼ����ɫ������

//   var svg = d3.select("#barchart-svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//   var arc = d3.arc()
//     .innerRadius(0)
//     .outerRadius(radius);

//   svg.selectAll("path")
//     .data(arcs)
//     .enter()
//     .append("path")
//     .attr("d", arc)
//     .attr("fill", function(d, i) { return color(i); })
//     .attr("stroke", "white")
//     .style("stroke-width", "2px");

//   // 4. ���ӱ�ͼ��ǩ
//   svg.selectAll("text")
//     .data(arcs)
//     .enter()
//     .append("text")
//     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//     .attr("text-anchor", "middle")
//     .attr("dy", "0.35em")
//     .text(function(d) { return d.data.length; });
// }
