<template>
  <v-app-bar elevation="4" app>
    <v-app-bar-title> Chat App </v-app-bar-title>
    <v-spacer />
    <div v-if="authenticated">{{ username }}</div>
    <v-btn class="float-right" to="/login" v-else>
      <v-icon>mdi-login</v-icon> Login
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

type authResponse = { authenticated: boolean; username?: string };

export default Vue.extend({
  async mounted() {
    const response = await fetch('/api/authenticated');
    const data = (await response.json()) as authResponse;
    this.authenticated = data.authenticated;
    this.username = data.username;
  },
  data(): authResponse {
    return { authenticated: false };
  },
});
</script>

<style></style>
