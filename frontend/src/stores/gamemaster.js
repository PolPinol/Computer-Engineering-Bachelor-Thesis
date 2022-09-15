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
            const response = await axios.get('./gameMaster.json');

            this.resources = response.data.resources;
            this.troops = response.data.troops;
            this.buildings = response.data.buildings;
            this.pyramid = response.data.pyramid;
            this.adventures = response.data.adventures;
            this.lands = response.data.lands;
        }
    }
});
