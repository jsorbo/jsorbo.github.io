'use strict';

/**
 * @ngdoc directive
 * @name laborDataVisApp.directive:lineChart
 * @description
 * # lineChart
 */
angular.module('laborDataVisApp')
  .directive('lineChart', ['d3Service', function (d3Service) {
    return {
      restrict: 'EA',
      scope: {},
      link: function (scope, element, attrs) {
        d3Service.d3().then(function (d3) {

          var margin = { top: 30, right: 20, bottom: 30, left: 50 },
            width = 600 - margin.left - margin.right,
            height = 270 - margin.top - margin.bottom;

          var parseDate = d3.timeParse("%Y%m%d");

          var x = d3.scaleTime()
            .range([0, width]);

          var y = d3.scaleLinear()
            .range([height, 0]);

          var line = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.rate); });

          var svg = d3.select(element[0])
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          d3.csv("unemployment.csv", function (error, data) {
            if (error) {
              console.log(error);
            }

            var selectState = function (allStates, state) {
              var stateData = [];
              allStates.forEach(function (d) {
                if (d.state === state) {
                  stateData.push(d);
                }
              });

              stateData.forEach(function (d) {
                d.date = parseDate(d.date + "01");
                d.rate = +d.rate;
              });

              stateData.sort(function (a, b) {
                if (a.date < b.date) {
                  return -1;
                } else if (a.date === b.date) {
                  return 0;
                } else {
                  return 1;
                }
              });

              return stateData;
            };

            var dataTx = selectState(data, "Texas");
            var dataCt = selectState(data, "Connecticut");

            var dataBoth = dataTx.concat(dataCt);

            // Scale the range of the data
            x.domain(d3.extent(dataBoth, function (d) { return d.date; }));
            y.domain([0, d3.max(dataBoth, function (d) { return d.rate; })]);

            // Add the valueline path.
            svg.append("path")
              .attr("class", "line1")
              .attr("d", line(dataTx));

            svg.append("path")
              .attr("class", "line2")
              .attr("d", line(dataCt));

            // Add the X Axis
            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
              .attr("class", "y axis")
              .call(d3.axisLeft(y));
          });

          // x.domain(d3.extent(scope.data, function (d) { return d.date; }));
          // y.domain(d3.extent(scope.data, function (d) { return d.close; }));

          // svg.append('g')
          //   .attr('class', 'x axis')
          //   .attr('transform', 'translate(0,' + height + ')')
          //   .call(d3.axisBottom(x));

          // svg.append('g')
          //   .attr('class', 'y axis')
          //   .call(d3.axisLeft(y))
          //   .append('text')
          //   .attr('transform', 'rotate(-90)')
          //   .attr('y', 6)
          //   .attr('dy', '.71em')
          //   .style('text-anchor', 'end')
          //   .text('Price ($)');

          // svg.append('path')
          //   .datum(scope.data)
          //   .attr('class', 'line')
          //   .attr('d', line);
        });
      }
    };
  }]);