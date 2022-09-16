/**
 * Methods to manage all the logic in the creation and update of a land
 */

const landDAO = require("../database/landDAO");
const mapDAO = require("../database/mapDAO");
const playerDAO = require("../database/playerDAO");
const data = require("../data/data");
const mongo = require("mongodb");

// Method that get all owned lands from a player and return them.
const getLands = async (playerId) => {
    const query = await playerDAO.findOne(
        {
            "_id": new mongo.ObjectId(playerId)
        }
    );

    if (query === null)  return null;

    return {"lands" : query.lands};
}

// Method that creates a new land and return its new id.
const createLand = async () => {
    // Insert new coordinates from a new land to the collection 'map'
    const coordX = Math.floor(Math.random() * 100);
    const coordY = Math.floor(Math.random() * 100);
    const res = await mapDAO.insertOne(
        {
            "coordinates": {
                "type": "Point",
                "coordinates": [ coordX, coordY ]
            }
        }
    );

    // Get the last id from the generated land inside 'map'
    const landId = res.insertedId.toString();

    // Get all initial resources from gamemaster data
    const resourcesData = data.getResources();
    const resourcesIds = [];
    const resources = [];
    resourcesData.forEach(
        element =>
        {
            const obj = {};
            resourcesIds.push(element.resourceId);
            obj.type = element.resourceId;
            obj.quantity = 0;
            resources.push(obj);
        }
    );

    // Select a random type of land with different resources on it
    const lands = data.getLandsInfo();
    const randomLand = Math.floor(Math.random() * lands.type.length);
    const landData = lands.type[randomLand];
    const landType = landData.typeId;
    let it = 1;
    const resourcesFields = [];
    for (const res of landData.resources) {
        const obj = {};
        obj.nField = it;
        obj.type = res;
        obj.level = 1;
        it++;
        resourcesFields.push(obj);
    }

    // Add all new land data to the 'lands' collection
    await landDAO.insertOne(
        {
            "_id": new mongo.ObjectId(landId),
            "name": "Land_" + landId.slice(landId.length - 5, landId.length),
            "resources": resources,
            "pyramidLevel": 1,
            "troops": [],
            "resourcesFields": resourcesFields,
            "landType": landType,
            "buildingsFields": [],
            "eventsTime": [
                {
                    "time": new Date(),
                    "type": "LT"
                }
            ],
            "timeline": []
        }
    );

    return landId.toString();
}

// Method that checks if the player has the necessary resources to create a land
const createLandByPlayer = async (playerId, land) => {
    const landsData = data.getLandsInfo();
    const resourcesInfo = landsData.resources;
    let times = 0;
    const expectedTimes = resourcesInfo.length;

    for (const cost of resourcesInfo) {
        for (const resource of land.resources) {
            if (cmp(cost.type, resource.type)) {
                if (cost.quantity <= resource.quantity) {
                    times++;
                    resource.quantity -= cost.quantity;
                } else {
                    // Case when there is no sufficient resources
                    return false;
                }
            }
        }
    }

    // Land has no material needed on json data
    if (expectedTimes !== times) return false;

    const obj = {};
    obj.type = 'create';
    obj.time = new Date();
    obj.log = 'A new land has been created.';
    land.timeline.push(obj);

    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set": {
                "resources": land.resources,
                "timeline": land.timeline
            }
        }
    );

    const newLandId = await createLand();

    await playerDAO.updateOne(
        {
            "_id": new mongo.ObjectId(playerId)
        },
        {
            "$push": {
                "lands": new mongo.ObjectId(newLandId),
            }
        }
    );

    return true;
}

// Get all data info from a land given an id
const getLandInfo = async (landId) => {
    // Insert data to collection 'map'
    const query = await landDAO.findOne(
        {
            "_id": new mongo.ObjectId(landId)
        }
    );

    if (query === null)  return null;

    return updateLand(query);
}

// Method that update all resources and events from a land. It calculates the events passed and update all necessary
// resources and troops. Also update the events array with new actual information
const updateLand = async (land) => {
    // Add NOW to eventsTime
    const objNow = {};
    objNow.time = new Date();
    objNow.type = "LT";
    land.eventsTime.push(objNow);

    // Sort array eventsTime with event date
    land.eventsTime.sort(function(a, b) {
        return a.time - b.time;
    });

    const eventArr = [];

    // MODELLING TIMELINE

    for (let i = 0; i < land.eventsTime.length-1; i++) {
        const lower = land.eventsTime[i].time;
        const upper = land.eventsTime[i+1].time;

        const productions = [];
        // Calculate production for this interval
        land.resourcesFields.forEach(
            field =>
            {
                const listResourcesLand = getResourcesLand(land.resources);
                if (listResourcesLand.includes(field.type)) {
                    const prod = Math.round(production(field.type, field.level) * bonusPyramid(land.pyramidLevel));
                    land.resources[getIndexArrResources(land.resources, field.type)].quantity += Math.round((upper - lower)/1000 * prod);

                    const obj = {};
                    obj.type = field.type;
                    obj.production = prod;

                    let newObj = true;
                    for (const element of productions) {
                        if (cmp(element.type, field.type)) {
                            element.production += prod;
                            newObj = false;
                            break;
                        }
                    }

                    if (newObj) productions.push(obj);
                } else {
                    // New recourse type por player / land
                    const obj = {};
                    obj.type = field.type;
                    obj.quantity = 0;
                    land.resources.push(obj);
                }
            }
        );
        land.productions = productions;

        // UPDATE TIMES
        const event = land.eventsTime[i+1];

        // CALCULATE BUILD BUILDINGS
        if (cmp(event.type, "build")) {
            // create build obj to add
            const building = {};
            building.nField = event.nField;
            building.type = event.buildingId;
            building.level = 1;

            // add to obj land
            land.buildingsFields.push(building);
        }
        // CALCULATE UPGRADE BUILDING
        else if (cmp(event.type, "upgrade_build")) {
            for (const building of land.buildingsFields) {
                if (building.nField === event.nField) {
                    building.level = event.level;
                }
            }
        }
        // CALCULATE UPGRADE RESOURCE
        else if (cmp(event.type, "upgrade_resource")) {
            for (const resource of land.resourcesFields) {
                if (resource.nField === event.nField) {
                    resource.level = event.level;
                }
            }
        }
        // CALCULATE UPGRADE PYRAMID
        else if (cmp(event.type, "upgrade_pyramid")) {
            land.pyramidLevel = event.level;
        }
        // CALCULATE ADVENTURE DONE
        else if (cmp(event.type, "adventure")) {
            let succeed = true;
            const troopsData = data.getTroops();
            const adventureData = data.getAdventures();
            const adventure = adventureData[event.difficulty - 1];

            let life = adventure.life;
            let attack = adventure.attack;

            // Calculate all damage that player has sent
            let allAttack = 0;
            for (const troops of event.troops) {
                for (const trData of troopsData) {
                    if (trData.troopId === troops.troopId) {
                        allAttack += troops.quantity * trData.attackDamage;
                        break;
                    }
                }
            }
            
            if (life > allAttack) {
                // Adventure failed - No sufficient attack
                succeed = false;
            } else {
                // Calculate all life that player has sent
                let allLife = 0;
                for (const troops of event.troops) {
                    for (const trData of troopsData) {
                        if (trData.troopId === troops.troopId) {
                            allLife += troops.quantity * trData.life;
                            break;
                        }
                    }
                }

                if (attack > allLife) {
                    // Adventure failed - No sufficient life
                    succeed = false;
                } else {
                    // Adventure succeed
                    succeed = true;
                }
            }
            
            if (succeed) {
                // Get quantity
                for (const resource of adventure.resources) {
                    for (const res of land.resources) {
                        if (res.type === resource.type) {
                            res.quantity += resource.quantity;
                            break;
                        }
                    }
                }

                // Kill troops
                // attack = attack from adventure
                for (const troops of event.troops) {
                    for (const trData of troopsData) {
                        if (trData.troopId === troops.troopId) {
                            let it = 0;
                            for (let j = 0; j < troops.quantity; j++) {
                                if (attack > troops.life) {
                                    it++;
                                }
                            }
                            troops.quantity -= it;
                            break;
                        }
                    }

                    if (attack <= 0) {
                        break;
                    }
                }

                // Add event.troops on land.troops
                for (const troopAdd of event.troops) {
                    if (troopAdd.quantity > 0) {
                        let it = 0;
                        for (const troop of land.troops) {
                            if (troop.troopId === troopAdd.troopId) {
                                troop.quantity += troopAdd.quantity;
                                it = 1;
                                break;
                            }
                        }

                        if (it === 0) {
                            const obj = {};
                            obj.troopId = troopAdd.troopId;
                            obj.quantity = troopAdd.quantity;
                            land.troops.push(obj);
                        }
                    }
                }
            } else {
                // Kill all troops sent -> do nothing
            }
        }
        // Break loop (times after NOW)
        else if (cmp(event.type, "LT")) {
            // Update Array EventsTime
            for (let j = 0; j < land.eventsTime.length; j++) {
                if (j < i+1) {
                    if (!cmp(land.eventsTime[j].type, "LT")) {
                        land.timeline.push(land.eventsTime[j]);
                    }
                } else {
                    eventArr.push(land.eventsTime[j]);
                }
            }
            break;
        }
    }

    // Update Array EventsTime
    land.eventsTime = eventArr;

    // Update the server
    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set": {
                "resources": land.resources,
                "eventsTime": land.eventsTime,
                "buildingsFields": land.buildingsFields,
                "resourcesFields": land.resourcesFields,
                "pyramidLevel": land.pyramidLevel,
                "troops": land.troops,
                "timeline": land.timeline
            }
        }
    );

    return land;
}

// Method that checks if the land has sufficient resources to upgrade the build in the field. This build
// will be appended to the events array to be run when the time is passed.
const build = async (land, indexBuilding, nField) => {
    // check for resources to build
    const buildingsData = data.getBuildings()[indexBuilding];
    const upgradeData = buildingsData.upgrades[0];
    const resourcesUpgrade = upgradeData.resources;
    let times = 0;
    const expectedTimes = resourcesUpgrade.length;

    for (const cost of resourcesUpgrade) {
        for (const resource of land.resources) {
            if (cmp(cost.type, resource.type)) {
                if (cost.quantity <= resource.quantity) {
                    times++;
                    resource.quantity -= cost.quantity;
                } else {
                    // Case when there is no sufficient resources
                    return false;
                }
            }
        }
    }

    // Land has no material needed on json data
    if (expectedTimes !== times) return false;

    // create event to build
    const eventObj = {};
    let time = land.eventsTime[land.eventsTime.length-1].time; // get last time to do the queue
    time.setSeconds(time.getSeconds() + upgradeData.time);
    eventObj.time = time;
    eventObj.type = 'build';
    eventObj.nField = nField;
    eventObj.buildingId = buildingsData.buildingId;
    eventObj.queue = 'Building \'' + buildingsData.name + '\' is under construction.';
    eventObj.log = 'The building \'' + buildingsData.name + '\' has been built.';

    // update land with $set resources and $push buildingsFields
    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set" : {
                "resources": land.resources
            },
            "$push" : {
                "eventsTime": eventObj
            }
        }
    );

    return true;
}

// Method that checks if the land has sufficient resources to upgrade the level of the given resource in the field. This upgrade
// will be appended to the events array to be run when the time is passed.
const upgradeBuilding = async (land, indexBuilding, nField) => {
    // If upgrade = is ignored the buildingId

    // check for level to update from field or eventsTime
    let level1 = -1;
    for (const building of land.buildingsFields) {
        if (building.nField === nField) {
            level1 = building.level + 1;
            break;
        }
    }

    let level2 = -1;
    for (const event of land.eventsTime) {
        if (cmp(event.type, "build")  && event.nField === nField) {
            if (1 >= level2) {
                level2 = 2;
            }
        } else if (cmp(event.type, "upgrade_build") && event.nField === nField) {
            if (event.level >= level2) {
                level2 = event.level + 1;
            }
        }
    }
    const level = Math.max(level1, level2);

    // check for resources to build
    const buildingsData = data.getBuildings()[indexBuilding];
    const upgradeData = buildingsData.upgrades[level-1];
    const resourcesUpgrade = upgradeData.resources;
    let times = 0;
    const expectedTimes = resourcesUpgrade.length;

    for (const cost of resourcesUpgrade) {
        for (const resource of land.resources) {
            if (cmp(cost.type, resource.type)) {
                if (cost.quantity <= resource.quantity) {
                    times++;
                    resource.quantity -= cost.quantity;
                } else {
                    // Case when there is no sufficient resources
                    return false;
                }
            }
        }
    }

    // Land has no material needed on json data
    if (expectedTimes !== times) return false;

    // create event to build
    const eventObj = {};
    let time = land.eventsTime[land.eventsTime.length-1].time; // get last time to do the queue
    time.setSeconds(time.getSeconds() + upgradeData.time);
    eventObj.time = time;
    eventObj.type = 'upgrade_build';
    eventObj.level = level;
    eventObj.nField = nField;
    eventObj.queue = 'Building \'' + buildingsData.name + '\' is upgrading from ' + (level-1) + ' to ' + level + '.';
    eventObj.log = 'The building \'' + buildingsData.name + '\' has been upgrade from ' + (level-1) + ' to ' + level + '.';

    // update land with $set resources and $push buildingsFields
    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set" : {
                "resources": land.resources
            },
            "$push" : {
                "eventsTime": eventObj
            }
        }
    );

    return true;
}

// Method that checks if the land has sufficient resources to upgrade the level of the pyramid. This upgrade
// will be appended to the events array to be run when the time is passed.
const upgradeResource = async (land, indexResource, nField) => {
    // check for level to update from field or eventsTime
    const level1 = land.resourcesFields[nField-1].level + 1;

    let level2 = -1;
    for (const event of land.eventsTime) {
        if (cmp(event.type, "upgrade_resource") && event.nField === nField) {
            if (event.level >= level2) {
                level2 = event.level + 1;
            }
        }
    }
    const level = Math.max(level1, level2);

    // check for resources to build
    const resourcesData = data.getResources()[indexResource];
    const upgradeData = resourcesData.upgrades[level-1];
    const resourcesUpgrade = upgradeData.resources;
    let times = 0;
    const expectedTimes = resourcesUpgrade.length;

    for (const cost of resourcesUpgrade) {
        for (const resource of land.resources) {
            if (cmp(cost.type, resource.type)) {
                if (cost.quantity <= resource.quantity) {
                    times++;
                    resource.quantity -= cost.quantity;
                } else {
                    // Case when there is no sufficient resources
                    return false;
                }
            }
        }
    }

    // Land has no material needed on json data
    if (expectedTimes !== times) return false;

    // create event to build
    const eventObj = {};
    let time = land.eventsTime[land.eventsTime.length-1].time; // get last time to do the queue
    time.setSeconds(time.getSeconds() + upgradeData.time);
    eventObj.time = time;
    eventObj.type = 'upgrade_resource';
    eventObj.level = level;
    eventObj.nField = nField;
    eventObj.queue = 'Resource \'' + resourcesData.name + '\' is upgrading from ' + (level-1) + ' to ' + level + '.';
    eventObj.log = 'The resource \'' + resourcesData.name + '\' has been upgrade from ' + (level-1) + ' to ' + level + '.';

    // update land with $set resources and $push buildingsFields
    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set" : {
                "resources": land.resources
            },
            "$push" : {
                "eventsTime": eventObj
            }
        }
    );

    return true;
}

// Method that checks if the land has sufficient troops to upgrade the level of the pyramid. This upgrade
// will be appended to the events array to be run when the time is passed.
const upgradePyramid = async (land) => {
    // check for level to upgrade
    const level1 = land.pyramidLevel + 1;
    let level2 = -1;
    for (const event of land.eventsTime) {
        if (cmp(event.type, "upgrade_pyramid")) {
            if (event.level >= level2) {
                level2 = event.level + 1;
            }
        }
    }
    const level = Math.max(level1, level2);

    const upgradeData = data.getPyramidData().upgrades[level - 1];
    const resourcesUpgrade = upgradeData.resources;
    let times = 0;
    const expectedTimes = resourcesUpgrade.length;

    for (const cost of resourcesUpgrade) {
        for (const resource of land.resources) {
            if (cmp(cost.type, resource.type)) {
                if (cost.quantity <= resource.quantity) {
                    times++;
                    resource.quantity -= cost.quantity;
                } else {
                    // Case when there is no sufficient resources
                    return false;
                }
            }
        }
    }

    // Land has no material needed on json data
    if (expectedTimes !== times) return false;

    // create event to build
    const eventObj = {};
    let time = land.eventsTime[land.eventsTime.length-1].time; // get last time to do the queue
    time.setSeconds(time.getSeconds() + upgradeData.time);
    eventObj.time = time;
    eventObj.type = 'upgrade_pyramid';
    eventObj.level = level;
    eventObj.queue = 'Pyramid is being upgrade from ' + (level-1) + ' to ' + level + '.';
    eventObj.log = 'The pyramid has been upgrade from ' + (level-1) + ' to ' + level + '.';

    // update land with $set resources and $push buildingsFields
    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set" : {
                "resources": land.resources
            },
            "$push" : {
                "eventsTime": eventObj
            }
        }
    );

    return true;
}

// Method that checks if the land has the sufficient resources to recruit troops and then recruit them by updating
// the troops from the land
const recruitTroops = async (land, troopId, quantity) => {
    const troopsData = data.getTroops();

    let troopToRecruit = {};
    for (const troop of troopsData) {
        if (troop.troopId === troopId) {
            troopToRecruit = troop;
        }
    }

    let times = 0;
    const expectedTimes = troopToRecruit.resources.length;
    for (const resource1 of troopToRecruit.resources) {
        for (const resource2 of land.resources) {
            if (resource1.type === resource2.type) {
                if (resource2.quantity < resource1.quantity * quantity) {
                    return false;
                } else {
                    // remove resources
                    resource2.quantity -= resource1.quantity * quantity;
                }

                times++;
                break;
            }
        }
    }

    if (expectedTimes !== times) return false;

    // add troop to land
    let it = 0;
    for (const troop of land.troops) {
        if (troop.troopId === troopToRecruit.troopId)  {
            troop.quantity = parseInt(troop.quantity) + parseInt(quantity);
            it = 1;
            break;
        }
    }

    const obj = {};
    obj.type = 'create';
    obj.time = new Date();
    obj.log = 'A total of ' + quantity + ' of troops \'' + troopToRecruit.name + '\' has been recruited.';
    land.timeline.push(obj);

    if (it === 0) {
        const obj = {};
        obj.troopId = troopToRecruit.troopId;
        obj.quantity = quantity;
        land.troops.push(obj);
    }

    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set" : {
                "resources": land.resources,
                "troops": land.troops,
                "timeline": land.timeline
            }
        }
    );

    return true;
}

// Method that checks if the land has sufficient troops to send the adventure selected and send it. This adventure
// will be appended to the events array to be run when the time is passed.
const adventure = async (land, troops, difficulty) => {
    // check for any troop
    let n = 0;
    for (const troop of troops) {
        if (troop.quantity > 0) {
            n = 1;
            break;
        }
    }
    if (n === 0) return false;

    const adventureData = data.getAdventures();
    const adventure = adventureData[difficulty - 1];

    // create event to adventure
    const eventObj = {};
    let time; // get last time to do the queue (of type adventure)

    let it = 0;
    for (const event of land.eventsTime) {
        if (event.type === 'adventure') {
            time = event.time;
            it = 1;
        }
    }
    if (it === 0) {
        time = new Date();
    }

    time.setSeconds(time.getSeconds() + adventure.time);
    eventObj.time = time;
    eventObj.type = 'adventure';
    eventObj.troops = troops;
    eventObj.difficulty = difficulty;
    eventObj.queue = 'Adventure \'' + adventure.name +  '\' is in progress.';
    eventObj.log = 'The adventure \'' + adventure.name +  '\' has been completed.';

    // update land with $set resources and $push buildingsFields
    await landDAO.updateOne(
        {
            "_id": land._id
        },
        {
            "$set": {
                "troops": [],
            },
            "$push": {
                "eventsTime": eventObj
            }
        }
    );

    return true;
}

// Method that checks if the field is empty to build or if the field is not empty to upgrade the actual building.
const checkBuildOrUpgrade = (land, nField) => {
    if (typeof nField !== 'number' || (nField % 1) !== 0 || nField <= 0 || nField > 27) return 'error';

    for (let building of land.buildingsFields) {
        if (building.nField === nField) return 'upgrade';
    }

    for (let event of land.eventsTime) {
        if (event.type.localeCompare("build") === 0 && event.nField === nField) return 'upgrade';
    }

    return 'build';
}

// Method that checks if the building id exists into the gamemaster
const isBuildingIdCorrect = (id) => {
    const buildings = data.getBuildings();

    let it = 0;
    for (let building of buildings) {
        const str1 = building.buildingId;
        const str2 = id;
        if (cmp(str1, str2)) {
            return it;
        }
        it++;
    }

    return null;
}

// Method that get the index of the resource in the array of the gamemaster
const getIndexResource = (land, nField) => {
    const resData = data.getResources();
    for (let res of land.resourcesFields) {
        if (cmp(res.nField, nField)) {
            let it = 0;
            for (const element of resData) {
                if (cmp(element.resourceId, res.type)) {
                    return it;
                }
                it++;
            }
            return null;
        }
    }

    return null;
}

// Method that gets all info about a specific resource with a level
const production = (type, level) => {
    const resources = data.getResources();

    for (let resource of resources) {
        const str1 = resource.resourceId;
        const str2 = type;
        if (cmp(str1, str2)) {
            return resource.upgrades[level-1].production;
        }
    }
}

// Method that gets the specific production bonus with a level of the pyramid
const bonusPyramid = (level) => {
    const pyramidData = data.getPyramidData();

    return pyramidData.upgrades[level-1].bonusProd;
}

// Method that gets a list of all resources type from a land
const getResourcesLand = (resources) => {
    const list = [];
    resources.forEach(
        resource => list.push(resource.type)
    );
    return list;
}

// Method that gets the index of the array of resources given to equal the type of the resource also given
const getIndexArrResources = (resources, type2) => {
    let it = 0;

    for (let resource of resources) {
        const str1 = resource.type;
        const str2 = type2;
        if (cmp(str1, str2)) {
            return it;
        }
        it++;
    }

    // UNREACHABLE
    return -1;
}

// Method to compare two strings
const cmp = (str1, str2) => {
    return (str1 < str2 ? -1 : (str1 > str2 ? 1 : 0)) === 0;
}

module.exports = {
    getLands,
    getLandInfo,
    isBuildingIdCorrect,
    checkBuildOrUpgrade,
    upgradeBuilding,
    build,
    createLand,
    upgradePyramid,
    getIndexResource,
    upgradeResource,
    recruitTroops,
    adventure,
    createLandByPlayer,
};