/**
 * Data Access Object for a Map
 */

const DbConnection = require("./db");

// Insert new position data to the 'game' db and 'map' collection after connecting to MongoDB cluster.
const insertOne = async (obj) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('map').insertOne(obj);
}

module.exports = {
    insertOne,
};