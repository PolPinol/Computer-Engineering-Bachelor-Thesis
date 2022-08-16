const playerService = require("../services/playerService");
const landService = require("../services/landService");
const jwt = require("jsonwebtoken");

const authenticatePlayer = async (req, res) => {
    if (typeof req.body.username === 'undefined' || typeof req.body.password === 'undefined') {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' is missing."});
    } else if (req.body.username.length < 8 || req.body.password.length < 8) {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' are less than 8 characters / digits."});
    } else {
        const _id = await playerService.getAuthKey(req.body.username, req.body.password);

        if (_id !== null) {
            const authKey = jwt.sign({
                "username": req.body.username,
                "_id": _id
            }, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");

            return res.status(200).send({"auth_key": authKey});
        } else {
            return res.status(404).send({"error": "Your username and/or password are incorrect."});
        }
    }
}

const createPlayer = async (req, res) => {
    if (typeof req.body.username === 'undefined' || typeof req.body.password === 'undefined') {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' is missing."});
    } else if (req.body.username.length < 8 || req.body.password.length < 8) {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' are less than 8 characters / digits."});
    } else {
        if (await playerService.playerExists(req.body.username)) {
            return res.status(400).send({"error": "A player with this username already exists."});
        } else {
            const playerId = await playerService.createPlayer(req.body.username, req.body.password);
            const landId = await landService.createLand();
            await playerService.registerLand(playerId, landId);

            return res.status(200).send({"message": "Sign up correctly."});
        }
    }
}

const ranking = async (req, res) => {
    const query = await playerService.getRanking();

    return res.status(200).send({"ranking": query});
}

const rankingPlayer = async (req, res) => {
    const query = await playerService.getTopPlayer(req.player._id);

    return res.status(200).send({"top": query});
}

module.exports = {
    authenticatePlayer,
    createPlayer,
    ranking,
    rankingPlayer,
};