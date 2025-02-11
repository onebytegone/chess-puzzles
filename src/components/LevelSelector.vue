<template>
   <div class="levelSelector">
      <Button
         v-for="level in levelManager.levelSummaries"
         :key="level.id"
         :routeTo="'/square-control/' + level.id"
         :class="{ outlined: level.isCompleted }"
      >
         <span>{{ level.name }}</span>
         <Checkmark class="checkmark" v-if="level.isCompleted" alt="Completed" />
      </Button>
   </div>
</template>

<script setup lang="ts">
import { loadLevelManager } from '@/lib/load-level-manager';
import Button from './Button.vue';
import Checkmark from '@/assets/checkmark.svg';
const levelManager = loadLevelManager();
</script>

<style lang="scss" scoped>
.levelSelector {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   padding: 1rem;
   max-width: 50vw;
   margin: 0 auto;
}

:deep(.button) {
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: 0.5rem;
   min-height: 48px;
}

.checkmark {
   fill: var(--buttonText);
}
</style>
