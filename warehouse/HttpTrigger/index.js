const { CosmosClient} = require("@azure/cosmos")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = "https://warehouse.documents.azure.com:443/";
    const key = '<bYTlxZLrb2d0BQhnn0bb5ZH4zSE8lQZilnf9fR26mG5XUPc0kBNzc4eLn5YbdLWzmoQc15BpgB3YACDbEFF9cQ==>';
    const client = new CosmosClient({ endpoint, key});
    const { database } = await client.databases.createIfNotExists({ id: "warehouseDatabase" });
    const { container } = await database.containers.createIfNotExists({ id: "container1" });
    // const { resources } = await container.items.query("SELECT * from c").fetchAll()
    const name = (req.query.name || (req.body && req.body.name));
    const shipmentId = (req.query.shipmentId || (req.body && req.body.shipmentId));

    console.log(name)
    console.log(shipmentId)

    if (shipmentId) {
        // Edit User
        await container.items.upsert({
            shipmentId: shipmentId,
            name: name, 
        });
    } else {
        // Add User
        await container.items.create({
            name: name,
        });
    }

    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}