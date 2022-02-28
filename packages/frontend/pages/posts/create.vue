<template>
  <v-card>
    <v-card-text>
      <v-text-field label="Title" v-model="title"></v-text-field>
      <v-textarea label="Text" v-model="content"></v-textarea>
      Comma separated tags:
      <v-chip-group column>
        <v-chip
          v-for="chip in chips"
          :key="chip"
          close
          @click:close="chipClosed(chip)"
          >{{ chip }}</v-chip
        >
      </v-chip-group>
      <v-text-field
        @keyup="tagInputEvent"
        v-model="tagFieldContent"
      ></v-text-field>
    </v-card-text>
    <v-card-subtitle v-if="error"
      >There seems to have been an issue. Please try again
      later</v-card-subtitle
    >
    <v-card-actions>
      <v-btn @click="submitPost">Submit!</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import checkLogin from '~/mixins/checkLogin.vue';

const tagSeparators = ['Comma', 'Enter', 'Space'];

export default Vue.extend({
  mixins: [checkLogin],
  methods: {
    tagInputEvent(ev: KeyboardEvent) {
      if (tagSeparators.includes(ev.code) && this.tagFieldContent !== ',') {
        this.tagFieldContent = this.tagFieldContent.replace(/\,|\ /, '');

        if (!this.chips.includes(this.tagFieldContent)) {
          this.chips.push(this.tagFieldContent);
        }

        this.tagFieldContent = '';
      }
    },
    chipClosed(chip: string) {
      const chipIndex = this.chips.indexOf(chip);
      this.chips.splice(chipIndex, 1);
    },
    async submitPost() {
      const body = {
        title: this.title,
        content: this.content,
        tags: this.chips,
      };

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(response);

      if ([400, 500].includes(response.status)) {
        this.error = true;
        console.log(await response.json());
        return;
      }

      const responseJson = await response.json();
      this.$router.push(`/posts/${responseJson.id}`);
    },
  },
  data(): {
    tagFieldContent: string;
    title: string;
    content: string;
    chips: Array<string>;
    error: boolean;
  } {
    return {
      tagFieldContent: '',
      title: '',
      content: '',
      chips: [],
      error: false,
    };
  },
});
</script>

<style></style>
