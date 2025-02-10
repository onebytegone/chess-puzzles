<template>
   <div class="square" :class="stateClasses">
      <div class="contents">
         <ChessPieceIcon class="piece" v-if="props.piece" :piece="props.piece" />
      </div>
   </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type ChessPiece } from '../lib/chess-piece-types';
import ChessPieceIcon from './ChessPieceIcon.vue';

const props = defineProps<{
   cellID: string;
   piece?: ChessPiece;
   isTinted?: boolean;
   isSelected?: boolean;
   isHovered?: boolean;
   isControlled?: boolean;
}>();

const stateClasses = computed(() => {
   return {
      hasPiece: !!props.piece,
      tinted: !!props.isTinted,
      selected: !!props.isSelected,
      hovered: !!props.isHovered,
      controlled: !!props.isControlled,
   };
});
</script>

<style lang="scss" scoped>
.square {
   aspect-ratio: 1;
   position: relative;
   user-select: none;
   position: relative;
   background-color: var(--lightCell);
}

.hasPiece {
   cursor: grab;
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
   pointer-events: none;
}

.selected .contents {
   background-color: var(--selectedOverlay);
}

.hovered .contents {
   border: 4px solid var(--hoverOverlay);
}

.controlled::after {
   content: '';
   position: absolute;
   top: 30%;
   left: 30%;
   right: 30%;
   bottom: 30%;
   border-radius: 50%;
   background-color: var(--selectedOverlay);
}

.controlled.hasPiece::after {
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
