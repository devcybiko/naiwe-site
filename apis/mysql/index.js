const mysql = require("mysql2");
/*
    constructor...
    api(inputObj, context, callback)
    callback(err, resultObj, context);
*/

// connect(connection, context, callback) => callback(err, connection, context)
// query({query:string}, context, callback) => callback(err, rowset, context)
let MySQLConstructor = function (config) {
    this._name = "mysql";
    this.connection = mysql.createConnection(config.mysqlConfig);
    this.connect = (connection, context, callback) => {
        if(connection.state === 'disconnected'){
            connection.connect(function (err) {
                if (err) return callback(err, connection, context);
            });
        }
        return callback(null, connection, context);
    };
    this.query = (data, context, callback) => {
        this.connect(this.connection, context, function(err, connection, context) {
            if (err) return callback(err, connection, context);
            let query = data.query;
            connection.query(query, {}, function (err, rowset) {
                if (err) return callback(err, null, context);
                let resultSet = [];
                for(let i=0; i<rowset.length; i++) {
                    resultSet.push(rowset[i]);
                }
                return callback(null, resultSet, context);
            });
        });
    }
}

module.exports = MySQLConstructor;