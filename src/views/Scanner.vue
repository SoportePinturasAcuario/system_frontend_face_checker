<script>
import Menu from '../components/Menu.vue';
import FooterScanner from '../components/FooterScanner.vue'
import { useLogsStore } from '@/stores/logs';
import { useRegistersStore } from '@/stores/registers';
export default {
    components: { Menu, FooterScanner },
    data() {
        return {
            internet: navigator.onLine,
            statusCamara: true,
        }
    },
    // El mounted se ejecuta despues de que los componentes se cargan
    mounted() {
        this.startCamara();
    },
    setup() {
        const LogsStore = useLogsStore();
        const RegistersStore = useRegistersStore();
        return { LogsStore, RegistersStore };
    },
    methods: {
        async startCamara() {
            try {
                const video = document.getElementById('video');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (err) {
                this.statusCamara = false;
                console.log(err);
                console.error('Error al acceder a la cámara:', err);
            } finally {
                console.log(this.statusCamara);
            }
        },
        async updateInternet() {
            this.internet = navigator.onLine;
        },
    }
}
</script>
<template>
    <v-card class="h-100" elevation="0">
        <v-card-title class="bg-blue-darken-3" v-if="statusCamara">
            <v-row>
                <v-col class="d-flex justify-start align-center">
                    <Menu></Menu>
                </v-col>
                <v-col class="d-flex justify-end align-center">
                    <v-btn :color="internet === true ? 'green' : 'red'" :text="internet === true ? 'Online' : 'Offline'"
                        @click="updateInternet"></v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-title v-else>
            <v-alert border="start" title="Error al acceder a la camara" type="error" variant="outlined"
                style="white-space: normal; word-break: break-word;">
                No a sido posible acceder a la cámara, para poder habilidad la cámara dirígete a la configuración
                del navegador en la sección de sitios y habilita en los permisos la cámara para esta página.
                <v-progress-linear color="blue-darken-3" indeterminate class="my-4"></v-progress-linear>
            </v-alert>
        </v-card-title>
        <v-card-text class="py-0" v-if="statusCamara">
            <div>
                <canvas id="capturaImg"></canvas>
                <video id="video" class="my-a" autoplay muted></video>
            </div>
        </v-card-text>
        <FooterScanner v-if="statusCamara"></FooterScanner>
    </v-card>

</template>
<style>
video {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -100;
    background-size: cover;
    overflow: hidden;
    text-align: center;
}

#capturaImg {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -100;
    background-size: cover;
    overflow: hidden;
    text-align: center;
}
</style>
