let currentDataFile = 'clusterData_index1.csv';

function loadData() {
    const kInput = document.getElementById('kInput');
    const k = kInput.value;

    // Update the data file based on the input
    currentDataFile = `clusterData_index${k}.csv`;

    // Clear previous chart
    d3.select("#chartDiv").selectAll("*").remove();

    d3.csv(currentDataFile, d3.autoType)
        .then(function(data) {
            console.log(data);

            const keys = data.columns.slice(1);
            const margin = {top: 20, right: 10, bottom: 20, left: 10};
            const width = 800;
            const height = keys.length * 120;
            const keyz = 'group';

            const x = new Map(Array.from(keys, key => [key, d3.scaleLinear().domain(d3.extent(data, d => d[key])).range([margin.left, width - margin.right])]));
            const y = d3.scalePoint(keys, [margin.top, height - margin.bottom]);
            const z = d3.scaleSequential().domain(d3.extent(data, d => d[keyz])).interpolator(d3.interpolateBrBG);

            const line = d3.line()
                .defined(([, value]) => value != null)
                .x(([key, value]) => x.get(key)(value))
                .y(([key]) => y(key));

            const svg = d3.create("svg")
                .attr("viewBox", [0, 0, width, height]);

            svg.append("g")
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .attr("stroke-opacity", 0.4)
                .selectAll("path")
                .data(data.slice().sort((a, b) => d3.ascending(a[keyz], b[keyz])))
                .join("path")
                .attr("stroke", d => z(d[keyz]))
                .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
                .append("title")
                .text(d => d.name);

            svg.append("g")
                .selectAll("g")
                .data(keys)
                .join("g")
                .attr("transform", d => `translate(0,${y(d)})`)
                .each(function(d) { d3.select(this).call(d3.axisBottom(x.get(d))); })
                .call(g => g.append("text")
                .attr("x", margin.left)
                .attr("y", -6)
                .attr("text-anchor", "start")
                .attr("fill", "currentColor")
                .text(d => d))
                .call(g => g.selectAll("text")
                .clone(true).lower()
                .attr("fill", "none")
                .attr("stroke-width", 5)
                .attr("stroke-linejoin", "round")
                .attr("stroke", "white"));

            const chartDiv = document.getElementById("chartDiv");
            chartDiv.appendChild(svg.node());

            // 添加刷选框
            const brush = d3.brush()
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
            .on("end", brushEnd);

            svg.append("g")
            .attr("class", "brush")
            .call(brush);

            function brushEnd(event) {
            if (!event.selection) return;

            const [[x0, y0], [x1, y1]] = event.selection;
            // 获取刷选的键
            const brushedKeys = keys.filter((key, index) => {
                const [[x0, y0], [x1, y1]] = event.selection;
                return y(key)>=y0 && y(key)<=y1;
            });
            // 获取刷选的数据
            const selectedData = data.filter(d => {
                return brushedKeys.every(key => {
                const scale = x.get(key);
                const value = (scale(d[key]));
                return value >= x0 && value <= x1;
                });
            });
            const selectedDataIds = selectedData.map(d => d.id);
                console.log(selectedDataIds);
                svg.selectAll("path")
                    .attr("display", d => selectedData.includes(d) ? "initial" : "none");
            }

            return svg.node();
        })
        .catch(function(err) {
            // handle error here
            console.log(err);
        });
}
