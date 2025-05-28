import { defineStore } from "pinia";
export const useCheckerStore = defineStore("checker", {
    state: () => ({ info: [] }),
    actions: {
        async infoChecker(data) {
            this.info = data;
        }
    },
    persist: true,
})