<template>
  <v-card width="600">
    <v-card-title> <v-icon class="mr-2">mdi-login</v-icon>Login </v-card-title>
    <v-card-text>
      <v-text-field
        label="Username"
        v-model="username"
        @keydown="inputEntered"
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        type="password"
        @keydown="inputEntered"
      ></v-text-field>
      <div v-if="loginFailed" class="red--text mb-2 ml-1">
        Incorrect Username or Password
      </div>
      <v-btn @click="submitLoginData">Submit</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'blank',
  methods: {
    async submitLoginData() {
      const data = {
        username: this.username,
        password: this.password,
      };
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response && response.status === 200) {
        this.$router.push('/');
      } else {
        this.loginFailed = true;
      }
    },
    inputEntered(ev: KeyboardEvent) {
      if (ev.key === 'Enter') {
        this.submitLoginData();
      }
    },
  },
  data() {
    return {
      loginFailed: false,
      username: '',
      password: '',
    };
  },
});
</script>

<style scoped></style>
