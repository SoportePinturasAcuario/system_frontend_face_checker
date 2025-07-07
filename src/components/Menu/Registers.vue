<script>
import { useRegistersStore } from '@/stores/registers';
import { useLogsStore } from '@/stores/logs';
export default {
    data() {
        return {
            data: {
                registers: [],
                registersStore: localStorage.registers ? JSON.parse(localStorage.registers).registers : [],
                collaboratorsStore: JSON.parse(localStorage.collaborators),
                eventsStore: JSON.parse(localStorage.events),
            },
            headers: [
                { title: 'Fecha y Hora', align: 'center', value: 'time' },
                { title: 'Colaborador', align: 'center', value: 'collaborator_name' },
                { title: 'Evento', align: 'center', value: 'event' },
                { title: 'Típo de registro', align: 'center', value: 'type_events' },
            ],
            error: {},
            setting: {
                registersStatus: true,
            }
        }
    },
    mounted() {
        this.formData(this.data.registersStore.length);
    },
    setup() {
        const registersStore = useRegistersStore();
        const logsStore = useLogsStore();
        return { registersStore, logsStore };
    },
    methods: {
        async formData(info) {
            if (info != 0) {
                this.setting.registersStatus = false;
                this.data.registersStore.forEach(element => {
                    const collaborator = this.data.collaboratorsStore.infoCollaborators.find(collaboratorElement => {
                        if (collaboratorElement.id === element.collaborator_id) {
                            return collaboratorElement.name;
                        }
                    });
                    const event = this.data.eventsStore.info.find(event => {
                        if (event.id === element.event_id) {
                            return event
                        }
                    });
                    element.collaborator_name = collaborator.name;
                    element.event = { "id": event.id, "color": event.color, "name": event.name };

                    const type = event.types_registers.find(types_registers => {
                        if (element.event_id === types_registers.event_id && element.type_event_id === types_registers.id) {
                            return types_registers
                        }
                    })
                    element.type_events = { "id": type.id, "event_id": type.event_id, "name": type.name, "color": type.color };
                });
                this.data.registers = this.data.registersStore;
            } else {
                this.setting.registersStatus = true;
            }
        },
        async sendDAta() {
            try {
                const registers = { 'list': this.data.registers };
                const response = await axios.post(import.meta.env.VITE_BACKEND_CHECKER_URL + 'registers/massive', registers);
                this.registersStore.delete();
                this.data.registers = localStorage.registers ? this.formData(JSON.parse(localStorage.registers).registers) : [];
                this.setting.registersStatus = true;
            } catch (error) {
                console.log(error);
                this.error.action = "POST Colaboradores";
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
    <v-row>
        <v-col cols="12">
            <v-data-table :headers="headers" :items="data.registers">
                <template v-slot:item.event="{ value }">
                    <v-chip :color="value.color" :text="value.name"></v-chip>
                </template>
                <template v-slot:item.type_events="{ value }">
                    <v-chip :color="value.color" :text="value.name"></v-chip>
                </template>
            </v-data-table>
        </v-col>
        <v-col cols="12">
            <v-btn append-icon="refresh" color="grey" block @click="sendDAta" :disabled="setting.registersStatus">Enviar
                Registros</v-btn>
        </v-col>
    </v-row>

</template>