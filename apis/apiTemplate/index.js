/* do any requires here
    const mysql = require("mysql2");
*/

/*
    the api must be a constructor taking a configuration object parameter that is shared by all apis.
        let MySQLConstructor = function (config) {

    _name:
        The constructor must return an object that has a _name member with the name of this API.
        This is the name used in the '/api/_name' URL
    (members):
        The constructor may attach other members to the object that are local to the object
        These members are visible to the caller
        By convention, members beginning with underscore (_) are local/static
    (methods):
        The constructor may attach methods that are the api calls
        The name of the methods is used in the '/api/_name/_method' URL
        All api methods must have the same signature:
            this.method = (data, context, callback)
            where
                data - an object that was passed to the api in the body of the POST
                context - an object that the caller cares about
                callback - a callback method that the user supplies
    callbacks:
        All callbacks have the same signature
            callback(err, resultObj, context);
            Where
                err - is an error object. 'null' if there is no error
                resultObj - the result of the API call as an object
                context - the context object passed into the API call by the user
            NOTE: if 'err' is non-falsey, resultObj is undefined, however, context is still passed in
*/

let APITemplate = function (config) { // usually there is some api-specific object at config.apitemplate...
    this._name = "apitemplate";
    this.method = (data, context, callback) => { //callable as '/api/apitemplate/method', data is the request.body
        /* do some work resulting in 'result' */
        if (err) return callback(err, result, context); // note - result is undefined
        else return callback(null, result, context); // note - err is null
    };
}

module.exports = APITemplate; // note that we return the constructor function