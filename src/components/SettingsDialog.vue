<template>
   <dialog ref="dialog" class="settings">
      <div class="header">
         <h2>Settings</h2>
         <Button @click="dialog?.close()">Close</Button>
      </div>
      <Button type="danger" @click="promptResetProgress">Reset All Progress</Button>
   </dialog>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { LEVEL_STATE_KEY } from '../model/LevelManager';
import Button from './Button.vue';

const dialog = useTemplateRef<HTMLDialogElement>('dialog');

function promptResetProgress() {
   if (confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem(LEVEL_STATE_KEY);
      window.location.reload();
   }
}

onMounted(() => {
   dialog.value?.addEventListener('click', ({ target: dialog }) => {
      if (dialog && dialog instanceof HTMLDialogElement) {
         dialog.close();
      }
   });
});

defineExpose({
   open: () => {
      dialog.value?.showModal();
   },
});
</script>

<style lang="scss" scoped>
.settings {
   width: 95vw;
   max-width: 320px;
}
.header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 1em;
}
h2 {
   margin: 0;
}
</style>
