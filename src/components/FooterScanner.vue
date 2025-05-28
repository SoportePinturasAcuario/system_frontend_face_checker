<script>
export default {
    data() {
        return {
            data: {
                events: [],
            },
            optionsActive: null,
            item: '',
        }
    },
    created() {
        this.getEvents();
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
        operation(event) {
            if (event.types_registers) {
                this.item = event.types_registers;
                this.optionsActive = event;
            } else if (event.event_id) {
                // Operacion para registrar y regresar a los eventos
                // console.log(event);
            } else if (event === false) {
                this.item = this.data.events;
                this.optionsActive = null;
            }
            console.log(event);
        }
    },
}
</script>
<template>
    <div class="position-absolute w-100 bottom-0 left-0" style="height: 100px;">
        <v-footer class="h-100" rounded="lg" style="background-color: #548FCB;">
            <v-row>
                <v-col cols="6 text-white" class="d-flex flex-column justify-center align-center">
                    <h1>Tipo de eventos</h1>
                    <strong v-if="optionsActive != null">"{{ optionsActive.name }}"</strong>
                </v-col>
                <v-col cols="6" class="d-flex justify-center align-center">
                    <v-row>
                        <v-col cols="4" v-if="optionsActive">
                            <v-btn class="text-white" color="grey" @click="operation(false)" stacked block>
                                <v-icon icon="angles-left"></v-icon>
                                <p style="font-size: 10px;"> Regresar</p>
                            </v-btn>
                        </v-col>
                        <!-- <v-btn v-if="!event.types_registers">Regresar</v-btn> -->
                        <v-col cols="4" v-for="event in item" class="text-center text-white">
                            <v-btn class="text-white" :color="event.color" @click="operation(event)" stacked block>
                                <v-icon :icon="event.icon"></v-icon>
                                <p style="font-size: 10px;">{{ event.name }}</p>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>