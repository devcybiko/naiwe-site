let fs = require("fs");
let path = require("path");
let basename = path.basename(module.filename);
let env = process.env.NODE_ENV || "production";
let config = require(__dirname + "/api-config.json")[env];
let apis = {};

console.log(env);
fs.readdirSync(__dirname)
  .forEach(function(file) {
    let apiPath = path.join(__dirname, file, "index.js");
    if (fs.existsSync(apiPath)) {
      let api = require(apiPath);
      let newapi = new api(config);
      apis[newapi._name] = newapi  
    }
  });
  //console.log(apis)
module.exports = apis;
