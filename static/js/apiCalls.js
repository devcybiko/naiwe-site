function allErrorCountsByWeek() {
    var url = "/api/naiwelogs/allErrorCountsByWeek";
    jQuery.get(url).then(result => {
        console.log(result)
        let data = JSON.parse(result);
        let jsonData = PS.sqlToArray2(data);
        PS.lineChart('allErrorsDiv', jsonData, { legend: jsonData.labels, svgHeight: 250, svgWidth: 1000, xLabel: "Week", yLabel: "Number Errors", points: true });
    });
}

function weeklyErrorCounts() {
    var url = "/api/naiwelogs/weeklyErrorCounts";
    jQuery.get(url).then(result => {
        console.log(result)
        let data = JSON.parse(result);
        let weeklyData = PS.sqlToArray(data);
        $(`#totalWeeksCountDiv`).html(`${data.length}`);
        //PS.barChart('weeklyErrorCountsDiv', weeklyData, { svgHeight: 250, svgWidth: 1000, xLabel: "Week", yLabel: "Total Errors" });
        PS.barChart('miniWeeklyErrorCountsDiv', weeklyData.filter((row, i) => (i >= (weeklyData.length - 5))),
            { barColor: '#0cc', svgHeight: 100, svgWidth: 250, yAxis: false, xAxis: false, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
        let lastWeek = weeklyData[weeklyData.length - 2].y;
        let thisWeek = weeklyData[weeklyData.length - 1].y;
        console.log(`...${lastWeek} ${thisWeek}`);
        if (thisWeek < lastWeek) {
            $(`#miniWeeklyErrorCountsDivTrend`).addClass(`fa-long-arrow-down`);
            $(`#miniWeeklyErrorCountsDivColor`).removeClass(`text-warning`).addClass(`text-success`);
            $(`#miniWeeklyErrorCountsDivSpan`).text(`Trending Down`);
        } else {
            $(`#miniWeeklyErrorCountsDivTrend`).addClass(`fa-long-arrow-up`);
            $(`#miniWeeklyErrorCountsDivColor`).removeClass(`text-warning`).addClass(`text-danger`);
            $(`#miniWeeklyErrorCountsDivSpan`).text(`Trending Up`);
        }
    });
}

function totalErrorCount() {
    var url = "/api/naiwelogs/totalErrorCount";
    jQuery.get(url).then(result => {
        console.log(result)
        let totalErrorCount = JSON.parse(result);
        console.log(totalErrorCount);
        $(`#totalErrorCountDiv`).html(`${totalErrorCount[0].y0}`);
    });
}

function uniqueErrors() {
    var url = "/api/naiwelogs/uniqueErrors";
    jQuery.get(url).then(result => {
        console.log(result)
        let data = JSON.parse(result);
        $(`#uniqueErrorsCountDiv`).html(`${data.length}`);
        PS.tableChart('uniqueErrorsDiv', data, { check: false });
    });
}

function uniqueSourceErrors() {
    var url = "/api/naiwelogs/uniqueSourceErrors";
    jQuery.get(url).then(result => {
        console.log(result)
        let data = JSON.parse(result);
        $(`#uniqueSourceErrorsCountDiv`).html(`${data.length}`);
        PS.tableChart('uniqueSourceErrorsDiv', data, { check: false });
    });
}

function logfileCounts() {
    var url = "/api/naiwelogs/logfileCounts";
    jQuery.get(url).then(result => {
        console.log(result)
        let data = JSON.parse(result);
        //$(`#logfileCountsDiv`).html(`${data.length}`);
        let table="<table>";
        for(let i=0; i<data.length; i++) {
            table += `<tr><td height="12px">${data[i].x}</td><td height="12px">${data[i].y}</td></tr>`;
        }
        table += "</table>";
        $('#logfileCountsDiv').html(table);
    });
}