<script>
import Menu from '../components/Menu.vue';
import FooterScanner from '../components/FooterScanner.vue'
export default {
    components: { Menu, FooterScanner },
    data() {
        return {
            internet: navigator.onLine,
        }
    },
}
</script>
<template>
    <v-chip :text="internet === true ? 'Online' : 'Offline'" style="position: absolute; top: 15px; right: 15px;"
        :color="internet === true ? 'green' : 'red'"></v-chip>
    <Menu></Menu>
    <div class="px-5">
        <video id="video" style="width: 100%; height: 100vh; border: 4px solid #548FCB; border-radius: 60px;"></video>
    </div>
    <FooterScanner></FooterScanner>
</template>
