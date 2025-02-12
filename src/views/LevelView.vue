<template>
   <NavigationBar>
      <Button routeTo="/">Back</Button>
      <h1>{{ levelDefinition.name }}</h1>
      <Button @click.prevent="resetGame">Restart</Button>
   </NavigationBar>
   <main>
      <SquareControl
         ref="game"
         :key="props.levelID"
         :level="level"
         v-on:completed="onLevelCompletion"
      />
   </main>
   <dialog class="dialog" ref="completedDialog">
      <h2>Completed!</h2>
      <div class="buttonGroup">
         <Button :type="levelRating === -1 ? 'primary' : 'outlined'" @click="levelRating = -1"
            >👎</Button
         >
         <Button :type="levelRating === 1 ? 'primary' : 'outlined'" @click="levelRating = 1"
            >👍</Button
         >
      </div>
      <div class="buttonGroup">
         <Button type="outlined" routeTo="/">Back</Button>
         <Button v-if="nextLevelLink" :routeTo="nextLevelLink">Next</Button>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import SquareControl from '../components/SquareControl.vue';
import NavigationBar from '../components/NavigationBar.vue';
import Button from '../components/Button.vue';
import {
   generateSquareControlLevel,
   isGenerateSquareControlLevelOptions,
} from '../model/square-control/generate-square-control-level';
import { loadLevelManager } from '../lib/load-level-manager';

const game = useTemplateRef('game');

const completedDialog = useTemplateRef<HTMLDialogElement>('completedDialog');

const resetGame = () => {
   game.value?.resetGame();
};

const props = defineProps<{
   levelID: string;
}>();

const levelManager = loadLevelManager();

const levelDefinition = computed(() => {
   return levelManager.getLevel(props.levelID);
});

const levelRating = ref(levelManager.getLevelRating(props.levelID));

watch(levelRating, (rating) => {
   console.log(rating);
   levelManager.setLevelRating(props.levelID, rating);
});

const level = computed(() => {
   return isGenerateSquareControlLevelOptions(levelDefinition.value.level)
      ? generateSquareControlLevel(levelDefinition.value.level)
      : levelDefinition.value.level;
});

const nextLevelLink = computed(() => {
   const nextLevel = levelManager.getNextLevelID(props.levelID);

   return nextLevel ? `/level/${nextLevel}` : undefined;
});

watch(props, () => {
   completedDialog.value?.close();
});

onMounted(() => {
   document.documentElement.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
   document.documentElement.style.overflow = 'auto';
});

function onLevelCompletion() {
   levelManager.markLevelAsCompleted(props.levelID);
   completedDialog.value?.showModal();
}
</script>

<style lang="scss" scoped>
.page {
   display: flex;
   flex-direction: column;
   max-height: 100vh;
   height: 100vh;
}

.dialog {
   border-radius: 8px;
   background-color: var(--dialogBackground);
   border: 2px solid var(--dialogBorder);
   color: var(--dialogText);
   padding: 1rem;
   min-width: 280px;

   &::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
   }

   h2 {
      text-align: center;
   }
}

.buttonGroup {
   margin-top: 1em;
   display: flex;
   justify-content: space-between;
   gap: 1rem;
}
</style>
