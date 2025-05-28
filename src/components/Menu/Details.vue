<script>
export default {
    data() {
        return {
            infoChecker: JSON.parse(localStorage.checker),
            infoCollaborators: JSON.parse(localStorage.collaborators),
            lengthCollaborators: null,
            internet: navigator.onLine,
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
    </v-row>
</template>