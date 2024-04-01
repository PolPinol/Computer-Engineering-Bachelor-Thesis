import { defineStore } from "pinia"
import { default as axios } from "axios";

export const land = defineStore("land", {
    state: () => ({
        landData: undefined,
    }),
    getters: {

    },
    actions: {
        async getLandInfo(firstLandId, authKey) {
            const configuration = {
                method: 'GET',
                url: 'http://localhost:3000/api/lands/' + firstLandId,
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    this.landData = res.data;
                })
                .catch(() => {
                    return null
                });
        },
        async updateResource(nField, authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/lands/resource',
                data: {
                    'landId': this.landData._id,
                    'nField': nField
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch((err) => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async refreshLand(authKey) {
            const configuration = {
                method: 'GET',
                url: 'http://localhost:3000/api/lands/' + this.landData._id,
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    this.landData = res.data;
                })
                .catch(() => {
                    return null
                });
        },
        async build(buildingId, nField, authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/lands/building',
                data: {
                    'landId': this.landData._id,
                    'buildingId': buildingId,
                    'nField': nField
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch((err) => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async upgradeBuilding(nField, buildingId, authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/lands/building',
                data: {
                    'landId': this.landData._id,
                    'buildingId': buildingId,
                    'nField': nField
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch((err) => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async upgradePyramid(authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/lands/pyramid',
                data: {
                    'landId': this.landData._id
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch((err) => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async recruitTroops(authKey, troopId, quantity) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/lands/troops',
                data: {
                    'landId': this.landData._id,
                    'troopId': troopId,
                    'quantity': quantity
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch((err) => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async adventure(authKey, name) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/lands/adventure',
                data: {
                    'landId': this.landData._id,
                    'troops': this.landData.troops,
                    'name': name
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch((err) => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async createLand(authKey) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/lands',
                data: {
                    'landId': this.landData._id
                },
                headers: {
                    'Authorization': 'Bearer ' + authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    if (res.data.ok === 1) {
                        return null;
                    } else {
                        return 'Network error';
                    }
                })
                .catch((err) => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
    }
});
