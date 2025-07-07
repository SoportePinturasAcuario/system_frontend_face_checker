<script>
import { useLogsStore } from '@/stores/logs';
export default {
    data() {
        return {
            headers: [
                { title: 'Día', value: 'day', align: 'center' },
                { title: 'Acción', value: 'action', align: 'center' },
                { title: 'Mensage', value: 'message', align: 'center' },
                { title: 'HTTP code', value: 'status', align: 'center' },
                { title: 'Metodo', value: 'method', align: 'center' },
                { title: 'Time', value: 'hour', align: 'center' },
            ],
            data: {
                logsStor: localStorage.logs ? JSON.parse(localStorage.logs).logs : [],
            },
            setting: {
                logsStatus: true,
            },
            error: {}
        }
    },
    setup() {
        const logsStore = useLogsStore();
        return { logsStore };
    },
    mounted() {
        if (this.data.logsStor.length != 0) {
            this.setting.logsStatus = false;
        } else {
            this.setting.logsStatus = true;
        }
    },
    methods: {
        async deleteStore() {
            try {
                this.logsStore.delete();
                this.data.logsStor = localStorage.logs ? JSON.parse(localStorage.logs).logs : [];
                this.setting.logsStatus = true;
            } catch (error) {
                this.error.action = "Delete logs";
                this.error.status = error.status;
                this.error.message = error.message;
                this.error.method = error.config?.method;
                this.logsStore.add(this.error);
            }
        },
    },
}
</script>
<template>
    <v-data-table :items="data.logsStor" :headers="headers">
    </v-data-table>
    <v-divider :thickness="6" class="border-opacity-25 ma-2"></v-divider>
    <v-btn block color="red" :disabled="setting.logsStatus" @click="deleteStore()">Limpiar registros</v-btn>
</template>