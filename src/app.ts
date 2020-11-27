const express = require("express");
var logHelper = require("./utils/loghelper");
const vaultHelper = require("./utils/vaultsecrethelper");
const httpStatus = require('http-status-codes');
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
    vaultHelper.getSecret(null)
    .then (function(response:any) {
        logHelper.logger.info(response);
        res.json(response);
        return;
    })
    .catch(function(error:any) {
        logHelper.logger.info(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
        return;
    });
});

app.get('/id/:id/secret', function(req:any, res:any) {
    vaultHelper.getSecret(req.params.id)
    .then (function(response:any) {
        logHelper.logger.info(response);
        res.json(response);
        return;
    })
    .catch(function(error:any) {
        logHelper.logger.info(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
        return;
    });
});

app.use(function clientErrorHandler(err:any, _req:any, _res:any, next:any) {
    console.log("in client handler");
    logHelper.logger.info("caught error %s", err.name);
    next(err);
});

app.listen(port);
console.log("express now running on port " + port);
logHelper.logger.info("express now running on poprt %d", port);