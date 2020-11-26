"use strict";
const kvSecret = require('@azure/keyvault-secrets');
const identity = require('@azure/identity');
const tokenLogger = require("./tokenlogger");
var logger = require("./loghelper").logger;
//
// getKeyVaultSecret reads the secret from keyvault using managed identity
//

async function getKeyVaultSecret(keyVaultUrl:string, secretName:string, clientID:string) {

    //
    // note that the clientID is optional here. 
    // The keyvault secret client has an interesting behavior as follows:
    // if the hosting app has a system assigned identity, it always tries that no matter what. And if you pass 
    // a clientID for your managed identity,  it will try that as well as the system assigned identity. 
    // That ends up in this strange behavior:
    // 1) If system assigned identity has permission to keyault, you will always get the secret using that identity:
    //    no matter what you specified for clientid. If you specified an incorrect managed identity, that error is swallowed.
    // 2) If system assigned identity does not have permission to keyvault, and the id you specified has permission, 
    //    you will get the secret using the id you specified
    // 3) if system assigned identity does not have permission to keyvault, and the id you specified is wrong or does not 
    //    have permission to keyvault, the error thrown only shows that the system assigned identity does not have permission. no mention is made about the id you provided.
    // 4) only if you dont have a system assigned identity will you see any errors caused by using the client id 
    //    of your user assigned managed identity
    //
    
    logger.info("in get secret, managed id is %s", clientID ? clientID: "undefined");
    const credential = (clientID == null) ? 
        new identity.ManagedIdentityCredential() : new identity.ManagedIdentityCredential(clientID);

    const logCredential = new tokenLogger.LoggingCredential(credential);

    const keyVaultClient = new kvSecret.SecretClient(keyVaultUrl, logCredential);

    const result = await keyVaultClient.getSecret(secretName);

    return result.value;
};

//
// getSecret: this function either reads the secret from the env (for localhost testing ), or reads the 
// keyvault url, secretname etc from env and tries to get the secret from keyvault
//
async function getSecret() {
    const managedIDClientId:any = null || process.env.MANAGED_IDENTITY_CLIENT_ID;
 
    var keyVaultUrl:string;
    var secretName:string; 

    if (process.env.KEY_VAULT_INSTANCE) {
        keyVaultUrl = process.env.KEY_VAULT_INSTANCE;
        logger.info("accessing keyvault %s",keyVaultUrl);
    }
    else {
        logger.info("in get key, keyvault instance not defined");
        throw(new Error("Key vault instance missing"));
    }
    
    if (process.env.KEY_SECRET_NAME) {   
        secretName = process.env.KEY_SECRET_NAME;    
        logger.info("accessing keyvault to get secret %s", secretName);
    }
    else {
        logger.info("in get key, keyname not defined");
        throw(new Error("Key name missing"));
    }

    var value:string = await getKeyVaultSecret(keyVaultUrl, secretName, managedIDClientId);
  
    logger.info("Got secret %s", value);

    return value;
}



module.exports = getSecret;


