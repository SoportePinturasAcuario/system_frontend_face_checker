<script>
import { useCollaboratorsStore } from '@/stores/collaborators';
import { useCheckerStore } from '@/stores/configChecker';
import { useLogsStore } from '@/stores/logs';
export default {
    data() {
        return {
            infoChecker: JSON.parse(localStorage.checker),
            infoCollaborators: JSON.parse(localStorage.collaborators),
            lengthCollaborators: null,
            internet: navigator.onLine,
            error: {},
        }
    },
    created() {
        this.lengthCollaborators = this.infoCollaborators.infoCollaborators.length;
        this.infoCollaborators.infoCollaborators.forEach(element => {
            if (element != null) {
                element.countDescriptors = element.descriptors.length;
            }
        });
    },
    setup() {
        const collaboratorsStore = useCollaboratorsStore();
        const checkerStore = useCheckerStore();
        const logsStore = useLogsStore();
        return { collaboratorsStore, checkerStore, logsStore };
    },
    methods: {
        async getCollaborators() {
            try {
                const data = {};
                data.checker_id = this.infoChecker.info.id;
                data.key = this.infoChecker.info.key;
                const response = await axios.post(import.meta.env.VITE_BACKEND_CHECKER_URL + 'checkers/valid', data);
                const fecha = new Date().toLocaleDateString('en-MX', { timeZone: 'America/Mexico_City' });
                const hora = new Date().toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City', hour12: false });
                response.data.infoChecker.update = fecha + " " + hora;
                this.checkerStore.infoChecker(response.data.infoChecker);
                this.collaboratorsStore.infoStorage(response.data.data);
            } catch (error) {
                this.error.action = "Get Colaboradores";
                this.error.status = error.status;
                this.error.message = error.message;
                this.error.method = error.config?.method;
                this.logsStore.add(this.error);
            }
        }
    },
}
</script>
<template>
    <v-row class="text-center">
        <v-col cols="6" md="4">
            <strong>Nombre:</strong>
            <p v-if="infoChecker">{{ infoChecker.info.name }}</p>
        </v-col>
        <v-col cols="6" md="4">
            <strong>Modo de operación actual</strong>
            <p v-if="internet === true">Online</p>
            <p v-else>Offline</p>
        </v-col>
        <v-col cols="6" md="4">
            <strong>Ultima actualización</strong>
            <p v-if="infoChecker">{{ infoChecker.info.update }}</p>
        </v-col>
        <v-col cols="6" md="4">
            <strong>Colaboradores asociados</strong>
            <p v-if="infoCollaborators">{{ lengthCollaborators }}</p>
        </v-col>
        <v-col cols="12">
            <v-btn append-icon="refresh" color="grey" block @click="getCollaborators">Recargar información</v-btn>
        </v-col>
    </v-row>
</template>