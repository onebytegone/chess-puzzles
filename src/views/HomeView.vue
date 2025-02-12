<template>
   <NavigationBar>
      <h1>Chess Puzzles</h1>
      <Button @click="settingsDialog?.open()">Settings</Button>
   </NavigationBar>
   <main class="levels">
      <LevelSelector />
   </main>
   <SettingsDialog ref="settingsDialog" />
</template>

<script setup lang="ts">
import LevelSelector from '../components/LevelSelector.vue';
import NavigationBar from '../components/NavigationBar.vue';
import SettingsDialog from '../components/SettingsDialog.vue';
import Button from '../components/Button.vue';
import { useTemplateRef } from 'vue';

const settingsDialog = useTemplateRef('settingsDialog');
</script>

<style lang="scss" scoped>
.levels {
   overflow: scroll;
}
</style>
