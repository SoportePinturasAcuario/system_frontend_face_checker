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
    <v-data-table :headers="headers"></v-data-table>
</template>