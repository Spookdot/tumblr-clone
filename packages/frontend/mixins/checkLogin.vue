<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async mounted() {
    const response: { authenticated: boolean; username?: string } = await (
      await fetch('/api/user/authenticated')
    ).json();
    if (!response.authenticated) {
      this.$router.push('/login');
    }
  },
});
</script>
