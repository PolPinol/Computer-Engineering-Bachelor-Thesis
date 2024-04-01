/**
 * Methods to fetch all data from gameMaster when server starts.
 */

let data;

// Main method that reads the data from the gameMaster file and parse it.
const startServer = () => {
    const fs = require('fs');
    data = JSON.parse(fs.readFileSync('./backend/gameMaster.json', 'utf8'));
}

// Getters for all data from the gameMaster.
const getResources = () => {
    return data.resources;
}

const getBuildings = () => {
    return data.buildings;
}

const getPyramidData = () => {
    return data.pyramid;
}

const getTroops = () => {
    return data.troops;
}

const getAdventures = () => {
    return data.adventures;
}

const getLandsInfo = () => {
    return data.lands;
}

const getGamemaster = () => {
    return data;
}

const addResource = (resource) => {
    data.resources.push(resource);
    const fs = require('fs');
    fs.writeFileSync('./backend/gameMaster.json', JSON.stringify(data), 'utf8');
    fs.writeFileSync('./backend/gameMaster_real.json', JSON.stringify(data), 'utf8');
}

const addBuilding = (building) => {
    data.buildings.push(building);
    const fs = require('fs');
    fs.writeFileSync('./backend/gameMaster.json', JSON.stringify(data), 'utf8');
    fs.writeFileSync('./backend/gameMaster_real.json', JSON.stringify(data), 'utf8');
}

const addTroop = (troop) => {
    data.troops.push(troop);
    const fs = require('fs');
    fs.writeFileSync('./backend/gameMaster.json', JSON.stringify(data), 'utf8');
    fs.writeFileSync('./backend/gameMaster_real.json', JSON.stringify(data), 'utf8');
}

const addAdventure = (adventure) => {
    data.adventures.push(adventure);
    const fs = require('fs');
    fs.writeFileSync('./backend/gameMaster.json', JSON.stringify(data), 'utf8');
    fs.writeFileSync('./backend/gameMaster_real.json', JSON.stringify(data), 'utf8');
}

module.exports = {
    startServer,
    getResources,
    getBuildings,
    getPyramidData,
    getTroops,
    getAdventures,
    getLandsInfo,
    getGamemaster,
    addResource,
    addBuilding,
    addTroop,
    addAdventure,
};