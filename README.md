# Labor data visualization

## Demo

Click the screenshot to view the demo.

[![ScreenShot](https://raw.githubusercontent.com/jsorbo/labor-data-vis/master/media/p1.jeff.sorbo.png)](https://youtu.be/bLNU7d88GBE)

## Link to application

[Click here.](https://jsorbo.github.io)

## Visualization features

1. Click a state on the map to toggle its appearance on the chart.
2. Selected states will appear with a higher opacity value.
3. Time series on the chart are labeled with the state name.
4. Mouse over a time series to see a tooltip with the state name.
5. Use the National Rate checkbox to toggle the national unemployment rate on the chart.

## Data description

### Unemployment data

The data contained in `data/unemployment.csv` include the monthly unemployment rates for all 50
U.S. states, in addition to the national rate, from January 1978 through July 2016. Here's a sample
of the data contained in the file:

```
date,state,rate
201601,Alabama,6.3
201601,Alaska,7.3
201601,Arizona,5.3
201601,Arkansas,4.7
...
197812,Wisconsin,5.0
197812,Wyoming,3.1
197801,National,7.1
```

### U.S. States polygon data

The file `data/us-states.json` contains the coordinates for the polygons representing the states
on the U.S. map. This file was obtained from the U.S. map example posted on [Michelle Chandra's Block](http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922).

## Open issues

This application contains a number of open issues, [several of which are posted on the repo Issues page.](https://github.com/jsorbo/jsorbo.github.io/issues) 
Here are a few of the key open issues:

* Allow user to zoom into a time interval.

    Considerable work was completed towards the inclusion of a date range slider on the page. 
    The [noUiSlider](https://refreshless.com/nouislider/) library was added, and some configuration 
    was completed. However, this implementation is incomplete; the chart is not being redrawn upon
    movement of the sliders.

* Refactor for improved separation of concerns.

    Currently the map logic and the chart logic are closely intertwined; the data file reads are nested as follows:

```javascript
// Read US states map coordinates
d3.json("data/us-states.json", function (json) {
    // Read unemployment data
    d3.csv("data/unemployment.csv", function (error, data) {
        // Group and sort state unemployment data
        // Function to draw chart
        // ...
    });
    // Draw the map
    // ...
});
```

* Highlight a state on the map when mousing over the time series.

    This feature was not implemented. However, it should be trivial to add a feature where a
    mouseover on a time series will trigger an animation on the map.