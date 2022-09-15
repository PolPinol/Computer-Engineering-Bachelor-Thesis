/**
 * Data Access Object for a Land
 */

const DbConnection = require("./db");

// Find data to the 'game' db and 'lands' collection after connecting to MongoDB cluster.
const findOne = async (matchQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('lands').findOne(matchQuery);
}

// Update data to the 'game' db and 'lands' collection after connecting to MongoDB cluster.
const updateOne = async (matchQuery, updateQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('lands').updateOne(matchQuery, updateQuery);
}

// Insert data to the 'game' db and 'lands' collection after connecting to MongoDB cluster.
const insertOne = async (obj) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('lands').insertOne(obj);
}

module.exports = {
    findOne,
    updateOne,
    insertOne,
};