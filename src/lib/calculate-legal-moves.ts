import { type ChessPiece, ChessPieceType, ChessPlayer } from './chess-piece-types';

interface ChessBoardCell {
   piece?: ChessPiece;
}

export type ChessBoard = (ChessBoardCell | undefined)[][];

export type BoardPosition = { x: number; y: number };

export function calculateLegalMoves(position: BoardPosition, board: ChessBoard): BoardPosition[] {
   if (!isPositionInBounds(position, board)) {
      return [];
   }

   const piece = getCell(board, position)?.piece?.type;

   switch (piece) {
      case ChessPieceType.King:
         return [
            ...calculatePossibleMoves(position, { x: -1, y: -1, maxDistance: 1 }, board),
            ...calculatePossibleMoves(position, { x: -1, y: 0, maxDistance: 1 }, board),
            ...calculatePossibleMoves(position, { x: -1, y: 1, maxDistance: 1 }, board),
            ...calculatePossibleMoves(position, { x: 0, y: -1, maxDistance: 1 }, board),
            ...calculatePossibleMoves(position, { x: 0, y: 1, maxDistance: 1 }, board),
            ...calculatePossibleMoves(position, { x: 1, y: -1, maxDistance: 1 }, board),
            ...calculatePossibleMoves(position, { x: 1, y: 0, maxDistance: 1 }, board),
            ...calculatePossibleMoves(position, { x: 1, y: 1, maxDistance: 1 }, board),
         ];
      case ChessPieceType.Queen:
         return [...calculateRookMoves(position, board), ...calculateBishopMoves(position, board)];
      case ChessPieceType.Rook:
         return calculateRookMoves(position, board);
      case ChessPieceType.Bishop:
         return calculateBishopMoves(position, board);
      case ChessPieceType.Knight:
         return calculateKnightMoves(position, board);
      case ChessPieceType.Pawn:
         return calculatePawnMoves(position, board);
   }

   return [];
}

function calculateRookMoves(position: BoardPosition, board: ChessBoard): BoardPosition[] {
   return [
      ...calculatePossibleMoves(position, { x: -1, y: 0 }, board),
      ...calculatePossibleMoves(position, { x: 1, y: 0 }, board),
      ...calculatePossibleMoves(position, { x: 0, y: -1 }, board),
      ...calculatePossibleMoves(position, { x: 0, y: 1 }, board),
   ];
}

function calculateBishopMoves(position: BoardPosition, board: ChessBoard): BoardPosition[] {
   return [
      ...calculatePossibleMoves(position, { x: -1, y: -1 }, board),
      ...calculatePossibleMoves(position, { x: -1, y: 1 }, board),
      ...calculatePossibleMoves(position, { x: 1, y: -1 }, board),
      ...calculatePossibleMoves(position, { x: 1, y: 1 }, board),
   ];
}

function calculatePawnMoves(position: BoardPosition, board: ChessBoard): BoardPosition[] {
   const moves: BoardPosition[] = [];
   const player = getCell(board, position)?.piece?.player;

   if (player === undefined) {
      return moves;
   }

   const direction = player === ChessPlayer.White ? -1 : 1;
   const forwardPosition = { x: position.x, y: position.y + direction };

   if (isPositionEmpty(forwardPosition, board)) {
      moves.push(forwardPosition);
   }

   const leftDiagonalPosition = { x: position.x - 1, y: position.y + direction };

   if (isPositionOccupiedByOpponent(leftDiagonalPosition, player, board)) {
      moves.push(leftDiagonalPosition);
   }

   const rightDiagonalPosition = { x: position.x + 1, y: position.y + direction };

   if (isPositionOccupiedByOpponent(rightDiagonalPosition, player, board)) {
      moves.push(rightDiagonalPosition);
   }

   return moves;
}

function calculateKnightMoves(position: BoardPosition, board: ChessBoard): BoardPosition[] {
   const moves: BoardPosition[] = [];

   const player = getCell(board, position)?.piece?.player;

   if (player === undefined) {
      return moves;
   }

   for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
         if (Math.abs(x) + Math.abs(y) === 3) {
            const newPosition = { x: position.x + x, y: position.y + y };

            if (isMoveAllowed(player, newPosition, board)) {
               moves.push(newPosition);
            }
         }
      }
   }

   return moves;
}

export function isPositionInBounds(position: BoardPosition, board: ChessBoard): boolean {
   const row = board[position.y];

   return row !== undefined && row[position.x] !== undefined;
}

export function isPositionEmpty(position: BoardPosition, board: ChessBoard): boolean {
   return isPositionInBounds(position, board) && !getCell(board, position)?.piece;
}

export function isPositionOccupiedByOpponent(
   position: BoardPosition,
   player: ChessPlayer,
   board: ChessBoard,
): boolean {
   return (
      isPositionInBounds(position, board) &&
      !isPositionEmpty(position, board) &&
      getCell(board, position)?.piece?.player !== player
   );
}

export function isMoveAllowed(
   player: ChessPlayer,
   target: BoardPosition,
   board: ChessBoard,
): boolean {
   if (!isPositionInBounds(target, board)) {
      return false;
   }

   return isPositionEmpty(target, board) || isPositionOccupiedByOpponent(target, player, board);
}

export function calculatePossibleMoves(
   position: BoardPosition,
   direction: { x: number; y: number; maxDistance?: number },
   board: ChessBoard,
): BoardPosition[] {
   const moves: BoardPosition[] = [];

   const player = getCell(board, position)?.piece?.player;

   if (player === undefined) {
      return moves;
   }

   for (let i = 1; i <= (direction.maxDistance ?? board.length); i++) {
      const newPosition = { x: position.x + i * direction.x, y: position.y + i * direction.y };

      if (isMoveAllowed(player, newPosition, board)) {
         moves.push(newPosition);
      } else {
         break;
      }

      if (!isPositionEmpty(newPosition, board)) {
         break;
      }
   }

   return moves;
}

export function getCell(board: ChessBoard, position: BoardPosition): ChessBoardCell | undefined {
   return isPositionInBounds(position, board) ? board[position.y][position.x] : undefined;
}
