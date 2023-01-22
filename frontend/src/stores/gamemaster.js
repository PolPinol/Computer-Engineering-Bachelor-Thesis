import { defineStore } from "pinia"
import axios from "axios";

export const gamemaster = defineStore("gamemaster", {
    state: () => ({
        resources: [],
        troops: [],
        buildings: [],
        pyramid: {},
        adventures: [],
        lands: {}
    }),
    getters: {

    },
    actions: {
        async getGameMasterInfo() {
            const configuration = {
                method: 'GET',
                url: 'http://localhost:3000/api/gameMaster'
            }

            return await axios(configuration)
                .then(response => {
                    this.resources = response.data.resources;
                    this.troops = response.data.troops;
                    this.buildings = response.data.buildings;
                    this.pyramid = response.data.pyramid;
                    this.adventures = response.data.adventures;
                    this.lands = response.data.lands;
                })
                .catch(() => {
                    return null
                });
        },
        async addResource(resource, authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/admin/resource',
                data: {
                    resource: resource,
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        this.resources.push(resource);
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch(err => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async addTroop(troop, authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/admin/troop',
                data: {
                    troop: troop,
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        this.troops.push(troop);
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch(err => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async addBuilding(building, authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/admin/building',
                data: {
                    building: building,
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        this.buildings.push(building);
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch(err => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async addAdventure(adventure, authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/admin/adventure',
                data: {
                    adventure: adventure,
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        this.adventures.push(adventure);
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch(err => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        }
    }
});
