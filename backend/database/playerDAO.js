/**
 * Data Access Object for a Player
 */

const DbConnection = require('./db');

// Find data to the 'game' db and 'players' collection after connecting to MongoDB cluster.
const find = async (matchQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').find(matchQuery).toArray();
}

// Find one object to the 'game' db and 'players' collection after connecting to MongoDB cluster.
const findOne = async (matchQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').findOne(matchQuery);
}

// Update one object to the 'game' db and 'players' collection after connecting to MongoDB cluster.
const updateOne = async (matchQuery, updateQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').updateOne(matchQuery, updateQuery);
}

// Insert one object to the 'game' db and 'players' collection after connecting to MongoDB cluster.
const insertOne = async (obj) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').insertOne(obj);
}

// Run an aggregation query from the aggregation framework from MongoDB to the 'game' db and 'players' collection after
// connecting to MongoDB cluster.
const aggregate = async (obj) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').aggregate(obj).toArray();
}

module.exports = {
    find,
    findOne,
    updateOne,
    insertOne,
    aggregate
};