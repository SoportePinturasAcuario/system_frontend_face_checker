import { defineStore } from "pinia";

export const useLogsStore = defineStore("logs", {
    state: () => ({ logs: [] }),
    actions: {
        async add(data) {
            this.logs.push(data);
        },
        async delete() {
            this.logs = [];
        }
    },
    persist: true,
})