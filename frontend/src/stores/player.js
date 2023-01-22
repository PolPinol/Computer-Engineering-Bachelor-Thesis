import { defineStore } from "pinia"
const axios = require('axios').default;

export const player = defineStore("player", {
    state: () => ({
        username: undefined,
        authKey: undefined,
        lands: undefined,
        ranking: undefined,
        position: undefined,
        admin: undefined
    }),
    getters: {

    },
    actions: {
        async getPosition() {
            const configuration = {
                method: 'GET',
                url: 'http://localhost:3000/api/ranking',
                headers: {
                    'Authorization': 'Bearer ' + this.authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    this.position = res.data.top;
                });
        },
        async getRanking() {
            const configuration = {
                method: 'GET',
                url: 'http://localhost:3000/api/ranking/top',
                headers: {
                    'Authorization': 'Bearer ' + this.authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    this.ranking = res.data.ranking;
                });
        },
        async refreshLands() {
            const configuration = {
                method: 'GET',
                url: 'http://localhost:3000/api/lands',
                headers: {
                    'Authorization': 'Bearer ' + this.authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    this.lands = res.data.lands;
                });
        },
        async createPlayer(username, password) {
            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/players',
                data: {
                    username: username,
                    password: password
                }
            }
            /* eslint-disable */
            return axios(configuration)
                .then(res => {
                    return null;
                })
                .catch(err => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
            /* eslint-enable */
        },
        async authenticatePlayer(username, password) {
            this.username = username;

            const configuration = {
                method: 'POST',
                url: 'http://localhost:3000/api/players/login',
                data: {
                    username: username,
                    password: password
                }
            }

            return await axios(configuration)
                .then(res => {
                    this.authKey = res.data.auth_key;

                    if (res.data.admin) {
                        this.admin = true;
                    } else {
                        // Open cookie for authKey
                        const name = 'authKey';
                        const value = this.authKey;
                        const hours = 4;
                        const date = new Date();
                        date.setTime(date.getTime() + (hours*60*60*1000));
                        const expires = "; expires=" + date.toUTCString();
                        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                        this.admin = false;
                    }

                    return null;
                })
                .catch(err => {
                    try {
                        return err.response.data.error;
                    } catch (e) {
                        return 'Error at network.';
                    }
                });
        },
        async getLandsId() {
            const configuration = {
                method: 'GET',
                url: 'http://localhost:3000/api/lands',
                headers: {
                    'Authorization': 'Bearer ' + this.authKey
                }
            }

            return await axios(configuration)
                .then(res => {
                    this.lands = res.data.lands;
                    return this.lands[0];
                })
                .catch(() => {
                    return null
                });
        },
        setAuthKey(authKey) {
            this.authKey = authKey;
        }
    }
});
