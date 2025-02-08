<template>
   <component :is="icon" :class="props.piece.player" class="piece" />
</template>

<script setup lang="ts">
import type { ChessPiece } from '../lib/chess-piece-types';
import { defineAsyncComponent } from 'vue';

const props = defineProps<{ piece: ChessPiece }>();

const icon = defineAsyncComponent(() => import(`../assets/${props.piece.type}.svg?component`));
</script>

<style lang="scss" scoped>
.piece {
   width: 100%;
   height: 100%;
   paint-order: stroke;
   stroke-width: 0.05em;
   stroke-linecap: round;
   stroke-linejoin: round;
}

.white {
   fill: var(--whitePiece);
   stroke: var(--whitePieceStroke);
}

.black {
   fill: var(--blackPiece);
   stroke: var(--blackPieceStroke);
}
</style>
