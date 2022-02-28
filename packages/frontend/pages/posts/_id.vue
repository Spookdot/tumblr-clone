<template>
  <v-card v-if="post">
    <v-card-title>{{ post.title }}</v-card-title>
    <v-card-text>{{ post.content }}</v-card-text>
    <v-card-subtitle>
      <v-chip v-for="tag in post.tags" :key="tag._id" class="mr-1">{{
        tag.name
      }}</v-chip>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

type Tag = { _id: string; name: string };

type Post = {
  title: string;
  author: string;
  content: string;
  tags: Array<Tag>;
};

export default Vue.extend({
  layout: 'blank',
  async mounted() {
    const { id } = this.$route.params;
    if (!id) {
      this.$nuxt.error({
        statusCode: 404,
        message: "This post doesn't seem to exist",
      });
    }

    const response = await fetch(`/api/posts/?id=${id}`);
    this.post = await response.json();
  },
  data(): { post?: Post } {
    return {
      post: undefined,
    };
  },
});
</script>

<style></style>
