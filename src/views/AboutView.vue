<template>
   <div class="page">
      <NavigationBar>
         <Button routeTo="/">Back</Button>
         <div />
      </NavigationBar>
      <main>
         <h2>Chess Puzzles</h2>
         <p>
            Chess Puzzles is a free open-source game with no ads or tracking. It is built using
            Vue.js and is hosted on GitHub Pages.
         </p>
         <p>
            <em>Did you know?</em> This is a progressive web app (PWA). If this webpage is
            bookmarked to your mobile device's home screen, this will work offline!
         </p>
         <Button type="primary" icon="share" @click="share">Share</Button>
         <Button type="primary" icon="github" linkTo="https://github.com/onebytegone/chess-puzzles"
            >Source Code</Button
         >
         <hr />
         <Button type="primary" icon="export" @click="exportData">Export Progress</Button>
         <Button type="danger" icon="trash-can" @click="promptResetData">Reset All Data</Button>
         <hr />
         <p class="copyright">&copy; 2025 Ethan Smith</p>
      </main>
   </div>
</template>

<script setup lang="ts">
import NavigationBar from '../components/NavigationBar.vue';
import Button from '../components/Button.vue';
import { LevelManager } from '../model/LevelManager';

function promptResetData() {
   if (confirm('Are you sure you want to reset all data?')) {
      LevelManager.delete_all_data();
      window.location.reload();
   }
}

async function share() {
   await navigator.share({
      text: 'Thought you might like this web game using Chess pieces!',
      url: 'https://onebytegone.github.io/chess-puzzles',
   });
}

async function exportData() {
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

.page main {
   display: flex;
   flex-direction: column;

   height: 100vh;
   padding: 0 2em;
   max-width: 480px;
   margin: 0 auto;

   :deep(.button) {
      margin-bottom: 0.5em;
   }
   p {
      margin-top: 0;
   }
}

hr {
   width: 100%;
   margin-bottom: 1em;
   border: 1px solid var(--hrBorder);
}

.ratingGroup {
   margin: 0 0 0.5em 0;
   display: flex;
   justify-content: center;
   align-items: center;
   span {
      margin-right: 0.5em;
   }
}

.buttonGroup {
   display: flex;
   justify-content: space-between;
   gap: 1rem;
}

.copyright {
   text-align: center;
}
</style>
