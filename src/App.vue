<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  data() {
    return {
    }
  },
}
</script>
<template>
  <v-container :height="$vuetify.display.height" class="d-flex">
    <v-row>
      <v-col class="d-flex justify-center align-center">
        <v-card :height="$vuetify.display.height * .9"
          :width="$vuetify.display.width < 1280 ? $vuetify.display.width * .80 : $vuetify.display.width * .42"
          elevation="2" class="rounded-xl">
          <v-card-text>
            <RouterView />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>