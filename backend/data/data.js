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

module.exports = {
    startServer,
    getResources,
    getBuildings,
    getPyramidData,
    getTroops,
    getAdventures,
    getLandsInfo,
};