<template>
   <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useHead } from '@unhead/vue';

useHead({
   titleTemplate: (title?: string) => {
      return title ? `${title} - Chess Puzzles` : 'Chess Puzzles';
   },
});
</script>
