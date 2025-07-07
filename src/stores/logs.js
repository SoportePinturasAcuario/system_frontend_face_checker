import { defineStore } from "pinia";

export const useLogsStore = defineStore("logs", {
    state: () => ({ logs: [] }),
    actions: {
        async add(data) {
            const fecha = new Date().toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).slice(0, 10);
            const hora = new Date().toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City', hour12: false });
            data.day = fecha;
            data.hour = hora;
            this.logs.push(data);
        },
        async delete() {
             this.logs = [];
             localStorage.removeItem("logs");
        }
    },
    persist: true,
})