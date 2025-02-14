<template>
   <div class="levelSelector">
      <Button
         v-for="level in levelSummaries"
         :key="level.id"
         :routeTo="level.isLocked ? undefined : '/level/' + level.id"
         :disabled="level.isLocked"
         :type="level.isCompleted || level.isLocked ? 'outlined' : 'primary'"
         :class="{ uncompleted: !level.isCompleted }"
      >
         <span>{{ level.name }}</span>
         <Checkmark class="icon" v-if="level.isCompleted" alt="Completed" />
         <Lock class="icon" v-if="level.isLocked" alt="Locked" />
      </Button>
   </div>
</template>

<script setup lang="ts">
import { loadLevelManager } from '../lib/load-level-manager';
import Button from './Button.vue';
import Checkmark from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/check.svg';
import Lock from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/lock.svg';
import { computed, onMounted } from 'vue';
const levelManager = loadLevelManager();

const levelSummaries = computed(() => {
   let unlocked = 0;

   return levelManager.levelSummaries.map((summary) => {
      if (summary.isCompleted) {
         return {
            ...summary,
            isLocked: false,
         };
      }

      if (unlocked < 3) {
         unlocked++;
         return {
            ...summary,
            isLocked: false,
         };
      }

      return {
         ...summary,
         isLocked: true,
      };
   });
});

onMounted(() => {
   document.querySelector('.uncompleted')?.scrollIntoView({ behavior: 'auto', block: 'center' });
});
</script>

<style lang="scss" scoped>
.levelSelector {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   padding: 1rem 1rem 4rem 1rem;
   margin: 0 auto;
}

@media screen and (min-width: 400px) {
   .levelSelector {
      max-width: 320px;
   }
}

:deep(.button) {
   justify-content: space-between;
   min-height: 48px;
}

.icon {
   fill: var(--buttonText);
   height: 1.5em;
}
</style>
