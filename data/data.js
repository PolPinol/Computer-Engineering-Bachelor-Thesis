let data;

const startServer = () => {
    const fs = require('fs');
    data = JSON.parse(fs.readFileSync('./gameMaster.json', 'utf8'));
}

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