<template>
   <NavigationBar>
      <Button routeTo="/">Back</Button>
      <Button @click.prevent="resetGame">Restart</Button>
   </NavigationBar>
   <main>
      <SquareControl ref="game" :level="level" v-on:completed="onLevelCompletion" />
   </main>
   <dialog ref="completedDialog">
      <h2>Completed!</h2>
      <Button routeTo="/">Back</Button>
   </dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import SquareControl from '@/components/SquareControl.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import Button from '@/components/Button.vue';
import {
   generateSquareControlLevel,
   isGenerateSquareControlLevelOptions,
} from '@/model/square-control/generate-square-control-level';
import { loadLevelManager } from '@/lib/load-level-manager';

const game = useTemplateRef('game');

const completedDialog = useTemplateRef<HTMLDialogElement>('completedDialog');

const resetGame = () => {
   game.value?.resetGame();
};

const props = defineProps<{
   levelID: string;
}>();

const levelManager = loadLevelManager(),
   levelDefinition = levelManager.getLevel(props.levelID);

const level = isGenerateSquareControlLevelOptions(levelDefinition.level)
   ? generateSquareControlLevel(levelDefinition.level)
   : levelDefinition.level;

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
</style>
