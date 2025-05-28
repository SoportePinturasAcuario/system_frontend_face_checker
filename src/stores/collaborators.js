import { defineStore } from "pinia";

export const useCollaboratorsStore = defineStore("collaborators", {
    state: () => ({ infoCollaborators: [], status: false, }),
    actions: {
        async infoStorage(data) {
            this.infoCollaborators = data;
            this.status = true;
        },
    },
    persist: true,
})