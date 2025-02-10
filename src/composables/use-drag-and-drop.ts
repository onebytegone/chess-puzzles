import { useEventListener } from '@vueuse/core';
import { ref, type Ref } from 'vue';

export interface DragAndDropComposableProps {
   onDrop: (itemID: string, dropZoneID: string) => boolean;
}

export interface DragAndDropComposable {
   selectedItemID: Ref<string | undefined>;
   hoveredDropZoneID: Ref<string | undefined>;
   hoverPosition: Ref<{ x: number; y: number } | undefined>;
}

function getElement(event: MouseEvent | TouchEvent, selector: string): HTMLElement | undefined {
   let eventTarget = event.target;

   if (event instanceof TouchEvent) {
      const touch = event.changedTouches[0];
      eventTarget = document.elementFromPoint(touch.clientX, touch.clientY);
   }

   if (eventTarget instanceof HTMLElement) {
      return eventTarget.closest<HTMLElement>(selector) || undefined;
   }

   return undefined;
}

function getDraggableItemID(event: MouseEvent | TouchEvent): string | undefined {
   return getElement(event, '[data-draggable-item-id]')?.dataset.draggableItemId;
}

function getDraggableDropZoneID(event: MouseEvent | TouchEvent): string | undefined {
   return getElement(event, '[data-drop-zone-id]')?.dataset.dropZoneId;
}

export function useDragAndDrop(props: DragAndDropComposableProps): DragAndDropComposable {
   const selectedItemID = ref<string | undefined>(undefined),
      hoveredDropZoneID = ref<string | undefined>(undefined),
      hoverPosition = ref<{ x: number; y: number } | undefined>(undefined),
      wasAlreadySelected = ref(false);

   function clearSelection() {
      selectedItemID.value = undefined;
      hoveredDropZoneID.value = undefined;
      hoverPosition.value = undefined;
   }

   function updateHoverPosition(event: MouseEvent | TouchEvent) {
      if (event instanceof MouseEvent) {
         hoverPosition.value = { x: event.clientY, y: event.clientX };
      } else if (event instanceof TouchEvent) {
         const touch = event.touches[0];
         hoverPosition.value = { x: touch.clientY, y: touch.clientX };
      }
   }

   function startInteraction(event: MouseEvent | TouchEvent) {
      const itemID = getDraggableItemID(event),
         dropZoneID = getDraggableDropZoneID(event);

      if (itemID === undefined && (dropZoneID === undefined || !selectedItemID.value)) {
         clearSelection();
         return;
      }

      wasAlreadySelected.value = itemID === selectedItemID.value;

      if (selectedItemID.value && dropZoneID && !wasAlreadySelected.value) {
         props.onDrop(selectedItemID.value, dropZoneID);
         clearSelection();
         return;
      }

      selectedItemID.value = itemID;
      hoveredDropZoneID.value = dropZoneID;
      updateHoverPosition(event);
   }

   useEventListener('mousedown', startInteraction);
   useEventListener('touchstart', startInteraction);

   function updateHoveredDropZone(event: MouseEvent | TouchEvent) {
      if (!selectedItemID.value || (event instanceof MouseEvent && !event.buttons)) {
         return;
      }

      updateHoverPosition(event);
      hoveredDropZoneID.value = getDraggableDropZoneID(event);
   }
   useEventListener('touchmove', updateHoveredDropZone);
   useEventListener('mousemove', updateHoveredDropZone);

   function endInteraction(event: MouseEvent | TouchEvent) {
      if (!selectedItemID.value) {
         return;
      }
      event.preventDefault();

      const dropZoneID = getDraggableDropZoneID(event);

      const shouldClearSelection = dropZoneID
         ? props.onDrop(selectedItemID.value, dropZoneID)
         : false;

      if (shouldClearSelection || wasAlreadySelected.value) {
         clearSelection();
      } else {
         hoveredDropZoneID.value = undefined;
         hoverPosition.value = undefined;
      }
   }

   useEventListener('mouseup', endInteraction);
   useEventListener('touchend', endInteraction);

   return { selectedItemID, hoveredDropZoneID, hoverPosition };
}
