<!-- eslint-disable vue/multi-word-component-names -->
<template>
   <RouterLink v-if="props.routeTo" class="button" :to="props.routeTo">
      <slot />
   </RouterLink>
   <button v-else class="button" type="button">
      <slot />
   </button>
</template>

<script setup lang="ts">
const props = defineProps<{
   type?: 'primary' | 'secondary';
   routeTo?: string;
}>();
</script>

<style lang="scss" scoped>
.button {
   text-decoration: none;
   cursor: pointer;
   outline: 0;
   color: var(--buttonText);
   background-color: var(--button);
   border-color: var(--button);
   display: inline-block;
   font-weight: 400;
   line-height: 1.5;
   text-align: center;
   border: 1px solid transparent;
   padding: 6px 12px;
   font-size: 16px;
   border-radius: 0.25rem;
   transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;

   &:hover {
      color: var(--buttonText);
      background-color: var(--buttonHover);
      border-color: var(--buttonHover);
   }
}
</style>
