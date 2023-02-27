const { CosmosClient} = require("@azure/cosmos")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = "https://warehouse.documents.azure.com:443/";
    const key = '<bYTlxZLrb2d0BQhnn0bb5ZH4zSE8lQZilnf9fR26mG5XUPc0kBNzc4eLn5YbdLWzmoQc15BpgB3YACDbEFF9cQ==>';
    const client = new CosmosClient({ endpoint, key});
    const { database } = await client.databases.createIfNotExists({ id: "warehouseDatabase" });
    const { container } = await database.containers.createIfNotExists({ id: "container1" });

    if( req.query.shipperId ) {
        const { resources } = await container.items.query("SELECT * from c WHERE " + req.query.shipperId +  " = c.ShipperId").fetchAll();
        context.res = {
            body: resources
        };
    } else {
        context.res = {
            body: []
        };
    }
}