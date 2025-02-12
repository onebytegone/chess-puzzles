<template>
   <div class="squareControl" :class="{ isDragging: hoverPosition, touchDrag: isTouchDrag }">
      <div ref="chessBoard" class="chessBoard">
         <template v-for="cell in manager.boardCells.flat()" :key="cell.id">
            <ChessSquare
               v-if="cell.type === SquareControlBoardCellType.Square"
               :cellID="cell.id"
               :data-draggable-item-id="cell.piece.value ? cell.id : undefined"
               :data-drop-zone-id="!cell.piece.value || cell.isSelected.value ? cell.id : undefined"
               :isSelected="cell.isSelected.value"
               :isHovered="cell.id === hoveredDropZoneID"
               :isTinted="cell.isTinted"
               :isControlled="cell.isControlled.value"
               :piece="
                  cell.id === manager.selectedCellID.value && hoverPosition
                     ? undefined
                     : cell.piece.value
               "
            />
            <TargetSquare
               v-else-if="cell.type === SquareControlBoardCellType.Target"
               :cellID="cell.id"
               :expectedControlCount="cell.expected"
               :actualControlCount="cell.actual.value"
               :isSelected="cell.isSelected.value"
               :isTinted="cell.isTinted"
               :isControlled="cell.isControlled.value"
               :data-draggable-item-id="cell.id"
            />
            <WallSquare v-else :cellID="cell.id" />
         </template>
         <div
            class="floatingPiece"
            v-if="manager.selectedPiece.value && hoverPosition"
            :style="{ top: hoverPosition.x + 'px', left: hoverPosition.y + 'px' }"
         >
            <ChessPieceIcon :piece="manager.selectedPiece.value" />
         </div>
      </div>

      <div class="pieceDepot">
         <PieceDepotCell
            v-for="cell in manager.depotCells"
            :key="cell.id"
            :data-draggable-item-id="cell.available.value > 0 ? cell.id : undefined"
            :data-drop-zone-id="cell.id"
            :piece="cell.piece"
            :available="cell.available.value"
            :isSelected="cell.isSelected.value"
            :isHovered="cell.id === hoveredDropZoneID"
         />
      </div>
   </div>
</template>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import ChessSquare from './ChessSquare.vue';
import PieceDepotCell from './PieceDepotCell.vue';
import ChessPieceIcon from './ChessPieceIcon.vue';
import TargetSquare from './TargetSquare.vue';
import WallSquare from './WallSquare.vue';
import { SquareControlManager } from '../model/square-control/SquareControlManager';
import { useDragAndDrop } from '../composables/use-drag-and-drop';
import {
   SquareControlBoardCellType,
   type SquareControlLevel,
} from '../model/square-control/square-control-types';

const chessBoard = useTemplateRef<HTMLElement>('chessBoard');

const props = defineProps<{
   level: SquareControlLevel;
}>();

const manager = new SquareControlManager(props.level);

const { selectedItemID, hoveredDropZoneID, hoverPosition, isTouchDrag } = useDragAndDrop({
   onDrop: (sourceCellID, targetCellID) => {
      return manager.movePiece(sourceCellID, targetCellID);
   },
});

watch([manager.percentSolved, manager.piecesLeft], ([percentSolved, piecesLeft]) => {
   if (percentSolved === 1 && piecesLeft === 0) {
      emit('completed');
   }
});

watch(selectedItemID, (cellID) => {
   if (cellID === undefined) {
      manager.clearSelection();
   } else {
      manager.selectedCell(cellID);
   }
});

defineExpose({
   resetGame: () => {
      window.location.reload();
   },
});

const emit = defineEmits<{
   completed: [];
}>();
</script>

<style lang="scss" scoped>
.squareControl {
   user-select: none;
   -webkit-user-select: none;
   width: 90vw;
   flex-grow: 1;
   display: flex;
   flex-direction: column;
   align-items: center;
   margin: 0 auto;
}

.isDragging {
   cursor: grabbing;
}

.chessBoard {
   width: 100%;
   user-select: none;
   display: grid;
   grid-template-columns: repeat(v-bind('manager.width'), 1fr);
}

.floatingPiece {
   position: fixed;
   pointer-events: none;
   z-index: 1000;
   width: 16vw;
   height: 16vw;
   margin-top: -8vw;
   margin-left: -8vw;
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
   height: 15vw;
}

@media screen and (min-width: 600px) {
   .squareControl {
      width: 540px;
      font-size: 1.5em;
   }

   .pieceDepot {
      height: 90px;
   }

   .floatingPiece {
      height: 90px;
      width: 90px;
      margin-top: -45px;
      margin-left: -45px;
   }
}
</style>
