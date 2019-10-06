const query = function (sql, data, context, callback) {
    this.connect(this.connection, context, function (err, connection, context) {
        if (err) return callback(err, connection, context);
        connection.query(sql, function (err, rowset) {
            //console.log(`...${rowset}`);
            if (err) {
                console.error("bad..." + err.message);
                return callback(err, null, context);
            }
            return callback(null, rowset, context);
        });
    });
}
module.exports = query;
