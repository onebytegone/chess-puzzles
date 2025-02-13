<template>
   <div class="levelSelector">
      <Button
         v-for="level in levelManager.levelSummaries"
         :key="level.id"
         :routeTo="'/level/' + level.id"
         :type="level.isCompleted ? 'outlined' : 'primary'"
         :class="{ uncompleted: !level.isCompleted }"
      >
         <span>{{ level.name }}</span>
         <Checkmark class="checkmark" v-if="level.isCompleted" alt="Completed" />
      </Button>
   </div>
</template>

<script setup lang="ts">
import { loadLevelManager } from '../lib/load-level-manager';
import Button from './Button.vue';
import Checkmark from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/check.svg';
import { onMounted } from 'vue';
const levelManager = loadLevelManager();

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
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: 0.5rem;
   min-height: 48px;
}

.checkmark {
   fill: var(--buttonText);
   height: 1.5em;
}
</style>
