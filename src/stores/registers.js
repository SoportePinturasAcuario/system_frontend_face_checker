import { defineStore } from "pinia";

export const useRegistersStore = defineStore("registers", {
    state: () => ({ registers: [] }),
    actions: {
        async add(data) {
            this.registers.push(data);
        },
        async delete() {
             this.registers = [];
             localStorage.removeItem("registers");
        }
    },
    persist: true,
})