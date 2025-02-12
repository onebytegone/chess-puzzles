<!-- eslint-disable vue/multi-word-component-names -->
<template>
   <RouterLink v-if="props.routeTo" class="button" :class="props.type" :to="props.routeTo">
      <slot />
   </RouterLink>
   <button v-else class="button" :class="props.type" type="button">
      <slot />
   </button>
</template>

<script setup lang="ts">
const props = defineProps<{
   type?: 'primary' | 'outlined' | 'danger';
   routeTo?: string;
}>();
</script>

<style lang="scss" scoped>
.button {
   text-decoration: none;
   cursor: pointer;
   outline: 0;
   background-color: var(--buttonBackground);
   color: var(--buttonText);
   display: inline-block;
   font-weight: 400;
   line-height: 1.5;
   text-align: center;
   border: 2px solid var(--buttonBorder);
   padding: 6px 12px;
   font-size: 16px;
   border-radius: 0.25rem;
   transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;

   &:hover {
      background-color: var(--buttonBackground--hover);
   }

   &.danger {
      background-color: var(--buttonBackground-danger);
      color: var(--buttonText-danger);
      border-color: var(--buttonBorder-danger);

      &:hover {
         background-color: var(--buttonBackground-danger--hover);
      }
   }

   &.outlined {
      background-color: var(--buttonBackground-outlined);
      color: var(--buttonText-outlined);
      border-color: var(--buttonBorder-outlined);

      &:hover {
         background-color: var(--buttonBackground-outlined--hover);
      }
   }
}
</style>
