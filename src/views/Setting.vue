<script>
import { useCollaboratorsStore } from '@/stores/collaborators';
import { useCheckerStore } from '@/stores/configChecker';
export default {
    data() {
        return {
            layout: {
                checker_id: null,
                key: null,
            },
            data: {
                checkers: [],
            },
            settings: {
                loadingCheckers: false,
                disabledForm: false,
                alert: { status: false, message: null },
            }
        }
    },
    created() {
        this.getCheckers();
    },
    setup() {
        const collaboratorsStore = useCollaboratorsStore();
        const checkerStore = useCheckerStore();
        return { collaboratorsStore, checkerStore };
    },
    methods: {
        async getCheckers() {
            try {
                this.settings.loadingCheckers = false;
                const response = await axios.get(import.meta.env.VITE_BACKEND_CHECKER_URL + 'checkers')
                this.data.checkers = response.data.data;
                this.settings.loadingCheckers = true;
            } catch (error) {
                console.log(error);
            }
        },
        async valid(event) {
            try {
                let errors = await event;
                this.settings.disabledForm = true;
                if (errors.errors.length === 0) {
                    const response = await axios.post(import.meta.env.VITE_BACKEND_CHECKER_URL + 'checkers/valid', this.layout);
                    if (response.data.status === true) {
                        const fecha = new Date().toLocaleDateString('en-US', { timeZone: 'America/Mexico_City' });
                        const hora = new Date().toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City', hour12: false });
                        response.data.infoChecker.update = fecha + " " + hora;
                        this.checkerStore.infoChecker(response.data.infoChecker);
                        this.collaboratorsStore.infoStorage(response.data.data);
                        this.$router.push("/scanner")
                    } else {
                        this.settings.alert = { status: true, message: response.data.message };
                    }
                } else {
                    this.settings.alert = { status: true, message: 'Llena los campos solicitados.' };
                }
            } catch (error) {
                this.settings.alert = { status: true, message: error.status + ' - ' + error.message };
            } finally {
                this.settings.disabledForm = false;
                setTimeout(() => {
                    this.settings.alert = { status: false, message: null };
                }, 5000);
            }
        }
    },
}
</script>
<template>
    <v-card elevation="0">
        <v-card-title class="pb-0">
            <v-row class="py-0 mt-6 mb-0">
                <v-col cols="12">
                    <v-img :width="$vuetify.display.width < 960 ? 300 : 500" src="/public/img/logo-pinturas-acuario.png"
                        style="margin: 0px auto;"></v-img>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="8" class="d-flex justify-center align-center">
                            <h4 style="text-wrap: wrap; text-align: center;">Asistente de
                                instalación</h4>
                        </v-col>
                        <v-col cols="4">
                            <v-img src="/public/img/camera.gif"></v-img>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text v-if="settings.loadingCheckers">
            <v-form @submit.prevent="valid" :disabled="settings.disabledForm">
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="layout.checker_id" label="Checador" :items="data.checkers"
                            item-value="id" item-title="name" variant="solo" density="compact"
                            :rules="[v => !!v || 'Campo requerido']"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="layout.key" label="Clave de instalación" variant="solo" density="compact"
                            :rules="[v => !!v || 'Campo requerido']"></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col cols="12" class="d-flex justify-center flex-column">
                        <v-btn variant="outlined" type="submit">Verificar y instalar</v-btn>
                    </v-col>
                    <v-col cols="12" v-if="settings.alert.status" class="py-0">
                        <v-alert :title="settings.alert.message" type="error" variant="outlined">
                            <v-progress-linear indeterminate></v-progress-linear>
                        </v-alert>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-text v-else>

        </v-card-text>
    </v-card>

</template>
<style>
.v-btn {
    border: 1px solid #98BFE6;
    color: #1F78D2;
}

.v-btn:hover {
    background-color: #1F78D2;
    color: white;
}
</style>