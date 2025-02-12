import { ChessPieceType, type ChessPiece } from '../src/lib/chess-piece-types';
import LEVEL_DEFINITIONS from '../src/assets/level-definitions';
import {
   generateSquareControlLevel,
   isGenerateSquareControlLevelOptions,
} from '../src/model/square-control/generate-square-control-level';
import { SquareControlBoardCellType } from '../src/model/square-control/square-control-types';

LEVEL_DEFINITIONS.forEach((levelDefinition) => {
   const { board, depot } = isGenerateSquareControlLevelOptions(levelDefinition.level)
      ? generateSquareControlLevel(levelDefinition.level)
      : levelDefinition.level;

   const targetCount = board.flat().reduce((memo, cell) => {
      if (cell.type === SquareControlBoardCellType.Target) {
         memo++;
      }

      return memo;
   }, 0);

   const boardWidth = board.reduce((memo, row) => {
      return Math.max(memo, row.length);
   }, 0);

   const depotSummary = depot
      .flatMap(({ piece, available }) => {
         return Array(available).fill(formatPiece(piece));
      })
      .join('');

   console.info(
      `${levelDefinition.name}: ${boardWidth}x${board.length}; t=${targetCount}; ${depotSummary}`,
   );

   console.info(
      board
         .map((row) => {
            return row.map((cell) => {
               if (cell.type === SquareControlBoardCellType.Square && cell.piece) {
                  return formatPiece(cell.piece);
               } else if (cell.type === SquareControlBoardCellType.Target) {
                  return 'T';
               }
               return '_';
            });
         })
         .map((row) => row.join(' '))
         .join('\n') + '\n',
   );
});

function formatPiece(piece: ChessPiece): string {
   switch (piece.type) {
      case ChessPieceType.King:
         return 'K';
      case ChessPieceType.Queen:
         return 'Q';
      case ChessPieceType.Rook:
         return 'R';
      case ChessPieceType.Bishop:
         return 'B';
      case ChessPieceType.Knight:
         return 'K';
      case ChessPieceType.Pawn:
         return 'P';
   }
}
