import { ChessPieceType, ChessPlayer } from '../lib/chess-piece-types';
import { LevelType, type LevelDefinition } from '../model/LevelManager';
import { SquareControlBoardCellType } from '../model/square-control/square-control-types';

interface SquareControlTemplate {
   board: string;
   depot: { piece: ChessPieceType; available: number }[];
}

const ALL_BUT_PAWN = [
   ChessPieceType.Knight,
   ChessPieceType.Queen,
   ChessPieceType.Bishop,
   ChessPieceType.King,
   ChessPieceType.Rook,
];

let seedMemo = 0;

const LEVEL_DEFINITIONS: LevelDefinition[] = autoLabel([
   squareControl({
      // Piece Intro: king
      board: `
         _ _ _ _ _
         _ 1 1 1 _
         _ 1 _ 1 _
         _ 1 1 1 _
         _ _ _ _ _
      `,
      depot: [{ piece: ChessPieceType.King, available: 1 }],
   }),

   squareControl({
      // multiple pieces
      board: `
         _ _ _ _ _
         _ 1 1 1 _
         _ 1 _ 2 _
         _ 1 2 _ 1
         _ _ 1 1 1
      `,
      depot: [{ piece: ChessPieceType.King, available: 2 }],
   }),

   ...Array.from({ length: 5 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 16, targetCount: 5 },
            pieces: { count: 3, types: [ChessPieceType.King] },
         },
      };
   }),

   squareControl({
      // zero targets
      board: `
         _ _ _ _ _
         _ 1 1 0 _
         _ 0 _ 0 _
         _ 1 1 1 _
         _ _ _ _ _
      `,
      depot: [{ piece: ChessPieceType.King, available: 2 }],
   }),

   ...Array.from({ length: 5 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.5 },
            pieces: { count: 3, types: [ChessPieceType.King] },
         },
      };
   }),

   squareControl({
      // Piece Intro: rook
      board: `
         _ _ 1 _ _
         _ 0 1 0 _
         1 1 _ 1 1
         _ 0 1 0 _
         _ _ 1 _ _
      `,
      depot: [{ piece: ChessPieceType.Rook, available: 1 }],
   }),

   squareControl({
      // piece blocks piece
      board: `
         _ _ _ 1 _
         _ _ _ 1 _
         1 _ 2 _ 1
         _ 1 _ _ _
         _ 1 _ _ _
      `,
      depot: [{ piece: ChessPieceType.Rook, available: 2 }],
   }),

   squareControl({
      // piece blocks piece
      board: `
         _ _ _ _ 0
         0 _ _ _ _
         1 _ _ _ 1
         _ _ _ _ 0
         0 _ _ _ _
      `,
      depot: [{ piece: ChessPieceType.Rook, available: 2 }],
   }),

   ...Array.from({ length: 5 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.7 },
            pieces: { count: 3, types: [ChessPieceType.Rook] },
         },
      };
   }),

   squareControl({
      // bishop
      board: `
         1 _ _ _ 1
         _ 1 0 1 _
         _ 0 _ 0 _
         _ 1 0 1 _
         1 _ _ _ 1
      `,
      depot: [{ piece: ChessPieceType.Bishop, available: 1 }],
   }),

   ...Array.from({ length: 3 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.5 },
            pieces: { count: 3, types: [ChessPieceType.Bishop] },
         },
      };
   }),

   squareControl({
      // queen
      board: `
         1 _ 1 _ 1
         _ 1 1 1 _
         1 1 _ 1 1
         _ 1 1 1 _
         1 _ 1 _ 1
      `,
      depot: [{ piece: ChessPieceType.Queen, available: 1 }],
   }),

   squareControl({
      // king and queen
      board: `
         1 1 1 _ _
         1 _ 1 1 1
         1 1 1 _ _
         _ 1 _ 2 1
         _ 1 _ 1 _
      `,
      depot: [
         { piece: ChessPieceType.King, available: 1 },
         { piece: ChessPieceType.Queen, available: 1 },
      ],
   }),

   ...Array.from({ length: 3 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 3, zeroTargetPercentage: 0.7 },
            pieces: { count: 1, types: [ChessPieceType.Queen] },
         },
      };
   }),

   ...Array.from({ length: 3 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 3, zeroTargetPercentage: 1 },
            pieces: { count: 2, types: [ChessPieceType.Queen] },
         },
      };
   }),

   ...Array.from({ length: 4 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 3, zeroTargetPercentage: 1 },
            pieces: { count: 2, types: [ChessPieceType.King, ChessPieceType.Queen] },
         },
      };
   }),

   squareControl({
      // knight
      board: `
         _ 1 _ 1 _
         1 _ _ _ 1
         _ _ _ _ _
         1 _ _ _ 1
         _ 1 _ 1 _
      `,
      depot: [{ piece: ChessPieceType.Knight, available: 1 }],
   }),

   ...Array.from({ length: 3 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.5 },
            pieces: { count: 2, types: [ChessPieceType.Knight] },
         },
      };
   }),

   ...Array.from({ length: 3 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.5 },
            pieces: { count: 3, types: [ChessPieceType.Knight] },
         },
      };
   }),

   ...Array.from({ length: 10 }, () => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.7 },
            pieces: {
               count: 3,
               types: [ChessPieceType.Bishop, ChessPieceType.Queen, ChessPieceType.Rook],
            },
         },
      };
   }),

   ...Array.from({ length: 20 }, (_, i) => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.7 },
            pieces: {
               count: 3,
               types: pickFromList(i, [
                  [ChessPieceType.Bishop, ChessPieceType.King],
                  [ChessPieceType.Knight, ChessPieceType.King],
                  [ChessPieceType.Bishop, ChessPieceType.Rook],
                  [ChessPieceType.Bishop, ChessPieceType.Queen],
               ]),
            },
         },
      };
   }),

   ...Array.from({ length: 50 }, (_, i) => {
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.7 },
            pieces: {
               count: 4,
               types: pickFromList(i, [
                  [ChessPieceType.Bishop, ChessPieceType.King],
                  [ChessPieceType.Bishop, ChessPieceType.Rook],
                  [ChessPieceType.Bishop, ChessPieceType.Queen],
                  [ChessPieceType.King, ChessPieceType.Queen],
                  [ChessPieceType.Knight],
               ]),
            },
         },
      };
   }),

   ...Array.from({ length: 75 }, (_, i) => {
      const item = pickFromList(i, [
         {
            tag: '5x5; p=4; t=5; 0%',
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '5x5; p=6; t=5; 0%',
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '5x5; p=6; t=5; 50%',
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 0.5 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '5x5; p=4; t=5; 100%',
            board: { squareCount: 25, targetCount: 5, zeroTargetPercentage: 1 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '5x5; p=6; t=8; 0%',
            board: { squareCount: 25, targetCount: 8, zeroTargetPercentage: 0 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '5x5; p=6; t=8; 50%',
            board: { squareCount: 25, targetCount: 8, zeroTargetPercentage: 0.5 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
      ]);
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: item.board,
            pieces: item.pieces,
         },
      };
   }),

   ...Array.from({ length: 75 }, (_, i) => {
      const item = pickFromList(i, [
         {
            tag: '5x5; p=4; t=8; 0%',
            board: { squareCount: 25, targetCount: 8, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '6x6; p=4; t=8; 0%',
            board: { squareCount: 36, targetCount: 8, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '6x6; p=4; t=12; 0%',
            board: { squareCount: 36, targetCount: 12, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '5x5; p=4; t=8; 50%',
            board: { squareCount: 25, targetCount: 8, zeroTargetPercentage: 0.5 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '6x6; p=4; t=8; 50%',
            board: { squareCount: 36, targetCount: 8, zeroTargetPercentage: 0.5 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '6x6; p=6; t=8; 0%',
            board: { squareCount: 36, targetCount: 8, zeroTargetPercentage: 0 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '6x6; p=6; t=8; 50%',
            board: { squareCount: 36, targetCount: 8, zeroTargetPercentage: 0.5 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
      ]);
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: item.board,
            pieces: item.pieces,
         },
      };
   }),

   ...Array.from({ length: 75 }, (_, i) => {
      const item = pickFromList(i, [
         {
            tag: '6x6; p=4; t=8; 0%',
            board: { squareCount: 36, targetCount: 8, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '7x7; p=4; t=12; 0%',
            board: { squareCount: 49, targetCount: 12, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '7x7; p=4; t=8; 50%',
            board: { squareCount: 49, targetCount: 8, zeroTargetPercentage: 0.5 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '6x6; p=4; t=8; 50%',
            board: { squareCount: 36, targetCount: 8, zeroTargetPercentage: 0.5 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '7x7; p=4; t=12; 50%',
            board: { squareCount: 49, targetCount: 12, zeroTargetPercentage: 0.5 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '7x7; p=6; t=8; 0%',
            board: { squareCount: 49, targetCount: 8, zeroTargetPercentage: 0 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '7x7; p=6; t=8; 50%',
            board: { squareCount: 49, targetCount: 8, zeroTargetPercentage: 0.5 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
      ]);
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: item.board,
            pieces: item.pieces,
         },
      };
   }),

   ...Array.from({ length: 151 }, (_, i) => {
      const item = pickFromList(i, [
         {
            tag: '7x7; p=4; t=12; 50%',
            board: { squareCount: 49, targetCount: 12, zeroTargetPercentage: 0.5 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '8x8; p=6; t=18; 50%',
            board: { squareCount: 64, targetCount: 18, zeroTargetPercentage: 0.5 },
            pieces: { count: 6, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '7x7; p=4; t=12; 0%',
            board: { squareCount: 49, targetCount: 12, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '8x8; p=8; t=18; 0%',
            board: { squareCount: 64, targetCount: 18, zeroTargetPercentage: 0 },
            pieces: { count: 8, maxTypes: 4, types: ALL_BUT_PAWN },
         },
         {
            tag: '6x6; p=4; t=12; 0%',
            board: { squareCount: 36, targetCount: 12, zeroTargetPercentage: 0 },
            pieces: { count: 4, maxTypes: 4, types: ALL_BUT_PAWN },
         },
      ]);
      return {
         type: LevelType.SquareControl,
         level: {
            seed: seedMemo++,
            board: item.board,
            pieces: item.pieces,
         },
      };
   }),
]);

export default LEVEL_DEFINITIONS;

function squareControl(
   template: SquareControlTemplate & { tag?: string },
): Omit<LevelDefinition & { tag?: string }, 'id' | 'name'> {
   return {
      type: LevelType.SquareControl,
      tag: template.tag,
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

function autoLabel(
   definitions: Omit<LevelDefinition & { tag?: string }, 'id' | 'name'>[],
): LevelDefinition[] {
   return definitions.map((definition, index) => {
      return {
         id: `sc:${index + 1}`,
         name: `Level ${index + 1}${definition.tag ? ' - ' + definition.tag : ''}`,
         ...definition,
      };
   });
}

function pickFromList<T>(index: number, list: T[]): T {
   return list[index % list.length];
}
