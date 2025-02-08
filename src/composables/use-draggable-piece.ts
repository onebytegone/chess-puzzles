import { useEventListener } from '@vueuse/core';
import { ref, type Ref } from 'vue';

export interface DraggablePieceComposableProps {
   canMoveToCell: (sourceCellID: string, targetCellID: string) => boolean;
   onPieceMove: (sourceCellID: string, targetCellID: string) => void;
}

export interface DraggablePieceComposable {
   selectedCellID: Ref<string | undefined>;
   isDragging: Ref<boolean>;
   hoveredCellID: Ref<string | undefined>;
   hoverPosition: Ref<{ x: number; y: number }>;
}

export function useDraggablePiece(props: DraggablePieceComposableProps): DraggablePieceComposable {
   const selectedCellID = ref<string | undefined>(undefined),
      wasAlreadySelected = ref(false),
      hoveredCellID = ref<string | undefined>(undefined),
      hoverPosition = ref({ x: 0, y: 0 }),
      isDragging = ref(false);

   function getCellElement(event: MouseEvent | TouchEvent) {
      let eventTarget = event.target;

      if (event instanceof TouchEvent) {
         const touch = event.changedTouches[0];

         eventTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      }

      if (eventTarget instanceof HTMLElement) {
         return eventTarget.closest<HTMLElement>('.draggablePieceCell');
      }

      return undefined;
   }

   function getTargetCellID(event: MouseEvent | TouchEvent) {
      const el = getCellElement(event);

      return el?.dataset.draggablePieceCellId;
   }

   function clearSelection() {
      selectedCellID.value = undefined;
      hoveredCellID.value = undefined;
      isDragging.value = false;
   }

   function canMoveToCell(sourceCellID: string, targetCellID: string) {
      return sourceCellID !== targetCellID && props.canMoveToCell(sourceCellID, targetCellID);
   }

   function startInteraction(event: MouseEvent | TouchEvent) {
      const el = getCellElement(event),
         cellID = el?.dataset.draggablePieceCellId,
         hasDraggablePiece = el?.classList.contains('hasDraggablePiece');

      if (cellID === undefined || (!selectedCellID.value && !hasDraggablePiece)) {
         clearSelection();
         return;
      }

      if (selectedCellID.value && canMoveToCell(selectedCellID.value, cellID)) {
         props.onPieceMove(selectedCellID.value, cellID);
         clearSelection();
         return;
      }

      wasAlreadySelected.value = cellID === selectedCellID.value;
      selectedCellID.value = cellID;
      hoveredCellID.value = cellID;
      isDragging.value = true;
      updateHoverPosition(event);
   }

   useEventListener('mousedown', startInteraction);
   useEventListener('touchstart', startInteraction);

   function updateHoverPosition(event: MouseEvent | TouchEvent) {
      if (event instanceof MouseEvent) {
         hoverPosition.value = { x: event.clientY, y: event.clientX };
      } else if (event instanceof TouchEvent) {
         const touch = event.touches[0];
         hoverPosition.value = { x: touch.clientY, y: touch.clientX };
      }
   }

   function updateHoveredCell(event: MouseEvent | TouchEvent) {
      if (!selectedCellID.value || (event instanceof MouseEvent && !event.buttons)) {
         return;
      }

      updateHoverPosition(event);
      hoveredCellID.value = getTargetCellID(event);
   }

   useEventListener('touchmove', updateHoveredCell);
   useEventListener('mousemove', updateHoveredCell);

   function endInteraction(event: MouseEvent | TouchEvent) {
      if (!selectedCellID.value) {
         return;
      }

      event.preventDefault();

      const targetCellID = getTargetCellID(event);

      if (targetCellID && canMoveToCell(selectedCellID.value, targetCellID)) {
         props.onPieceMove(selectedCellID.value, targetCellID);
      }

      if (wasAlreadySelected.value || selectedCellID.value !== targetCellID) {
         clearSelection();
      }

      hoveredCellID.value = undefined;
      isDragging.value = false;
   }

   useEventListener('mouseup', endInteraction);
   useEventListener('touchend', endInteraction);

   return { selectedCellID, hoveredCellID, hoverPosition, isDragging };
}
