const mysql = require("mysql2");
const load = require("./load");
const query = require("./query");
const weeklyErrorCounts = require("./weeklyErrorCounts");
const totalErrorCount = require("./totalErrorCount");
const uniqueErrors = require("./uniqueErrors");
const uniqueSourceErrors = require("./uniqueSourceErrors");
const allErrorCountsByWeek = require("./allErrorCountsByWeek");
const logfileCounts = require("./logfileCounts");

/*
    constructor...
    api(inputObj, context, callback)
    callback(err, resultObj, context);
*/
const NAIWELogsConstructor = function (config) {
    this._name = "naiwelogs";
    this.config = config;
    this.connection = mysql.createConnection(config.mysqlConfig);
    this.connect = (connection, context, callback) => {
        if (connection.state === 'disconnected') {
            connection.connect(function (err) {
                if (err) return callback(err, connection, context);
            });
        }
        return callback(null, connection, context);
    };
    this.query = query;
    this.load = load;
    this.weeklyErrorCounts = weeklyErrorCounts;
    this.totalErrorCount = totalErrorCount;
    this.uniqueErrors = uniqueErrors;
    this.uniqueSourceErrors = uniqueSourceErrors;
    this.allErrorCountsByWeek = allErrorCountsByWeek;
    this.logfileCounts = logfileCounts;
}
module.exports = NAIWELogsConstructor;