const data = require("../data/data");

//
const addResource = async (resource) => {
    // TODO: checks resource
    data.addResource(resource);
    return true;
}

const addBuilding = async (building) => {
    // TODO: checks building
    data.addBuilding(building);
    return true;
}

const addTroop = async (troop) => {
    // TODO: checks troop
    data.addTroop(troop);
    return true;
}

const addAdventure = async (adventure) => {
    // TODO: checks adventure
    data.addAdventure(adventure);
    return true;
}

module.exports = {
    addResource,
    addBuilding,
    addTroop,
    addAdventure,
};