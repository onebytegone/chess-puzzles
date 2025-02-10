<template>
   <div
      class="cell"
      :class="{
         unavailable: props.available === 0,
         selected: props.isSelected,
         hovered: props.isHovered,
      }"
   >
      <div class="contents">
         <ChessPieceIcon :piece="props.piece" />
      </div>
      <div class="availableCount">{{ props.available }}</div>
   </div>
</template>

<script setup lang="ts">
import { type ChessPiece } from '../lib/chess-piece-types';
import ChessPieceIcon from './ChessPieceIcon.vue';

const props = defineProps<{
   piece: ChessPiece;
   available: number;
   isSelected: boolean;
   isHovered: boolean;
}>();
</script>

<style lang="scss" scoped>
.cell {
   height: 100%;
   aspect-ratio: 1;
   user-select: none;
   position: relative;
   background-color: var(--lightCell);
   border-radius: 4px;
   border: 2px solid var(--darkCell);
   cursor: grab;

   &.unavailable {
      cursor: unset;
   }
}

.availableCount {
   display: flex;
   justify-content: center;
   align-items: center;
   position: absolute;
   top: -0.8em;
   left: -0.8em;
   height: 1.4em;
   min-width: 1.4em;
   padding: 0 0.2em;
   color: var(--targetText);
   background-color: var(--darkCell);
   border-radius: 0.8em 0.8em 0.8em 0.8em;
}

.contents {
   display: flex;
   justify-content: center;
   align-items: center;
   aspect-ratio: 1;
   width: 2.5em;
}

.unavailable .contents {
   opacity: 20%;
}

.contents {
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 100%;
   pointer-events: none;
}

.selected .contents {
   background-color: var(--selectedOverlay);
}

.hovered .contents {
   border: 4px solid var(--hoverOverlay);
}
</style>
