import {GetTokenOptions, TokenCredential} from  "@azure/core-http";
var logger = require("./loghelper").logger;
const jwt = require("jsonwebtoken");


class LoggingCredential implements TokenCredential {
    private credential: TokenCredential;

    constructor(
        credential: TokenCredential,
    ) {
        this.credential = credential;
        //validate token, and see if it matches clientid trust
        // throw authenticationerror if fail
    }

    public async getToken(
        scopes: string | string[],
        options?: GetTokenOptions) {         

        return this.credential.getToken(scopes, options)
                .then (function(response) {
                    if (response) {                    
                        var decoded = jwt.decode(response.token, {complete : true});
                        logger.info("Managed id: app id %s obj id %s", decoded.payload.appid, decoded.payload.oid);
			logger.info("scopes");
			logger.info(scopes);
			logger.info(options);
			logger.info("token");
			logger.info(response);
                    }
                    return response;
                });
    }
}

module.exports= {LoggingCredential};