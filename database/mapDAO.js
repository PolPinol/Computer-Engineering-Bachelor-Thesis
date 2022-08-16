const DbConnection = require("./db");

const insertOne = async (obj) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('map').insertOne(obj);
}

module.exports = {
    insertOne,
};