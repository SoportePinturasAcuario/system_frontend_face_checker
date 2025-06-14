<script>
import { useCollaboratorsStore } from '@/stores/collaborators';
import * as faceapi from 'face-api.js';
export default {
    data() {
        return {
            data: {
                events: [],
                collaborators: [],
                infoCollaborators: [],
                imgData: [],
                info: null,
            },
            layout: {
                collaborator_id: null,
                event_id: null,
                type_event_id: null,
                img: null,
            },
            optionsActive: null,
            detectCollaborator: false,
            item: '',
            setting: {
                statusDetections: false,
                nameCollaborator: null,
                time: {
                    interval: {},
                    value: 0,
                    count: 5,
                }
            },
        }
    },
    created() {
        this.getEvents();
    },
    mounted() {
        const collaboratorsStore = useCollaboratorsStore();
        const collaborators = collaboratorsStore.infoCollaborators;
        // Crea el archivo en el criterio que se requiere
        const Float32ArrayCollaborators = collaborators.map(person => {
            const label = person.name || 'ID-${person.descriptors[0].id}';
            const descriptors = person.descriptors.map(d =>
                new Float32Array(JSON.parse(d.descriptor))
            );
            return new faceapi.LabeledFaceDescriptors(label, descriptors);
        })
        this.data.collaborators = Float32ArrayCollaborators;
        this.data.infoCollaborators = collaborators;
    },
    methods: {
        async getEvents() {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_CHECKER_URL + 'checkers/events');
                this.data.events = response.data.data;
                this.data.events.forEach(element => {
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
                this.item = this.data.events;
            } catch (error) {
                // Error para logs
            }
        },
        // Se controla la seleccion de eventos 
        operation(event) {
            if (event.types_registers) {
                this.layout.type_event_id = event.id;
                this.item = event.types_registers;
                this.optionsActive = event;
            } else if (event.event_id) {
                this.layout.event_id = event.id;
                this.startScanner(event);
                // Operacion para registrar y regresar a los eventos
            } else if (event === false) {
                clearInterval(this.setting.time.interval);
                video.play();
                this.setting.time.value = 0;
                this.setting.time.count = 5;
                this.item = this.data.events;
                this.setting.nameCollaborator = null;
                this.optionsActive = null;
                this.layout = {};
            }
        },
        async startScanner(event) {
            try {
                this.setting.statusDetections = false;
                // Librerias de faceapi
                await Promise.all([
                    await faceapi.nets.tinyFaceDetector.loadFromUri('/scripts/ApiFace/models'),
                    await faceapi.nets.faceLandmark68Net.loadFromUri('/scripts/ApiFace/models'),
                    await faceapi.nets.faceRecognitionNet.loadFromUri('/scripts/ApiFace/models'),
                ]);
                const canvas = faceapi.createCanvasFromMedia(video);
                const displaySize = { width: video.width, height: video.height };
                faceapi.matchDimensions(canvas, displaySize);
                video.pause();
                // Realiza una captura a la etiqueta video para formato en base64
                this.capture();

                // Buscara en la imagen de etiqueta video pausado un descriptor  
                let detections;
                while (this.setting.statusDetections != true) {
                    detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                    // En caso de encontrar un descriptor se finaliza el ciclo
                    if (detections != undefined) {
                        this.setting.statusDetections = true;
                        clearInterval(this.setting.time.interval);
                        this.optionsActive = null;
                        this.item = null;
                        // En espera de 5s para al confirmacion o negacion
                        this.setting.time.interval = setInterval(() => {
                            if (this.setting.time.value === 100) {
                                clearInterval(this.setting.time.interval);
                                video.play();
                                this.item = this.data.events;
                                this.setting.nameCollaborator = null;
                                this.setting.time.value = 0;
                                this.setting.time.count = 5;
                            }
                            this.setting.time.count--;
                            this.setting.time.value += 20
                        }, 1000)
                        video.pause();
                        break;
                    }
                    // await new Promise(resolve => setTimeout(resolve, 1000));
                    video.play();
                }
                const dataBios = new faceapi.FaceMatcher(this.data.collaborators);
                const result = dataBios.findBestMatch(detections.descriptor);
                this.setting.nameCollaborator = result.label;
            } catch (error) {
            } finally {
            }
        },
        async capture() {
            try {
                const img = document.getElementById('capturaImg');
                const ctx = img.getContext('2d');
                img.width = '480';
                img.height = '640';
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                this.data.imgData = img.toDataURL('image/png')
                this.layout.img = this.data.imgData;
            } catch (error) {
                console.error('Error No fue posible capturar la imagen', error);
            }
        },
        async register() {
            try {
                const nameCollaborator = this.setting.nameCollaborator;
                const result = this.data.infoCollaborators.filter((collaborator) =>
                    collaborator.name === nameCollaborator);
                this.layout.collaborator_id = result[0].id;
                console.log(this.layout);
            } catch (error) {
                console.log("Error");
            }
        }
    },
}
</script>
<template>
    <div class="position-absolute w-100 bottom-0 left-0">
        <v-footer class="bg-blue-grey-darken-2 px-16 pb-10">
            <v-row>
                <v-col cols="12 text-white" class="d-flex flex-column justify-center align-center">
                    <h1 v-if="setting.nameCollaborator === null" class="text-center">Tipo de eventos</h1>
                    <strong class="text-center" v-if="optionsActive != null">"{{ optionsActive.name }}"</strong>
                    <h1 v-if="setting.nameCollaborator != null" class="text-center">Colaborador</h1>
                    <strong class="text-center" v-if="setting.nameCollaborator != null">"{{
                        setting.nameCollaborator }}"</strong>
                </v-col>
                <v-col cols="12" class="d-flex justify-center align-center">
                    <v-row v-if="item != null">
                        <v-col cols="4" v-if="optionsActive">
                            <v-btn class="text-white" color="grey" @click="operation(false)" stacked block>
                                <v-icon icon="angles-left"></v-icon>
                                <p> Regresar</p>
                            </v-btn>
                        </v-col>
                        <v-col cols="4" v-for="event in item" class="text-center text-white">
                            <v-btn class="text-white" :color="event.color" @click="operation(event)" stacked block>
                                <v-icon :icon="event.icon"></v-icon>
                                <p class="text-center">{{ event.name }}</p>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col cols="4">
                            <v-btn class="text-white" color="red" @click="operation(false)" stacked block>
                                <p class="text-center">No</p>
                            </v-btn>
                        </v-col>
                        <v-col cols="4" v-if="setting.nameCollaborator" class="text-center">
                            <v-progress-circular :model-value="setting.time.value" :rotate="360" :size="70" :width="15"
                                color="white">
                                {{ setting.time.count }}
                            </v-progress-circular>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="green" stacked block @click="register">
                                <p class="text-center">Si</p>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>