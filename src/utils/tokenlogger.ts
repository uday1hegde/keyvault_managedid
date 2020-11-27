import {GetTokenOptions, TokenCredential} from  "@azure/core-http";


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
                    var token:any = response;
                    logger.info("Got token with client_id %s", token.client_id);
                    return response;
                });
    }
}

module.exports= {LoggingCredential};