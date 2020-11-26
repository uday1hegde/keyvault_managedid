const express = require("express");
var logHelper = require("./utils/loghelper");
const vaultHelper = require("./utils/vaultsecrethelper");
require('dotenv').config();

var port = process.env.PORT || 3001;

var app = express();
logHelper.init(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
* we have one route, with the get of /key, so just add it here
*/


app.use(function timeLog(req:any, _res:any, next:any) {
    var date = new Date();
    console.log(`Got request ${req.method} at time`, date.toLocaleString());
    next();
});
app.get('/secret', function(_req:any, res:any) {
    vaultHelper.getsecret()
    .then (function(response:any) {
        res.json(response);
    });
});
app.use(function clientErrorHandler(err:any, _req:any, _res:any, next:any) {
    logHelper.logger.info("caught error %s", err.name);
    next(err);
});

app.listen(port);
console.log("express now running on port " + port);
logHelper.logger.info("express now running on poprt %d", port);