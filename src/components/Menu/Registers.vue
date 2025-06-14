<script>
export default {
    data() {
        return {
            headers: [
                { title: 'Fecha y Hora' },
                { title: 'Colaborador' },
                { title: 'Evento' },
                { title: 'Típo de registro' },

            ]
        }
    },
}
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-data-table :headers="headers"></v-data-table>
        </v-col>
        <v-col cols="12">
            <v-btn append-icon="refresh" color="grey" block>Enviar Registros</v-btn>
        </v-col>
</v-row>

</template>