<template>
  <v-row justify="center" align="center">
    <v-col class="d-flex justify-center">
      <v-card max-width="600">
        <v-card-title>Hello World</v-card-title>
        <v-img :src="sample" max-height="700" contain></v-img>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      sample: 'https://via.placeholder.com/512?text=Hello%20World',
    };
  },
};
</script>

<style scoped></style>
