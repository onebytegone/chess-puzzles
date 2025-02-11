import { ChessPieceType, ChessPlayer, type ChessPiece } from '../../lib/chess-piece-types';
import { makePRNG, type PRNG } from '../../lib/make-prng';
import { calculateLegalMoves } from '../../lib/calculate-legal-moves';
import {
   SquareControlBoardCellType,
   type BoardCell,
   type DepotCell,
   type SquareControlLevel,
} from './square-control-types';

export interface GenerateSquareControlLevelOptions {
   seed: number;
   board?: { squareCount?: number; targetCount?: number };
   pieces?: number;
}

export function isGenerateSquareControlLevelOptions(
   o: unknown,
): o is GenerateSquareControlLevelOptions {
   return (
      o !== null &&
      typeof o === 'object' &&
      typeof (o as GenerateSquareControlLevelOptions).seed === 'number'
   );
}

export function generateSquareControlLevel(
   opts: GenerateSquareControlLevelOptions,
): SquareControlLevel {
   const prng = makePRNG(opts.seed),
      boardProps = generateBoardProps(prng, opts),
      depot = generateDepot(prng, boardProps.pieces);

   return {
      board: generateBoard(
         prng,
         boardProps,
         depot.flatMap((cell) => {
            return new Array(cell.available).fill(cell.piece);
         }),
      ),
      depot,
   };
}

function generateBoardProps(
   prng: PRNG,
   opts: GenerateSquareControlLevelOptions,
): {
   width: number;
   height: number;
   targetCount: number | undefined;
   pieces: number;
} {
   const squareCount = generateValue(prng, opts.board?.squareCount, 16, 36),
      pieceCount = generateValue(prng, opts.pieces, 5, 12),
      boardWidth = Math.ceil(Math.sqrt(squareCount)),
      boardHeight = Math.ceil(squareCount / boardWidth);

   return {
      width: boardWidth,
      height: boardHeight,
      targetCount: opts.board?.targetCount,
      pieces: pieceCount,
   };
}

function generateDepot(prng: PRNG, totalPieceCount: number): DepotCell[] {
   const allPieceTypes = Object.values(ChessPieceType),
      numberOfTypes = prng.inRange(1, Math.min(allPieceTypes.length, totalPieceCount)),
      pieceTypes = prng.randomElements(allPieceTypes, numberOfTypes);

   const depots = Array(totalPieceCount)
      .fill(undefined)
      .map(() => {
         return prng.randomElement(pieceTypes);
      })
      .reduce(
         (memo, type) => {
            if (!memo[type]) {
               memo[type] = {
                  piece: {
                     type,
                     player: ChessPlayer.Black,
                  },
                  available: 0,
               };
            }

            memo[type].available += 1;

            return memo;
         },
         {} as Record<string, DepotCell>,
      );

   return Object.values(depots);
}

function generateBoard(
   prng: PRNG,
   boardProps: { width: number; height: number; targetCount: number | undefined },
   pieces: ChessPiece[],
): BoardCell[][] {
   const cells = prng.randomElements(
      generateCellCoordinates(boardProps.width, boardProps.height),
      pieces.length,
   );

   const board: { piece?: ChessPiece; expected?: number }[][] = new Array(boardProps.height)
      .fill(undefined)
      .map(() => {
         return new Array(boardProps.width).fill(undefined).map(() => {
            return {};
         });
      });

   cells.forEach(({ x, y }) => {
      board[y][x].piece = pieces.splice(prng.inRange(0, pieces.length - 1), 1)[0];
   });

   cells.forEach(({ x, y }) => {
      const moves = calculateLegalMoves({ x, y }, board);

      moves.forEach((move) => {
         board[move.y][move.x].expected = (board[move.y][move.x].expected || 0) + 1;
      });
   });

   if (boardProps.targetCount) {
      const targets = board
         .flatMap((row, y) => {
            return row.map(({ expected }, x) => {
               return expected ? { x, y } : undefined;
            });
         })
         .filter((cell) => {
            return !!cell;
         });

      const targetCellToRemove = prng.randomElements(
         targets,
         targets.length - boardProps.targetCount,
      );

      targetCellToRemove.forEach(({ x, y }) => {
         delete board[y][x].expected;
      });
   }

   return board.map((row) => {
      return row.map(({ piece, expected }) => {
         if (!piece && expected) {
            return {
               type: SquareControlBoardCellType.Target,
               expected,
            };
         }

         return {
            type: SquareControlBoardCellType.Square,
         };
      });
   });
}

function generateValue(prng: PRNG, override: number | undefined, min: number, max: number): number {
   return override !== undefined ? override : prng.inRange(min, max);
}

function generateCellCoordinates(width: number, height: number): { x: number; y: number }[] {
   return new Array(width * height).fill(null).map((_, i) => {
      return {
         x: i % width,
         y: Math.floor(i / width),
      };
   });
}
