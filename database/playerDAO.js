const DbConnection = require('./db');

const find = async (matchQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').find(matchQuery).toArray();
}

const findOne = async (matchQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').findOne(matchQuery);
}

const updateOne = async (matchQuery, updateQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').updateOne(matchQuery, updateQuery);
}

const insertOne = async (obj) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('players').insertOne(obj);
}

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