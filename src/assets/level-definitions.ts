import { ChessPieceType, ChessPlayer } from '../lib/chess-piece-types';
import { LevelType, type LevelDefinition } from '../model/LevelManager';
import { SquareControlBoardCellType } from '../model/square-control/square-control-types';

interface SquareControlTemplate {
   board: string;
   depot: { piece: ChessPieceType; available: number }[];
}

const LEVEL_DEFINITIONS: LevelDefinition[] = autoLabel([
   squareControl({
      board: `
         _ 1 _ _
         _ _ _ _
         _ _ _ _
      `,
      depot: [{ piece: ChessPieceType.Queen, available: 1 }],
   }),
   squareControl({
      board: `
         _ _ _ _ _
         _ _ 1 _ _
         _ _ _ _ _
         _ _ 2 _ _
      `,
      depot: [
         { piece: ChessPieceType.Knight, available: 1 },
         { piece: ChessPieceType.Queen, available: 1 },
      ],
   }),
   ...Array.from({ length: 15 }, (_, i) => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: i,
            board: { squareCount: 12, targetCount: 3 },
            pieces: 2,
         },
      };
   }),
   ...Array.from({ length: 15 }, (_, i) => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: i,
            board: { squareCount: 16, targetCount: 3 },
            pieces: 3,
         },
      };
   }),
   ...Array.from({ length: 15 }, (_, i) => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: i,
            board: { squareCount: 25, targetCount: 3 },
            pieces: 4,
         },
      };
   }),
   ...Array.from({ length: 15 }, (_, i) => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: i,
            board: { squareCount: 25, targetCount: 10 },
            pieces: 6,
         },
      };
   }),
]);

export default LEVEL_DEFINITIONS;

function squareControl(template: SquareControlTemplate): Omit<LevelDefinition, 'id' | 'name'> {
   return {
      type: LevelType.SquareControl,
      level: {
         board: template.board
            .trim()
            .split('\n')
            .map((row) => {
               return row
                  .trim()
                  .split(' ')
                  .map((cell) => {
                     if (cell === '_') {
                        return { type: SquareControlBoardCellType.Square };
                     }

                     const expected = Number(cell);

                     if (Number.isInteger(expected)) {
                        return { type: SquareControlBoardCellType.Target, expected };
                     }

                     return { type: SquareControlBoardCellType.Wall };
                  });
            }),
         depot: template.depot.map((cell) => {
            return {
               piece: { type: cell.piece, player: ChessPlayer.Black },
               available: cell.available,
            };
         }),
      },
   };
}

function autoLabel(definitions: Omit<LevelDefinition, 'id' | 'name'>[]): LevelDefinition[] {
   return definitions.map((definition, index) => {
      return {
         id: `sc:${index + 1}`,
         name: `Level ${index + 1}`,
         ...definition,
      };
   });
}
