import { calculateLegalMoves, type ChessBoard } from '@/lib/calculate-legal-moves';
import type { ChessPiece } from '@/lib/chess-piece-types';
import { computed, ref, type Ref } from 'vue';

interface BoardCell {
   piece?: ChessPiece;
   expected?: number;
}

interface DepotCell {
   piece: ChessPiece;
   available: number;
}

interface BaseBoardCellState {
   type: CellType;
   id: string;
   position: { x: number; y: number };
}

interface WallBoardCellState extends BaseBoardCellState {
   type: CellType.BoardWall;
}

interface ChessPieceBoardCellState extends BaseBoardCellState {
   type: CellType.BoardChessPiece;
   piece: Ref<ChessPiece | undefined>;
   isSelected: Ref<boolean>;
   controlledBy: Ref<string[]>;
   isTinted: boolean;
   isHovered: Ref<boolean>;
}

interface ControlTargetBoardCellState extends BaseBoardCellState {
   type: CellType.BoardTargetCell;
   expected: number;
   isSelected: Ref<boolean>;
   controlledBy: Ref<string[]>;
   isTinted: boolean;
}

type BoardCellState = ChessPieceBoardCellState | ControlTargetBoardCellState | WallBoardCellState;

interface DepotCellState {
   type: CellType.Depot;
   id: string;
   piece: ChessPiece;
   available: Ref<number>;
   isSelected: Ref<boolean>;
   isHovered: Ref<boolean>;
}

interface SquareControlBoard {
   height: number;
   width: number;
   boardState: BoardCellState[];
   depotState: DepotCellState[];
   selectedPiece: Ref<ChessPiece | undefined>;
   setSelectedCell: (cellID: string) => void;
   setHoveredCell: (cellID: string | undefined) => void;
   makeMoveOperation: (fromCellID: string, toCellID: string) => (() => void) | undefined;
   clearSelection: () => void;
}

export enum CellType {
   BoardWall = 'board-wall',
   BoardChessPiece = 'board-piece',
   BoardTargetCell = 'board-target',
   Depot = 'depot',
}

const DEPOT_ID_PREFIX = 'd:';

export function makeSquareControlBoard(
   boardCells: (BoardCell | undefined)[][],
   depotCells: DepotCell[],
): SquareControlBoard {
   const selectedCellID = ref<string | undefined>(undefined),
      hoveredCellID = ref<string | undefined>(undefined),
      controlMap: Ref<Record<string, string[]>> = ref({});

   function makeCellID(x: number, y: number): string {
      return `${x}:${y}`;
   }

   const boardState: BoardCellState[] = boardCells.flatMap((row, y) => {
      return row.map((cell, x) => {
         const cellID = makeCellID(x, y);

         if (!cell) {
            return {
               id: cellID,
               type: CellType.BoardWall,
               position: { x, y },
            };
         }

         const base = {
            id: cellID,
            position: { x, y },
            isTinted: !!((x + (y % 2)) % 2),
            isSelected: computed(() => {
               return selectedCellID.value === cellID;
            }),
            controlledBy: computed(() => {
               return controlMap.value[cellID] || [];
            }),
         };

         if (cell.expected === undefined) {
            return {
               ...base,
               type: CellType.BoardChessPiece,
               piece: ref(cell.piece),
               isHovered: computed(() => {
                  return hoveredCellID.value === cellID;
               }),
            };
         }

         return {
            ...base,
            type: CellType.BoardTargetCell,
            expected: cell.expected,
         };
      });
   });

   const depotState: DepotCellState[] = depotCells.map((cell, index) => {
      const cellID = `${DEPOT_ID_PREFIX}${index}`;

      return {
         type: CellType.Depot,
         id: cellID,
         piece: cell.piece,
         available: ref(cell.available),
         isSelected: computed(() => {
            return selectedCellID.value === cellID;
         }),
         isHovered: computed(() => {
            return hoveredCellID.value === cellID;
         }),
      };
   });

   function updateControlMap(): void {
      const twoDimensionalBoard = boardState.reduce((memo, cell) => {
         if (!memo[cell.position.y]) {
            memo[cell.position.y] = [];
         }

         if (cell.type === CellType.BoardWall) {
            memo[cell.position.y][cell.position.x] = undefined;
         } else {
            memo[cell.position.y][cell.position.x] = {
               piece: cell.type === CellType.BoardChessPiece ? cell.piece.value : undefined,
            };
         }

         return memo;
      }, [] as ChessBoard);

      controlMap.value = boardState.reduce(
         (memo, cell) => {
            if (cell.type === CellType.BoardChessPiece && cell.piece.value) {
               const moves = calculateLegalMoves(cell.position, twoDimensionalBoard);

               moves.forEach((move) => {
                  const targetCellID = makeCellID(move.x, move.y);

                  if (!memo[targetCellID]) {
                     memo[targetCellID] = [];
                  }

                  memo[targetCellID].push(cell.id);
               });
            }

            return memo;
         },
         {} as Record<string, string[]>,
      );
   }

   updateControlMap();

   return {
      height: boardCells.length,
      width: boardCells[0].length,
      boardState,
      depotState,
      selectedPiece: computed(() => {
         if (selectedCellID.value === undefined) {
            return undefined;
         }

         const cell = findCell(boardState, depotState, selectedCellID.value);

         if (cell?.type === CellType.BoardChessPiece) {
            return cell.piece.value;
         }

         if (cell?.type === CellType.Depot) {
            return cell.piece;
         }

         return undefined;
      }),
      setSelectedCell: (cellID: string) => {
         if (cellID.startsWith(DEPOT_ID_PREFIX)) {
            const depotCell = findDepotCell(depotState, cellID);

            if (!depotCell || depotCell.available.value === 0) {
               selectedCellID.value = undefined;
               return;
            }
         } else {
            const boardCell = findBoardCell(boardState, cellID);

            if (
               !boardCell ||
               (boardCell.type === CellType.BoardChessPiece && !boardCell.piece.value)
            ) {
               selectedCellID.value = undefined;
               return;
            }
         }

         selectedCellID.value = cellID;
      },
      setHoveredCell: (cellID: string | undefined) => {
         if (cellID === undefined) {
            hoveredCellID.value = undefined;
            return;
         }

         if (cellID.startsWith(DEPOT_ID_PREFIX)) {
            if (!findDepotCell(depotState, cellID)) {
               hoveredCellID.value = undefined;
               return;
            }
         } else {
            const boardCell = findBoardCell(boardState, cellID);

            if (
               !boardCell ||
               (boardCell.type === CellType.BoardChessPiece &&
                  boardCell.piece.value &&
                  cellID !== selectedCellID.value)
            ) {
               hoveredCellID.value = undefined;
               return;
            }
         }

         hoveredCellID.value = cellID;
      },
      makeMoveOperation: (fromCellID: string, toCellID: string) => {
         const sourceCell = findCell(boardState, depotState, fromCellID);
         const targetCell = findCell(boardState, depotState, toCellID);

         if (!sourceCell || !targetCell) {
            return;
         }

         if (sourceCell.type === CellType.Depot && targetCell.type === CellType.Depot) {
            return; // never allowed
         }

         if (
            sourceCell.type === CellType.BoardTargetCell ||
            targetCell.type === CellType.BoardTargetCell
         ) {
            return; // never allowed
         }

         if (sourceCell.type === CellType.Depot && targetCell.type === CellType.BoardChessPiece) {
            if (sourceCell.available.value <= 0 || targetCell.piece.value) {
               return;
            }

            return () => {
               sourceCell.available.value -= 1;
               targetCell.piece.value = sourceCell.piece;
               updateControlMap();
            };
         }

         if (sourceCell.type === CellType.BoardChessPiece && targetCell.type === CellType.Depot) {
            if (targetCell.piece.type !== sourceCell.piece.value?.type) {
               return;
            }

            return () => {
               targetCell.available.value += 1;
               sourceCell.piece.value = undefined;
               updateControlMap();
            };
         }

         if (
            sourceCell.type === CellType.BoardChessPiece &&
            targetCell.type === CellType.BoardChessPiece
         ) {
            if (targetCell.piece.value) {
               return;
            }

            return () => {
               targetCell.piece.value = sourceCell.piece.value;
               sourceCell.piece.value = undefined;
               updateControlMap();
            };
         }

         throw new Error(
            `Invalid move from ${fromCellID} (${sourceCell.type}) to ${toCellID} (${targetCell.type})`,
         );
      },
      clearSelection: () => {
         selectedCellID.value = undefined;
         hoveredCellID.value = undefined;
      },
   };
}

function findCell(
   boardState: BoardCellState[],
   depotState: DepotCellState[],
   cellID: string,
): DepotCellState | BoardCellState | undefined {
   return cellID.startsWith(DEPOT_ID_PREFIX)
      ? findDepotCell(depotState, cellID)
      : findBoardCell(boardState, cellID);
}

function findBoardCell(boardState: BoardCellState[], cellID: string): BoardCellState | undefined {
   return boardState.find((cell) => {
      return cell.id === cellID;
   });
}

function findDepotCell(depotState: DepotCellState[], cellID: string): DepotCellState | undefined {
   return depotState.find((cell) => {
      return cell.id === cellID;
   });
}
