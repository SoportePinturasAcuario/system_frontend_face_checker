<script>
export default {
    data() {
        return {
            infoCollaborators: JSON.parse(localStorage.collaborators),
            headers: [
                { title: "Folio", value: 'folio', key: 'folio', align: 'center' },
                { title: "Nombre", value: 'name', key: 'name', align: 'center' },
                { title: "Descriptores", value: 'countDescriptors', key: 'countDescriptors', align: 'center' },
            ],
            search: null,
        }
    },
    created() {
        this.infoCollaborators.infoCollaborators.forEach(element => {
            if (element != null) {
                element.countDescriptors = element.descriptors.length;
            }
        });
    },
}
</script>
<template>
    <v-text-field v-model="search" label="Criterio de busqueda" append-inner-icon="magnifying-glass"
        variant="solo"></v-text-field>
    <v-data-table :headers="headers" :items="infoCollaborators.infoCollaborators" :search="search"
        color="#009688"></v-data-table>
</template>