import { calculateLegalMoves } from '@/lib/calculate-legal-moves';
import { computed, ref, type Ref } from 'vue';
import {
   DEPOT_ID_PREFIX,
   isCellTinted,
   isDepotCellState,
   isSquareCellState,
   makeBoardCellID,
   makeDepotCellID,
   SquareControlBoardCellType,
   type BoardCellState,
   type DepotCellState,
   type SquareControlLevel,
} from './square-control-types';
import type { ChessPiece } from '@/lib/chess-piece-types';

export class SquareControlManager {
   public readonly height: number;
   public readonly width: number;
   public readonly boardCells: BoardCellState[][];
   public readonly depotCells: DepotCellState[];
   public readonly selectedPiece: Ref<ChessPiece | undefined>;
   public readonly selectedCellID: Ref<string | undefined>;
   public readonly percentSolved: Ref<number>;
   public readonly piecesLeft: Ref<number>;

   private readonly _controlMap: Ref<Record<string, string[]>> = ref({});

   public constructor(level: SquareControlLevel) {
      this.boardCells = level.board.map((row, y) => {
         return row.map((cell, x): BoardCellState => {
            const id = makeBoardCellID(x, y);
            if (cell.type === SquareControlBoardCellType.Wall) {
               return {
                  id,
                  position: { x, y },
                  type: SquareControlBoardCellType.Wall,
               };
            }

            if (cell.type === SquareControlBoardCellType.Square) {
               return {
                  id,
                  position: { x, y },
                  type: SquareControlBoardCellType.Square,
                  isTinted: isCellTinted(x, y),
                  piece: ref(cell.piece),
                  isSelected: computed(() => {
                     return this.selectedCellID.value === id;
                  }),
                  isControlled: computed(() => {
                     const controlMap = this._controlMap.value,
                        controlledBy = controlMap[id] || [],
                        selectedCellID = this.selectedCellID.value;

                     if (selectedCellID && !this.selectedPiece.value) {
                        return (controlMap[selectedCellID] || []).includes(id);
                     }

                     return selectedCellID ? controlledBy.includes(selectedCellID) : false;
                  }),
               };
            }

            if (cell.type === SquareControlBoardCellType.Target) {
               return {
                  id,
                  position: { x, y },
                  type: SquareControlBoardCellType.Target,
                  isTinted: isCellTinted(x, y),
                  expected: cell.expected,
                  actual: computed(() => {
                     return (this._controlMap.value[id] || []).length;
                  }),
                  isSelected: computed(() => {
                     return this.selectedCellID.value === id;
                  }),
                  isControlled: computed(() => {
                     const controlledBy = this._controlMap.value[id] || [],
                        selectedCell = this.selectedCellID.value;

                     return selectedCell ? controlledBy.includes(selectedCell) : false;
                  }),
               };
            }

            throw new Error(`Unknown cell: ${cell}`);
         });
      });

      this.depotCells = level.depot.map((cell, index) => {
         const id = makeDepotCellID(index);

         return {
            id,
            piece: cell.piece,
            available: ref(cell.available),
            isSelected: computed(() => {
               return this.selectedCellID.value === id;
            }),
         };
      });

      this.height = this.boardCells.length;
      this.width = Math.max(0, ...this.boardCells.map((row) => row.length));
      this.selectedCellID = ref(undefined);
      this.selectedPiece = ref(undefined);
      this.percentSolved = computed(() => {
         const { total, solved } = level.board.reduce(
            (rowMemo, row, y) => {
               return row.reduce((memo, cell, x) => {
                  if (cell.type === SquareControlBoardCellType.Target) {
                     const isSolved =
                        (this._controlMap.value[makeBoardCellID(x, y)] || []).length ===
                        cell.expected;

                     memo.total += 1;
                     memo.solved += isSolved ? 1 : 0;
                  }

                  return memo;
               }, rowMemo);
            },
            { total: 0, solved: 0 },
         );

         return total === 0 ? 0 : solved / total;
      });

      this.piecesLeft = computed(() => {
         return this.depotCells.reduce((memo, cell) => {
            return memo + cell.available.value;
         }, 0);
      });
   }

   public selectedCell(cellID: string): void {
      const cell = this._findCell(cellID);

      if (!cell) {
         this.selectedCellID.value = undefined;
         this.selectedPiece.value = undefined;
      } else if (isDepotCellState(cell)) {
         this.selectedCellID.value = cell.available.value > 0 ? cell.id : undefined;
         this.selectedPiece.value = cell.piece;
      } else if (cell.type === SquareControlBoardCellType.Target) {
         this.selectedCellID.value = cell.id;
         this.selectedPiece.value = undefined;
      } else if (cell.type === SquareControlBoardCellType.Square) {
         this.selectedCellID.value = cell.id;
         this.selectedPiece.value = cell.piece.value;
      }
   }

   public clearSelection(): void {
      this.selectedCellID.value = undefined;
      this.selectedPiece.value = undefined;
   }

   public movePiece(fromCellID: string, toCellID: string): boolean {
      const fromCell = this._findCell(fromCellID);
      const toCell = this._findCell(toCellID);

      if (!fromCell || !toCell) {
         return false;
      }

      if (isDepotCellState(fromCell) && isDepotCellState(toCell)) {
         return false;
      }

      if (isDepotCellState(fromCell) && isSquareCellState(toCell)) {
         if (fromCell.available.value <= 0 || toCell.piece.value) {
            return false;
         }

         fromCell.available.value -= 1;
         toCell.piece.value = fromCell.piece;
         this._updateControlMap();
         return true;
      }

      if (isSquareCellState(fromCell) && isDepotCellState(toCell)) {
         if (fromCell.piece.value?.type !== toCell.piece.type) {
            return false;
         }

         fromCell.piece.value = undefined;
         toCell.available.value += 1;
         this._updateControlMap();
         return true;
      }

      if (isSquareCellState(fromCell) && isSquareCellState(toCell)) {
         if (toCell.piece.value) {
            return false;
         }

         toCell.piece.value = fromCell.piece.value;
         fromCell.piece.value = undefined;
         this._updateControlMap();
         return true;
      }

      return false;
   }

   public reset(): void {}

   private _findCell(cellID: string): DepotCellState | BoardCellState | undefined {
      if (cellID.startsWith(DEPOT_ID_PREFIX)) {
         return this.depotCells.find((cell) => cell.id === cellID);
      }

      return this.boardCells.flat().find((cell) => cell.id === cellID);
   }

   private _updateControlMap(): void {
      const pieceMap = this.boardCells.map((row) => {
         return row.map((cell) => {
            return {
               piece:
                  cell.type === SquareControlBoardCellType.Square ? cell.piece.value : undefined,
            };
         });
      });

      this._controlMap.value = this.boardCells.flat().reduce(
         (memo, cell) => {
            const moves = calculateLegalMoves(cell.position, pieceMap);

            moves.forEach((move) => {
               const targetCellID = makeBoardCellID(move.x, move.y);

               if (!memo[targetCellID]) {
                  memo[targetCellID] = [];
               }

               memo[targetCellID].push(cell.id);
            });

            return memo;
         },
         {} as Record<string, string[]>,
      );
   }
}
