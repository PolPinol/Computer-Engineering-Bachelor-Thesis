/**
 * Pattern Singleton to connect only once to a MongoDB cluster.
 */

let MongoClient = require('mongodb').MongoClient;

const DbConnection = function () {
    let db = null;

    async function DbConnect() {
        try {
            let url = '';
	    return await MongoClient.connect(url);
        } catch (e) {
            console.log('Error at connecting to mongo');
            return e;
        }
    }

    async function Get() {
        try {
            if (db != null) {
                return db;
            } else {
                db = await DbConnect();
                return db;
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}

module.exports = DbConnection();
