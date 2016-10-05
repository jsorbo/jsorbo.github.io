// Map SVG dimensions
var mapMargin = { top: 30, right: 20, bottom: 30, left: 50 },
    mapWidth = 800 - mapMargin.left - mapMargin.right,
    mapHeight = 480 - mapMargin.top - mapMargin.bottom;

// Map projection
var mapProjection = d3.geoAlbersUsa()
    .translate([mapWidth / 2, mapHeight / 2])
    .scale([mapWidth]);

// Define path generator
var mapPath = d3.geoPath()
    .projection(mapProjection);

// Create map SVG
var mapSvg = d3.select("#map-container")
    .append("svg")
    .attr("width", mapWidth + mapMargin.left + mapMargin.right)
    .attr("height", mapHeight + mapMargin.top + mapMargin.bottom);

// 20-category color function
var color = d3.scaleOrdinal(d3.schemeCategory20b);

// Chart SVG dimensions
var chartMargin = { top: 30, right: 100, bottom: 30, left: 50 },
    chartWidth = 1600 - chartMargin.left - chartMargin.right,
    chartHeight = 360 - chartMargin.top - chartMargin.bottom;

// Parse date
var parseDate = d3.timeParse("%Y%m");

// X scale
var x = d3.scaleTime()
    .range([0, chartWidth]);

// Y scale
var y = d3.scaleLinear()
    .range([chartHeight, 0]);

// Value line function
var valueline = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.rate); });

// Array of objects to store state selections
var allStates = [];

// Object to store all unemployment data
var dataAll = {};

// Date range
var minDate = parseDate("209901"), maxDate = parseDate("190001");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Read US states map coordinates
d3.json("data/us-states.json", function (json) {
    // Read unemployment data
    d3.csv("data/unemployment.csv", function (error, data) {
        // Group unemployment data by state
        data.forEach(function (d) {
            if (dataAll[d.state] == undefined) {
                dataAll[d.state] = [];
            }
            dataAll[d.state].push(d);
        });

        // Set fields and sort by date
        for (var statename in dataAll) {
            dataAll[statename].forEach(function (d) {
                d.date = parseDate(d.date);
                d.rate = +d.rate;
                if (d.date < minDate) {
                    minDate = d.date;
                }
                if (maxDate < d.date) {
                    maxDate = d.date;
                }
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

        // Data for use by chart
        var dataArray = [];
        for (var statename in dataAll) {
            dataArray.push(dataAll[statename]);
        }

        // Function to redraw the chart
        function drawChart() {
            // Remove the existing chart SVG
            d3.select("#chart-container svg").remove();

            // Append the chart SVG
            var chartSvg = d3.select("#chart-container")
                .append('svg')
                .attr('width', chartWidth + chartMargin.left + chartMargin.right)
                .attr('height', chartHeight + chartMargin.top + chartMargin.bottom)
                .append('g')
                .attr('transform', 'translate(' + chartMargin.left + ',' + chartMargin.top + ')');

            // Scale the range of the data
            x.domain(d3.extent(dataAll["Alabama"], function (d) { return d.date; }));
            //x.domain(minDate, maxDate);
            y.domain([0, 20]);

            // Draw lines for selected states
            chartSvg.selectAll(".line")
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

            chartSvg.selectAll(".line2")
                .data(dataArray)
                .enter()
                .append("path")
                .attr("class", "line2")
                .attr("fill", "none")
                .attr("stroke-width", 5)
                .attr("stroke", function (d) {
                    return color(d[0].state);
                })
                .attr("stroke-opacity", 0)
                .attr("d", function (d) {
                    return valueline(d);
                })
                .on("mouseover", function (d) {
                    if (allStates[d[0].state] == undefined || allStates[d[0].state].selected == false) {
                        return;
                    }
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(d[0].state) //  + ":<br/>" + d[0].rate + " on " + d[0].date
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("background", color(d[0].state));
                })
                .on("mouseout", function (d) {
                    if (allStates[d[0].state] == undefined || allStates[d[0].state].selected == false) {
                        return;
                    }
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // Add the labels for the displayed lines
            chartSvg.selectAll("text")
                .data(dataArray)
                .enter()
                .append("text")
                .attr("transform", function (d) {
                    return "translate(" + (chartWidth + 3) + "," + y(d[d.length - 1].rate) + ")";
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
            chartSvg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            chartSvg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y));

            // text label for the x axis
            chartSvg.append("text")
                .attr("transform", "translate(" + (chartWidth / 2) + "," + (chartHeight + chartMargin.top) + ")")
                .style("text-anchor", "middle")
                .text("Date");

            // text label for the y axis
            chartSvg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - chartMargin.left)
                .attr("x", 0 - (chartHeight / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Value");
        }

        // Draw the map
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

                // Toggle opacity for selected state
                mapSvg.selectAll("path")
                    .attr("opacity", function (d1) {
                        if (d1.properties.selected == true) {
                            return 1;
                        } else {
                            return 0.4;
                        }
                    });

                // Redraw the chart
                drawChart();
            });

        // Toggle the national rate
        $("#showNationalRate").change(function () {
            if (allStates["National"] == undefined) {
                allStates["National"] = {};
            }
            if (this.checked) {
                allStates["National"].selected = true;
            } else {
                allStates["National"].selected = false;
            }
            // Redraw the chart
            drawChart();
        });

        // Draw the initial chart
        drawChart();
    });
});

// var range = document.getElementById('slider');

// range.style.height = '20px';
// range.style.margin = '0 auto 30px';

// noUiSlider.create(range, {
//     start: [1978, 2016],
//     margin: 1,
//     limit: 50,
//     connect: true,
//     direction: 'ltr',
//     orientation: 'horizontal',
//     behaviour: 'tap-drag',
//     step: 1,
//     tooltips: true,
//     format: {
//         to: function (value) { return value; },
//         from: function (value) { return value.replace(',-', ''); }
//     },
//     range: { 'min': 1978, 'max': 2016 }
// });