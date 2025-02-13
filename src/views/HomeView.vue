<template>
   <div class="page">
      <NavigationBar>
         <h1>Chess Puzzles</h1>
         <Button @click="settingsDialog?.open()">Settings</Button>
      </NavigationBar>
      <main class="levels">
         <LevelSelector />
      </main>
      <Dialog title="Settings" ref="settingsDialog">
         <Button type="primary" icon="share" @click="shareData">Share Progress</Button>
         <Button type="danger" icon="trash-can" @click="promptResetData">Reset All Data</Button>
      </Dialog>
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
import { LevelManager } from '../model/LevelManager';
import { onMounted, useTemplateRef } from 'vue';
import { isMobile } from '../lib/is-mobile';

const settingsDialog = useTemplateRef('settingsDialog');
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

function promptResetData() {
   if (confirm('Are you sure you want to reset all data?')) {
      LevelManager.delete_all_data();
      window.location.reload();
   }
}

async function shareData() {
   const data = LevelManager.export_data();

   try {
      await navigator.share({
         title: 'Chess Puzzles Progress',
         files: [
            new File([data], 'chess-puzzles.json', {
               type: 'application/json',
            }),
         ],
      });
   } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
         alert(data);
      } else {
         throw error;
      }
   }
}
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
