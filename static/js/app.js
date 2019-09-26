const PS = PlotSimple;
const _database = "mysql";

function main() {
    allErrorCountsByWeek();
    weeklyErrorCounts();
    totalErrorCount();
    uniqueErrors();
    uniqueSourceErrors();
    logfileCounts();
}

main();
