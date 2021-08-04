const express = require("express");
var logHelper = require("./utils/loghelper");
const vaultHelper = require("./utils/vaultsecrethelper");
const httpStatus = require('http-status-codes');
require('dotenv').config();

var port = process.env.PORT || 3001;

var app = express();
//
// initialize the logger
//
logHelper.init(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// we publish 2 apis: one to get a secret and the other to get a secret using a particular managed identity

app.route('/secret')
    .get(function(_req:any, res:any) {
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
        })
    })
    .post(function(_req:any, res:any) {
        vaultHelper.setSecret(null)
        .then (function(response:any) {
            logHelper.logger.info(response);
            res.json(response);
            return;
        })
        .catch(function(error:any) {
            logHelper.logger.info(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
            return;
        })
    });

// this api uses the managed identity specified to get the secret
app.route('/id/:id/secret')
    .get(function(req:any, res:any) {
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
        })
    })
    .post(function(req:any, res:any) {
        vaultHelper.setSecret(req.params.id)
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

app.listen(port);
logHelper.logger.info("express now running on poprt %d", port);