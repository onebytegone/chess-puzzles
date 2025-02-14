<template>
   <div class="page">
      <NavigationBar>
         <h1>Chess Puzzles</h1>
         <Button routeTo="/about">About</Button>
      </NavigationBar>
      <main class="levels">
         <LevelSelector />
      </main>
      <Dialog title="Greetings!" ref="welcomeDialog">
         <p>Chess Puzzles runs best when installed on your device.</p>
         <p>To do so, <b>add this page on your Home Screen</b>.</p>
         <p>Enjoy the game!</p>
      </Dialog>
   </div>
</template>

<script setup lang="ts">
import LevelSelector from '../components/LevelSelector.vue';
import NavigationBar from '../components/NavigationBar.vue';
import Dialog from '../components/Dialog.vue';
import Button from '../components/Button.vue';
import { onMounted, useTemplateRef } from 'vue';
import { isMobile } from '../lib/is-mobile';

const welcomeDialog = useTemplateRef('welcomeDialog');

onMounted(() => {
   const showWelcomeDialog =
      !localStorage.getItem('welcomeDialogShown') &&
      !window.matchMedia('(display-mode: standalone)').matches &&
      isMobile();

   if (showWelcomeDialog) {
      welcomeDialog.value?.open();
      localStorage.setItem('welcomeDialogShown', 'true');
   }
});
</script>

<style lang="scss" scoped>
.page {
   display: flex;
   flex-direction: column;
   height: 100vh;
}

.levels {
   overflow: scroll;
}
</style>
