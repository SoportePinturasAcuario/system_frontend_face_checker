<script>
export default {
    data() {
        return {
            headers: [
                { title: 'Día' },
                { title: 'Acción' },
                { title: 'Mensage' },
                { title: 'HTTP code' },
                { title: 'Metodo' },
                { title: 'Time' },
            ]
        }
    },
}
</script>
<template>
    <v-data-table :headers="headers">
    </v-data-table>
    <v-divider :thickness="6" class="border-opacity-25 ma-2"></v-divider>
    <v-btn block color="red">Limpiar registros</v-btn>
</template>