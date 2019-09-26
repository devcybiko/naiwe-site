
const PlotSimple = {
    textToCSV: function (text) {
        var results = [];
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var words = line.split(",");
            results.push(words);
        }
        return results;
    },
    /*
        expects homogenous arrays of data...
        data; [{x0: x0Value, x1:x1Value..., y0:y0Value, y1:y1Value...}...]
        result: [{x:[x0Value, x1Value,...], y:[y0Value, y1Value...}]
    */
    sqlToArray: function (data) {
        let result = [];
        let row = data[0];
        let xKeys = Object.keys(row).filter(x => x[0] === 'x').sort((a, b) => a.localeCompare(b));
        let yKeys = Object.keys(row).filter(y => y[0] === 'y').sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < data.length; i++) {
            let xArray = [];
            let yArray = [];
            let row = data[i];
            for (let j = 0; j < xKeys.length; j++) {
                xArray.push(row[xKeys[j]]);
            }
            for (let j = 0; j < yKeys.length; j++) {
                yArray.push(row[yKeys[j]]);
            }
            result.push({ x: xArray, y: yArray });
        }
        return result;
    },

    /*
    data = {label, x0, y0}
    */

    sqlToArray2: function (data) {
        let labels = {};
        data.map(row => labels[row.label] = { x: [], y: [] }); // get all the labels
        data.map(row => { labels[row.label].x.push(row.x0); labels[row.label].y.push(row.y0) }); // get all the x,y values
        let result = [];
        let xSet = [];
        for (let label of Object.keys(labels)) {
            xSet = xSet.concat(labels[label].x);
        }
        xSet = Array.from(new Set(xSet)).sort();
        for (let i = 0; i < xSet.length; i++) {
            let row = { x: [xSet[i]], y: [] };
            for (let label of Object.keys(labels)) {
                let y;
                for (let j = 0; j < labels[label].x.length; j++) {
                    if (xSet[i] === labels[label].x[j]) {
                        y = labels[label].y[j];
                        break;
                    }
                }
                row.y.push(y)
            }
            result.push(row);
        }
        result.labels = Object.keys(labels);
        console.log(result)
        return result;
    },

    /*
        NOTE: dataCSV is an array of rows of columns: 
        NOTE: row[0] is expected to be a list of headers
        [
            [header0, header1, header2...],
            [col0, col1, col2...],
            [col0, col1, col2...],...
        ]
        NOTE: yName can be a string or an array of strings
    */
    extractDataCSV: function (dataCSV, xName, yName) {
        //console.log(dataCSV);
        var dataArray = [];
        //console.log(typeof(yName));
        if (typeof (yName) === 'string') {
            // yname is a scalar - create rows of x,y...
            var header = dataCSV[0];
            var xIndex = header.indexOf(xName);
            var yIndex = header.indexOf(yName);
            var yIndex = header.indexOf(yName);
            //console.log(yName);
            //console.log(yIndex);
            for (var i = 1; i < dataCSV.length; i++) {
                var x = +dataCSV[i][xIndex] || dataCSV[i][xIndex];
                var y = +dataCSV[i][yIndex] || dataCSV[i][yIndex];
                if (x && y) {
                    dataArray.push({ x: x, y: y });
                }
            }
        } else {
            // yname is an array - create rows of x,y[...]...
            var header = dataCSV[0];
            var xIndex = header.indexOf(xName);
            for (var i = 1; i < dataCSV.length; i++) {
                var x = +dataCSV[i][xIndex] || dataCSV[i][xIndex];
                var y = [];
                for (var j = 0; j < y.length; j++) {
                    var yIndex = header.indexOf(yName[j]);
                    y[j] = +dataCSV[i][yIndex] || dataCSV[i][yIndex];
                }
                dataArray.push({ x: x, y: y });
            }
        }
        return dataArray;
    },
    _getDivStyle(div, s) {
        var width = div.style(s).slice(0, -2);
        return Math.round(Number(width))     // return as an integer
    },
    /*
        options = {
            svgWidth: 960,
            svgHeight: 660,
            margin: {
                top: 30,
                right: 30,
                bottom: 30,
                left: 100
            },
            xWidth: 25,
            xLabel: "X",
            yLabel: "Y",
            barColor: "red"
        }
    
        dataArray: array of objects of the form {x: [xValue...], y: [yValue...]}
        xValues can be numbers or strings
        yvalues must be numbers
    */
    barChart(divName, dataArray, options) {
        //console.log(dataArray);
        options = options || {};
        var svgWidth = options.svgWidth || 960;
        var svgHeight = options.svgHeight || 660;
        var margin = options.margin || {
            top: 30,
            right: 30,
            bottom: 30,
            left: 100
        };
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom
        var xWidth = options.xWidth || 25;
        var xLabel = options.xLabel || "X";
        var yLabel = options.yLabel || "Y";
        var barColor = options.barColor || 'red';
        var xAxis = options.xAxis === undefined ? true : options.xAxis;
        var yAxis = options.yAxis === undefined ? true : options.yAxis;

        document.getElementById(divName).innerHTML = "";
        var svg = d3.select(`#${divName}`)
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .style('cursor', 'pointer');
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        //console.log(dataArray);
        var xBandScale = d3.scaleOrdinal()
            .domain(dataArray.map((d, i) => d.x[0]))
            .range(dataArray.map((d, i) => (width / dataArray.length) * i + xWidth));
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray, d => +d.y[0])])
            .range([height, 0]);
        if (xAxis) {
            var bottomAxis =  d3.axisBottom(xBandScale);
            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);
            chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
                .attr("class", "axisText")
                .text(xLabel);
        }
        if (yAxis) {
            var leftAxis = d3.axisLeft(yLinearScale).ticks(options.yticks || 10);
            chartGroup.append("g").call(leftAxis);
            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height + yLabel.length * 8) / 2)
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text(yLabel);
        }
        chartGroup.selectAll(".bar")
            .data(dataArray)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xBandScale(d.x[0]) - xWidth / 2)
            .attr("y", d => yLinearScale(d.y[0]))
            .attr("width", xWidth)
            .attr("height", d => height - yLinearScale(d.y[0]))
            .attr("fill", barColor)
            .on('mouseover', function (d) {
                var rect = this.getBoundingClientRect();
                PlotSimple.toolTipDiv
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);
                PlotSimple.toolTipDiv
                    .html(d.x[0] + '<br/>' + d.y[0])
                    .style('left', (d3.event.pageX - d3.event.x + rect.x + xWidth / 2 - (PlotSimple._getDivStyle(PlotSimple.toolTipDiv, 'width') + 12) / 2) + 'px')
                    .style('top', (d3.event.pageY - d3.event.y + rect.y - (PlotSimple._getDivStyle(PlotSimple.toolTipDiv, 'height') + 12)) + 'px')
                    .style('height', '28px');
            })
            .on('mouseout', () => {
                PlotSimple.toolTipDiv
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    },

    /*
    options = {
        svgWidth: 960,
        svgHeight: 660,
        margin: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 100
        },
        xWidth: 25,
        xLabel: "X",
        yLable: "Y",
        lineColor: 'blue' (or ['color', 'color'...])
        curve: true/false,Linear, Step, StepBefore, StepAfter, Basis, Cardinal, MontoneX, CatmullRom
        points: true/false
    }
    
        dataArray: [{x: xvalue, y:yvalue}]
        dataArray: [{x: xvalue, y:[y0, y1, y2...]}]
    */
    lineChart: function (divName, dataArray, options) {
        //console.log(dataArray);
        defaultColors = ['blue', 'red', 'green', 'yellow', 'purple', 'cyan', 'black']
        options = options || {};
        var svgWidth = options.svgWidth || 960;
        var svgHeight = options.svgHeight || 660;
        var margin = options.margin || {
            top: 30,
            right: 30,
            bottom: 30,
            left: 100
        };
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom
        var xWidth = options.xWidth || 25;
        var xLabel = options.xLabel || "X";
        var yLabel = options.yLabel || "Y";
        var lineColors = options.lineColor || 'blue';
        var curve = options.curve || false;
        var points = options.points || false;
        var legend = options.legend || [];

        if (typeof (curve) === 'string') {
            curve = 'd3.curve' + curve[0].toUpperCase() + curve.substring(1);
        } else if (curve === true) {
            curve = 'd3.curveBasis';
        } else {
            curve = 'd3.curveLinear';
        }

        //console.log(typeof (lineColors));
        if (typeof (lineColors) === "string") {
            lineColors = [lineColors];
        }
        //console.log(lineColors);

        if (lineColors.length !== dataArray[0].y.length) {
            for (var i = Math.min(lineColors.length, dataArray[0].y.length); i < dataArray[0].y.length; i++) {
                lineColors[i] = defaultColors[i] || 'black';
            }
        }
        //console.log(lineColors);
        document.getElementById(divName).innerHTML = "";

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(`#${divName}`).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // set the ranges
        var xScale;
        if (typeof (dataArray[0].x[0]) === 'string') {
            xScale = d3.scaleOrdinal()
                .domain(dataArray.map((d, i) => d.x[0]))
                .range(dataArray.map((d, i) => (width / dataArray.length) * i + xWidth));
        } else {
            xScale = d3.scaleLinear().range([0, width]);
            xScale.domain(d3.extent(dataArray, function (d) { return d.x[0]; }));
        }
        var yScale = d3.scaleLinear().range([height, 0]);
        // define the line
        let valueline = [];
        let yMin = 0;
        let yMax = 0;
        for (var i = 0; i < dataArray.length; i++) {
            let d = dataArray[i];
            for (var j = 0; j < d.y.length; j++) {
                if (yMin > d.y[j]) yMin = d.y[j];
                if (yMax < d.y[j]) yMax = d.y[j];
            }
        }
        yScale.domain([yMin, yMax])
        for (var i = 0; i < dataArray[0].y.length; i++) {
            valueline.push(d3.line(dataArray)
                .curve(eval(curve))
                .x(function (d) { return xScale(d.x[0]); })
                .y(function (d) {
                    d.y[i] = +d.y[i];
                    return yScale(d.y[i] || 0);
                })
                .defined(function (d) {
                    return d.y[i] || d.y[i] === 0;
                })
            );
            //console.log(valueline[i]);
        }
        console.log(yMin);
        console.log(yMax);

        // Add the valueline paths.
        for (var i = 0; i < dataArray[0].y.length; i++) {
            let j = i;
            svg.append("path")
                .data([dataArray])
                .attr("class", "line")
                .attr('stroke', function (d) { return lineColors[i]; })
                .attr("d", valueline[j])
            // add circles to svg
            if (points) {
                svg.selectAll("xxx") // weirdly selecting nothing at all...
                    .data(dataArray).enter()
                    .append("circle")
                    .attr("cx", function (d) { return d.y[j] ? xScale(d.x[0]) : null; })
                    .attr("cy", function (d) { return yScale(d.y[j]); })
                    .attr("r", "2px")
                    .attr("fill", lineColors[j])
                    .on('mouseover', function (d) {
                        var rect = this.getBoundingClientRect();
                        PlotSimple.toolTipDiv
                            .transition()
                            .duration(200)
                            .style('opacity', 0.9);
                        PlotSimple.toolTipDiv
                            .html(`${legend[j] ? legend[j] + "<br/>" : ""}${d.x[0]}<br/>${d.y[j]}`)
                            .style('left', (d3.event.pageX - d3.event.x + rect.x - (PlotSimple._getDivStyle(PlotSimple.toolTipDiv, 'width') + 12) / 2) + 'px')
                            .style('top', (d3.event.pageY - d3.event.y + rect.y - (PlotSimple._getDivStyle(PlotSimple.toolTipDiv, 'height') + 12)) + 'px')
                            .style('height', legend[j] ? '46px' : '28px');
                    })
                    .on('mouseout', () => {
                        PlotSimple.toolTipDiv
                            .transition()
                            .duration(500)
                            .style('opacity', 0);
                    });
            }
        }
        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(yScale));
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height + yLabel.length * 8) / 2)
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text(yLabel);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
            .attr("class", "axisText")
            .text(xLabel);

    },
    tableChart: function (divName, dataArray, options) {
        let header = dataArray[0];
        let tableHTML = `<table class="display" id="${divName}-table"><thead><tr>`;
        let columnDefs = {};
        if (options && options.check) {
            tableHTML += `<th></th>`;
            columnDefs = {
                columnDefs: [{
                    orderable: false,
                    className: 'select-checkbox',
                    targets: 0
                }],
                select: {
                    //style: 'os',
                    style: options.check, // multi or os
                    selector: 'td:first-child',
                }
            }
        }
        for (key of Object.keys(header)) {
            tableHTML += `<th>${key}</th>`
        }
        tableHTML += `</tr></thead></table>`;
        console.log(tableHTML)
        document.getElementById(divName).innerHTML = tableHTML;
        let t = $(`#${divName}-table`).DataTable(columnDefs);
        for (let i = 0; i < dataArray.length; i++) {
            let row = dataArray[i];
            if (options && options.check) row[0] = '';
            const rowArray = Object.keys(row).map(j => row[j])
            let trow = t.row.add(rowArray).draw(true);
        }
        if (options && options.click) {
            t.on('click', 'tr', function () {
                var data = t.row(this)[0];
                options.click(data);
            });
        }
        if (options && options.select) {
            t.on('select', function () {
                var data = t.rows(".selected")[0];
                options.select(data);
            });
        }
        return t;
    }
}
PlotSimple.toolTipDiv = d3
    .select('body')
    .append('div')
    .attr('class', 'PStooltip')
    .style('opacity', 0);