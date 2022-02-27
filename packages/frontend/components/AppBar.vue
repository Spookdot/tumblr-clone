<template>
  <v-app-bar elevation="4" app>
    <v-app-bar-title> Chat App </v-app-bar-title>
    <v-spacer />
    <v-menu v-if="authenticated" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon> {{ username }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="logout" link> Logout </v-list-item>
      </v-list>
    </v-menu>
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
    const response = await fetch('/api/user/authenticated');
    const data = (await response.json()) as authResponse;
    this.authenticated = data.authenticated;
    this.username = data.username;
  },
  methods: {
    async logout() {
      const response = await fetch('/api/user/logout', { method: 'POST' });

      if (response && response.status === 200) {
        this.$router.go(0);
      }
    },
  },
  data(): authResponse {
    return { authenticated: false };
  },
});
</script>

<style></style>
