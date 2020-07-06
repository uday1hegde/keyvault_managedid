const vaultHelper = require ("./vaultsecrethelper");
require('dotenv').config();

vaultHelper.getCosmosDBSecret()
.then(function(value) {
    console.log("Got secret", value);
})
.catch(function(error) {
    console.log("Failed", error);
});
