/**
 * Methods to manage all the logic in the sign up, log in, lands properties and ranking from a player
 */

const playerDAO = require("../database/playerDAO");
const mongo = require("mongodb");

// Method that checks if the player already exists in the database
const playerExists = async (username) => {
    const res = await playerDAO.find({"username": username});
    const num = res.length;

    return num > 0;
}

// Method to create a new player and add it into the database with a username and password
const createPlayer = async (username, password) => {
    const query = await playerDAO.insertOne(
        {
            "username": username,
            "password": btoa(password)
        }
    );

    return query.insertedId;
}

// Method that will get the player id from a given username and password
const getAuthKey = async (username, password) => {
    const query = await playerDAO.findOne(
        {
            "username": username,
            "password": btoa(password)
        }
    );
    return query === null ? null : query._id;
}

// Method that registers a new land owned by the recent created player
const registerLand = async (playerId, landId) => {
    await playerDAO.updateOne(
        {
            "_id": playerId
        },
        {
            "$push": { "lands" : new mongo.ObjectID(landId) }
        }
    );
}

// Method that checks if the given land id is owned by the player
const isLandFromPlayer = async (playerId, landId) => {
    const res = await playerDAO.findOne(
        {
            "_id": new mongo.ObjectId(playerId)
        }
    );

    try {
        for (const land of res.lands) {
            if (land.toString().localeCompare(landId) === 0) return true;
        }
    } catch (e) {
        return false;
    }

    return false;
}

// Method that will get all the ranking (best top 10) punctuating the total amount of the resources since last update
const getRanking = async () => {
    const pipeline = [
        { $match: {} },
        { $lookup: {
                from: "lands",
                localField: "lands",
                foreignField: "_id",
                as: "XX"
            }
        },
        { $project: { _id: 0, username: 1, "XX.resources": 1}},
        { $unwind: "$XX" },
        { $unwind: "$XX.resources" },
        { $group: { _id: "$username", "val": { "$sum" : "$XX.resources.quantity" }} },
        { $sort: {"val" : -1} },
        { $limit: 10 }
    ];

    return playerDAO.aggregate(pipeline);
}

// Method that will get the position from a player into the global ranking punctuating the total amount of the
// resources since last update
const getTopPlayer = async (id) => {
    const pipeline = [
        { $match: {"_id": new mongo.ObjectId(id)} },
        { $lookup: {
                from: "lands",
                localField: "lands",
                foreignField: "_id",
                as: "XX"
            }
        },
        { $project: { _id: 0, username: 1, "XX.resources": 1}},
        { $unwind: "$XX" },
        { $unwind: "$XX.resources" },
        { $group: { _id: "$username", "val": { "$sum" : "$XX.resources.quantity" }} },
        { $sort: {"val" : -1} },
    ];

    const query = await playerDAO.aggregate(pipeline);
    const val = query[0].val;

    const pipeline2 = [
        { $match: { }},
        { $lookup: {
                from: "lands",
                localField: "lands",
                foreignField: "_id",
                as: "XX"
            }
        },
        { $project: { _id: 0, username: 1, "XX.resources": 1}},
        { $unwind: "$XX" },
        { $unwind: "$XX.resources" },
        { $group: { _id: "$username", "val": { "$sum" : "$XX.resources.quantity" }} },
        { $sort: {"val" : -1} },
        { $match: { "val": { "$gt": val } } },
        { $count: "val"}
    ];

    const query2 = await playerDAO.aggregate(pipeline2);

    if (query2.length === 0) return 1;

    return query2[0].val + 1;
}

module.exports = {
    playerExists,
    createPlayer,
    getAuthKey,
    registerLand,
    isLandFromPlayer,
    getRanking,
    getTopPlayer,
};