export interface ChessPiece {
   type: ChessPieceType;
   player: ChessPlayer;
}

export enum ChessPieceType {
   King = 'king',
   Queen = 'queen',
   Rook = 'rook',
   Bishop = 'bishop',
   Knight = 'knight',
   Pawn = 'pawn',
}

export enum ChessPlayer {
   White = 'white',
   Black = 'black',
}
