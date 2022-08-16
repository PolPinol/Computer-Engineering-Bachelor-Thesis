const DbConnection = require("./db");

const findOne = async (matchQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('lands').findOne(matchQuery);
}

const updateOne = async (matchQuery, updateQuery) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('lands').updateOne(matchQuery, updateQuery);
}

const insertOne = async (obj) => {
    const client = await DbConnection.Get();
    return client.db('game').collection('lands').insertOne(obj);
}

module.exports = {
    findOne,
    updateOne,
    insertOne,
};