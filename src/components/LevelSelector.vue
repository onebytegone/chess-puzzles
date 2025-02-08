<template>
   <div class="levelSelector">
      <Button v-for="level in levels" :key="level.id" routeTo="/square-control">{{
         level.name
      }}</Button>
   </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';

const levels = Array(10)
   .fill(undefined)
   .map((_, i) => {
      return {
         id: i,
         name: `Level ${i + 1}`,
      };
   });
</script>

<style lang="scss" scoped>
.levelSelector {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   padding: 1rem;
}
</style>
