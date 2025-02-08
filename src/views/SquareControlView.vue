<template>
   <NavigationBar>
      <Button routeTo="/">Back</Button>
      <Button @click.prevent="resetGame">Restart</Button>
   </NavigationBar>
   <main>
      <SquareControl ref="game" />
   </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import SquareControl from '@/components/SquareControl.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import Button from '@/components/Button.vue';

const game = useTemplateRef('game');

onMounted(() => {
   document.documentElement.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
   document.documentElement.style.overflow = 'auto';
});

const resetGame = () => {
   game.value?.resetGame();
};
</script>

<style lang="scss" scoped>
.page {
   display: flex;
   flex-direction: column;
   max-height: 100vh;
   height: 100vh;
}
</style>
