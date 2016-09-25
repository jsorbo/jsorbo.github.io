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
          var width = 960;
          var height = 500;

          // D3 Projection
          var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])    // translate to center of screen
            .scale([1000]);          // scale things down so see entire US

          // Define path generator
          var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
            .projection(projection);  // tell path generator to use albersUsa projection


          // Define linear scale for output
          var color = d3.scaleLinear()
            .range(["rgb(213,222,217)", "rgb(69,173,168)", "rgb(84,36,55)", "rgb(217,91,67)"]);

          //Create SVG element and append map to the SVG
          var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

          // Append Div for tooltip to SVG
          var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          d3.json("data/us-states.json", function (json) {
            svg.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("stroke", "#fff")
              .style("stroke-width", "1")
              .style("fill", function (d) {

                // Get data value
                var value = d.properties.visited;

                if (value) {
                  //If value exists…
                  return color(value);
                } else {
                  //If value is undefined…
                  return "rgb(213,222,217)";
                }
              });
          });

        });
      }
    };
  }]);
