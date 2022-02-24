<template>
  <v-card width="600">
    <v-card-title> <v-icon class="mr-2">mdi-login</v-icon>Login </v-card-title>
    <v-card-text>
      <div v-if="!allFieldsFilled" class="red--text">
        All fields need to be filled
      </div>
      <div v-if="!doPasswordsMatch" class="red--text">
        The given passwords do not match
      </div>
      <v-text-field label="Username" v-model="username"></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        type="password"
      ></v-text-field>
      <v-text-field
        label="Repeat Password"
        v-model="repeatPassword"
        type="password"
      ></v-text-field>
      <v-btn @click="submitLoginData">Register</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'blank',
  methods: {
    async submitLoginData() {
      if (!(this.username && this.password && this.repeatPassword)) {
        this.allFieldsFilled = false;
        return;
      } else {
        this.allFieldsFilled = true;
      }
      if (this.password !== this.repeatPassword) {
        this.doPasswordsMatch = false;
        return;
      } else {
        this.doPasswordsMatch = true;
      }

      const data = {
        username: this.username,
        password: this.password,
      };
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response && response.status === 200) {
        this.$router.push('/login');
      } else {
      }
    },
  },
  data() {
    return {
      username: '',
      password: '',
      repeatPassword: '',
      doPasswordsMatch: true,
      allFieldsFilled: true,
    };
  },
});
</script>

<style></style>
