function testFunc(year) {
    var url = `/api/mysql/query`;
    var query = {
        mysql: {
            query: `SELECT logtext AS x0, logtime AS y0 FROM rawlogs`,
        },
    };
    jQuery.post(url, query[_database]).then(str => {
        let resultset = JSON.parse(str);
        console.log(resultset);
    });
}

function testLineChart() {
    var url = "/api/mysql/query";
    var sql = `select logname as label, concat('week', WEEKOFYEAR(logtime)) as x0, count(logtext) as y0 from rawlogs GROUP BY logname, WEEKOFYEAR(logtime) ORDER BY logname, x0, y0`;
    var data = {
        query: sql,
    };
    jQuery.post(url, data).then(result => {
        let data = JSON.parse(result);
        let salaryData = PS.sqlToArray2(data);
        PS.lineChart('testDiv', salaryData, { legend: salaryData.labels, svgHeight: 250, svgWidth: 1000, xLabel: "Year", yLabel: "Sweenie vs Torred Salaries", lineColor: "orange", points: true });
    });
}