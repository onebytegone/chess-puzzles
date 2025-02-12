import type { ChessPiece } from '../../lib/chess-piece-types';
import type { Ref } from 'vue';

export enum SquareControlBoardCellType {
   Wall = 'wall',
   Square = 'square',
   Target = 'target',
}

export interface SquareControlLevel {
   board: BoardCell[][];
   depot: DepotCell[];
}

export interface BoardSquareCell {
   type: SquareControlBoardCellType.Square;
   piece?: ChessPiece;
}

export interface BoardWallCell {
   type: SquareControlBoardCellType.Wall;
}

export interface BoardTargetCell {
   type: SquareControlBoardCellType.Target;
   expected: number;
}

export type BoardCell = BoardSquareCell | BoardWallCell | BoardTargetCell;

export interface DepotCell {
   piece: ChessPiece;
   available: number;
}

interface BaseBoardCellState<T extends SquareControlBoardCellType> {
   type: T;
   id: string;
   position: { x: number; y: number };
}

export interface BoardSquareCellState
   extends BaseBoardCellState<SquareControlBoardCellType.Square> {
   piece: Ref<ChessPiece | undefined>;
   isSelected: Ref<boolean>;
   isControlled: Ref<boolean>;
   isTinted: boolean;
}

export interface BoardTargetCellState
   extends BaseBoardCellState<SquareControlBoardCellType.Target> {
   expected: number;
   actual: Ref<number>;
   isSelected: Ref<boolean>;
   isControlled: Ref<boolean>;
   isTinted: boolean;
}

export type BoardWallCellState = BaseBoardCellState<SquareControlBoardCellType.Wall>;

export type BoardCellState = BoardSquareCellState | BoardTargetCellState | BoardWallCellState;

export interface DepotCellState {
   id: string;
   piece: ChessPiece;
   available: Ref<number>;
   isSelected: Ref<boolean>;
}

export const DEPOT_ID_PREFIX = 'd:';

export function makeBoardCellID(x: number, y: number): string {
   return `${x}:${y}`;
}

export function makeDepotCellID(index: number): string {
   return `${DEPOT_ID_PREFIX}${index}`;
}

export function isDepotCellID(cellID: string): boolean {
   return cellID.startsWith(DEPOT_ID_PREFIX);
}

export function isDepotCellState(o: { id: string }): o is DepotCellState {
   return isDepotCellID(o.id);
}

export function isSquareCellState(o: DepotCellState | BoardCellState): o is BoardSquareCellState {
   return !isDepotCellState(o) && o.type === SquareControlBoardCellType.Square;
}

export function isCellTinted(x: number, y: number): boolean {
   return !!((x + (y % 2)) % 2);
}
