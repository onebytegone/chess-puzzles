<template>
   <div class="target" :class="stateClasses">
      <div class="contents">
         <span v-if="props.isSelected">{{ props.actualControlCount }}</span>
         <span v-else>{{ props.expectedControlCount }}</span>
      </div>
   </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
   cellID: string;
   expectedControlCount: number;
   actualControlCount: number;
   isSelected?: boolean;
   isControlled?: boolean;
   isTinted?: boolean;
}>();

const stateClasses = computed(() => {
   return {
      tinted: !!props.isTinted,
      selected: !!props.isSelected,
      controlled: !!props.isControlled,
      under: props.actualControlCount < props.expectedControlCount,
      over: props.actualControlCount > props.expectedControlCount,
   };
});
</script>

<style lang="scss" scoped>
.target {
   user-select: none;
   position: relative;
   background-color: var(--lightCell);
   aspect-ratio: 1;
}

.over .contents::after,
.under .contents::after {
   clip-path: polygon(
      0 0,
      100% 0,
      100% 100%,
      0 100%,
      0 60%,
      40% 100%,
      60% 100%,
      100% 60%,
      100% 40%,
      60% 0,
      40% 0,
      0% 40%
   );
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
}

.under .contents::after {
   background-color: var(--targetCorners);
}

.over .contents::after {
   background-color: var(--targetCornersOver);
}

.tinted {
   background-color: var(--darkCell);
}

.contents {
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 100%;
}

.selected .contents {
   background-color: var(--selectedOverlay);
}

.controlled::after {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   border-radius: 0;
   background: radial-gradient(circle at center, transparent 55%, var(--selectedOverlay) 0%);
}
</style>
