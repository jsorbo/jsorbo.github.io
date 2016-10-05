var mapMargin = { top: 30, right: 20, bottom: 30, left: 50 },
    mapWidth = 800 - mapMargin.left - mapMargin.right,
    mapHeight = 480 - mapMargin.top - mapMargin.bottom;

// D3 Projection
var mapProjection = d3.geoAlbersUsa()
    .translate([mapWidth / 2, mapHeight / 2])    // translate to center of screen
    .scale([mapWidth]);          // scale things down so see entire US

// Define path generator
var mapPath = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
    .projection(mapProjection);  // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var mapSvg = d3.select("#map-container")
    .append("svg")
    .attr("width", mapWidth + mapMargin.left + mapMargin.right)
    .attr("height", mapHeight + mapMargin.top + mapMargin.bottom);

var mapTooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var allStates = [];

var focusMargin = { top: 30, right: 100, bottom: 110, left: 50 },
    contextMargin = { top: 300, right: 100, bottom: 20, left: 50 },
    width = 1600 - focusMargin.left - focusMargin.right,
    focusHeight = 360 - focusMargin.top - focusMargin.bottom,
    contextHeight = 360 - contextMargin.top - contextMargin.bottom;

var parseDate = d3.timeParse("%Y%m");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]);

var y = d3.scaleLinear().range([focusHeight, 0]),
    y2 = d3.scaleLinear().range([contextHeight, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, focusHeight]])
    .extent([[0, 0], [width, focusHeight]])
    .on("zoom", zoomed);

var valueline = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.rate); });

var dataAll = {};

d3.json("data/us-states.json", function (json) {
    d3.csv("data/unemployment.csv", function (error, data) {
        data.forEach(function (d) {
            if (dataAll[d.state] == undefined) {
                dataAll[d.state] = [];
            }
            dataAll[d.state].push(d);
        });

        for (var statename in dataAll) {
            dataAll[statename].forEach(function (d) {
                d.date = parseDate(d.date);
                d.rate = +d.rate;
            });

            dataAll[statename].sort(function (a, b) {
                if (a.date < b.date)
                    return -1;
                else if (a.date > b.date)
                    return 1;
                else
                    return 0;
            });
        }

        // Scale the range of the data
        x.domain(d3.extent(dataAll["Alabama"], function (d) { return d.date; }));
        y.domain([0, 24]);

        var dataArray = [];

        for (var statename in dataAll) {
            dataArray.push(dataAll[statename]);
        }

        function drawChart() {
            d3.select("#chart-container svg").remove();

            var chartSvg = d3.select("#chart-container")
                .append('svg')
                .attr('width', width + focusMargin.left + focusMargin.right)
                .attr('height', focusHeight + focusMargin.top + focusMargin.bottom);

            // .append('g')
            // .attr('transform', 'translate(' + focusMargin.left + ',' + focusMargin.top + ')');

            var focus = chartSvg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + focusMargin.left + "," + focusMargin.top + ")");

            var context = chartSvg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + contextMargin.left + "," + contextMargin.top + ")");

            focus.selectAll(".line")
                .data(dataArray)
                .enter()
                .append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", function (d) {
                    return color(d[0].state);
                })
                .attr("stroke-opacity", function (d) {
                    if (allStates[d[0].state] != undefined && allStates[d[0].state].selected == true) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .attr("d", function (d) {
                    return valueline(d);
                });

            context.selectAll(".line")
                .data(dataArray)
                .enter()
                .append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", function (d) {
                    return color(d[0].state);
                })
                .attr("stroke-opacity", function (d) {
                    if (allStates[d[0].state] != undefined && allStates[d[0].state].selected == true) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .attr("d", function (d) {
                    return valueline(d);
                });

            focus.selectAll("text")
                .data(dataArray)
                .enter()
                .append("text")
                .attr("transform", function (d) {
                    return "translate(" + (width + 3) + "," + y(d[d.length - 1].rate) + ")";
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .style("fill", function (d) {
                    if (allStates[d[0].state] != undefined && allStates[d[0].state].selected == true) {
                        return color(d[0].state);
                    } else {
                        return "#fff";
                    }
                })
                .text(function (d) {
                    return d[0].state;
                });

            // Add the X Axis
            focus.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + focusHeight + ")")
                .call(xAxis());

            // Add the Y Axis
            focus.append("g")
                .attr("class", "y axis")
                .call(yAxis());

            // Add the X Axis
            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + contextHeight + ")")
                .call(xAxis2());

            // Add the Y Axis
            context.append("g")
                .attr("class", "y axis")
                .call(yAxis2());

            // text label for the y axis
            focus.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - focusMargin.left)
                .attr("x", 0 - (focusHeight / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Unemployment Rate (%)");

            chartSvg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", focusHeight);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

            svg.append("rect")
                .attr("class", "zoom")
                .attr("width", width)
                .attr("height", focusHeight)
                .attr("transform", "translate(" + focusMargin.left + "," + focusMargin.top + ")")
                .call(zoom);
        }

        // draw map
        mapSvg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", mapPath)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function (d) {
                var stateName = d.properties.name;
                var stateColor = color(stateName);
                d.properties.color = stateColor;
                return stateColor;
            })
            .attr("opacity", function (d) {
                if (d.properties.selected == undefined || d.properties.selected == false) {
                    return 0.5;
                }
                return 1;
            })
            .on("click", function (d) {
                if (allStates[d.properties.name] == undefined) {
                    allStates[d.properties.name] = {};
                }
                if (d.properties.selected == undefined || d.properties.selected == false) {
                    allStates[d.properties.name].selected = true;
                    d.properties.selected = true;
                } else {
                    allStates[d.properties.name].selected = false;
                    d.properties.selected = false;
                }

                mapSvg.selectAll("path")
                    .attr("opacity", function (d1) {
                        if (d1.properties.selected == true) {
                            return 1;
                        } else {
                            return 0.5;
                        }
                    });

                drawChart();
            });
        
        // Toggle the time series for the national rate
        $("#showNationalRate").change(function () {
            if (allStates["National"] == undefined) {
                allStates["National"] = {};
            }
            if (this.checked) {
                allStates["National"].selected = true;
            } else {
                allStates["National"].selected = false;
            }
            drawChart();
        });
        drawChart();
    });
});

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
