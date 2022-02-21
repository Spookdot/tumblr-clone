<template>
  <v-app dark>
    <app-bar></app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import AppBar from '../components/AppBar.vue';

export default Vue.extend({
  components: { AppBar },
});
</script>

<style scoped></style>
