const vaultHelper = require ("./vaultsecrethelper");
require('dotenv').config();

vaultHelper.getCosmosDBSecret()
.then(function(value:string) {
    console.log("Got secret", value);
})
.catch(function(error:any) {
    console.log("Failed", error);
});
