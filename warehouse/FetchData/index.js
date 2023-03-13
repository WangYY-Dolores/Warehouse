const { CosmosClient} = require("@azure/cosmos")
// const { KeyClient } = require("@azure/keyvault-keys");
// const { DefaultAzureCredential } = require("@azure/identity");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = "https://warehouse.documents.azure.com:443/";
    const key = '<bYTlxZLrb2d0BQhnn0bb5ZH4zSE8lQZilnf9fR26mG5XUPc0kBNzc4eLn5YbdLWzmoQc15BpgB3YACDbEFF9cQ==>';
    const client = new CosmosClient({ endpoint, key});
    const { database } = await client.databases.createIfNotExists({ id: "warehouseDatabase" });
    const { container } = await database.containers.createIfNotExists({ id: "container2" });

    // const keyVaultName = process.env["warehouseKeyVault"];
    // const url = "https://" + keyVaultName + ".vault.azure.net";
    // const credential = new DefaultAzureCredential();
    // const client1 = new KeyClient(url, credential);
    console.log(req.headers);

    if( req.query.ShipperID ) {
        const { resources } = await container.items.query("SELECT * from c WHERE " + req.query.ShipperID +  " = c.ShipperID").fetchAll();
        context.res = {
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET',
                "Access-Control-Allow-Origin": "https://wangyy-dolores.github.io/"
            },
            body: resources
        };
    } else {
        context.res = {
            headers: {"Access-Control-Allow-Origin": "https://wangyy-dolores.github.io/"},
            body: []
        };
    }
}