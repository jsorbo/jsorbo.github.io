'use strict';

/**
 * @ngdoc directive
 * @name laborDataVisApp.directive:usMap
 * @description
 * # usMap
 */
angular.module('laborDataVisApp')
  .directive('usMap', ['d3Service', function (d3Service) {
    return {
      restrict: 'EA',
      scope: {},
      link: function (scope, element, attrs) {
        d3Service.d3().then(function (d3) {
          var margin = { top: 30, right: 20, bottom: 30, left: 50 },
            width = 720 - margin.left - margin.right,
            height = 540 - margin.top - margin.bottom;

          // D3 Projection
          var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])    // translate to center of screen
            .scale([width]);          // scale things down so see entire US

          // Define path generator
          var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
            .projection(projection);  // tell path generator to use albersUsa projection

          //Create SVG element and append map to the SVG
          var svg = d3.select("#vis-column")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

          var div = d3.select("#vis-column")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          var color = d3.scaleOrdinal(d3.schemeCategory20);

          d3.json("data/us-states.json", function (json) {
            svg.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
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
              // .on("click", function (d1) {
              //   svg.selectAll("path")
              //   .attr("opacity", function (d2) {
              //     return (d2 == d1) ? 1 : 0.5;
              //   })
              // });
              // .attr("opacity", 0.5)
              // .append("class", "deselected")
              .on("click", function (d1) {
                svg.selectAll("path")
                  .attr("opacity", function (d2) {
                    debugger;
                    if (d2 === d1) {
                      if (d2.properties.selected == undefined || d2.properties.selected == false) {
                        d2.properties.selected = true;
                        return 1;
                      }
                      d2.properties.selected = false;
                      return 0.5;
                    }
                    if (d2.properties.selected == undefined || d2.properties.selected == false) {
                      return 0.5;
                    }
                    return 1;
                  });
              });
          });

        });
      }
    };
  }]);
