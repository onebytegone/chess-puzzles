<template>
   <div class="page">
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
      <Dialog
         title="Completed!"
         ref="completedDialog"
         :dismissable="false"
         :showCloseButton="false"
      >
         <div class="ratingGroup">
            <span>Rating:</span>
            <Button
               :type="levelRating === -1 ? 'primary' : 'text'"
               @click="updateRating(-1)"
               icon="thumbs-down"
            ></Button>
            <Button
               :type="levelRating === 1 ? 'primary' : 'text'"
               @click="updateRating(1)"
               icon="thumbs-up"
            ></Button>
         </div>
         <div class="buttonGroup">
            <Button type="outlined" routeTo="/">Back</Button>
            <Button v-if="nextLevelLink" :routeTo="nextLevelLink">Next</Button>
         </div>
      </Dialog>
   </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
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

const levelRating = ref(0);

watchEffect(() => {
   levelRating.value = levelManager.getLevelRating(props.levelID) || 0;
});

function updateRating(rating: number) {
   levelManager.setLevelRating(props.levelID, rating);
   levelRating.value = rating;
}

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
   height: 100vh;
   overflow: hidden;
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
</style>
