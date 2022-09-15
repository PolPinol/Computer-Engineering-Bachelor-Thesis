/**
 * Controller for all calls to API related to land management.
 */

const playerService = require("../services/playerService");
const landService = require("../services/landService");

// Method that get all identifiers from lands owned by the player.
const getLands = async (req, res) => {
    const lands = await landService.getLands(req.player._id);

    if (lands !== null) {
        return res.status(200).send(lands);
    } else {
        return res.status(404).send({"error": "There are no lands for this player."});
    }
}

// Get all data from the given land. The land must be owned by the player id.
const getLandInfo = async (req, res) => {
    if (!await playerService.isLandFromPlayer(req.player._id, req.params.land_id)) {
        return res.status(404).send({"error": "This land is not owned by the player."});
    }

    const land = await landService.getLandInfo(req.params.land_id);

    if (land !== null) {
        return res.status(200).send(land);
    } else {
        return res.status(404).send({"error": "The land id is incorrect."});
    }
}

// Method that depending on if the field is occupied, it builds the building given, or it upgrades it.
const buildOrUpgrade = async (req, res) => {
    if (typeof req.body.landId === 'undefined' || typeof req.body.buildingId === 'undefined' || typeof req.body.nField === 'undefined') {
        return res.status(400).send({"error": "Fields on body request are not correct / missing."})
    } else {
        if (!await playerService.isLandFromPlayer(req.player._id, req.body.landId)) {
            return res.status(404).send({"error": "This land is not owned by the player."});
        }

        const land = await landService.getLandInfo(req.body.landId);

        if (land !== null) {
            const indexBuilding = landService.isBuildingIdCorrect(req.body.buildingId);
            if (indexBuilding !== null) {
                const status = landService.checkBuildOrUpgrade(land, req.body.nField);
                if (status.localeCompare('upgrade') === 0) {
                    const query = await landService.upgradeBuilding(land, indexBuilding, req.body.nField);
                    if (query) {
                        return res.status(200).send({"ok": 1});
                    } else {
                        return res.status(404).send({"error": "Not sufficient resources to upgrade."});
                    }
                } else if (status.localeCompare('build') === 0) {
                    const query = await landService.build(land, indexBuilding, req.body.nField);
                    if (query) {
                        return res.status(200).send({"ok": 1});
                    } else {
                        return res.status(404).send({"error": "Not sufficient resources to build."});
                    }
                } else {
                    return res.status(404).send({"error": "The nField is incorrect."});
                }
            } else {
                return res.status(404).send({"error": "The building id is incorrect."});
            }
        } else {
            return res.status(404).send({"error": "The land id is incorrect."});
        }
    }
}

// Method that upgrades a field of resource.
const upgradeResource = async (req, res) => {
    if (typeof req.body.landId === 'undefined' || typeof req.body.nField === 'undefined') {
        return res.status(400).send({"error": "Fields on body request are not correct / missing."})
    } else {
        if (!await playerService.isLandFromPlayer(req.player._id, req.body.landId)) {
            return res.status(404).send({"error": "This land is not owned by the player."});
        }

        const land = await landService.getLandInfo(req.body.landId);

        if (land !== null) {
            const indexResource = landService.getIndexResource(land, req.body.nField);
            const query = await landService.upgradeResource(land, indexResource, req.body.nField);
            if (query) {
                return res.status(200).send({"ok": 1});
            } else {
                return res.status(404).send({"error": "Not sufficient resources to upgrade."});
            }
        } else {
            return res.status(404).send({"error": "The land id is incorrect."});
        }
    }
}

// Method that upgrades the pyramid level.
const upgradePyramid = async (req, res) => {
    if (typeof req.body.landId === 'undefined') {
        return res.status(400).send({"error": "Fields on body request are not correct / missing."})
    } else {
        if (!await playerService.isLandFromPlayer(req.player._id, req.body.landId)) {
            return res.status(404).send({"error": "This land is not owned by the player."});
        }

        const land = await landService.getLandInfo(req.body.landId);

        if (land !== null) {
            const query = await landService.upgradePyramid(land);
            if (query) {
                return res.status(200).send({"ok": 1});
            } else {
                return res.status(404).send({"error": "Not sufficient resources to upgrade."});
            }
        } else {
            return res.status(404).send({"error": "The land id is incorrect."});
        }
    }
}

// Method that recruits the quantity of the troops requests.
const recruitTroops = async (req, res) => {
    if (typeof req.body.landId === 'undefined' || typeof req.body.troopId === 'undefined' || typeof req.body.quantity === 'undefined') {
        return res.status(400).send({"error": "Fields on body request are not correct / missing."})
    } else {
        if (!await playerService.isLandFromPlayer(req.player._id, req.body.landId)) {
            return res.status(404).send({"error": "This land is not owned by the player."});
        }

        if (req.body.quantity > 0) {
            const land = await landService.getLandInfo(req.body.landId);

            if (land !== null) {
                const query = await landService.recruitTroops(land, req.body.troopId, req.body.quantity);
                if (query) {
                    return res.status(200).send({"ok": 1});
                } else {
                    return res.status(404).send({"error": "Not sufficient resources to recruit."});
                }
            } else {
                return res.status(404).send({"error": "The land id is incorrect."});
            }
        } else {
            return res.status(404).send({"error": "The quantity is incorrect."});
        }
    }
}

// Method that sends an adventure over the time.
const adventure = async (req, res) => {
    if (typeof req.body.landId === 'undefined' || typeof req.body.troops === 'undefined' || typeof req.body.difficulty === 'undefined') {
        return res.status(400).send({"error": "Fields on body request are not correct / missing."})
    } else {
        if (!await playerService.isLandFromPlayer(req.player._id, req.body.landId)) {
            return res.status(404).send({"error": "This land is not owned by the player."});
        }

        if (0 < req.body.difficulty && req.body.difficulty < 4) {
            const land = await landService.getLandInfo(req.body.landId);

            if (land !== null) {
                const query = await landService.adventure(land, req.body.troops, req.body.difficulty);
                if (query) {
                    return res.status(200).send({"ok": 1});
                } else {
                    return res.status(404).send({"error": "Error at sending an adventure."});
                }
            } else {
                return res.status(404).send({"error": "The land id is incorrect."});
            }
        } else {
            return res.status(404).send({"error": "The difficulty is incorrect."});
        }
    }
}

// Method that creates / recruit a new land for the given player.
const createLand = async (req, res) => {
    if (typeof req.body.landId === 'undefined') {
        return res.status(400).send({"error": "Fields on body request are not correct / missing."})
    } else {
        if (!await playerService.isLandFromPlayer(req.player._id, req.body.landId)) {
            return res.status(404).send({"error": "This land is not owned by the player."});
        }

        const land = await landService.getLandInfo(req.body.landId);

        if (land !== null) {
            const query = await landService.createLandByPlayer(req.player._id, land);
            if (query) {
                return res.status(200).send({"ok": 1});
            } else {
                return res.status(404).send({"error": "Not sufficient resources to create a land."});
            }
        } else {
            return res.status(404).send({"error": "The land id is incorrect."});
        }
    }
}

module.exports = {
    getLands,
    getLandInfo,
    buildOrUpgrade,
    upgradeResource,
    upgradePyramid,
    recruitTroops,
    adventure,
    createLand,
};