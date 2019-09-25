# PlotSimple - a simplified D3 wrapper

`PlotSimple` is a wrapper and Node.js server that simplifies the processing of MySQL data into charts. It supports an AJAX api for sending a relational query to the server that returns a resultset that can then be plotted. It is very much an MVP with more features planned in the future.

The current MVP supports mutli-Line and Bar charts.

**This is not a secure app and is not intended for production as the SQL that is passed to the server is not scanned for exploits. So, buyer beware. For now, only use this tool for educational purposes.**

Four basic plots are delivered as a demonstration using baseball data. The data can be found in the `static/data` folder.

See the `index.html` and `static/js/app.js` code for an example of how to use PlotSimple. The files are organized as follows:

- app.js - the main program
- attendanceCharts.js - two charts, one barchart and one linechart (with smooth linefill)
- salaryCharts.js - one line chart (with two traces) and one barchart

- plotsimple.js - the `PlotSimple` library functions, documented below


## PlotSimple.js - the D3 Wrapper

`PlotSimple` requires JQuery as well as D3.js to be included in the HTML page

The files `static/js/plotsimple.js` and `static/css/plotsimple.css` are also needed in the HTML.

PlotSimple provides two functions (with more planned) that will plot x/y data with additional options to style the chart.

### lineChart(divName, dataArray, options)

- `divname` is the name of the div to render the chart in (sans #)
- `dataArray` is an array of objects in the following format:
  - [{x: [x0, x1, x2...]}, y:[y0, y1, y2...]}...]
    - x: is an array of x-axis values, one per axis
    - y: is an array of y-axis values to be plotted, one per axis
    - NOTE This allows for multiple line charts ({x: [0], y:[10, 20]})
- `options` - this is an object for specifying the size and color of the lineChart
- defaults:

```
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
```

### barChart(divName, dataArray, options)
- `divname` is the name of the div to render the chart in (sans #)
- `dataArray` is an array of objects in the following format:
  - [{x: [x0, x1, x2...]}, y:[y0, y1, y2...]}...]
    - x: is an array of x-axis values, one per axis
    - y: is an array of y-axis values to be plotted, one per axis
    - NOTE This allows for multiple line charts ({x: [0], y:[10, 20]})
- `options` - this is an object for specifying the size and color of the lineChart
- defaults:

```
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
```

### More Charts are planned
- ScatterChart

## Utility Functions

### textToCSV(text) - convert a long string formatted as CSV into an array of rows of columns
- NOTE: The implementation is very simple
- NOTE: It doesn't take into account quoted strings and columns with commas in it

### sqlToArray(resultset) - convert resultset into an array
- NOTE: converts the resultset returned from the `/api/mysql/query` 
- NOTE: into an array suitable for consumption by the lineChart/barChart functions

### extractDataCSV(dataCSV, xName, yName) - extract a column from csv data
- NOTE: Extracts 2 columns from CSV data (from textToCSV)
- NOTE: formats it into an array suitable for consumption by the Chart functions

## PlotSimple Node.js Server

The PlotSimple Server is instantiated with the following command:

`node server`

Be sure to execute a `npm install` first.

The PlotSimple server delivers HTML files in the root folder and any static files under the `static` folder. It also reads the `apis` folder for plugins that support any api functionality you may want to add. See the `apis/apiTemplate.js` for more details.

The delivered api is a `MySQL` plugin that is accessible at `POST:http://localost:8888/api/mysql/query`. The body must be of the form:

```
{
    query: `SELECT ....`
}
``` 

The SELECT statement must be fully formed, no variable substitution is performed.

The `apis/config.json` file holds the values for database and other configuration items.
