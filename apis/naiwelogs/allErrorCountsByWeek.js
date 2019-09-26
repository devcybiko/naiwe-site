const sql = `select logname as label, concat('week', WEEKOFYEAR(logtime)) as x0, count(logtext) as y0 from rawlogs GROUP BY logname, WEEKOFYEAR(logtime) ORDER BY logname, x0, y0`;
weeklyCounts = function(data, context, callback) {
    return this.query(sql, data, context, callback);
}
module.exports = weeklyCounts;
