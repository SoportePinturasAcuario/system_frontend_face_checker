<script>
import Menu from '../components/Menu.vue';
import FooterScanner from '../components/FooterScanner.vue'
import { useEventstore } from '@/stores/events';
export default {
    components: { Menu, FooterScanner },
    data() {
        return {
            internet: navigator.onLine,
        }
    },
    // El mounted se ejecuta despues de que los componentes se cargan
    mounted() {
        const video = document.getElementById('video');
        this.startCamara(video);
        this.getEvents();
    },
    setup() {
        const EventsStore = useEventstore();
        return { EventsStore };
    },
    methods: {
        async startCamara(video) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (err) {
                console.error('Error al acceder a la cámara:', err);
            }
        },
        async updateInternet() {
            this.internet = navigator.onLine;
        },
        async getEvents() {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_CHECKER_URL + 'checkers/events');
                const data = response.data.data;
                data.forEach(element => {
                    switch (element.id) {
                        case 1:
                            element.icon = 'helmet-safety';
                            break;
                        case 2:
                            element.icon = 'utensils';
                            break;
                        case 3:
                            element.icon = 'stopwatch';
                            break;
                    }
                    element.types_registers.forEach(type => {
                        switch (type.id) {
                            case 1:
                                type.icon = 'angles-up';
                                break;
                            case 2:
                                type.icon = 'angles-down';
                                break;
                            case 3:
                                type.icon = 'angles-up';
                                break;
                            case 4:
                                type.icon = 'angles-down';
                                break;
                            case 5:
                                type.icon = 'angles-up';
                                break;
                            case 6:
                                type.icon = 'angles-down';
                                break;
                        }
                    });
                })
                this.EventsStore.infoEvents(data);
            } catch (error) {
                console.error('No es posible descargar o actualizar los eventos', error);
            }
        },
    }
}
</script>
<template>
    <v-card class="h-100" elevation="0">
        <v-card-title class="bg-blue-darken-3">
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
        <v-card-text class="py-0">
            <div>
                <canvas id="capturaImg"></canvas>
                <video id="video" class="my-a" autoplay muted></video>
            </div>
        </v-card-text>
        <FooterScanner></FooterScanner>
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
