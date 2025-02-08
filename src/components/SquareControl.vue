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
import { ChessPieceType, ChessPlayer } from '@/lib/chess-piece-types';
import PieceDepotCell from './PieceDepotCell.vue';
import { CellType, makeSquareControlBoard } from '@/model/SquareControlBoard';
import { useDraggablePiece } from '@/composables/use-draggable-piece';
import ChessPieceIcon from './ChessPieceIcon.vue';
import TargetSquare from './TargetSquare.vue';
import WallSquare from './WallSquare.vue';

const chessBoard = useTemplateRef<HTMLElement>('chessBoard');

const boardCells = Array(8)
   .fill(undefined)
   .map(() => {
      return Array(8)
         .fill(undefined)
         .map(() => {
            if (Math.random() > 0.8) {
               return undefined;
            }

            if (Math.random() > 0.5) {
               return {
                  expected: Math.floor(Math.random() * 3 + 1),
               };
            }
            return {
               piece:
                  Math.random() > 0.7
                     ? {
                          type: ChessPieceType.Bishop,
                          player: ChessPlayer.White,
                       }
                     : undefined,
            };
         });
   });

const pieces = Object.values(ChessPieceType);

const depotCells = Array(5)
   .fill(undefined)
   .map(() => {
      const piece = pieces.splice(Math.floor(Math.random() * pieces.length), 1)[0];

      return {
         piece: {
            type: piece,
            player: ChessPlayer.Black,
         },
         available: Math.floor(Math.random() * 7) + 1,
      };
   });

const board = makeSquareControlBoard(boardCells, depotCells);

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
   resetGame: () => {},
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
