<template>
    <div class="text-center pa-4">
        <v-dialog v-model="dialog" persistent>
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps" icon="gears" color="grey"
                    style="position: absolute; top: 15px; left: 15px;"></v-btn>
            </template>
            <v-card>
                <template v-slot:append>
                    <v-btn @click="dialog = false" color="red" icon="x" size="small"></v-btn>
                </template>
                <template v-slot:title>
                    <h2>Detalles de la intancia</h2>
                </template>
                <template v-slot:subtitle>
                    <p>Detalles de la instancia checador</p>
                </template>
                <template v-slot:text>
                    <v-card>
                        <v-tabs v-model="tab" color="primary" align-tabs="center" stacked>
                            <v-tab value="1">
                                <v-icon icon="book"></v-icon>
                                <br>
                                Datos Generales
                            </v-tab>
                            <v-tab value="2">
                                <v-icon icon="users"></v-icon>
                                <br>
                                Colaboradores ({{ lengthCollaborators }})</v-tab>
                            <v-tab value="3"> <v-icon icon="list"></v-icon>
                                <br>Registros locales</v-tab>
                            <v-tab value="4">
                                <v-icon icon="triangle-exclamation"></v-icon>
                                <br>Logs</v-tab>
                        </v-tabs>

                        <v-card-text>
                            <v-tabs-window v-model="tab">
                                <v-tabs-window-item value="1">
                                    <Details></Details>
                                </v-tabs-window-item>
                                <v-tabs-window-item value="2">
                                    <TableCollaborators></TableCollaborators>
                                </v-tabs-window-item>
                                <v-tabs-window-item value="3">
                                    <TableRegisters></TableRegisters>
                                </v-tabs-window-item>
                                <v-tabs-window-item value="4">
                                    <TableLogs></TableLogs>
                                </v-tabs-window-item>
                            </v-tabs-window>
                        </v-card-text>
                    </v-card>
                </template>
                <template v-slot:actions>
                    <div style="width: 20%; margin: 0px auto;" class="mb-3">
                        <v-img src="/public/img/logo-pinturas-acuario.png"></v-img>
                    </div>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Details from "../components/Menu/Details.vue"
import TableCollaborators from "../components/Menu/TableCollaborators.vue"
import TableRegisters from "../components/Menu/Registers.vue"
import TableLogs from "../components/Menu/Logs.vue"
export default {
    components: { Details, TableCollaborators, TableRegisters, TableLogs },
    data() {
        return {
            infoCollaborators: JSON.parse(localStorage.collaborators),
            lengthCollaborators: null,
            tab: null,
            dialog: false,
        }
    },
    created() {
        this.lengthCollaborators = this.infoCollaborators.infoCollaborators.length;
    },
}
</script>