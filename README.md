Read keyvault secret using managed identity

Code sample for reading a secret from keyvault using managed identity

Getting Started

This code sample in node shows how to use managed identity to get a secret from keyvault.
It has a generic function to read the secret: getKeyVaultSecret: which given the vault url, the secret name and id of the managed identity, reads the secret and returns it.


Prerequisites

Either run this in a webapp in Azure that is assigned a managed identity: either system assigned managed identity or a user assigned managed identity
Make sure this identity has been granted access to your Azure keyvault, by going to the access policy in keyvault and granting this identity GET Secret 

Installing

npm run build, builds the js files
npm run start, runs the server

Running:
This implements 2 api: get /secret, gets the secret for the secret and keyvault URL specified in the environment variables.
get /id/:id/secret allows you to say what managedid to use to get the secret


