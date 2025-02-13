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
   <Dialog title="Completed!" ref="completedDialog" :dismissable="false" :showCloseButton="false">
      <div class="buttonGroup">
         <Button type="outlined" routeTo="/">Back</Button>
         <Button v-if="nextLevelLink" :routeTo="nextLevelLink">Next</Button>
      </div>
   </Dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
import SquareControl from '../components/SquareControl.vue';
import NavigationBar from '../components/NavigationBar.vue';
import Button from '../components/Button.vue';
import Dialog from '../components/Dialog.vue';
import {
   generateSquareControlLevel,
   isGenerateSquareControlLevelOptions,
} from '../model/square-control/generate-square-control-level';
import { loadLevelManager } from '../lib/load-level-manager';

const game = useTemplateRef('game');

const completedDialog = useTemplateRef('completedDialog');

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
   completedDialog.value?.open();
}
</script>

<style lang="scss" scoped>
.page {
   display: flex;
   flex-direction: column;
   max-height: 100vh;
   height: 100vh;
}

.buttonGroup {
   display: flex;
   justify-content: space-between;
   gap: 1rem;
}
</style>
