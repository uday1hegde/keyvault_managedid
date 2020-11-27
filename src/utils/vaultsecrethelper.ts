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
    // 1) If you dont specify an id or id does not exist on the compute, 
    // system assigned identity is used
    // 2) if system assigned is not there, and you specify a clientID not assigned to the compute, you get "unknown error"
    // An unknown error occurred and no additional details are available (status code 400)
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
async function getSecret(managedIDClientId:string) {
 
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



module.exports = {getSecret};


