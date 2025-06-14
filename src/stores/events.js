import { defineStore } from "pinia";
export const useEventstore = defineStore("events", {
    state: () => ({ info: [] }),
    actions: {
        async infoEvents(data) {
            this.info = data;
        }
    },
    persist: true,
})