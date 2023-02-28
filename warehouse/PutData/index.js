const { CosmosClient } = require("@azure/cosmos")
const { Buffer } = require('node:buffer')

const fs = require('fs');

module.exports = async function (context, req) {
    
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = "https://warehouse.documents.azure.com:443/";
    const key = '<bYTlxZLrb2d0BQhnn0bb5ZH4zSE8lQZilnf9fR26mG5XUPc0kBNzc4eLn5YbdLWzmoQc15BpgB3YACDbEFF9cQ==>';
    const client = new CosmosClient({ endpoint, key});
    const { database } = await client.databases.createIfNotExists({ id: "warehouseDatabase" });
    const { container } = await database.containers.createIfNotExists({ id: "container2" });
    
    const content = req.body.toString('utf-8')
    const str = content.split('\n');
    str.splice(0, 3)
    str.splice(-2)
    const newStr = str.join("\n");
    const obj = JSON.parse(newStr).Received

    for(let i of obj) {
        await container.items.upsert(i);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: ""
    };
}