<!-- eslint-disable vue/multi-word-component-names -->
<template>
   <RouterLink
      v-if="props.routeTo"
      class="button"
      :class="classes"
      :to="props.routeTo"
      :disabled="props.disabled"
   >
      <component v-if="props.icon" :is="ICON_COMPONENTS[props.icon]" />
      <slot />
   </RouterLink>
   <a
      v-else-if="props.linkTo"
      class="button"
      :class="classes"
      :href="props.linkTo"
      target="_blank"
      :disabled="props.disabled"
   >
      <component v-if="props.icon" :is="ICON_COMPONENTS[props.icon]" />
      <slot />
   </a>
   <button v-else class="button" :class="classes" type="button" :disabled="props.disabled">
      <component v-if="props.icon" :is="ICON_COMPONENTS[props.icon]" />
      <slot />
   </button>
</template>

<script setup lang="ts">
import ThumbsUp from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/thumbs-up.svg';
import ThumbsDown from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/thumbs-down.svg';
import TrashCan from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/trash-can.svg';
import Share from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/arrow-up-from-bracket.svg';
import Export from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/arrow-up-from-bracket.svg';
import X from '../../node_modules/@fortawesome/fontawesome-free/svgs/solid/x.svg';
import GitHub from '../../node_modules/@fortawesome/fontawesome-free/svgs/brands/github.svg';
import { computed } from 'vue';

const ICON_COMPONENTS = Object.freeze({
   'thumbs-up': ThumbsUp,
   'thumbs-down': ThumbsDown,
   'trash-can': TrashCan,
   export: Export,
   github: GitHub,
   share: Share,
   x: X,
});

interface Props {
   type?: 'primary' | 'outlined' | 'danger' | 'text';
   icon?: keyof typeof ICON_COMPONENTS;
   routeTo?: string;
   linkTo?: string;
   disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
   type: 'primary',
});

const classes = computed(() => {
   return {
      disabled: props.disabled,
      [props.type]: true,
   };
});
</script>

<style lang="scss" scoped>
.button {
   display: flex;
   gap: 0.5rem;
   align-items: center;
   justify-content: center;
   text-decoration: none;
   cursor: pointer;
   outline: 0;
   background-color: var(--buttonBackground);
   color: var(--buttonText);
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

   &.disabled {
      cursor: default;
      &:hover {
         background-color: unset !important;
      }
   }

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

   &.text {
      background-color: transparent;
      border-color: transparent;
      &:hover {
         background-color: var(--buttonBackground--hover);
      }
   }
}

svg {
   fill: var(--buttonText-outlined);
   height: 1em;
   margin: 4px 0;
}
</style>
