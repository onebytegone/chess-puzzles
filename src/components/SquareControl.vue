<template>
   <div class="squareControl" :class="{ isDragging }">
      <div ref="chessBoard" class="chessBoard">
         <template v-for="cell in board.boardState" :key="cell.id">
            <ChessSquare
               v-if="cell.type === CellType.BoardChessPiece"
               :cellID="cell.id"
               class="draggablePieceCell"
               :data-draggable-piece-cell-id="cell.id"
               :class="{ hasDraggablePiece: !!cell.piece.value }"
               :isSelected="cell.isSelected.value"
               :isHovered="cell.isHovered.value"
               :isTinted="cell.isTinted"
               :isControlled="!!selectedCellID && cell.controlledBy.value.includes(selectedCellID)"
               :piece="cell.piece.value"
            />
            <TargetSquare
               v-else-if="cell.type === CellType.BoardTargetCell"
               :cellID="cell.id"
               :expectedControlCount="cell.expected"
               :actualControlCount="cell.controlledBy.value.length"
               :isSelected="cell.isSelected.value"
               :isTinted="cell.isTinted"
               :isControlled="!!selectedCellID && cell.controlledBy.value.includes(selectedCellID)"
            />
            <WallSquare v-else :cellID="cell.id" />
         </template>
         <div
            class="floatingPiece"
            v-if="board.selectedPiece.value && isDragging"
            :style="{ top: hoverPosition.x + 'px', left: hoverPosition.y + 'px' }"
         >
            <ChessPieceIcon :piece="board.selectedPiece.value" />
         </div>
      </div>

      <div class="pieceDepot">
         <PieceDepotCell
            v-for="cell in board.depotState"
            :key="cell.id"
            class="draggablePieceCell"
            :data-draggable-piece-cell-id="cell.id"
            :class="{ hasDraggablePiece: cell.available.value > 0 }"
            :piece="cell.piece"
            :available="cell.available.value"
            :isSelected="cell.isSelected.value"
            :isHovered="cell.isHovered.value"
         />
      </div>
   </div>
</template>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import ChessSquare from './ChessSquare.vue';
import PieceDepotCell from './PieceDepotCell.vue';
import { CellType, makeSquareControlBoard } from '@/model/SquareControlBoard';
import { useDraggablePiece } from '@/composables/use-draggable-piece';
import ChessPieceIcon from './ChessPieceIcon.vue';
import TargetSquare from './TargetSquare.vue';
import WallSquare from './WallSquare.vue';
import { generateSquareControlLevel } from '@/lib/generate-square-control-level';

const chessBoard = useTemplateRef<HTMLElement>('chessBoard');

const props = defineProps<{
   seed: number;
   squareCount: number;
   pieceCount: number;
}>();

const level = generateSquareControlLevel({
   seed: props.seed,
   board: { squareCount: props.squareCount },
   pieces: props.pieceCount,
});

const board = makeSquareControlBoard(level.board, level.depot);

const { selectedCellID, hoveredCellID, hoverPosition, isDragging } = useDraggablePiece({
   canMoveToCell: (sourceCellID, targetCellID) => {
      return !!board.makeMoveOperation(sourceCellID, targetCellID);
   },
   onPieceMove: (sourceCellID, targetCellID) => {
      const op = board.makeMoveOperation(sourceCellID, targetCellID);

      if (op) {
         op();
      } else {
         throw new Error(`Invalid move from ${sourceCellID} to ${targetCellID}`);
      }
   },
});

watch(selectedCellID, (cellID) => {
   if (cellID === undefined) {
      board.clearSelection();
   } else {
      board.setSelectedCell(cellID);
   }
});

watch(hoveredCellID, board.setHoveredCell);

defineExpose({
   resetGame: () => {
      window.location.reload();
   },
});
</script>

<style lang="scss" scoped>
.squareControl {
   flex-grow: 1;
   display: flex;
   flex-direction: column;
   align-items: center;
}

.isDragging {
   cursor: grabbing;
}

.chessBoard {
   width: 80vw;
   user-select: none;
   display: grid;
   grid-template-columns: repeat(v-bind('board.width'), 1fr);
   grid-template-rows: repeat(v-bind('board.height'), 1fr);
}

@media screen and (min-width: 640px) {
   .chessBoard {
      width: 512px;
   }
}

.floatingPiece {
   position: fixed;
   pointer-events: none;
   z-index: 1000;
   width: 56px;
   height: 56px;
   margin-top: -28px;
   margin-left: -28px;
   display: flex;
   justify-content: center;
   align-items: center;
}

.pieceDepot {
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   gap: 1em;
   margin: 1.25em 1em 0.5em 1em;
}
</style>
