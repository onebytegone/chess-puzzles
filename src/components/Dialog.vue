<!-- eslint-disable vue/multi-word-component-names -->
<template>
   <dialog ref="dialog" class="dialog">
      <div class="header">
         <h2>{{ props.title }}</h2>
         <Button
            v-if="props.showCloseButton"
            type="text"
            icon="x"
            @click="dialog?.close()"
         ></Button>
      </div>
      <slot />
   </dialog>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import Button from './Button.vue';

const dialog = useTemplateRef<HTMLDialogElement>('dialog');

interface Props {
   title: string;
   dismissable?: boolean;
   showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
   dismissable: true,
   showCloseButton: true,
});

onMounted(() => {
   dialog.value?.addEventListener('click', ({ target: dialog }) => {
      if (dialog && dialog instanceof HTMLDialogElement && props.dismissable) {
         dialog.close();
      }
   });
});

defineExpose({
   open: () => {
      dialog.value?.showModal();
   },
   close: () => {
      dialog.value?.close();
   },
});
</script>

<style lang="scss" scoped>
.dialog {
   width: 95vw;
   max-width: 320px;
   border-radius: 8px;
   background-color: var(--dialogBackground);
   border: 2px solid var(--dialogBorder);
   color: var(--dialogText);
   padding: 1rem;
   gap: 0.75em;

   &::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
   }
}

.header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 0.5em;
}

h2 {
   margin: 0.25em 0 0 0;
}

:deep(p) {
   margin: 0;
}

.dialog:not([open]) {
   pointer-events: none;
   opacity: 0;
}

.dialog {
   display: flex;
   flex-direction: column;
   transition:
      display 0.3s allow-discrete,
      overlay 0.3s allow-discrete,
      opacity 0.3s var(--timing-ease) allow-discrete;
   color: var(--textNormal);
}

@media (prefers-reduced-motion: no-preference) {
   .dialog {
      animation: scale-down 0.3s cubic-bezier(0.5, -0.5, 0.1, 1.5) forwards;
   }

   .dialog[open] {
      animation: slide-in-up 0.3s var(--timing-ease) forwards;
   }
}

@keyframes slide-in-up {
   from {
      transform: translateY(100%);
   }
}

@keyframes scale-down {
   to {
      transform: scale(0.75);
   }
}
</style>
