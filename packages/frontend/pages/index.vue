<template>
  <v-row justify="center" align="center">
    <v-col class="d-flex justify-center">
      <v-card max-width="600">
        <v-card-title>Hello Werewolf</v-card-title>
        <v-img
          lazy-src="https://static1.e621.net/data/preview/be/be/bebe6fd6d9d61e1baf1f2674691dc061.jpg"
          :src="werewolf"
          max-height="700"
          contain
        ></v-img>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'barLayout',
  data() {
    const werewolf =
      'https://static1.e621.net/data/sample/be/be/bebe6fd6d9d61e1baf1f2674691dc061.jpg';
    return {
      werewolf,
      tree: 'https://www.arborica.de/wp-content/uploads/2019/06/20190527_171815-e1560886079336.jpg',
    };
  },
};
</script>

<style scoped></style>
