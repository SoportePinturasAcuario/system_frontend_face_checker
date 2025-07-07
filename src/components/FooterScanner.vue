<script>
import { useCollaboratorsStore } from '@/stores/collaborators';
import { useRegistersStore } from '@/stores/registers';
import { useLogsStore } from '@/stores/logs';
import * as faceapi from 'face-api.js';
export default {
    data() {
        return {
            data: {
                events: JSON.parse(localStorage.events),
                checker: JSON.parse(localStorage.checker).info,
                collaborators: [],
                infoCollaborators: [],
                imgData: [],
            },
            layout: {
                collaborator_id: null,
                event_id: null,
                type_event_id: null,
                img: null,
                time: null,
            },
            setting: {
                loading: false,
                statusRegisters: false,
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
            },
            error: {},
        }
    },
    created() {
        this.data.events = this.data.events.info;
    },
    mounted() {
        try {
            this.setting.loading = true;
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
        } catch (error) {
            this.error.action = "Error al cargar";
            this.error.status = error.status;
            this.error.message = error.message;
            this.error.method = error.config?.method;
            this.logsStore.add(this.error);
        } finally {
            this.setting.loading = false;
        }
    },
    setup() {
        const registersStore = useRegistersStore();
        const logsStore = useLogsStore();
        return { registersStore, logsStore };
    },
    methods: {
        async eventSelection(event) {
            try {
                this.setting.status_event_active = false;
                this.setting.event_active = event;
                this.setting.status_type_event_active = true;
            } catch (error) {
                this.error.action = "Error al seleccionar el tipo de evento";
                this.error.status = error.status;
                this.error.message = error.message;
                this.error.method = error.config?.method;
                this.logsStore.add(this.error);
            }
        },
        async refresh() {
            try {
                this.setting.loading = true;
                this.setting.type_event_active = [];
                this.setting.event_active = [];
                this.setting.status_type_event_active = false;
                this.setting.status_event_active = true;
                this.setting.status_scanner = false;
                this.setting.statusRegisters = false;
                this.setting.status_detections = false;
                this.setting.name_collaborator = null;
                this.setting.time.value = 0;
                this.setting.time.count = 5;
                clearInterval(this.setting.time.interval);
                video.play();
            } catch (error) {
                this.error.action = "Error al seleccionar el tipo de evento";
                this.error.status = error.status;
                this.error.message = error.message;
                this.error.method = error.config?.method;
                this.logsStore.add(this.error);
            } finally {
                this.setting.loading = false;
            }
        },
        async validCollaborator(data) {
            try {
                this.setting.loading = true;
                this.setting.status_type_event_active = false;
                this.setting.type_event_active = data;
                this.setting.time.value = 0;
                this.setting.time.count = 5;
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
                let v = 0;
                while (this.setting.status_detections != true) {
                    console.log(v)
                    detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                    if (detections != undefined) {
                        video.pause();
                        this.setting.name_collaborator = detections.descriptor.label;
                        this.setting.status_detections = true;
                        break;
                    }
                    if (v === 50)
                    // Si respues de 100 intentos no reconoce a un colaborador se resetea
                    {
                        this.refresh();
                        break;
                    }
                    v++;
                    video.play();
                }

                const dataBios = new faceapi.FaceMatcher(this.data.collaborators);
                const result = dataBios.findBestMatch(detections.descriptor);
                // se cambian estados de configuraciones
                this.setting.status_scanner = true;
                this.setting.name_collaborator = result.label;
                // En espera de 5s para al confirmacion o negacion
                this.setting.time.interval = setInterval(() => {
                    if (this.setting.time.value === 100) {
                        clearInterval(this.setting.time.interval);
                        this.refresh();

                    }
                    this.setting.time.value += 20
                    this.setting.time.count--;
                }, 1000)
            } catch (error) {
                this.error.action = "Escaner";
                this.error.status = error.status;
                this.error.message = error.message;
                this.error.method = error.config?.method;
                this.logsStore.add(this.error);
            } finally {
                this.setting.loading = false;
            }
        },
        async capture() {
            try {
                const img = document.getElementById('capturaImg');
                const ctx = img.getContext('2d');
                img.width = '640';
                img.height = '480';
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataURL = img.toDataURL('image/png')
                const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
                this.data.imgData = base64Data;;

            } catch (error) {
                this.error.action = "Error no fue posible capturar la imagen";
                this.error.status = error.status;
                this.error.message = error.message;
                this.error.method = error.config?.method;
                this.logsStore.add(this.error);
            }
        },
        async saveRegister() {
            try {
                this.setting.loading = true;
                const name_collaborator = this.setting.name_collaborator;
                const fecha = new Date().toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).slice(0, 10);
                const hora = new Date().toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City', hour12: false });
                const data = this.data.infoCollaborators.find(collaborator => collaborator.name === name_collaborator);
                this.layout.collaborator_id = data.id;
                this.layout.event_id = this.setting.event_active.id;
                this.layout.type_event_id = this.setting.type_event_active.id;
                this.layout.checker_id = this.data.checker.id;
                this.layout.time = fecha + " " + hora;
                this.setting.statusRegisters = true;
                if (this.setting.internet) {
                    this.layout.img = this.data.imgData;
                    const response = await axios.post(import.meta.env.VITE_BACKEND_CHECKER_URL + 'registers', this.layout);
                }
                clearInterval(this.setting.time.interval);
            } catch (error) {
                this.error.action = "Guardar registro";
                this.error.status = error.status;
                this.error.message = error.message;
                this.error.method = error.config?.method;
                delete this.layout.img;
                this.registersStore.add(this.layout);
                this.logsStore.add(this.error);
            } finally {
                this.setting.status_scanner = false;
                this.setting.loading = false;
                setTimeout(() => {
                    this.layout = {};
                    this.refresh();
                }, 2000);
            }
        }
    },
}
</script>
<template>
    <div class="position-absolute w-100 bottom-0 left-0">
        <v-footer class="bg-blue-lighten-4" height="auto">
            <v-row class="ma-1">
                <!-- Texto -->
                <v-col cols="6">
                    <v-card>
                        <v-card-text>
                            <v-list>
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-icon size="30"
                                            :icon="setting.status_event_active === false ? setting.event_active.icon : 'info-circle'"
                                            :color="setting.status_event_active === false ? setting.event_active.color : 'black'"></v-icon>
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
                                        <v-icon size="30"
                                            :icon="setting.type_event_active.length === 0 ? 'info-circle' : setting.type_event_active.icon"
                                            :color="setting.type_event_active.length === 0 ? 'black' : 'green'"></v-icon>
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
                                        <v-icon size="30" icon="user"
                                            :color="setting.name_collaborator != null ? 'green' : 'black'"></v-icon>
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
                <v-col v-if="!setting.loading" cols="6" class="d-flex justify-center align-center">
                    <v-row v-if="setting.status_scanner === false">
                        <!-- Botones de eventos-->
                        <v-col cols="6" v-if="setting.status_event_active" v-for="event in data.events" key="id">
                            <v-btn class="text-white" :color="event.color" @click="eventSelection(event)"
                                :prepend-icon="event.icon" stacked style="width: 100%;">
                                <!-- <v-icon :icon="event.icon" class="my-1"></v-icon> -->
                                <p class="text-center">{{ event.name }}</p>
                            </v-btn>
                        </v-col>
                        <!-- Botones de tipos de eventos-->
                        <v-col cols="6" v-if="setting.status_type_event_active"
                            v-for="type in setting.event_active.types_registers" key="id">
                            <v-btn class="text-white" :color="type.color" @click="validCollaborator(type)"
                                :prepend-icon="type.icon" stacked style="width: 100%;">
                                <!-- <v-icon :icon="type.icon"></v-icon> -->
                                <p class="text-center">{{ type.name }}</p>
                            </v-btn>
                        </v-col>
                        <v-col cols="12" v-if="setting.status_type_event_active">
                            <v-btn class="text-white" color="grey" @click="refresh()" prepend-icon="angles-left" stacked
                                style="width: 100%;">
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
                            <v-btn color="green" stacked block @click="saveRegister()">
                                <p class="text-center">Si</p>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-if="setting.name_collaborator != null && setting.statusRegisters === true">
                        <v-col cols="12">
                            <p>{{ layout.time }}</p>
                        </v-col>
                        <v-col cols="12">
                            <p>Registro enviado</p>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col v-if="setting.loading" cols="6" class="d-flex align-center justify-center">
                    <v-progress-circular color="primary" indeterminate :size="82" :width="12"></v-progress-circular>
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>