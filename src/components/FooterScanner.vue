<script>
import { useCollaboratorsStore } from '@/stores/collaborators';
import * as faceapi from 'face-api.js';
export default {
    data() {
        return {
            data: {
                events: JSON.parse(localStorage.events),
                collaborators: [],
                infoCollaborators: [],
                imgData: [],
            },
            layout: {
                collaborator_id: null,
                event_id: null,
                type_event_id: null,
                img: null,
            },
            setting: {
                event_active: [],
                status_event_active: true,
                type_event_active: [],
                status_type_event_active: false,
                status_scanner: false,
                internet: navigator.onLine,
                status_detections: false,
                name_collaborator: null,
                time: {
                    interval: {},
                    value: 0,
                    count: 5,
                }
            }
        }
    },
    created() {
        this.data.events = this.data.events.info;
    },
    mounted() {
        const collaboratorsStore = useCollaboratorsStore();
        const collaborators = collaboratorsStore.infoCollaborators;
        // Crea el archivo en el criterio que se requiere para el scanner facial
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
        async eventSelection(event) {
            try {
                this.setting.status_event_active = false;
                this.setting.event_active = event;
                this.setting.status_type_event_active = true;
            } catch (error) {
                console.error('Error al seleccionar el evento', error);
            }
        },
        async refresh() {
            try {
                this.setting.type_event_active = [];
                this.setting.event_active = [];
                this.setting.status_type_event_active = false;
                this.setting.status_event_active = true;
                this.setting.status_scanner = false;
                this.setting.name_collaborator = null;
                this.setting.status_detections = false;
                video.play();
            } catch (error) {
                console.error('Error al seleccionar el tipo de evento', error);
            }
        },
        async validCollaborator(data) {
            try {
                video.pause();

                // Librerias de faceapi
                await Promise.all([
                    await faceapi.nets.tinyFaceDetector.loadFromUri('/scripts/ApiFace/models'),
                    await faceapi.nets.faceLandmark68Net.loadFromUri('/scripts/ApiFace/models'),
                    await faceapi.nets.faceRecognitionNet.loadFromUri('/scripts/ApiFace/models'),
                ]);
                const canvas = faceapi.createCanvasFromMedia(video);
                const displaySize = { width: video.width, height: video.height };
                faceapi.matchDimensions(canvas, displaySize);
                // Si se esta conectado a internet se tomara una foto para el registro
                if (this.setting.internet) {
                    this.capture();
                }
                // Buscara en la imagen de etiqueta video pausado un descriptor  
                let detections;
                while (this.setting.status_detections != true) {
                    detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                    if (detections != undefined) {
                        video.pause();
                        this.setting.name_collaborator = detections.descriptor.label;
                        this.setting.status_detections = true;
                        break;
                    }
                    video.play();
                }

                const dataBios = new faceapi.FaceMatcher(this.data.collaborators);
                const result = dataBios.findBestMatch(detections.descriptor);
                // se cambian estados de configuraciones
                this.setting.type_event_active = data;
                this.setting.status_type_event_active = false;
                this.setting.status_scanner = true;
                this.setting.name_collaborator = result.label;
                // En espera de 5s para al confirmacion o negacion
                this.setting.time.interval = setInterval(() => {
                    this.setting.time.value += 20
                    this.setting.time.count--;
                    if (this.setting.time.value === 100) {
                        clearInterval(this.setting.time.interval);
                        this.refresh();
                        this.setting.time.value = 0;
                        this.setting.time.count = 5;

                    }
                }, 1000)
            } catch (error) {
                console.error('Error no se pudo escanear', error);
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
            } catch (error) {
                console.error('Error No fue posible capturar la imagen', error);
            }
        },
    },
}
</script>
<template>
    <div class="position-absolute w-100 bottom-0 left-0">
        <v-footer class="bg-blue-grey-darken-2"
            :height="$vuetify.display.height < 960 ? $vuetify.display.height * .3 : $vuetify.display.height * .4">
            <v-row>
                <!-- Texto -->
                <v-col cols="6">
                    <v-card color="black">
                        <v-card-text>
                            <v-list bg-color="black">
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-icon
                                            :icon="setting.status_event_active === false ? setting.event_active.icon : 'info-circle'"
                                            :color="setting.status_event_active === false ? setting.event_active.color : 'white'"></v-icon>
                                    </template>
                                    <template v-slot:title>
                                        Evento
                                    </template>
                                    <template v-if="setting.status_event_active === false" v-slot:subtitle>
                                        "{{ setting.event_active.name
                                        }}"
                                    </template>
                                </v-list-item>
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-icon
                                            :icon="setting.status_type_event_active === true && setting.status_event_active === true ? setting.type_event_active.icon : 'info-circle'"
                                            :color="setting.status_type_event_active === true ? setting.type_event_active.color : 'white'"></v-icon>
                                    </template>
                                    <template v-slot:title>
                                        Tipo de Evento
                                    </template>
                                    <template
                                        v-if="setting.status_event_active === false && setting.status_type_event_active === false"
                                        v-slot:subtitle>"{{ setting.type_event_active.name }}"</template>
                                </v-list-item>
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-icon icon="user"></v-icon>
                                    </template>
                                    <template v-slot:title>Colaborador</template>
                                    <template v-if="setting.name_collaborator != null" v-slot:subtitle>{{
                                        setting.name_collaborator
                                    }}</template>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="6" class="d-flex justify-center align-center">
                    <v-row v-if="setting.status_scanner === false">
                        <!-- Botones de eventos-->
                        <v-col cols="12" v-if="setting.status_event_active" v-for="event in data.events" key="id">
                            <v-btn class="text-white" :color="event.color" block @click="eventSelection(event)"
                                :prepend-icon="event.icon">
                                <!-- <v-icon :icon="event.icon" class="my-1"></v-icon> -->
                                <p class="text-center">{{ event.name }}</p>
                            </v-btn>
                        </v-col>
                        <!--  -->
                        <!-- Botones de tipos de eventos-->
                        <v-col cols="12" v-if="setting.status_type_event_active"
                            v-for="type in setting.event_active.types_registers" key="id">
                            <v-btn class="text-white" :color="type.color" block @click="validCollaborator(type)"
                                :prepend-icon="type.icon">
                                <!-- <v-icon :icon="type.icon"></v-icon> -->
                                <p class="text-center">{{ type.name }}</p>
                            </v-btn>
                        </v-col>
                        <v-col cols="12" v-if="setting.status_type_event_active">
                            <v-btn class="text-white" color="grey" block @click="refresh()" prepend-icon="angles-left">
                                <!-- <v-icon icon="angles-left"></v-icon> -->
                                <p> Regresar</p>
                            </v-btn>
                        </v-col>
                        <!--  -->
                    </v-row>
                    <v-row v-else>
                        <v-col cols="4">
                            <v-btn class="text-white" color="red" @click="refresh" stacked block>
                                <p class="text-center">No</p>
                            </v-btn>
                        </v-col>
                        <v-col cols="4" class="text-center">
                            <v-progress-circular :model-value="setting.time.value" :rotate="360" :size="70" :width="15"
                                color="white">
                                {{ setting.time.count }}
                            </v-progress-circular>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="green" stacked block>
                                <p class="text-center">Si</p>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>