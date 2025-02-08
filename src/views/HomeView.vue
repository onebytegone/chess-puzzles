<template>
   <NavigationBar>
      <h1>Chess Puzzles</h1>
   </NavigationBar>
   <main class="levels">
      <LevelSelector />
   </main>
</template>

<script setup lang="ts">
import LevelSelector from '@/components/LevelSelector.vue';
import NavigationBar from '@/components/NavigationBar.vue';
</script>

<style lang="scss" scoped>
.levels {
   overflow: scroll;
}
</style>
