<template>
   <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
         <component :is="Component" />
      </Transition>
   </RouterView>
   <PWAToast />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useHead } from '@unhead/vue';
import PWAToast from './components/PWAToast.vue';

useHead({
   titleTemplate: (title?: string) => {
      return title ? `${title} - Chess Puzzles` : 'Chess Puzzles';
   },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}
</style>
