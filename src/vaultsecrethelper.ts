const KeyVaultSecret = require('@azure/keyvault-secrets');
const identity = require('@azure/identity');

//
// getKeyVaultSecret reads the secret from keyvault using managed identity
//

async function getKeyVaultSecret(keyVaultUrl, secretName, clientID) {

    const keyVaultClient = new KeyVaultSecret.SecretClient(keyVaultUrl, new identity.ManagedIdentityCredential(clientID));

    const result = await keyVaultClient.getSecret(secretName);

    return result.value;
};

async function getCosmosDBSecret() {
    if (process.env.COSMOS_DB_KEY) {
        return process.env.COSMOS_DB_KEY
    }
    else {
        const managedIDClientId = process.env.MANAGED_IDENTITY_CLIENT_ID;
        const keyVaultUrl = "https://" + process.env.KEY_VAULT_INSTANCE + ".vault.azure.net/";
        const cosmosDBSecretName = process.env.COSMOS_DB_SECRET_NAME;

        var value = await getKeyVaultSecret(keyVaultUrl, cosmosDBSecretName, managedIDClientId);
        return value;
    }
};



module.exports = {
    getKeyVaultSecret,
    getCosmosDBSecret

};

