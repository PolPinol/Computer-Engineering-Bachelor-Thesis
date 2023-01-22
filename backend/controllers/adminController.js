/**
 *  Admin controller
 */

const adminService = require("../services/adminService");

const addResource = async (req, res) => {
    console.log(req.player);
    console.log(req.body.resource);

    if (req.player.username === "admin") {
        const ok = await adminService.addResource(req.body.resource);
        if (ok) {
            res.status(200).send({"message": "Resource added correctly.", "ok": 1});
        } else {
            res.status(400).send({"error": "Resource not added."});
        }
    } else {
        res.status(400).send({"error": "Not admin"});
    }
}

const addBuilding = async (req, res) => {
    if (req.player.username === "admin") {
        const ok = await adminService.addBuilding(req.body.building);
        if (ok) {
            res.status(200).send({"message": "Building added correctly.", "ok": 1});
        } else {
            res.status(400).send({"error": "Building not added."});
        }
    } else {
        res.status(400).send({"error": "Not admin"});
    }
}

const addTroop = async (req, res) => {
    if (req.player.username === "admin") {
        const ok = await adminService.addTroop(req.body.troop);
        if (ok) {
            res.status(200).send({"message": "Troop added correctly.", "ok": 1});
        } else {
            res.status(400).send({"error": "Troop not added."});
        }
    } else {
        res.status(400).send({"error": "Not admin"});
    }
}

const addAdventure = async (req, res) => {
    if (req.player.username === "admin") {
        const ok = await adminService.addAdventure(req.body.adventure);
        if (ok) {
            res.status(200).send({"message": "Adventure added correctly.", "ok": 1});
        } else {
            res.status(400).send({"error": "Adventure not added."});
        }
    } else {
        res.status(400).send({"error": "Not admin"});
    }
}

module.exports = {
    addResource,
    addBuilding,
    addTroop,
    addAdventure,
};